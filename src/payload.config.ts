import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { SiteSettings } from './globals/SiteSettings'
import { HomePage } from './globals/HomePage'
import { OfertaPage } from './globals/OfertaPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // serverURL celowo NIE ustawiony. Gdy jest niepusty, Payload dopisuje go do
  // listy `csrf` (sanitize.js), co aktywuje ścisłą walidację Origin/Sec-Fetch-Site
  // w extractJWT. Wewnętrzne (server-side) requesty bez tych nagłówków są wtedy
  // odrzucane → token ignorowany → /api/users/me zwraca user:null → pętla logowania.
  // Na localhost serverURL jest pusty (csrf=[]), więc auth działa — tu replikujemy to.
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: '/components/admin/AdminLogo#default',
        Icon: '/components/admin/AdminIcon#default',
      },
    },
  },
  collections: [Users, Media],
  globals: [SiteSettings, HomePage, OfertaPage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
})
