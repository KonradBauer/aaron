import type { Media } from '@/payload-types'

/**
 * Pole `upload` w Payload zwraca `string` (niezrozwiązane ID), pełny obiekt `Media`,
 * albo `null`/`undefined`. Frontend potrzebuje URL-a do `next/image`, a gdy klient
 * nie wgrał jeszcze zdjęcia — fallbacku z kodu (placeholder Unsplash). Ta funkcja
 * narzuca narrowing i wybiera URL lub fallback.
 */
export function resolveMediaUrl(
  field: string | Media | null | undefined,
  fallback: string,
): string {
  if (field && typeof field === 'object' && typeof field.url === 'string' && field.url.length > 0) {
    return field.url
  }
  return fallback
}
