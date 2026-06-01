'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

import SkeletonImage from '@/components/SkeletonImage'

import type { GalleryImage } from '@/lib/galeria'

interface Props {
  images: GalleryImage[]
  footerNote?: string | null
}

type SlideDir = 'prev' | 'next' | null

export default function Gallery({ images, footerNote }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [slideDir, setSlideDir] = useState<SlideDir>(null)
  const isOpen = openIndex !== null
  const count = images.length
  const overlayRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    setOpenIndex(null)
    setSlideDir(null)
  }, [])

  const openAt = useCallback((i: number) => {
    setSlideDir(null)
    setOpenIndex(i)
  }, [])

  const goPrev = useCallback(() => {
    setSlideDir('prev')
    setOpenIndex((i) => (i === null ? i : (i - 1 + count) % count))
  }, [count])

  const goNext = useCallback(() => {
    setSlideDir('next')
    setOpenIndex((i) => (i === null ? i : (i + 1) % count))
  }, [count])

  // Klawiatura (←/→/Esc) + blokada scrolla tła + focus na overlay — rejestrowane i sprzątane gdy lightbox otwarty.
  useEffect(() => {
    if (!isOpen) return

    overlayRef.current?.focus()

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'ArrowRight') goNext()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close, goPrev, goNext])

  if (count === 0) {
    return footerNote ? (
      <p className="text-center text-text-muted text-[0.875rem]">{footerNote}</p>
    ) : null
  }

  const current = openIndex !== null ? images[openIndex] : null

  return (
    <>
      <div className="columns-3 max-[768px]:columns-2 max-[480px]:columns-1 gap-1">
        {images.map((img, i) => (
          <button
            key={img.url}
            type="button"
            onClick={() => openAt(i)}
            className="block w-full mb-1 break-inside-avoid relative overflow-hidden group cursor-pointer"
            style={{ aspectRatio: `${img.width}/${img.height}` }}
            aria-label={`Powiększ zdjęcie: ${img.alt}`}
          >
            <SkeletonImage
              src={img.url}
              alt={img.alt}
              width={img.width}
              height={img.height}
              className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
          </button>
        ))}
      </div>

      {footerNote && (
        <p className="text-center text-text-muted text-[0.875rem] mt-10">{footerNote}</p>
      )}

      {isOpen && current && (
        <div
          ref={overlayRef}
          tabIndex={-1}
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center outline-none"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Podgląd zdjęcia"
        >
          <button
            type="button"
            onClick={close}
            className="cursor-pointer absolute top-5 right-6 text-cream/70 hover:text-gold text-3xl leading-none transition-colors z-10"
            aria-label="Zamknij podgląd"
          >
            ×
          </button>

          <span className="absolute top-6 left-6 text-cream/70 text-[0.875rem] tracking-[0.1em] z-10">
            {openIndex + 1} / {count}
          </span>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goPrev() }}
            className="cursor-pointer absolute left-4 max-[560px]:left-2 top-1/2 -translate-y-1/2 text-cream/70 hover:text-gold text-5xl max-[560px]:text-3xl leading-none transition-colors z-10 px-2"
            aria-label="Poprzednie zdjęcie"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goNext() }}
            className="cursor-pointer absolute right-4 max-[560px]:right-2 top-1/2 -translate-y-1/2 text-cream/70 hover:text-gold text-5xl max-[560px]:text-3xl leading-none transition-colors z-10 px-2"
            aria-label="Następne zdjęcie"
          >
            ›
          </button>

          <div
            key={openIndex}
            className={`relative max-w-[90vw] max-h-[85vh] ${
              slideDir === 'next' ? 'lightbox-slide-next' : slideDir === 'prev' ? 'lightbox-slide-prev' : ''
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current.url}
              alt={current.alt}
              width={current.width}
              height={current.height}
              className="w-auto h-auto max-w-[90vw] max-h-[85vh] object-contain"
              sizes="90vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  )
}
