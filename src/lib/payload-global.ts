import config from '@payload-config'
import { getPayload } from 'payload'

import type { Config } from '@/payload-types'

type GlobalSlug = keyof Config['globals']

/**
 * Wspólny odczyt globala Payload dla Server Components (direct DB, bez HTTP).
 * Gdy odczyt zawiedzie (np. brak połączenia z DB w buildzie) — loguje i zwraca
 * przekazany FALLBACK, żeby strona nigdy nie wywaliła się przez brak danych CMS.
 *
 * Każdy per-stronowy helper powinien owinąć wywołanie w `cache()` dla dedupu
 * w obrębie jednego renderu (wzorzec z `src/lib/site-settings.ts`).
 */
export async function fetchGlobal<S extends GlobalSlug>(
  slug: S,
  fallback: Config['globals'][S],
): Promise<Config['globals'][S]> {
  try {
    const payload = await getPayload({ config })
    return await payload.findGlobal({ slug })
  } catch (err) {
    console.error(`fetchGlobal: nie udało się pobrać globala "${slug}", używam FALLBACK`, err)
    return fallback
  }
}
