export const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS as string | undefined)
  ?.split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean) ?? ["admin@leagueofrap.com", "elijesse740@gmail.com"];

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  const normalized = email.toLowerCase();
  return ADMIN_EMAILS.includes(normalized) || normalized.endsWith("@leagueofrap.com");
}
