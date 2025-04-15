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

const client_side_path = '/cs?q=';
const crawlable_path = '/public';

import { env } from "cloudflare:workers";
import { pageGenerator } from "./english";

const default_size:number = parseInt(env.PAGE_SIZE) || 131071;
const default_chunk:number = parseInt(env.CHUNK_SIZE) || 16384;
const kIndexNowKey:string = env.INDEXNOWKEY ?? '\u03c0';
const kIndexNowKeyFile = `/${kIndexNowKey}.txt`;
const kModificationDate = new Date(env.CF_VERSION_METADATA.timestamp || "Wed, 16 Apr 2025 00:00:00 GMT");
const kLastModified = kModificationDate.toUTCString();
const kXMLLastModified = kModificationDate.toISOString();
const extra_header = '<script type="text/javascript" src="/unpack.js"> </script>';

const html_headers = new Headers({
    'Content-Type': 'text/html',
    'Cache-Control': 'immutable, public, max-age=2700000',
    'Last-Modified': kLastModified,
});

const xml_headers = new Headers({
    'Content-Type': 'application/xml',
    'Cache-Control': 'immutable, public, max-age=604800',
    'Last-Modified': kLastModified,
});


function robots_txt(origin: string): Response {
    return new Response(
`Sitemap: ${origin}/sitemap.xml

user-agent: *
Allow: ${crawlable_path}/
Allow: ${client_side_path}${crawlable_path}/*
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
        return `${n+100}/start/${escapeURL(words.join('-'))}`;
    }

    var pagelist = [];
    const root = [
        origin + crawlable_path,
        origin + client_side_path + crawlable_path,
    ];
    for (let i = 0; i < 1024; ++i) {
        pagelist.push(`<url><loc>${root[i % root.length]}/${RandomURIPath(i)}/</loc><lastmod>${kXMLLastModified}</lastmod></url>`);
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

        if (url.pathname === '/robots.txt') return robots_txt(origin);
        if (url.pathname === '/sitemap.xml') return sitemap_xml(origin);
        if (url.pathname === kIndexNowKeyFile) {
            return new Response(kIndexNowKey);
        }

        const ifModifiedSince = new Date(request.headers.get('if-modified-since') ?? 0);
        if (kModificationDate <= ifModifiedSince) {
            return new Response(null, { status: 304 });
        }
        if (request.method === 'HEAD') {
            return new Response(null, { headers: html_headers });
        }

        let page_size = default_size;
        let chunk_size = default_chunk;
        let path_start = '/';
        if (url.pathname.startsWith(crawlable_path)) {
            path_start = crawlable_path;
            page_size = Math.min(page_size, 1000000);
        }

        const enc = new TextEncoder();
        const ratelimit = await env.RATE_LIMITER.limit({ key: path_start });
        const hash = new Uint32Array(await crypto.subtle.digest("SHA-256", enc.encode(request.url)));
        if (!ratelimit.success) {
            let choice = Math.random() * 3 >>> 0;
            switch (choice) {
            case 0:
                // TODO: delete log call; it's just a quick test
                console.log("Trying 307 workaround for rate limit", ratelimit);
                return new Response('307 temporary redirect - rate limit exceeded', {
                    status: 307,
                    headers: new Headers({ 'location': client_side_path + url.pathname }),
                });
            default:
                // TODO: delete log call; just a quick test
                console.log("Returning 429 rate limit", ratelimit);
                return new Response('429 Failure - rate limit exceeded', { status: 429 });
            }
        }


        var total = 0;
        const generator = pageGenerator({
            path: url.pathname,
            hash: hash,
            headers: extra_header,
            page_size: page_size,
            chunk_size: chunk_size,
        });
        const stream = new ReadableStream({
            async pull(controller) {
                const { value, done } = generator.next();
                if (done) {
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
