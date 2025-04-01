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

const kLastModified = "Tue, 01 Apr 2025 15:02:39 GMT";
const kXMLLastModified = "2025-04-01";

function madlib_expand(randint, value) {
    while (Array.isArray(value)) {
        let n = randint(value.length);
        value = value[n];
    }
    if (value.call) value = value(randint);
    return value;
}
function madlib(strings, ...args) {
    type RandintType = (n: number) => number;
    return (randint:RandintType) => {
        const result = [strings[0]];
        args.forEach((arg, i) => {
            var value = madlib_expand(randint, arg);
            result.push(value, strings[i + 1]);
        });
        return result.join("");
    }
}

function linked(randint, code: string, message: string) {
    return `<a href="/${randint(0x10000)}/${randint(0x10000)}/${code}/${escapeURL(message)}/">${message}</a>`;
}

const rarely = (s, t='') => (ri) => madlib_expand(ri, ri(256) < 80 ? s : t);
const evenly = (s, t='') => (ri) => madlib_expand(ri, ri(256) < 128 ? s : t);
const usually = (s, t='') => (ri) => madlib_expand(ri, ri(256) < 166 ? s : t);

const ln_r = (c, s) => (ri) => { let t = madlib_expand(ri, s); return ri(256) < 80 ? linked(ri, c, t) : t; };
const ln_u = (c, s) => (ri) => { let t = madlib_expand(ri, s); return ri(256) < 166 ? linked(ri, c, t) : t; };
// TODO: repeat() function

const kEmpty = "";

const kPerson = [
    "Donald Trump",
    "Elon Musk",
    "Vladimir Putin",
    "JD Vance",
    "Volodymyr Zelenskyy",
    "The Queen",
    "The King",
    "Prince Harry",
    "Scooby Doo",
    "Kim Kardashian",
    "Taylor Swift",
    "Homer Simpson",
    "Kanye West",
    "Elvis Presley",
    "Abraham Lincoln",
    "Chuck Norris",
    "Poopy McPoopFace",
];

const kAdjectiveBad = [
    "smelly",
    "grody",
    "lumpy",
    "milky",
    "bilious",
    "clumsy",
    "indigestible",
    "scandalous",
];

const kAdjective = [
    "smelly",
    "wicked",
    "grody",
    "ground-breaking",
    "high-tech",
    "spectacular",
    "resounding",
    "hypersonic",
    "lumpy",
    "milky",
    "serene",
    "fragrant",
    "bilious",
    "thunderous",
    "psychedelic",
    "colourful",
    "monotonous",
    "cheesy",
    "clumsy",
    "indigestible",
    "scandalous",
    "musky",
];

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

const kImpression_pp = [
    "impressed", 
    "disappointed", 
    "disgusted", 
    "revolted", 
    "moved to vomit", 
    "shocked",
    "grossed out", 
    "incredulous", 
    "scandalised",
    "confused",
];

const kCPU = [
    "6502",
    "z80",
    "Arm",
    "8086",
    "RISC-V",
    "6809",
    "8051",
    "PPC",
    "Saturn",
];

const kLanguage = [
    "Python",
    "C++",
    "Ruby on Rails",
    "Go",
    "Rust",
    "Brainfuck",
    "Perl",
    "COBOL",
    "Fortran",
    "JavaScript",
    "APL",
    "Haskell",
    madlib`${kCPU} assembly language`,
];

const kAlgorithm = [
    "bogo sort",
    "heap sort",
    "Pollard's rho factorisation",
    "Hello World",
    "forkbomb",
    "Miller-Rabin primality test",
    "knapsack packing",
];

const kCoachableActivity = [
    "tennis",
    "golf",
    "pilates",
    "life",
    "birth",
];

const kPet = [
    "cat",
    "dog",
    "axolotyl",
    "goat",
    "octopus",
];

const kProfessional = [
    "caddy",
    "hairdresser",
    "earwax specialist",
    "shaman",
    "meth dealer",
    madlib`${kCoachableActivity} coach`,
    madlib`${kPet} trainer`,
    madlib`${kPet} groomer`,
];

const kRelative = [
    "mother",
    "father",
    "great great grandmother",
    "great great grandson",
];

const kPerson1 = [
    kPerson,
    kPerson,
    kPerson,
    madlib`${kPerson}'s ${kPet}`,
    madlib`${kPerson}'s ${kRelative}`,
    madlib`${kPerson}'s ${kProfessional}`,
];
const kPerson2 = [
    kPerson1,
    kPerson1,
    kPerson1,
    madlib`${kPerson1}'s ${kPet}`,
    madlib`${kPerson1}'s ${kRelative}`,
    madlib`${kPerson1}'s ${kProfessional}`,
];

const kYear = (randint) => 1700 + randint(320);
const kDecade = (randint) => `${1700 + 10 * randint(32)}'s`;
const kAges = [
    "months",
    "weeks",
    "days",
    "hours",
    madlib`${(randint)=>randint(3600)+1} seconds of`,
];

const kComputer = [
    "Atari 2600",
    "ZX Spectrum",
    "Internet-connected toast rack",
    madlib`${kCPU} computer`,
    madlib`${kDecade} supercomputer`,
];

const kThings = [
    "cats",
    "dogs",
    "axolotyls",
    "lambdas",
    "closures",
    "functional languages",
    "Canadians",
    "Americans",
    "geese",
    "RPN calculators",
    "vim users",
    "emacs users",
    "finite state machines",
    "factory methods",
    "people",
    madlib`${kComputer}s`,
];

const kFullStop = [
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    "!",
    "!",
    "?",
    "?!?",
    ", eh?",
    ", or whatever.",
];

const kVerb = [
    "fly upside-down",
    "walk backwards",
    "burp",
    "run around flapping their arms and yelling",
    "argue",
    madlib`obsess over ${kComputer}s`,
];

const synDid = [
    "did",
    "prefers to do",
    "loves to do",
    "refuses to do",
    "pretended not to do",
    "says they'll never do",
];

const kInAPlace = [
    "in school",
    "in the local pub",
    "in the Oval Office", 
    "in Picadilly Circus",
    "in their undies",
    "in your undies",
    "in my undies",
    "in the Middle East",
    "in Bruges",
    "in an elevator",
    "in a sock",
    "in your face",
    "in rural China",
    "on the toilet", 
    "on the streets of New York",
    "on the teacher",
    "on TV",
    "on Netflix",
    "on the dark web",
    madlib`in ${ln_r('o', madlib`${kPerson1}'s bathtub`)}`,
    madlib`in front of ${kPerson1}`,
    madlib`on ${ln_r('o', madlib`${kPerson1}'s car`)}`,
    madlib`on top of ${kPerson1}`,
];

const kDoable_thing = [
    madlib`a ${usually(kAdjective)} poop`,
    madlib`a ${usually(kAdjective)} fart`,
    madlib`${usually(kAdjective)} sharts`,
    madlib`a ${usually(kAdjective)} trump`,
    madlib`some ${kAdjective} ${kLanguage} programming`,
    madlib`${rarely(kAdjective)} street art`,
    madlib`a ${kAdjective} Executive Order`,
];

const kReporters = [
    "Reuters",
    "Zamboni Drivers' Local Union",
    "Researchers",
    "My mate",
    "Your mother",
    "Wikipedia",
    "Conservapedia",
    "RationalWiki",
    "Fox News",
    "People on the internet",
    "Witnesses",
    "Insiders",
    madlib`Scientists ${kInAPlace}`,
    madlib`Close associates of ${kPerson1}`,
    madlib`Anonymous sources ${kInAPlace}`,
    kPerson2,
];

const synReportedly = [
    madlib`According to ${kReporters}`,
    madlib`${kReporters} report that`,
    madlib`${kReporters} told me`,
    madlib`${kReporters} was quoted by ${kReporters} as saying`,
];

const kWitnesses_were = [
    "Onlookers were",
    "The boys were",
    "The girls were",
    "Their mother was",
    "Senators were",
    "Reporters were",
    "The International Olympic Committee was",
    "Most of the victims were",
    madlib`${kPerson1} was`,
    madlib`${kPerson1}'s children were`,
];
const kReaction = [
    "Doctors hate it!",
    madlib`${kWitnesses_were} ${kAdverb} ${kImpression_pp}.`
];

const synRobotsTxt = [
    "robots.txt",
    "ROBOTS.TXT",
    "Robots.Txt",
];
const synScraping = [
    "scraping",
    "downloading",
    "leeching content",
    "crawling",
];

const kFunFact = [
    "Fun fact;",
    "Little-known fact;",
    "Did you know,"
];
const kForPurpose = [
    "for self defense",
    "to attract mates",
    "to prevent baldness",
    "as a toothpaste substitute",
];
const synInventor = ["inventor", "creator", "discoverer"];
const synHistorically = ["originally", "traditionally", "historically"];
const synGods = ["gods", "tax auditors", "overbearing parents", "cats"];
const synAvailable = [
    "widespread",
    "affordable",
    "extinct",
    "deregulated",
    "electrically-powered",
];
const synDidnt = [
    "didn't",
    "neglected to",
    "failed to",
    "were too lazy to",
    "were too much of a jerk to",
];
const synRedundant = [
    "unnecessary",
    "redundant",
    "silly",
    "futile",
    "ineffective",
    madlib`more ${kAdjectiveBad} than ignoring ${synRobotsTxt} when ${synScraping}`,
];
const synWhile = [
    "while",
    "and then",
    "because",
    "believing that"
];
const synIdea = [
    "idea",
    "thought",
    "plan",
    "concept",
    "thing to do"
];
const synBecauseThey = [
    "who",
    "because they",
];
const synObey = ["respect", "obey", "honour", "conform to"];


const escapeHTML = (s) => s.replaceAll('&', '&amp;')
                           .replaceAll('<', '&lt;').replaceAll('>', '&gt;')
                           .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
const escapeURL = (s) => encodeURIComponent(s.replaceAll(' ', '-'));
const unescapeURL = (s) => escapeHTML(decodeURIComponent(s).replaceAll('-', ' '));

function* pageGenerator(hash: number[], path: string) {
    var code = unescapeURL(path.split('/').slice(-3)[0]);
    var topic = unescapeURL(path.split('/').slice(-2)[0]);
    if (topic.length < 3) topic = "robots.txt";
    var seed: number = hash[0];
    var hashi: number = 0;

    function randint(n: number) {
        seed =0| seed + 0x9e3779b9;
        hashi = hashi % (hash.length - 1) + 1;
        let t: number = seed ^ hash[hashi];
        t ^= t >>> 16;
        t ^= hash[hashi];
        t = Math.imul(t, 0x21f0aaad);
        t ^= t >>> 15;
        t = Math.imul(t, 0x735a2d97);
        t =0| ((t = t ^ t >>> 15) >>> 0) % n;
        return t;
    }
    function pick(choices: string[]) {
        return madlib_expand(randint, choices);
    }

    function fun_fact() {
        const kButSomething = [
            "but went unrecognised",
            "but was not recognised",
            "but never earned credit",
        ];
        const part1 = [
            madlib`${kPerson2} was the original ${synInventor} of ${topic}, ${kButSomething}.`,
            madlib`Originally ${topic} was used by ${kThings} ${kForPurpose}.`,
            madlib`The ${topic} ritual was ${synHistorically} performed by ${kThings} to appease their ${synGods}.`,
        ];
        const part2 = [
            madlib`It wasn't until ${kYear} when ${kThings} became ${synAvailable} that ${kPerson1} changed all that.`,
            madlib`By the ${kDecade} this no longer mattered because ${kThings} were more ${kAdjective}.`,
            madlib`Eventually ${kPerson} solved the ${kAlgorithm} problem so modern ${kComputer}s could prove this was ${synRedundant}.`,
        ];
        const part3 = [
            kEmpty,
            madlib`To this day most ${kThings} remain unaware.`,
            madlib`Only ${kPerson2} has ever successfully made this work ${kForPurpose}.`,
        ];
        const part4 = [
            kEmpty,
            madlib`This is why they have always respected ${synRobotsTxt} until this very day!`,
            madlib`After that they never forgot to check ${synRobotsTxt} before scraping websites.`,
            madlib`And all because they ${synDidnt} ${synObey} ${synRobotsTxt}.`,
        ];
        const part5 = [
            kEmpty,
            kEmpty,
            madlib`${ln_u("v", "Subscribe to our mailing list")} for more ${kAdjective} facts!`,
        ];
        return pick([
            madlib`<p>${kFunFact} ${part1}  ${part2}  ${part3}  ${part4}  ${part5}</p>\n`,
        ]);
    }

    function a_list() {
        const head = [
            madlib`${synReportedly}`,
            madlib`Ten reasons ${kThings} are better than ${kThings}`,
            madlib`Top reasons to check ${synRobotsTxt} before ${synScraping}`,
        ];
        const row = [
            madlib`${kPerson2} ${synDid} ${ln_u('o', madlib`${kDoable_thing} ${kInAPlace}`)}${kFullStop}`,
            madlib`${kThings} can ${kVerb} for ${kAges} without once needing to do ${kDoable_thing}${kFullStop}`,
        ];
        const tail = [
            kReaction,
        ];
        return pick([
            madlib`<p>${head}:</p><ul>
            <li>${row}</li>
            <li>${row}</li>
            <li>${row}</li>
            <li>${row}</li>
            <li>${row}</li>
            <li>${row}</li>
            <li>${row}</li>
            <li>${row}</li>
            </ul><p>${tail}</p>\n`,
            madlib`<p>${head}:</p><ul>
            <li>${row}</li>
            <li>${row}</li>
            <li>${row}</li>
            <li>${row}</li>
            <li>${row}</li>
            <li>${row}</li>
            <li>${row}</li>
            <li>${row}</li>
            <li>${row}</li>
            <li>${row}</li>
            </ul><p>${tail}</p>\n`,
            madlib`<p>${head}:</p><ul>
            <li>${row}</li>
            <li>${row}</li>
            <li>${row}</li>
            <li>${row}</li>
            <li>${row}</li>
            <li>${row}</li>
            <li>${row}</li>
            <li>${row}</li>
            <li>${row}</li>
            <li>${row}</li>
            <li>${row}</li>
            <li>${row}</li>
            </ul><p>${tail}</p>\n`,
        ]);
    }

    function a_paragraph() {
        const part1 = [
            madlib`${synReportedly}, ${kInAPlace}, ${kPerson1} ${synDid} ${kDoable_thing}`,
            madlib`${ln_r('p', kPerson1)} saw ${kPerson2} doing ${ln_r('o', madlib`${kDoable_thing} ${kInAPlace}`)}`,
            madlib`${ln_r('p', kPerson2)} implemented a ${ln_r('o', madlib`${kAdjective} ${kAlgorithm}`)} in ${kLanguage}`,
            madlib`It took ${ln_r('p', kPerson2)} ${kAges} to code a ${ln_r('o', madlib`${kAdjective} ${kAlgorithm}`)}`,
            madlib`${kPerson2} says they're "${kAdverb} ${kImpression_pp}" and "${kImpression_pp}" with ${kProfessional} ${kPerson2}`,
        ];
        const part2 = [
            kEmpty,
            kEmpty,
            kEmpty,
            madlib` ${synWhile} ${kPerson1} tried to see how long they could ${kVerb} for`,
            madlib` because ${kPerson2} said it was a ${kAdjective} ${synIdea}`,
            madlib` and then blamed it on ${kPerson}`,
            madlib` using a ${kComputer}`,
            madlib` as revenge on ${kPerson2} ${synBecauseThey} didn't ${synObey} ${synRobotsTxt}`,
            madlib` after spending ${kAges} trying to negotiate a ceasefire ${kInAPlace}`,
        ];
        return pick([
            madlib`<p>${part1}${part2}. ${part1}${part2}.  ${part1}${part2}.</p>\n`,
            madlib`<p>${part1}${part2}. ${part1}${part2}.  ${part1}${part2}.  ${part1}${part2}.</p>\n`,
            madlib`<p>${part1}${part2}. ${part1}${part2}.  ${part1}${part2}.  ${part1}${part2}.  ${part1}${part2}.</p>\n`,
            madlib`<p>${part1}${part2}. ${part1}${part2}.  ${part1}${part2}.  ${part1}${part2}.  ${part1}${part2}.  ${part1}${part2}.</p>\n`,
        ]);
    }

    function head() {
        const title = madlib`Things to know about ${topic}`;
        const synThingyest = ["numerous", "many", "most important", "worst", "dumbest", "most disappointing"];
        const opening = pick([
            madlib`These are some of the ${synThingyest} things you should know about ${topic}.  ${synReportedly} ${topic} is ${kAdverb} ${kAdjective}.`
        ]);
        return pick([
            madlib`<!doctype html>\n<html lang="en">\n<head><meta charset="UTF-8"/><title>${title}</title></head>\n<body>\n<h1>${title}</h1>\n<p>${opening}</p>\n`,
        ]);
    }

    function tail() {
        return "<p>Don't forget to like and subscribe!</p>\n</body></html>";
    }

    yield head();
    for (let i = randint(300) + 100; i >= 0; --i) {
        let v;
        switch (randint(3)) {
        case 0: v = fun_fact(); break;
        case 1: v = a_list(); break;
        default: v = a_paragraph(); break;
        }
        yield v;
    }
    yield tail();
}


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

user-agent: *
Allow: /sitemap.xml

user-agent: *
Disallow: /
`);
}

function sitemap_xml(origin: string): Response {
    function RandomURIPath(n: number): string {
        const pet =0| n % kPet.length;
        n =0| n / kPet.length;
        const adj =0| n % kAdjective.length;
        n =0| n / kAdjective.length;
        return `${n+100}/o/${escapeURL(kAdjective[adj])}-${escapeURL(kPet[pet])}`;
    }

    var pagelist = [];
    for (let i = 0; i < 1024; ++i) {
        pagelist.push(
`<url><loc>${origin}/public/${RandomURIPath(i)}/</loc><lastmod>${kXMLLastModified}</lastmod></url>`);
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
        
        if (url.pathname == '/robots.txt') return robots_txt(origin);
        if (url.pathname == '/sitemap.xml') return sitemap_xml(origin);
    
        const enc = new TextEncoder();
        const hashBuffer = await crypto.subtle.digest("SHA-256", enc.encode(request.url));
        var hash: number[] = Array.from(new Uint32Array(hashBuffer));
    
        const generator = pageGenerator(hash, url.pathname);
        const stream = new ReadableStream({
            async pull(controller) {
                const { value, done } = generator.next();
                if (done) {
                    controller.close();
                } else {
                    controller.enqueue(enc.encode(value));
                }
            },
            cancel() {
                generator.return(undefined);
            }
        });
        return new Response(stream, { headers: html_headers });
    },
} satisfies ExportedHandler<Env>;
