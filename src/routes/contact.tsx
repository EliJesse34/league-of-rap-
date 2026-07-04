import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/lor/Header";
import { SecondaryNav } from "@/components/lor/SecondaryNav";
import { Footer } from "@/components/lor/Footer";
import { MobileBottomNav } from "@/components/lor/MobileBottomNav";
import { ContactForm } from "@/components/lor/ContactForm";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — League of Rap" },
      {
        name: "description",
        content: "Get in touch with League of Rap. Contact us for inquiries, partnerships, and support.",
      },
      { property: "og:title", content: "Contact Us — League of Rap" },
      {
        property: "og:description",
        content: "Get in touch with League of Rap. Contact us for inquiries, partnerships, and support.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Contact Us — League of Rap" },
      {
        name: "twitter:description",
        content: "Get in touch with League of Rap. Contact us for inquiries, partnerships, and support.",
      },
    ],
  }),
  component: ContactPage,
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

const socialPlatforms: Record<string, any> = {
  facebook: { Icon: Facebook, color: "hover:text-[#1877F2]" },
  instagram: { Icon: Instagram, color: "hover:text-[#E4405F]" },
  twitter: { Icon: Twitter, color: "hover:text-[#1DA1F2]" },
  tiktok: {
    Icon: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v13.67a2.4 2.4 0 1 1-2.4-2.4c.2 0 .41.02.61.04V9.41a6.32 6.32 0 0 0-.78-.08c-3.3 0-6.01 2.66-6.01 5.97 0 3.3 2.7 5.97 6 5.97 3.3 0 6.01-2.66 6.01-5.97 0-.08 0-.16-.01-.24V10.3a7.68 7.68 0 0 0 3.85 1.04v-3.65a4.83 4.83 0 0 1-.59-.04z" />
      </svg>
    ),
    color: "hover:text-black",
  },
  youtube: {
    Icon: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    color: "hover:text-[#FF0000]",
  },
  linkedin: {
    Icon: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.047-8.842 0-9.769h3.554v1.383c.43-.664 1.198-1.61 2.914-1.61 2.129 0 3.729 1.39 3.729 4.377v5.619zM5.337 8.855c-1.144 0-1.915-.759-1.915-1.71 0-.956.77-1.71 1.906-1.71.001 0 .001 0 .002 0 1.144 0 1.915.759 1.915 1.71 0 .951-.771 1.71-1.908 1.71zm1.595 11.597H3.635V9.021h3.297v11.431zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
      </svg>
    ),
    color: "hover:text-[#0A66C2]",
  },
  whatsapp: {
    Icon: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.297-.921.927-.129 1.124.792.427 1.856 2.039 2.059 2.459.203.42 1.494.754 1.794.909.3.155 2.227 1.31 3.177 1.865 1.27.738 1.715 1.039 1.919 1.039.204 0 .652-.405.808-.788.156-.383.11-1.108-.11-1.658-.22-.551-1.315-1.34-1.917-1.6-.602-.26-1.245-.345-1.847-.2-.602.145-1.201.536-1.315 1.032" />
      </svg>
    ),
    color: "hover:text-[#25D366]",
  },
};

function ContactPage() {
  const [contact, setContact] = useState<ContactSettings | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setLoading(true);

        // Fetch contact settings
        const { data: contactData, error: contactError } = await supabase
          .from("contact_settings")
          .select("*")
          .limit(1)
          .single();

        if (contactError && contactError.code !== "PGRST116") {
          console.error("Error fetching contact settings:", contactError);
        }

        // Fetch enabled social links sorted by display order
        const { data: linksData, error: linksError } = await supabase
          .from("contact_social_links")
          .select("*")
          .eq("is_enabled", true)
          .order("display_order", { ascending: true });

        if (linksError) {
          console.error("Error fetching social links:", linksError);
        }

        setContact(contactData || null);
        setSocialLinks(linksData || []);
      } catch (error) {
        console.error("Error fetching contact data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  const enabledSocialLinks = socialLinks.filter((link) => link.url && link.is_enabled);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-20">
      <Header />
      <SecondaryNav />

      <main className="mx-auto max-w-[1280px] space-y-12 px-4 pt-6 md:px-6 md:pt-10">
        {/* Hero Section */}
        <section className="relative space-y-4 text-center md:space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Get In Touch</p>
            <h1 className="text-4xl md:text-5xl font-black text-foreground">Contact Us</h1>
          </div>
          <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
            Have questions or want to collaborate? We'd love to hear from you. Get in touch and let's start a conversation.
          </p>
        </section>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {/* Left Column - Contact Info & Form */}
            <div className="md:col-span-2 space-y-8">
              {/* Contact Information Section */}
              <section className="lor-card p-6 md:p-8">
                <h2 className="text-lg font-black mb-6">Contact Information</h2>

                <div className="space-y-6">
                  {/* Name */}
                  {contact && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                        Contact Name
                      </p>
                      <p className="text-lg font-semibold text-foreground">{contact.contact_name}</p>
                    </div>
                  )}

                  {/* Email */}
                  {contact && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                        Email Address
                      </p>
                      <a
                        href={`mailto:${contact.contact_email}`}
                        className="flex items-center gap-2 text-foreground hover:text-primary transition-colors w-fit"
                      >
                        <Mail className="h-5 w-5" />
                        <span>{contact.contact_email}</span>
                      </a>
                    </div>
                  )}

                  {/* Phone */}
                  {(() => {
                    const phoneNumber = contact?.contact_phone && contact.contact_phone.trim()
                      ? contact.contact_phone.trim()
                      : '2134086150';

                    return phoneNumber ? (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                          Phone Number
                        </p>
                        <a
                          href={`tel:${phoneNumber}`}
                          className="text-foreground hover:text-primary transition-colors"
                        >
                          {phoneNumber}
                        </a>
                      </div>
                    ) : null;
                  })()}

                  {/* Location */}
                  {contact?.location && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                        Location
                      </p>
                      <div className="flex items-start gap-2 text-foreground">
                        <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <span>{contact.location}</span>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {contact?.contact_description && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">{contact.contact_description}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Contact Form */}
              <section className="lor-card p-6 md:p-8">
                <h2 className="text-lg font-black mb-6">Send Us a Message</h2>
                <ContactForm />
              </section>
            </div>

            {/* Right Column - Social Links & Map */}
            <div className="md:col-span-1 space-y-8">
              {/* Social Media Section */}
              {enabledSocialLinks.length > 0 && (
                <section className="lor-card p-6 md:p-8">
                  <h3 className="text-lg font-black mb-6">Follow Us</h3>

                  <div className="grid grid-cols-2 gap-4">
                    {enabledSocialLinks.map((link) => {
                      const platformConfig = socialPlatforms[link.platform];
                      if (!platformConfig) return null;

                      const { Icon, color } = platformConfig;
                      const platformName =
                        link.platform === "twitter"
                          ? "X"
                          : link.platform.charAt(0).toUpperCase() + link.platform.slice(1);

                        const url = link.url && link.url.trim()
                          ? link.url
                          : (link.platform === "facebook"
                            ? "https://web.facebook.com/LeagueofRapofficial?_rdc=1&_rdr#"
                            : (link.platform === "instagram"
                              ? "https://www.instagram.com/leagueofrap.com_official?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr"
                              : link.url));

                        return (
                          <a
                            key={link.id}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={platformName}
                            className={`flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-primary transition-all ${color}`}
                          >
                            <Icon />
                            <span className="text-xs font-semibold uppercase text-foreground">
                              {platformName}
                            </span>
                          </a>
                        );
                    })}
                  </div>
                </section>
              )}

              {/* Google Maps Section */}
              {contact?.google_maps_url && (
                <section className="lor-card overflow-hidden">
                  <h3 className="text-lg font-black p-6 pb-0">Location</h3>
                  <iframe
                    src={contact.google_maps_url}
                    width="100%"
                    height="300"
                    style={{ border: 0, borderRadius: "var(--radius-md)" }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="mt-4"
                  />
                </section>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
