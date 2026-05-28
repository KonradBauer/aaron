/**
 * Renders a JSON-LD structured data script tag.
 * Safe: receives pre-serialized JSON string built exclusively from server-side
 * static objects — no user-controlled content ever flows through this component.
 * Pattern endorsed by Next.js docs: https://nextjs.org/docs/app/building-your-application/optimizing/metadata#json-ld
 */

interface Props {
  json: string
}

export default function JsonLd({ json }: Props) {
  /* eslint-disable-next-line react/no-danger */
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
