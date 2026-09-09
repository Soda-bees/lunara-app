/**
 * Initials for the avatar: first + last word, one letter if a single word,
 * or "L" when the name is missing.
 */
export function getInitials(name?: string | null): string {
  const trimmed = (name ?? '').trim();
  if (!trimmed) {
    return 'L';
  }

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  const first = parts[0].charAt(0);
  const last = parts[parts.length - 1].charAt(0);
  return `${first}${last}`.toUpperCase();
}
