'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { ComponentProps } from 'react'

type Props = ComponentProps<typeof Image>

export default function SkeletonImage({ className, alt, onLoad: onLoadProp, ...props }: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      <Image
        {...props}
        alt={alt}
        className={className}
        onLoad={(e) => {
          setLoaded(true)
          onLoadProp?.(e)
        }}
      />
      <span
        aria-hidden="true"
        className={`absolute inset-0 bg-surface pointer-events-none transition-opacity duration-500 ${
          loaded ? 'opacity-0' : 'animate-pulse'
        }`}
      />
    </>
  )
}
