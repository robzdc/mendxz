import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../config/site';

export const GET: APIRoute = async () => {
  const apps = (await getCollection('apps')).sort((a, b) => a.data.order - b.data.order);
  const u = (p: string) => `${SITE.url}${p}`;
  const lines = [
    `# ${SITE.domain}`,
    '',
    `> ${SITE.description}`,
    '',
    `Contact: ${SITE.email}`,
    '',
    '## Apps',
    '',
    ...apps.flatMap((a) => [
      `- [${a.data.name}](${u(`/apps/${a.id}`)}): ${a.data.description} Platforms: ${a.data.platforms.join(', ')}. Status: ${a.data.status}.`,
      `  - [Support & FAQ](${u(`/apps/${a.id}/support`)})`,
      `  - [Privacy policy](${u(`/apps/${a.id}/privacy`)})`,
    ]),
    '',
    '## Help',
    '',
    `- [Support hub](${u('/support')}): find help for any app or contact the studio.`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
