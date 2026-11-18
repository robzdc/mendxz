/**
 * Cloudflare Worker in front of the static site.
 * Only /api/* reaches this code (see `run_worker_first` in wrangler.jsonc); everything else is served from ./dist.
 *
 * POST /api/testers — Android closed-testing sign-up. Emails the address to NOTIFY_EMAIL via SendGrid.
 */

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  /** Secret: `npx wrangler secret put SENDGRID_API_KEY` (Mail Send permission only). */
  SENDGRID_API_KEY: string;
  NOTIFY_EMAIL: string;
}

const FROM_EMAIL = 'support@mendxz.com';
/** Apps that currently accept beta sign-ups: slug → display name. */
const APPS: Record<string, string> = { astrosurf: 'Astrosurf' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/testers') {
      if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405, { Allow: 'POST' });
      return handleTesters(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};

async function handleTesters(request: Request, env: Env): Promise<Response> {
  const wantsHtml = !(request.headers.get('Accept') ?? '').includes('application/json');
  const reply = (ok: boolean, error?: string, status = ok ? 200 : 400) =>
    wantsHtml ? redirectBack(request, ok) : json(ok ? { ok } : { ok, error }, status);

  let fields: Record<string, string>;
  try {
    fields = await readBody(request);
  } catch {
    return reply(false, 'Invalid request.');
  }

  // Honeypot: real people never see this field. Pretend it worked.
  if (fields.website) return reply(true);

  const email = (fields.email ?? '').trim().toLowerCase();
  const appName = APPS[fields.app ?? ''];
  if (!appName) return reply(false, 'Unknown app.');
  if (email.length > 254 || !EMAIL_RE.test(email)) return reply(false, 'Please enter a valid email address.');

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.SENDGRID_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: env.NOTIFY_EMAIL }] }],
      from: { email: FROM_EMAIL, name: 'mendxz.com' },
      reply_to: { email },
      subject: `New ${appName} Android tester: ${email}`,
      content: [
        {
          type: 'text/plain',
          value: [
            `${email} signed up to test ${appName} on Android.`,
            '',
            'Add them in Play Console → Testing → Closed testing → Testers (email list).',
            '',
            `Page: ${request.headers.get('Referer') ?? 'unknown'}`,
            `Country: ${request.headers.get('CF-IPCountry') ?? 'unknown'}`,
            `Time: ${new Date().toISOString()}`,
          ].join('\n'),
        },
      ],
    }),
  });

  if (!res.ok) {
    console.error('SendGrid error', res.status, await res.text());
    return reply(false, 'Something went wrong. Please try again in a moment.', 502);
  }
  return reply(true);
}

async function readBody(request: Request): Promise<Record<string, string>> {
  const type = request.headers.get('Content-Type') ?? '';
  if (type.includes('application/json')) {
    const data = (await request.json()) as Record<string, unknown>;
    return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, typeof v === 'string' ? v : '']));
  }
  const form = await request.formData();
  const out: Record<string, string> = {};
  for (const [k, v] of form.entries()) if (typeof v === 'string') out[k] = v;
  return out;
}

/** No-JS fallback: static confirmation pages (src/pages/beta/[status].astro). */
function redirectBack(request: Request, ok: boolean): Response {
  const target = new URL(ok ? '/beta/joined' : '/beta/error', request.url);
  return new Response(null, { status: 303, headers: { Location: target.toString() } });
}

function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  });
}
