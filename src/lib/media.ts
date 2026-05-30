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

export interface ResolvedMedia {
  url: string
  width: number
  height: number
  alt: string
}

/**
 * Zwraca URL + wymiary + alt z populowanego pola Payload upload (relacja `media`).
 * Gdy pole jest stringiem (ID, niepopulowane), null/undefined, bez `url` lub bez wymiarów —
 * zwraca `null`. Używane przez galerię (masonry potrzebuje width/height do proporcji).
 */
export function resolveMediaWithSize(
  field: string | Media | null | undefined,
): ResolvedMedia | null {
  if (
    field &&
    typeof field === 'object' &&
    typeof field.url === 'string' &&
    field.url.length > 0 &&
    typeof field.width === 'number' &&
    field.width > 0 &&
    typeof field.height === 'number' &&
    field.height > 0
  ) {
    return { url: field.url, width: field.width, height: field.height, alt: field.alt }
  }
  return null
}
