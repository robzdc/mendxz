export const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export const platformLabel = (p: 'ios' | 'android') => (p === 'ios' ? 'iOS' : 'Android');

export const pad = (n: number) => String(n).padStart(2, '0');
