'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { ComponentProps } from 'react'

type Props = ComponentProps<typeof Image>

export default function SkeletonImage({ className, alt, onLoad: onLoadProp, ...props }: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      <span
        aria-hidden="true"
        className={`absolute inset-0 bg-surface transition-opacity duration-500 ${
          loaded ? 'opacity-0 pointer-events-none' : 'animate-pulse'
        }`}
      />
      <Image
        {...props}
        alt={alt}
        className={`${className ?? ''} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={(e) => {
          setLoaded(true)
          onLoadProp?.(e)
        }}
      />
    </>
  )
}
