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

const kLastModified = "Sun, 30 Mar 2025 23:17:59 GMT";
const kXMLLastModified = "2025-03-30";

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

function linked(randint, message: string) {
  return `<a href="/${randint(0x10000)}/${randint(0x10000)}/${escapeURL(message)}/">${message}</a>`;
}

const rarely = (s, t='') => (ri) => madlib_expand(ri, ri(256) < 80 ? s : t);
const evenly = (s, t='') => (ri) => madlib_expand(ri, ri(256) < 128 ? s : t);
const usually = (s, t='') => (ri) => madlib_expand(ri, ri(256) < 166 ? s : t);

const ln_r = (s) => (ri) => { let t = madlib_expand(ri, s); return ri(256) < 80 ? linked(ri, t) : t; };
const ln_u = (s) => (ri) => { let t = madlib_expand(ri, s); return ri(256) < 166 ? linked(ri, t) : t; };


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
  "Poopy McPoopFace",
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
];

const kMuchly = [
  "very",
  "highly",
  "not",
  "somewhat",
  "faintly",
  "gradually",
  "profoundly",
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
  "caddy",
  "hairdresser",
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
const kDecade = (randint) => `the ${1700 + 10 * randint(32)}'s`;
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
  madlib`${kComputer}s`,
];

const kFullStop = [
  ".",
  ".",
  ".",
  ".",
  "!",
  "?",
  "?!?",
  ", or whatever.",
];

const escapeHTML = (s) => s.replaceAll('&', '&amp;')
                           .replaceAll('<', '&lt;').replaceAll('>', '&gt;')
                           .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
const escapeURL = (s) => encodeURIComponent(s.replaceAll(' ', '-'));
const unescapeURL = (s) => escapeHTML(decodeURIComponent(s).replaceAll('-', ' '));

function RandomURIPath(n: number): string {
  const pet =0| n % kPet.length;
  n =0| n / kPet.length;
  const adj =0| n % kAdjective.length;
  n =0| n / kAdjective.length;
  return `${n}/${escapeURL(kAdjective[adj])}-${escapeURL(kPet[pet])}`;
}

function* pageGenerator(hash: number[], topic: string) {
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

  const kDoable_thing = [
    madlib`a ${kAdjective} Executive Order`,
    madlib`a ${kAdjective} fart`,
    madlib`a ${usually(kAdjective)} shart`,
    madlib`a ${usually(kAdjective)} poop`,
    madlib`some ${kAdjective} ${kLanguage} programming`,
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
    madlib`in ${ln_r(madlib`${kPerson1}'s bathtub`)}`,
    madlib`in front of ${kPerson1}`,
    madlib`on ${ln_r(madlib`${kPerson1}'s car`)}`,
    madlib`on top of ${kPerson1}`,
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

  const kWitness_was = [
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
    madlib`${kWitness_was} ${kMuchly} ${kImpression_pp}.`
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
    "worse than ignoring robots.txt when scraping",
  ];
  const synAdjoin = ["while", "and then", "because", "believing that"];
  const synIdea = ["idea", "thought", "plan", "concept", "thing to do"];
  const synBecauseThey = ["who", "because they"];
  const synObey = ["respect", "obey", "honour", "conform to"];

  function fun_fact() {

    return madlib`<p>${kFunFact} `(randint)
    + pick([
      madlib`${kPerson2} was the original ${synInventor} of ${topic}, but went unrecognised.  `,
      madlib`Originally ${topic} was used by ${kThings} ${kForPurpose}.  `,
      madlib`The ${topic} ritual was ${synHistorically} performed by ${kThings} to appease their ${synGods}.  `,
    ])
    + pick([
      madlib`It wasn't until ${kYear} when ${kThings} became ${synAvailable} that ${kPerson1} changed all that.`,
      madlib`By ${kDecade} this no longer mattered because ${kThings} were more ${kAdjective}.`,
      madlib`Eventually ${kPerson} solved the ${kAlgorithm} problem so modern ${kComputer}s could prove this was ${synRedundant}.`,
    ])
    + pick([
      "",
      madlib`  This is why they have always respected ${synRobotsTxt} until this very day!`,
      madlib`  After that they never forgot to check ${synRobotsTxt} before scraping websites.`,
      madlib`  And all because they ${synDidnt} respect ${synRobotsTxt}.`,
    ])
    + rarely("  Don't forget to like and subscribe!")(randint)
    + '</p>\n';
  }

  function a_list(len) {
    var text = pick([
      madlib`${synReportedly}:\n<ul>`,
      madlib`Ten reasons ${kThings} are better than ${kThings}:\n<ul>`,
      madlib`Top reasons to check ${synRobotsTxt} before ${synScraping}:\n<ul>`
    ]);
    for (var i = 0; i < len; ++i) {
      text += pick([
        madlib`<li>${kPerson2} did ${ln_u(madlib`${kDoable_thing} ${kInAPlace}`)}${kFullStop}</li>`,
      ]);
    }
    text += pick([
      madlib`</ul>\n<p>${kReaction}</p>\n`
    ]);
    return text;
  }

  function a_paragraph() {
    var text = '<p>';
    for (let j = randint(3) + 3; j >= 0; --j) {
      text += pick([
        madlib`${synReportedly} ${kInAPlace}, ${kPerson1} did ${kDoable_thing}`,
        madlib`${ln_r(kPerson1)} saw ${kPerson2} doing ${ln_r(madlib`${kDoable_thing} ${kInAPlace}`)}`,
        madlib`${ln_r(kPerson2)} implemented a ${ln_r(madlib`${kAdjective} ${kAlgorithm}`)} in ${kLanguage}`,
        madlib`${kPerson2} says they're "${kAdjective} ${kImpression_pp}" and "${kImpression_pp}" with ${kProfessional} ${kPerson2}`,
      ]);
      if (randint(256) < 166) {
        text += pick([
          madlib` ${synAdjoin} ${kDoable_thing} was done by ${kPerson1}`,
          madlib` because ${kPerson2} said it was a ${kAdjective} ${synIdea}`,
          madlib` and then blamed it on ${kPerson}`,
          madlib` using a ${kComputer}`,
          madlib` as revenge on ${kPerson2} ${synBecauseThey} didn't ${synObey} ${synRobotsTxt}`,
          madlib` after ${kAges} trying to negotiate a ceasefire ${kInAPlace}`,
        ]);
      }
      text += '.  ';
    }
    text += '</p>\n';
    return text;
  }

  function head() {
    const TypesOfThingsToKnow = ["numerous", "many", "most important", "worst"];
    return pick([
        madlib`<html><head><h1>Things to know about ${topic}</h1></head><body>
<p>These are some of the ${TypesOfThingsToKnow} things you should know about ${topic}.  ${synReportedly} ${topic} is ${kAdverb} ${kAdjective}.</p>
    `,
    ]);
  }

  function tail() {
    return "</body></html>";
  }

  yield head();
  for (let i = randint(300) + 100; i >= 0; --i) {
    let v;
    switch (randint(3)) {
    case 0: v = fun_fact(); break;
    case 1: v = a_list(randint(12) + 4); break;
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


export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);
    const origin = url.origin;
    
    if (url.pathname == '/robots.txt') return new Response(
`Sitemap: ${origin}/sitemap.xml

user-agent: *
Allow: /public/

user-agent: *
Allow: /sitemap.xml

user-agent: *
Disallow: /
`);

    if (url.pathname == '/sitemap.xml') {
      var pagelist = [];
      for (let i = 0; i < 32; ++i) {
        pagelist.push(`<url><loc>${origin}/public/${RandomURIPath(i)}/</loc>`
                         + `<lastmod>${kXMLLastModified}</lastmod></url>`);
      }
      return new Response(`<?xml version='1.0' encoding='UTF-8'?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pagelist.join('\n  ')}
</urlset>`, { headers: xml_headers });
    }

    var topic = unescapeURL(url.pathname.split('/').slice(-2)[0]);
    if (topic.length < 3) topic = "robots.txt";

    const enc = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest("SHA-256", enc.encode(request.url));
    var hash: number[] = Array.from(new Uint32Array(hashBuffer));
    const generator = pageGenerator(hash, topic);
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
    return new Response(stream);
  },
} satisfies ExportedHandler<Env>;
