import type { CollectionEntry } from 'astro:content';
import { SITE, absoluteUrl } from '../config/site';

type Json = Record<string, unknown>;

export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

export const appPath = (slug: string) => `/apps/${slug}`;

export function organization(): Json {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl('/favicon.svg'),
    email: SITE.email,
    description: SITE.description,
    foundingDate: '2026',
    founder: {
      '@type': 'Person',
      name: SITE.founder.name,
      ...(SITE.founder.profiles.length ? { sameAs: [...SITE.founder.profiles] } : {}),
      homeLocation: { '@type': 'Place', name: SITE.founder.location },
      worksFor: { '@type': 'Organization', name: SITE.founder.worksFor.name, url: SITE.founder.worksFor.url },
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: SITE.email,
      availableLanguage: ['English'],
    },
    ...(SITE.socials.length ? { sameAs: SITE.socials.map((s) => s.url) } : {}),
  };
}

export function website(): Json {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE.url,
    name: SITE.domain,
    description: SITE.description,
    inLanguage: SITE.lang,
    publisher: { '@id': ORG_ID },
  };
}

const OS = { ios: 'iOS', android: 'Android' } as const;

export function app(entry: CollectionEntry<'apps'>, images: { icon: string; cover?: string; screenshots: string[] }): Json {
  const d = entry.data;
  const url = absoluteUrl(appPath(entry.id));
  const downloadUrls = [d.appStoreUrl, d.playStoreUrl].filter(Boolean);
  return {
    '@type': d.type === 'game' ? ['MobileApplication', 'VideoGame'] : 'MobileApplication',
    '@id': `${url}#app`,
    name: d.name,
    description: d.description,
    url,
    image: images.cover ? [images.icon, images.cover] : images.icon,
    ...(images.screenshots.length ? { screenshot: images.screenshots } : {}),
    operatingSystem: d.platforms.map((p) => OS[p]).join(', '),
    applicationCategory: d.type === 'game' ? 'GameApplication' : 'UtilitiesApplication',
    ...(d.type === 'game' ? { genre: d.genre, gamePlatform: d.platforms.map((p) => OS[p]) } : {}),
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    inLanguage: SITE.lang,
    ...(d.releaseDate ? { datePublished: d.releaseDate.toISOString().slice(0, 10) } : {}),
    ...(downloadUrls.length ? { downloadUrl: downloadUrls, installUrl: downloadUrls[0] } : {}),
    ...(d.status === 'live'
      ? {
          offers: {
            '@type': 'Offer',
            price: d.price.toLowerCase() === 'free' ? '0' : d.price.replace(/[^0-9.]/g, ''),
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  };
}

export function breadcrumbs(items: { name: string; path: string }[]): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function faq(items: { q: string; a: string }[]): Json {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}

export function webPage(opts: {
  type?: string;
  path: string;
  name: string;
  description: string;
  dateModified?: Date;
  about?: string;
}): Json {
  const url = absoluteUrl(opts.path);
  return {
    '@type': opts.type ?? 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: opts.name,
    description: opts.description,
    inLanguage: SITE.lang,
    isPartOf: { '@id': WEBSITE_ID },
    ...(opts.about ? { about: { '@id': opts.about } } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified.toISOString().slice(0, 10) } : {}),
  };
}

/** Wrap nodes into a single @graph document. */
export const graph = (...nodes: Json[]) => ({ '@context': 'https://schema.org', '@graph': nodes });
