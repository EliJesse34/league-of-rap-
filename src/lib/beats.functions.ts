import { createServerFn } from "@tanstack/react-start";
import Stripe from "stripe";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeClient = stripeSecretKey ? new Stripe(stripeSecretKey, { apiVersion: "2022-11-15" }) : null;

function getSiteUrl() {
  return (
    process.env.VITE_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VITE_PUBLIC_URL ||
    "http://localhost:5173"
  );
}

/**
 * Returns a short-lived signed URL for the full audio file.
 * Only the buyer of a completed purchase OR the producer can fetch it.
 */
export const getBeatDownloadUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ beatId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;

    const { data: beat, error } = await supabaseAdmin
      .from("beats")
      .select("id, producer_id, audio_path, title")
      .eq("id", data.beatId)
      .maybeSingle();
    if (error || !beat) throw new Error("Beat not found");

    if (beat.producer_id !== userId) {
      const { data: purchase } = await supabaseAdmin
        .from("beat_purchases")
        .select("id")
        .eq("beat_id", data.beatId)
        .eq("buyer_id", userId)
        .eq("status", "completed")
        .maybeSingle();
      if (!purchase) throw new Error("Purchase required to download this beat");
    }

    if (!beat.audio_path) throw new Error("No audio file available");

    const { data: signed, error: sErr } = await supabaseAdmin.storage
      .from("beat-audio")
      .createSignedUrl(beat.audio_path, 60 * 10);
    if (sErr || !signed) throw new Error("Could not create signed URL");

    return { url: signed.signedUrl, title: beat.title };
  });

/**
 * Stub checkout: in test mode (no Stripe yet), instantly marks purchase complete.
 * When Stripe is enabled, replace handler with a checkout session + webhook flow.
 */
export const purchaseBeat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        beatId: z.string().uuid(),
        licenseId: z.string().uuid().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;

    const { data: beatRow } = await supabaseAdmin
      .from("beats")
      .select("id, title, base_price")
      .eq("id", data.beatId)
      .maybeSingle();
    if (!beatRow) throw new Error("Beat not found");

    let licenseType = "mp3_lease";
    let amount = Number(beatRow.base_price);

    if (data.licenseId) {
      const { data: lic } = await supabaseAdmin
        .from("beat_licenses")
        .select("license_type, price")
        .eq("id", data.licenseId)
        .maybeSingle();
      if (lic) {
        licenseType = lic.license_type;
        amount = Number(lic.price);
      }
    }

    if (stripeClient) {
      const checkoutSession = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: beatRow.title,
                description: `Beat license: ${licenseType}`,
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        success_url: `${getSiteUrl()}/beats/${beatRow.id}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${getSiteUrl()}/beats/${beatRow.id}?checkout=canceled`,
        metadata: {
          beatId: beatRow.id,
          licenseId: data.licenseId ?? "",
          userId,
        },
      });

      const { error: insertError } = await supabaseAdmin
        .from("beat_purchases")
        .insert({
          buyer_id: userId,
          beat_id: data.beatId,
          license_id: data.licenseId ?? null,
          license_type: licenseType,
          amount,
          currency: "usd",
          stripe_session_id: checkoutSession.id,
          status: "pending",
        });
      if (insertError) throw new Error(insertError.message);

      return {
        checkoutUrl: checkoutSession.url,
        sessionId: checkoutSession.id,
        status: "pending" as const,
      };
    }

    const { data: purchase, error } = await supabaseAdmin
      .from("beat_purchases")
      .insert({
        buyer_id: userId,
        beat_id: data.beatId,
        license_id: data.licenseId ?? null,
        license_type: licenseType,
        amount,
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    const { data: beatCount } = await supabaseAdmin
      .from("beats")
      .select("purchases_count")
      .eq("id", data.beatId)
      .single();
    await supabaseAdmin
      .from("beats")
      .update({ purchases_count: (beatCount?.purchases_count ?? 0) + 1 })
      .eq("id", data.beatId);

    return { purchaseId: purchase.id, status: "completed" as const };
  });

export const finalizeBeatPurchase = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ sessionId: z.string() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    if (!stripeClient) throw new Error("Stripe is not configured");

    const session = await stripeClient.checkout.sessions.retrieve(data.sessionId);
    if (!session || session.payment_status !== "paid" || session.status !== "complete") {
      throw new Error("Payment not completed");
    }

    const { data: purchase } = await supabaseAdmin
      .from("beat_purchases")
      .select("id, beat_id, status")
      .eq("stripe_session_id", data.sessionId)
      .eq("buyer_id", context.userId)
      .maybeSingle();
    if (!purchase) throw new Error("Purchase record not found");
    if (purchase.status === "completed") {
      return { status: "completed" as const };
    }

    await supabaseAdmin
      .from("beat_purchases")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", purchase.id);

    const { data: beatCount } = await supabaseAdmin
      .from("beats")
      .select("purchases_count")
      .eq("id", purchase.beat_id)
      .single();
    await supabaseAdmin
      .from("beats")
      .update({ purchases_count: (beatCount?.purchases_count ?? 0) + 1 })
      .eq("id", purchase.beat_id);

    return { status: "completed" as const };
  });

/**
 * Subscribe producer (stub — replace with Stripe subscription when enabled).
 */
export const subscribeProducer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const { data: existing } = await supabaseAdmin
      .from("producer_subscriptions")
      .select("id")
      .eq("producer_id", userId)
      .maybeSingle();

    if (existing) {
      await supabaseAdmin
        .from("producer_subscriptions")
        .update({ status: "active", current_period_end: periodEnd.toISOString() })
        .eq("id", existing.id);
    } else {
      await supabaseAdmin.from("producer_subscriptions").insert({
        producer_id: userId,
        plan: "producer_pro",
        status: "active",
        current_period_end: periodEnd.toISOString(),
      });
    }

    const { data: prof } = await supabaseAdmin
      .from("producer_profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
    if (!prof) {
      await supabaseAdmin.from("producer_profiles").insert({
        id: userId,
        display_name: "New Producer",
        is_verified: true,
      });
    } else {
      await supabaseAdmin
        .from("producer_profiles")
        .update({ is_verified: true })
        .eq("id", userId);
    }

    return { status: "active" as const };
  });
