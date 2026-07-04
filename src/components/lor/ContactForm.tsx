import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface ContactFormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  onSuccess?: () => void;
}

export function ContactForm({ onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  // Simple honeypot spam protection
  if (honeypot) {
    return null;
  }

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setErrorMessage("Please enter your full name");
      return false;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Please enter your email address");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }
    if (!formData.subject.trim()) {
      setErrorMessage("Please enter a subject");
      return false;
    }
    if (!formData.message.trim()) {
      setErrorMessage("Please enter a message");
      return false;
    }
    if (formData.message.trim().length < 10) {
      setErrorMessage("Message must be at least 10 characters");
      return false;
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setStatus("error");
      return;
    }

    setLoading(true);
    setStatus("loading");

    try {
      const { error } = await supabase.from("contact_submissions").insert([
        {
          full_name: formData.fullName.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          is_read: false,
          is_spam: false,
        },
      ]);

      if (error) {
        throw error;
      }

      setStatus("success");
      setFormData({ fullName: "", email: "", subject: "", message: "" });
      
      if (onSuccess) {
        onSuccess();
      }

      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("Failed to submit your message. Please try again.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot field (hidden from users) */}
      <input
        type="text"
        name="honeypot"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Success Message */}
      {status === "success" && (
        <div className="lor-card rounded-lg border border-green-500/50 bg-green-500/10 p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-500">Message sent successfully!</p>
            <p className="text-sm text-green-500/80">Thank you for reaching out. We'll get back to you soon.</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {status === "error" && errorMessage && (
        <div className="lor-card rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-destructive">Error</p>
            <p className="text-sm text-destructive/80">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-sm font-semibold">
          Full Name
        </Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleChange}
          disabled={loading}
          className="bg-card/50 border-border"
        />
      </div>

      {/* Email Address */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold">
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          className="bg-card/50 border-border"
        />
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm font-semibold">
          Subject
        </Label>
        <Input
          id="subject"
          name="subject"
          type="text"
          placeholder="What is this about?"
          value={formData.subject}
          onChange={handleChange}
          disabled={loading}
          className="bg-card/50 border-border"
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-semibold">
          Message
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us more... (minimum 10 characters)"
          value={formData.message}
          onChange={handleChange}
          disabled={loading}
          rows={6}
          className="bg-card/50 border-border resize-none"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading || status === "success"}
        className="w-full font-bold uppercase tracking-wider"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : status === "success" ? (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Sent!
          </>
        ) : (
          "Send Message"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        We'll respond to your message as soon as possible.
      </p>
    </form>
  );
}
