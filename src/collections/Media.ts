import path from 'path'
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  // Ukryte z nawigacji panelu — klient wgrywa zdjęcia inline z poziomu edytowanej
  // podstrony, nie przegląda wspólnej biblioteki. Kolekcja nadal działa w polach upload.
  admin: {
    hidden: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Tekst alternatywny (opis zdjęcia)',
      required: true,
      admin: {
        description: 'Krótki opis tego, co przedstawia zdjęcie — dla czytników ekranu i SEO.',
      },
    },
  ],
  upload: {
    staticDir: path.resolve(process.cwd(), 'public/media'),
  },
}
