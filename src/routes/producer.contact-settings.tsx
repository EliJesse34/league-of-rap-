import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/lor/Header";
import { SecondaryNav } from "@/components/lor/SecondaryNav";
import { Footer } from "@/components/lor/Footer";
import { MobileBottomNav } from "@/components/lor/MobileBottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { isAdminEmail } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, AlertCircle, CheckCircle2, Trash2, Plus, GripVertical } from "lucide-react";

export const Route = createFileRoute("/producer/contact-settings")({
  component: ContactSettingsPage,
});

interface ContactSettings {
  id: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  contact_description: string | null;
  contact_image_url: string | null;
  location: string | null;
  google_maps_url: string | null;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  is_enabled: boolean;
  display_order: number;
}

function ContactSettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();

  const [contact, setContact] = useState<ContactSettings | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error" | "loading">("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const isAdmin = isAdminEmail(user?.email);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      nav({ to: "/login" });
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: contactData } = await supabase
          .from("contact_settings")
          .select("*")
          .limit(1)
          .single();

        const { data: linksData } = await supabase
          .from("contact_social_links")
          .select("*")
          .order("display_order", { ascending: true });

        setContact(contactData || {
          contact_name: "",
          contact_email: "",
          contact_phone: "",
          contact_description: "",
          contact_image_url: null,
          location: "",
          google_maps_url: "",
        });
        setSocialLinks(linksData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSaveMessage("Failed to load contact data");
        setSaveStatus("error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authLoading, user, nav, isAdmin]);

  const handleContactChange = (field: keyof ContactSettings, value: any) => {
    if (contact) {
      setContact({ ...contact, [field]: value });
    }
  };

  const handleSaveContactSettings = async () => {
    if (!contact) return;

    setSaving(true);
    setSaveStatus("loading");

    try {
      if (contact.id) {
        const { error } = await supabase
          .from("contact_settings")
          .update({
            contact_name: contact.contact_name,
            contact_email: contact.contact_email,
            contact_phone: contact.contact_phone,
            contact_description: contact.contact_description,
            location: contact.location,
            google_maps_url: contact.google_maps_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", contact.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("contact_settings")
          .insert([{
            contact_name: contact.contact_name,
            contact_email: contact.contact_email,
            contact_phone: contact.contact_phone,
            contact_description: contact.contact_description,
            location: contact.location,
            google_maps_url: contact.google_maps_url,
          }]);

        if (error) throw error;
      }

      setSaveStatus("success");
      setSaveMessage("Contact settings saved successfully!");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Error saving:", error);
      setSaveStatus("error");
      setSaveMessage("Failed to save contact settings");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSocialLink = async (id: string, isEnabled: boolean) => {
    try {
      const { error } = await supabase
        .from("contact_social_links")
        .update({ is_enabled: !isEnabled })
        .eq("id", id);

      if (error) throw error;

      setSocialLinks(
        socialLinks.map(link =>
          link.id === id ? { ...link, is_enabled: !isEnabled } : link
        )
      );

      setSaveStatus("success");
      setSaveMessage("Social link updated!");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Error updating social link:", error);
      setSaveStatus("error");
      setSaveMessage("Failed to update social link");
    }
  };

  const handleUpdateSocialLink = async (id: string, url: string) => {
    try {
      const { error } = await supabase
        .from("contact_social_links")
        .update({ url, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setSocialLinks(
        socialLinks.map(link =>
          link.id === id ? { ...link, url } : link
        )
      );

      setSaveStatus("success");
      setSaveMessage("Social link URL updated!");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Error updating social link URL:", error);
      setSaveStatus("error");
      setSaveMessage("Failed to update social link URL");
    }
  };

  const handleReorderSocialLinks = async (fromIndex: number, toIndex: number) => {
    const newLinks = Array.from(socialLinks);
    const [movedLink] = newLinks.splice(fromIndex, 1);
    newLinks.splice(toIndex, 0, movedLink);

    // Update display order
    const updates = newLinks.map((link, index) => ({
      ...link,
      display_order: index,
    }));

    setSocialLinks(updates);

    // Persist changes
    try {
      for (const link of updates) {
        const { error } = await supabase
          .from("contact_social_links")
          .update({ display_order: link.display_order })
          .eq("id", link.id);

        if (error) throw error;
      }

      setSaveStatus("success");
      setSaveMessage("Social link order updated!");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Error updating order:", error);
      setSaveStatus("error");
      setSaveMessage("Failed to update social link order");
    }
  };

  if (authLoading || loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-20">
      <Header />
      <SecondaryNav />

      <main className="mx-auto max-w-[1280px] space-y-8 px-4 pt-6 md:px-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Admin Panel</p>
          <h1 className="text-3xl font-black text-foreground">Contact Settings</h1>
        </div>

        {/* Status Messages */}
        {saveStatus === "success" && (
          <div className="lor-card rounded-lg border border-green-500/50 bg-green-500/10 p-4 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-500">{saveMessage}</p>
          </div>
        )}

        {saveStatus === "error" && (
          <div className="lor-card rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{saveMessage}</p>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          {/* Left Column - Contact Settings */}
          <section className="lor-card p-6 md:p-8 h-fit">
            <h2 className="text-lg font-black mb-6">Basic Information</h2>

            <div className="space-y-4">
              {/* Contact Name */}
              <div className="space-y-2">
                <Label htmlFor="contact_name">Contact Name</Label>
                <Input
                  id="contact_name"
                  value={contact?.contact_name || ""}
                  onChange={(e) => handleContactChange("contact_name", e.target.value)}
                  placeholder="League of Rap Team"
                  className="bg-card/50"
                />
              </div>

              {/* Contact Email */}
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={contact?.contact_email || ""}
                  onChange={(e) => handleContactChange("contact_email", e.target.value)}
                  placeholder="contact@leagueofrap.com"
                  className="bg-card/50"
                />
              </div>

              {/* Contact Phone */}
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone (Optional)</Label>
                <Input
                  id="contact_phone"
                  value={contact?.contact_phone || ""}
                  onChange={(e) => handleContactChange("contact_phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="bg-card/50"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  value={contact?.location || ""}
                  onChange={(e) => handleContactChange("location", e.target.value)}
                  placeholder="City, Country"
                  className="bg-card/50"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description/Bio (Optional)</Label>
                <Textarea
                  id="description"
                  value={contact?.contact_description || ""}
                  onChange={(e) => handleContactChange("contact_description", e.target.value)}
                  placeholder="Tell visitors about your contact details..."
                  rows={4}
                  className="bg-card/50 resize-none"
                />
              </div>

              {/* Google Maps URL */}
              <div className="space-y-2">
                <Label htmlFor="google_maps_url">Google Maps Embed URL (Optional)</Label>
                <Textarea
                  id="google_maps_url"
                  value={contact?.google_maps_url || ""}
                  onChange={(e) => handleContactChange("google_maps_url", e.target.value)}
                  placeholder="Paste Google Maps embed URL here..."
                  rows={2}
                  className="bg-card/50 resize-none text-xs"
                />
              </div>

              <Button
                onClick={handleSaveContactSettings}
                disabled={saving}
                className="w-full mt-6 font-bold"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </section>

          {/* Right Column - Social Links */}
          <section className="lor-card p-6 md:p-8">
            <h2 className="text-lg font-black mb-6">Social Media Links</h2>

            <div className="space-y-4">
              {socialLinks.map((link, index) => (
                <div key={link.id} className="space-y-2 p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold capitalize">{link.platform}</span>
                    </div>
                    <Switch
                      checked={link.is_enabled}
                      onCheckedChange={() => handleToggleSocialLink(link.id, link.is_enabled)}
                    />
                  </div>

                  <Input
                    value={link.url}
                    onChange={(e) => handleUpdateSocialLink(link.id, e.target.value)}
                    placeholder={`https://${link.platform}.com/your-profile`}
                    className="bg-card/50 text-sm"
                    disabled={!link.is_enabled}
                  />

                  {!link.url && link.is_enabled && (
                    <p className="text-xs text-muted-foreground">Enter a URL to display this social link</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
