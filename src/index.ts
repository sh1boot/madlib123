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

// TODO: pluck this from git metadata or something?
const kLastModified = "Tue, 01 Apr 2025 15:02:39 GMT";
const kXMLLastModified = "2025-04-01";
const kModificationDate = new Date(kLastModified);

const chunk_size = 4096;
const loop_min = 300;
const loop_max = 1000;

const kEmpty = "";

function ml(strings, ...args) {
    return { strings: strings, args: args };
}

function mlFlatten(randint, input, output=[]) {
    output.push(input.strings[0]);
    input.args.forEach((arg, i) => {
        var value = arg;
        while (!(typeof value === 'string' || typeof value == 'number')) {
            if (!value) {
                console.log("undefined value:", value, arg, i, args);
                value = '***OOPS***';
                break;
            }
            if (Array.isArray(value)) {
                let n = randint(value.length);
                value = value[n];
            } else if (typeof value === 'function') {
                value = value(randint);
            } else {
                mlFlatten(randint, value, output);
                value = null;
                break;
            }
        }
        if (value) {
            output.push(value, input.strings[i + 1]);
        } else {
            output.push(input.strings[i + 1]);
        }
    });
    return output;
}

function expand_once(randint, input) {
    if (typeof input === 'string' || typeof input === 'number') return input;
    if (typeof input === 'function' || Array.isArray(input)) {
        input = ml`${input}`;
    }
    let result = mlFlatten(randint, input).join(kEmpty);
    return result;
}

function linked(code: string, message) {
    const number = (randint)=> randint(0x10000) + 1;
    return ml`<a href="/${number}/${number}/${code}/${escapeURL(message)}/">${message}</a>`;
}

// TODO: optimise these a bit.
const rarely = (s, t = kEmpty) => [ s, t, t, t ];
const evenly = (s, t = kEmpty) => [ s, t ];
const usually = (s, t = kEmpty) => rarely(t, s);
const ln_r = (c, s) => (ri) => (ri(256) < 60 ? linked(c, expand_once(ri, s)) : s);
const ln_u = (c, s) => (ri) => (ri(256) < 206 ? linked(c, expand_once(ri, s)) : s);

// TODO: repeat() function

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

const kUsuallyAdjective = usually(kAdjective);
const kRarelyAdjective = rarely(kAdjective);

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
    ml`${kCPU} assembly language`,
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
    ml`${kCoachableActivity} coach`,
    ml`${kPet} trainer`,
    ml`${kPet} groomer`,
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
    ml`${kPerson}'s ${kPet}`,
    ml`${kPerson}'s ${kRelative}`,
    ml`${kPerson}'s ${kProfessional}`,
];
const kPerson2 = [
    kPerson1,
    kPerson1,
    kPerson1,
    ml`${kPerson1}'s ${kPet}`,
    ml`${kPerson1}'s ${kRelative}`,
    ml`${kPerson1}'s ${kProfessional}`,
];

const kYear = (randint) => (1700 + randint(320)).toString();
const kDecade = (randint) => `${1700 + 10 * randint(32)}'s`;
const kAges = [
    "months",
    "weeks",
    "days",
    "hours",
    (randint) => `${randint(3600)+1} seconds of`,
];

const kComputer = [
    "Atari 2600",
    "ZX Spectrum",
    "Internet-connected toast rack",
    ml`${kCPU} computer`,
    ml`${kDecade} supercomputer`,
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
    ml`${kComputer}s`,
];

const kDialect = [
    "British",
    "Canadian",
    "military",
    "southern",
    "northern",
    "foamer",
    "biker",
    "crochet",
    "funeral-worker",
];

const kSomeWord = [
    "trump",
    "mildew",
    "souffle",
    "Gladys",

// https://aclanthology.org/2025.coling-main.426.pdf
    "delves",
    "delved",
    "delving",
    "showcasing",
    "delve",
    "boasts",
    "underscores",
    "comprehending",
    "intricacies",
    "surpassing",
    "intricate",
    "underscoring",
    "garnered",
    "showcases",
    "emphasizing",
    "underscore",
    "realm",
    "surpasses",
    "groundbreaking",
    "advancements",
    "aligns",
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
    ", eh.",
    ", or whatever.",
];

const kVerb = [
    "fly upside-down",
    "walk backwards",
    "burp",
    "run around flapping their arms and yelling profanity",
    "yell at clouds",
    "rock out to polka music",
    ml`argue with ${kPet}s`,
    ml`obsess over ${kComputer}s`,
];

const kInAPlace = [
    "in school",
    "at the local pub",
    "in the Oval Office",
    "in parliament",
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
    ml`in ${kPerson1}'s bathtub`,
    ml`on ${kPerson1}'s car`,
    ml`in front of ${kPerson1}`,
    ml`on top of ${kPerson1}`,
];

const synObey = [
    "respect",
    "obey",
    "honour",
    "conform to",
];

const synIgnore = [
    "ignore",
    "disregard",
    "overlook",
];

const synRobotsTxt = [
    "robots.txt",
    "ROBOTS.TXT",
    "Robots.Txt",
];

const synDidnt = [
    "didn't",
    "neglected to",
    "failed to",
    "were too lazy to",
    "were too much of a jerk to",
];

const synDid = [
    "did",
    "prefers to do",
    "wants to do",
    "loves to do",
    "refuses to do",
    "pretended to not do",
    "says they'll never do",
];

const kDidAThing = [
    "farted",
    "trumped",
    "pooped",
    ml`${synDid} a ${kAdjective} fart`,
    ml`${synDid} a ${kAdjective} trump`,
    ml`${synDid} a ${kUsuallyAdjective} bottom-burp`,
    ml`${synDid} a ${kUsuallyAdjective} shart`,
    ml`${synDid} ${kUsuallyAdjective} poops`,
    ml`${synDid} ${kAdjective} ${kLanguage} programming`,
    ml`${synDid} ${kRarelyAdjective} street art`,
    ml`didn't ${synIgnore} ${synRobotsTxt}`,
    ml`ran over a ${kProfessional}`,
    ml`ran over a ${kProfessional}`,
];

const kDoAGoodThing = [
    ml`${synObey} ${synRobotsTxt}`,
    "brush their teeth",
];

const kDubiousVerb = [
    "fart",
    "trump",
    "poop",
    ml`do a ${kAdjective} fart`,
    ml`do a ${kAdjective} trump`,
    ml`do ${kAdjective} poops`,
    ml`do a ${kUsuallyAdjective} bottom-burp`,
    ml`do a ${kUsuallyAdjective} shart`,
    ml`write ${kAdjective} ${kLanguage} code`,
    ml`create ${kRarelyAdjective} street art`,
    ml`issue a ${kAdjective} Executive Order`,
    kDoAGoodThing,
    kDoAGoodThing,
    kVerb,
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
    ml`Scientists ${kInAPlace}`,
    ml`Close associates of ${kPerson1}`,
    ml`Anonymous sources ${kInAPlace}`,
    kPerson2,
];

const synReportedly = [
    ml`According to ${kReporters}`,
    ml`${kReporters} report that`,
    ml`${kReporters} told me`,
    ml`${kReporters} was quoted by ${kReporters} as saying`,
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
    ml`${kPerson1} was`,
    ml`${kPerson1}'s children were`,
];
const kReaction = [
    "Doctors hate it!",
    ml`${kWitnesses_were} ${kAdverb} ${kImpression_pp}.`
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
    "Did you know,",
    ml`According to ${kReporters}`,
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
const synRedundant = [
    "unnecessary",
    "redundant",
    "silly",
    "futile",
    "ineffective",
    ml`more ${kAdjectiveBad} than ignoring ${synRobotsTxt} when ${synScraping}`,
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

const synCode = [
    "write",
    "code",
    "create",
    "implement",
    "author",
];
const synBecauseThey = [
    "who",
    "because they",
];


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
        return choices[randint(choices.length)];
    }

    function fun_fact(output) {
        const kButSomething = [
            "but went unrecognised",
            "but was not recognised",
            "but never earned credit",
        ];
        const part1 = [
            ml`${kPerson2} was the original ${synInventor} of ${topic}, ${kButSomething}.`,
            ml`Originally ${topic} was used by ${kThings} ${kForPurpose}.`,
            ml`The ${topic} ritual was ${synHistorically} performed by ${kThings} to appease their ${synGods}.`,
            ml`In ${kDialect} slang, the word "${kSomeWord}" actually means to ${kDubiousVerb}.`,
        ];
        const part2 = [
            ml`It wasn't until ${kYear} when ${kThings} became ${synAvailable} that ${kPerson1} changed all that.`,
            ml`By the ${kDecade} this no longer mattered because ${kThings} were more ${kAdjective}.`,
            ml`Eventually ${kPerson} solved the ${kAlgorithm} problem so modern ${kComputer}s could prove this was ${synRedundant}.`,
        ];
        const part3 = [
            kEmpty,
            ml`To this day most ${kThings} remain ${kAdjective}.`,
            ml`Only ${kPerson2} has ever successfully made this work ${kForPurpose}.`,
        ];
        const part4 = [
            kEmpty,
            ml`This is why they have always respected ${synRobotsTxt} until this very day!`,
            ml`After that they never forgot to check ${synRobotsTxt} before ${synScraping} websites.`,
            ml`And all because they ${synDidnt} ${kDoAGoodThing}.`,
        ];
        const part5 = [
            kEmpty,
            kEmpty,
            ml`${ln_u("v", "Subscribe to our mailing list")} for more ${kAdjective} facts!`,
        ];
        return mlFlatten(randint, pick([
            ml`<p>${kFunFact} ${part1}  ${part2}  ${part3}  ${part4}  ${part5}</p>\n`,
        ]), output);
    }

    function a_list(output) {
        const head = [
            ml`${synReportedly}`,
            ml`Ten reasons ${kThings} are better than ${kThings}`,
            ml`Top reasons to check ${synRobotsTxt} before ${synScraping}`,
        ];
        const row = [
            ml`${kPerson2} ${ln_r('news', ml`${kDidAThing} ${kInAPlace}`)}${kFullStop}`,
            ml`${kThings} can ${kVerb} for ${kAges} without once needing to ${kDubiousVerb}${kFullStop}`,
        ];
        const tail = [
            kReaction,
        ];
        mlFlatten(randint, ml`<p>${head}:</p><ul>\n`, output);
        for (let i = randint(12) + 4; i > 0; --i) {
            mlFlatten(randint, ml`<li>${row}</li>\n`, output);
        }
        return mlFlatten(randint, ml`</ul><p>${tail}</p>\n`, output);
    }

    function a_paragraph(output) {
        const part1 = [
            ml`${synReportedly}, ${kInAPlace}, ${kPerson1} ${kDidAThing}`,
            ml`${ln_r('p', kPerson1)} saw ${kPerson2} ${ln_r('howto', ml`${kDubiousVerb} ${kInAPlace}`)}`,
            ml`${ln_r('p', kPerson2)} implemented a ${ln_r('algo', ml`${kAdjective} ${kAlgorithm}`)} in ${kLanguage}`,
            ml`It took ${ln_r('p', kPerson2)} ${kAges} to ${synCode} a ${ln_r('algo', ml`${kAdjective} ${kAlgorithm}`)}`,
            ml`${kPerson2} says they're "${kAdverb} ${kImpression_pp}" and "${kImpression_pp}" with ${kProfessional} ${kPerson2}`,
        ];
        const part2 = [
            kEmpty,
            kEmpty,
            ml` ${synWhile} ${kPerson1} tried to see how long they could ${kVerb} for`,
            ml` because ${kPerson2} said it was a ${kAdjective} ${synIdea}`,
            ml` and then blamed it on ${kPerson}`,
            ml` using a ${kComputer}`,
            ml` as revenge on ${kPerson2} ${synBecauseThey} didn't ${kDoAGoodThing}`,
            ml` after spending ${kAges} trying to negotiate a ceasefire ${kInAPlace}`,
        ];
        output.push("<p>");
        for (let i = randint(4) + 3; i > 0; --i) {
            mlFlatten(randint, ml`${part1}${part2}.\n`, output);
        }
        output.push("</p>\n");
        return output;
    }

    function head(output) {
        const title = ml`Things to know about ${topic}`;
        const synThingyest = ["numerous", "many", "most important", "worst", "dumbest", "most disappointing"];
        const opening = [
            ml`These are some of the ${synThingyest} things you should know about ${topic}.  ${synReportedly} ${topic} is ${kAdverb} ${kAdjective}.`
        ];
        return mlFlatten(randint, pick([
            ml`<!doctype html>\n<html lang="en">\n<head><meta charset="UTF-8"/><title>${title}</title></head>\n<body>\n<h1>${title}</h1>\n<p>${opening}</p>\n`,
        ]), output);
    }

    function tail(output) {
        return mlFlatten(randint, ml`<p>Don't forget to like and subscribe!</p>\n</body></html>`, output);
    }

    // TODO: make an output object with push method which pre-allocates
    // its storage to chunk_size + safety_margin.
    var output = [];

    head(output);
    const count = randint(loop_max - loop_min) + loop_min;
    for (let i = 0; i < count; ++i) {
        let v;
        switch (randint(3)) {
        case 0:  fun_fact(output); break;
        case 1:  a_list(output); break;
        default: a_paragraph(output); break;
        }
        if (output.length >= chunk_size) {
            yield output.join(kEmpty);
            output = [];
        }
    }
    tail(output);
    yield output.join(kEmpty);
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

        const ifModifiedSince = new Date(request.headers.get('if-modified-since')) || 0;
        if (kModificationDate <= ifModifiedSince) {
            return new Response(null, { status: 304 });
        }
        if (request.method === 'HEAD') {
            return new Response(null, { headers: html_headers });
        }

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
