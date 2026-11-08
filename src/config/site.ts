/**
 * Single source of truth for studio identity.
 * Edit these values — they feed meta tags, JSON-LD, footer, support pages and llms.txt.
 */
export const SITE = {
  name: 'mendxz',
  domain: 'mendxz.com',
  url: 'https://mendxz.com',
  title: 'mendxz — small games & apps',
  description:
    'mendxz is a hobby studio by Roberto del Castillo in Mexico City, making small, experimental games and apps for iOS and Android.',
  tagline: 'Small, experimental games & apps.',
  author: 'Roberto del Castillo',
  /** The person behind the studio — feeds the About copy and Organization `founder` JSON-LD. */
  founder: {
    name: 'Roberto del Castillo',
    worksFor: { name: 'espina.studio', url: 'https://espina.studio' },
    location: 'Mexico City, Mexico',
  },
  email: 'support@mendxz.com',
  locale: 'en_US',
  lang: 'en',
  /** Typical reply time shown on support pages. */
  responseTime: '2 business days',
  /** Profile URLs — used for Organization `sameAs`. Leave empty to omit. */
  socials: [
    // { label: 'X', url: 'https://x.com/mendxz' },
    // { label: 'Instagram', url: 'https://instagram.com/mendxz' },
  ] as { label: string; url: string }[],
  ogImage: '/og/default.png',
} as const;

export const absoluteUrl = (path = '/') => new URL(path, SITE.url).toString().replace(/\/$/, '') || SITE.url;
