export interface GalleryItem {
  alt: string
  ratio: string
  imageUrl: string
}

const unsplash = (id: string) => `https://images.unsplash.com/${id}?w=800&q=75&fit=crop`

// Kanoniczny zestaw 12 kafelków galerii. `imageUrl` = fallback gdy klient nie wgrał
// własnego zdjęcia. `ratio` pozostaje w kodzie (layout siatki), nieedytowalne w CMS.
export const galleryItems: GalleryItem[] = [
  { alt: 'Pejzaż o zachodzie słońca', ratio: '4/3', imageUrl: unsplash('photo-1518098268026-4e89f1a2cd8e') },
  { alt: 'Spokojna droga', ratio: '4/3', imageUrl: unsplash('photo-1476514525535-07fb3b4ae5f1') },
  { alt: 'Oprawa muzyczna', ratio: '4/3', imageUrl: unsplash('photo-1507838153414-b4b713384a76') },
  { alt: 'Świeca', ratio: '16/10', imageUrl: unsplash('photo-1508739773434-c26b3d09e071') },
  { alt: 'Krajobraz górski', ratio: '4/3', imageUrl: unsplash('photo-1508739773434-c26b3d09e071') },
  { alt: 'Eleganckie wnętrze', ratio: '4/3', imageUrl: unsplash('photo-1558618666-fcd25c85cd64') },
  { alt: 'Transport międzynarodowy', ratio: '4/3', imageUrl: unsplash('photo-1436491865332-7a61a109cc05') },
  { alt: 'Mobilne biuro', ratio: '16/10', imageUrl: unsplash('photo-1449965408869-eaa3f722e40d') },
  { alt: 'Pejzaż', ratio: '4/3', imageUrl: unsplash('photo-1518098268026-4e89f1a2cd8e') },
  { alt: 'Natura', ratio: '4/3', imageUrl: unsplash('photo-1476514525535-07fb3b4ae5f1') },
  { alt: 'Muzyka', ratio: '4/3', imageUrl: unsplash('photo-1507838153414-b4b713384a76') },
  { alt: 'Krajobraz', ratio: '4/3', imageUrl: unsplash('photo-1508739773434-c26b3d09e071') },
]
