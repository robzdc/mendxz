export const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export const platformLabel = (p: 'ios' | 'android') => (p === 'ios' ? 'iOS' : 'Android');

/** Short release label for an app's badges, e.g. "Out now", "Out now on iOS", "Coming soon". */
export const releaseLabel = (d: { status: 'live' | 'coming-soon'; platforms: ('ios' | 'android')[]; comingSoon: ('ios' | 'android')[] }) => {
  if (d.status !== 'live') return 'Coming soon';
  const out = d.platforms.filter((p) => !d.comingSoon.includes(p));
  return out.length === d.platforms.length ? 'Out now' : `Out now on ${out.map(platformLabel).join(' & ')}`;
};

export const pad = (n: number) => String(n).padStart(2, '0');
