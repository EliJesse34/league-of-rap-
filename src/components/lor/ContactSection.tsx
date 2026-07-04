import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Mail, 
  Phone 
} from "lucide-react";

const socialPlatforms: Record<string, any> = {
  facebook: { Icon: Facebook, color: "hover:text-[#1877F2]" },
  instagram: { Icon: Instagram, color: "hover:text-[#E4405F]" },
  twitter: { Icon: Twitter, color: "hover:text-[#1DA1F2]" },
  tiktok: { Icon: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v13.67a2.4 2.4 0 1 1-2.4-2.4c.2 0 .41.02.61.04V9.41a6.32 6.32 0 0 0-.78-.08c-3.3 0-6.01 2.66-6.01 5.97 0 3.3 2.7 5.97 6 5.97 3.3 0 6.01-2.66 6.01-5.97 0-.08 0-.16-.01-.24V10.3a7.68 7.68 0 0 0 3.85 1.04v-3.65a4.83 4.83 0 0 1-.59-.04z"/></svg>, color: "hover:text-black" },
  youtube: { Icon: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>, color: "hover:text-[#FF0000]" },
  linkedin: { Icon: Linkedin, color: "hover:text-[#0A66C2]" },
  whatsapp: { Icon: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.297-.921.927-.129 1.124.792.427 1.856 2.039 2.059 2.459.203.42 1.494.754 1.794.909.3.155 2.227 1.31 3.177 1.865 1.27.738 1.715 1.039 1.919 1.039.204 0 .652-.405.808-.788.156-.383.11-1.108-.11-1.658-.22-.551-1.315-1.34-1.917-1.6-.602-.26-1.245-.345-1.847-.2-.602.145-1.201.536-1.315 1.032" /></svg>, color: "hover:text-[#25D366]" },
};

interface ContactSettings {
  id: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  contact_description: string | null;
  contact_image_url: string | null;
  location: string | null;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  is_enabled: boolean;
  display_order: number;
}

export function ContactSection() {
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

  if (loading || !contact) {
    return null;
  }

  const enabledSocialLinks = socialLinks.filter(link => link.url && link.is_enabled);

  return (
    <section className="lor-card p-4">
      <h3 className="lor-section-label text-sm">CONTACT</h3>
      
      <div className="mt-4 space-y-4">
        {/* Contact Name */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Name</p>
          <p className="mt-1 text-sm font-semibold text-foreground">{contact.contact_name}</p>
        </div>

        {/* Contact Email */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</p>
          <a 
            href={`mailto:${contact.contact_email}`}
            className="mt-1 flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
          >
            <Mail className="h-4 w-4" />
            {contact.contact_email}
          </a>
        </div>

        {/* Contact Phone */}
        {(() => {
          const phoneNumber = contact.contact_phone && contact.contact_phone.trim()
            ? contact.contact_phone.trim()
            : '2134086150';

          return phoneNumber ? (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone</p>
              <a 
                href={`tel:${phoneNumber}`}
                className="mt-1 flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                {phoneNumber}
              </a>
            </div>
          ) : null;
        })()}

        {/* Contact Description */}
        {contact.contact_description && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">About</p>
            <p className="mt-1 text-xs text-muted-foreground">{contact.contact_description}</p>
          </div>
        )}

        {/* Social Media Icons */}
        {enabledSocialLinks.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Follow</p>
            <div className="flex flex-wrap gap-3">
              {enabledSocialLinks.map((link) => {
                const platformConfig = socialPlatforms[link.platform];
                if (!platformConfig) return null;

                const { Icon, color } = platformConfig;

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
                    title={link.platform}
                    className={`text-muted-foreground transition-colors ${color}`}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
