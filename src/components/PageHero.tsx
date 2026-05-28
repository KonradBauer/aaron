import Link from 'next/link'

const BASE = 'https://twoja-domena.pl'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeroProps {
  title: string
  subtitle?: string
  breadcrumb?: BreadcrumbItem[]
}

export default function PageHero({ title, subtitle, breadcrumb }: PageHeroProps) {
  const breadcrumbSchema =
    breadcrumb && breadcrumb.length > 0
      ? JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Strona główna', item: BASE },
            ...breadcrumb.map((item, i) => ({
              '@type': 'ListItem',
              position: i + 2,
              name: item.label,
              ...(item.href ? { item: `${BASE}${item.href}` } : {}),
            })),
          ],
        })
      : null

  return (
    <section className="relative overflow-hidden bg-surface pt-[calc(var(--header-height)+72px)] pb-[72px] border-b border-[var(--color-border)]">
      {breadcrumbSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />
      )}
      {/* gradient overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(135deg,rgba(30,58,47,0.3)_0%,transparent_60%)]" />

      <div className="relative z-10 max-w-[var(--container)] mx-auto px-6">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center gap-2 flex-wrap mb-6" aria-label="Nawigacja okruszkowa">
            <Link href="/" className="text-[0.75rem] font-normal tracking-[0.1em] uppercase text-text-muted hover:text-gold transition-colors">
              Strona główna
            </Link>
            {breadcrumb.map((item, i) => (
              <span key={i} className="contents">
                <span className="text-[0.6875rem] text-text-muted">›</span>
                {item.href ? (
                  <Link href={item.href} className="text-[0.75rem] font-normal tracking-[0.1em] uppercase text-text-muted hover:text-gold transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-[0.75rem] font-normal tracking-[0.1em] uppercase text-gold">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <span className="block w-10 h-[1px] bg-gold mb-5" />
        <h1 className="font-heading font-normal text-cream tracking-[0.02em] leading-[1.1] text-[clamp(2.25rem,5vw,3.75rem)]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-[1rem] text-text-muted max-w-[560px] leading-relaxed">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
