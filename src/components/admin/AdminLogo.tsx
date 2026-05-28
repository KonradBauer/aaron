import Image from 'next/image'

export default function AdminLogo() {
  return (
    <Image
      src="/logo.png"
      alt="Aaron Dom Pogrzebowy"
      width={160}
      height={64}
      style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
      priority
    />
  )
}
