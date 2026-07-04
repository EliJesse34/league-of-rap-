export const ADSENSE_CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID ?? "";
export const ADSENSE_SLOT_ID = import.meta.env.VITE_ADSENSE_SLOT_ID ?? "";
export const ADSENSE_ENABLED = Boolean(ADSENSE_CLIENT_ID && ADSENSE_SLOT_ID);
