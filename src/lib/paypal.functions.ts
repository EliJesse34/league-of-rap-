import { createServerFn } from "@tanstack/react-start";
import * as paypal from "@paypal/checkout-server-sdk";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

function getPayPalClient() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_SECRET;
  const mode = (process.env.PAYPAL_MODE || "sandbox").toLowerCase();
  if (!clientId || !clientSecret) return null;
  const env = mode === "live"
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);
  return new paypal.core.PayPalHttpClient(env);
}

function getSiteUrl() {
  return (
    process.env.VITE_SITE_URL || process.env.SITE_URL || process.env.VITE_PUBLIC_URL || "http://localhost:5173"
  );
}

export const createPaypalOrder = createServerFn({ method: "POST" })
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
    const client = getPayPalClient();
    if (!client) throw new Error("PayPal not configured");

    const { userId } = context;

    const { data: beat } = await supabaseAdmin
      .from("beats")
      .select("id, title, base_price, producer_id")
      .eq("id", data.beatId)
      .maybeSingle();
    if (!beat) throw new Error("Beat not found");

    const { data: producerProfile } = await supabaseAdmin
      .from("producer_profiles")
      .select("payout_email")
      .eq("id", beat.producer_id)
      .maybeSingle();

    const producerPayeeEmail = producerProfile?.payout_email ?? undefined;
    const platformFeeEmail = process.env.PAYPAL_PLATFORM_FEE_EMAIL;
    const enableSplitPay = Boolean(producerPayeeEmail && platformFeeEmail);

    // For a regular PayPal merchant account, leave PAYPAL_PLATFORM_FEE_EMAIL unset.
    // In that case, the order is created normally and the entire payment settles
    // into this site's PayPal merchant account, then producer payouts are handled manually.

    let amount = Number(beat.base_price);
    let licenseType = "mp3_lease";
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

    const platformFee = enableSplitPay
      ? {
          amount: { currency_code: "USD", value: (amount * 0.3).toFixed(2) },
          payee: { email_address: platformFeeEmail },
        }
      : undefined;

    const purchaseUnit: any = {
      amount: { currency_code: "USD", value: amount.toFixed(2) },
      description: `Beat: ${beat.title} · ${licenseType}`,
    };

    if (enableSplitPay) {
      purchaseUnit.payee = { email_address: producerPayeeEmail };
      purchaseUnit.payment_instruction = {
        disbursement_mode: "INSTANT",
        platform_fees: [platformFee],
      };
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");

    // Regular PayPal accounts cannot use Commerce Platform split payouts.
    // With no split config available, the order is created normally and
    // funds settle into the merchant account identified by the PayPal credentials.
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [purchaseUnit],
      application_context: {
        return_url: `${getSiteUrl()}/beats/${beat.id}?paypal=success`,
        cancel_url: `${getSiteUrl()}/beats/${beat.id}?paypal=canceled`,
      },
    });

    const order = await client.execute(request);
    const orderId = order.result?.id;
    const approveLink = (order.result?.links || []).find((l: any) => l.rel === "approve")?.href;
    if (!orderId || !approveLink) throw new Error("Could not create PayPal order");

    const { error: insertError } = await supabaseAdmin
      .from("beat_purchases")
      .insert({
        buyer_id: userId,
        beat_id: data.beatId,
        license_id: data.licenseId ?? null,
        license_type: licenseType,
        amount,
        currency: "usd",
        stripe_session_id: orderId,
        status: "pending",
      });
    if (insertError) throw new Error(insertError.message);

    return { approveUrl: approveLink, orderId };
  });

export const capturePaypalOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ orderId: z.string() }).parse(input))
  .handler(async ({ data, context }) => {
    const client = getPayPalClient();
    if (!client) throw new Error("PayPal not configured");
    const { userId } = context;

    const request = new paypal.orders.OrdersCaptureRequest(data.orderId);
    request.requestBody({});
    const capture = await client.execute(request);
    const status = capture.result?.status;
    if (!status || status !== "COMPLETED") {
      throw new Error("Payment not completed");
    }

    const { data: purchase } = await supabaseAdmin
      .from("beat_purchases")
      .select("id, beat_id, status")
      .eq("stripe_session_id", data.orderId)
      .eq("buyer_id", userId)
      .maybeSingle();
    if (!purchase) throw new Error("Purchase record not found");
    if (purchase.status === "completed") return { status: "completed" as const };

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

export const createPaypalSubscriptionOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ amount: z.number().optional() }).parse(input))
  .handler(async ({ data, context }) => {
    const client = getPayPalClient();
    if (!client) throw new Error("PayPal not configured");
    const { userId } = context;

    const amount = data.amount ?? 9.99;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: { currency_code: "USD", value: amount.toFixed(2) },
          description: `Producer subscription: ${amount.toFixed(2)} USD`,
        },
      ],
      application_context: {
        return_url: `${getSiteUrl()}/producer/subscribe?paypal=success`,
        cancel_url: `${getSiteUrl()}/producer/subscribe?paypal=canceled`,
      },
    });

    const order = await client.execute(request);
    const orderId = order.result?.id;
    const approveLink = (order.result?.links || []).find((l: any) => l.rel === "approve")?.href;
    if (!orderId || !approveLink) throw new Error("Could not create PayPal order");

    const { error: insertError } = await supabaseAdmin
      .from("producer_subscriptions")
      .insert({
        producer_id: userId,
        plan: "producer_pro",
        status: "pending",
        stripe_session_id: orderId,
      });
    if (insertError) throw new Error(insertError.message);

    return { approveUrl: approveLink, orderId };
  });

export const capturePaypalSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ orderId: z.string() }).parse(input))
  .handler(async ({ data, context }) => {
    const client = getPayPalClient();
    if (!client) throw new Error("PayPal not configured");
    const { userId } = context;

    const request = new paypal.orders.OrdersCaptureRequest(data.orderId);
    request.requestBody({});
    const capture = await client.execute(request);
    const status = capture.result?.status;
    if (!status || status !== "COMPLETED") throw new Error("Payment not completed");

    const { data: existing } = await supabaseAdmin
      .from("producer_subscriptions")
      .select("id, status")
      .eq("producer_id", userId)
      .eq("stripe_session_id", data.orderId)
      .maybeSingle();

    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

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
        stripe_session_id: data.orderId,
      });
    }

    return { status: "active" as const };
  });
