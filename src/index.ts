/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const debug = false;
const default_size = 200000;
const default_chunk = 16384;

// TODO: pluck this from git metadata or something?
const kLastModified = "Tue, 01 Apr 2025 15:02:39 GMT";
const kXMLLastModified = "2025-04-01";
const kModificationDate = new Date(kLastModified);

import { pageGenerator } from "./english";


const html_headers = new Headers({
    'Content-Type': 'text/html',
    'Cache-Control': 'immutable, public, max-age=2700000',
    'Last-Modified': kLastModified,
});

const xml_headers = new Headers({
    'Content-Type': 'application/xml',
    'Cache-Control': 'immutable, public, max-age=604800',
});


function robots_txt(origin: string): Response {
    return new Response(
`Sitemap: ${origin}/sitemap.xml

user-agent: *
Allow: /public/
Allow: /cs?crawl=approved*
Allow: /sitemap.xml

user-agent: *
Disallow: /
`);
}

const kAdverb = [
    "very",
    "spectacularly",
    "resoundingly",
    "objectively",
    "literally",
    "measurably",
    "lumpily",
    "fragrantly",
    "thunderously",
    "ground-breakingly",
    "psychedelically",
    "mildly",
    "highly",
    "somewhat",
    "faintly",
    "gradually",
    "profoundly",
    "super-duper",
];

const kAdjective = [
    "smelly",
    "grody",
    "lumpy",
    "bilious",
    "clumsy",
    "indigestible",
    "scandalous",
    "hypersonic",
    "high-tech",
    "serene",
];

const kPet = [
    "cat",
    "dog",
    "axolotyl",
    "goat",
    "octopus",
];

function sitemap_xml(origin: string): Response {
    const escapeURL = (s:string) => encodeURIComponent(s.replaceAll(' ', '-'));
    function RandomURIPath(n: number): string {
        let words:string[] = [];
        [kAdverb, kAdjective, kPet].forEach((v:string[]) => {
            words.push(v[n % v.length | 0]);
            n = n / v.length >>> 0;
        });
        return `${n+100}/start/${escapeURL(words.join("-"))}`;
    }

    var pagelist = [];
    for (let i = 0; i < 1024; ++i) {
        let cs:string = (i & 1) ? "/cs?crawl=aproved&amp;q=" : "";
        pagelist.push(
`<url><loc>${origin}${cs}/public/${RandomURIPath(i)}/</loc><lastmod>${kXMLLastModified}</lastmod></url>`);
    }
    return new Response(`<?xml version='1.0' encoding='UTF-8'?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pagelist.join('\n  ')}
</urlset>`, { headers: xml_headers });
}

export default {
    async fetch(request, env, ctx): Promise<Response> {
        const url = new URL(request.url);
        const origin = url.origin;

        console.log(env);

        if (url.pathname === '/robots.txt') return robots_txt(origin);
        if (url.pathname === '/sitemap.xml') return sitemap_xml(origin);
        if (url.pathname.length === 37 && url.pathname.endsWith('.txt')) {
            const key:string = await env.INDEXNOWKEY.get();
            if (url.pathname === `/${key}.txt`) {
                return new Response(key);
            }
        }

        const ifModifiedSince = new Date(request.headers.get('if-modified-since') ?? 0);
        if (kModificationDate <= ifModifiedSince) {
            return new Response(null, { status: 304 });
        }
        if (request.method === 'HEAD') {
            return new Response(null, { headers: html_headers });
        }

        const enc = new TextEncoder();
        const hash = new Uint32Array(await crypto.subtle.digest("SHA-256", enc.encode(request.url)));

        var total = 0;
        const generator = pageGenerator(hash, url.pathname, default_size, default_chunk);
        const stream = new ReadableStream({
            async pull(controller) {
                const { value, done } = generator.next();
                if (done) {
                    console.log("page size:", total);
                    controller.close();
                } else {
                    total += value.length;
                    if (debug) {
                        const printable = (s:Uint8Array):string => new TextDecoder().decode(s).replaceAll(/[\u0000-\u001f\u007f-\u009f]/g, '.');
                        const front = printable(value.subarray(0, Math.min(value.length, 16)));
                        const back = printable(value.subarray(Math.max(0, value.length - 16)));
                        console.log('enqueue:', value.length, total, `"${front}" ... "${back}"`);
                    }
                    controller.enqueue(value);
                }
            },
            cancel() {
                generator.return(undefined);
            }
        });
        return new Response(stream, { headers: html_headers });
    },
} satisfies ExportedHandler<Env>;
