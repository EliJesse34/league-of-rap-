import { useEffect } from "react";
import { ADSENSE_CLIENT_ID, ADSENSE_ENABLED, ADSENSE_SLOT_ID } from "@/lib/adsense";

export function AdSense({ className }: { className?: string }) {
  useEffect(() => {
    if (!ADSENSE_ENABLED || typeof window === "undefined") return;
    try {
      const ads = (window as any).adsbygoogle || [];
      ads.push({});
      (window as any).adsbygoogle = ads;
    } catch (error) {
      console.warn("AdSense initialization failed", error);
    }
  }, []);

  if (!ADSENSE_ENABLED) {
    return null;
  }

  return (
    <div className={className ?? "w-full"}>
      <ins
        className="adsbygoogle block h-24 overflow-hidden"
        style={{ display: "block", minHeight: 100 }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={ADSENSE_SLOT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
