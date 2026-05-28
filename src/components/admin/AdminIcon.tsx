import Image from 'next/image'

export default function AdminIcon() {
  return (
    <Image
      src="/logo.png"
      alt="Aaron"
      width={40}
      height={40}
      style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
      priority
    />
  )
}
