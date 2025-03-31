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

const kProfessional = [
  "caddy",
  "hairdresser",
  "earwax specialist",
  "caddy",
  "hairdresser",
];

const kRelative = [
  "mother",
  "father",
  "great great grandmother",
  "great great grandson",
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

const kComputer = [
  "Atari 2600",
  "ZX Spectrum",
  "Internet-connected toast rack",
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

function RandomURIPath(n: number): string {
  const pet =0| n % kPet.length;
  n =0| n / kPet.length;
  const adj =0| n % kAdjective.length;
  n =0| n / kAdjective.length;
  return `${n}/${escapeURL(kAdjective[adj])}-${escapeURL(kPet[pet])}`;
}

async function* pageGenerator(seed: string, topic: string): AsyncGenerator<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(seed));
  var hash: number[] = Array.from(new Uint32Array(hashBuffer));
  var seed: number = hash[0];
  var hashi: number = 0;

  function randint(n: number) {
    seed = seed + 0x9e3779b9 | 0;
    hashi = hashi % (hash.length - 1) + 1;
    let t: number = seed ^ hash[hashi];
    t = t ^ t >>> 16;
    t ^= hash[hashi];
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ t >>> 15;
    t = Math.imul(t, 0x735a2d97);
    t = ((t = t ^ t >>> 15) >>> 0) % n | 0;
    return t;
  }
  function pick(choices: string[]) {
    return choices[randint(choices.length)];
  }
  function pickv(...choices: string[]) {
    let i = randint(choices.map(c => c.length));
    for (const c of choices) {
        if (i < c.length) return c[i];
        i -= c.length;
    }
  }

  function linked(message: string) {
    return `<a href="/${randint(0x10000)}/${randint(0x10000)}/${escapeURL(message)}/">${message}</a>`;
  }

  const ln_r = (s) => (randint(256) < 80 ? s : linked(s));
  const ln_u = (s) => (randint(256) < 166 ? s : linked(s));

  const rarely = (s, t=()=>'') => (randint(256) < 80 ? s : t);
  const even = (s, t=()=>'') => (randint(16) < 128 ? s : t);
  const usually = (s, t=()=>'') => (randint(10) < 166 ? s : t);

  const Pet = () => pick(kPet);
  const Relative = () => pick(kRelative);
  const Adjective = () => pick(kAdjective);
  const Adverb = () => pick(kAdverb);
  const Muchly = () => pick(kMuchly);
  const Impression_pp = () => pick(kImpression_pp);
  const FullStop = () => pick(kFullStop);
  const CPU = () => pick(kCPU);
  const Algorithm = () => pick(kAlgorithm);
  const Year = () => 1700 + randint(320);
  const Decade = () => `the ${1700 + 10 * randint(32)}'s`;
  const Ages = () => pick([
    "months",
    "weeks",
    "days",
    "hours",
    `${randint(3600)+1} seconds of`,
  ]);
  const Language = () => pickv(kLanguage, [
    `${CPU()} assembly language`
  ]);
  const Computer = () => pickv(kComputer, [
    `${CPU()} computer`,
    `${Decade()} supercomputer`,
  ]);
  const Things = () => pickv(kThings, [ `${Computer()}s`, ]);

  const Professional = () => pickv(kProfessional, [
    `${pick(kCoachableActivity)} coach`,
    `${Pet()} trainer`,
    `${Pet()} groomer`,
  ]);
  const Person_only = () => pick(kPerson);
  const Person = () => pick([
    `${Person_only()}`,
    `${Person_only()}`,
    `${Person_only()}`,
    `${Person_only()}'s ${Pet()}`,
    `${Person_only()}'s ${Relative()}`,
    `${Person_only()}'s ${Professional()}`,
  ]);
  const Person2 = () => pick([
    `${Person()}`,
    `${Person()}`,
    `${Person()}`,
    `${Person()}'s ${Pet()}`,
    `${Person()}'s ${Relative()}`,
    `${Person()}'s ${Professional()}`,
  ]);
  const a_Noun = () => pick([
    `a ${Adjective()} Executive Order`,
    `a ${Adjective()} fart`,
    `a ${usually(Adjective)()} shart`,
    `a ${usually(Adjective)()} poop`,
    `some ${Adjective()} ${Language()} programming`,
  ]);
  const at_a_Place = () => pick([
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
    `in ${ln_r(`${Person()}'s bathtub`)}`,
    `in front of ${Person()}`,
    `on ${ln_r(`${Person()}'s car`)}`,
    `on top of ${Person()}`,
  ]);

  const Witness_was = () => pick([
    "Onlookers were",
    "The boys were",
    "The girls were",
    "Their mother was",
    "Senators were",
    "Reporters were",
    "The International Olympic Committee was",
    "Most of the victims were",
    `${Person()} was`,
    `${Person()}'s children were`,
  ])
  const Authority = () => pick([
    "Reuters",
    "Researchers",
    "Scientists",
    "Zamboni Drivers' Local Union",
    `Anonymous sources ${at_a_Place()}`,
    "My mate",
    "Your mother",
    `${Person()}`,
    "Wikipedia",
    "Conservapedia",
    "RationalWiki",
    "Fox News",
    "People on the internet",
    "Witnesses",
  ]);
  const a_Report = () => pick([
    `According to ${Authority()}`,
    `${Authority()} report that`,
    `${Authority()} told me`,
    `${Authority()} has been quoted by ${Authority()} as saying`,
  ])
  const Reaction = () => pick([
    `${Witness_was()} ${Muchly()} ${Impression_pp()}.`
    // "Doctors hate them!",
  ])

  const synRobotsTxt = () => pick([
    "robots.txt",
    "ROBOTS.TXT",
    "Robots.Txt",
  ]);
  const synScraping = () => pick([
    "scraping",
    "downloading",
    "leeching content",
    "crawling",
  ]);

  function fun_fact() {
    const FunFact = () => pick(["Fun fact;", "Little-known fact;", "Did you know,"]);
    const ForPurpose = () => pick([
      "for self defense",
      "to attract mates",
      "to prevent baldness",
      "as a toothpaste substitute",
    ]);
    const synInventor = () => pick(["inventor", "creator", "discoverer"]);
    const synHistorically = () => pick(["originally", "traditionally", "historically"]);
    const synGods = () => pick(["gods", "tax auditors", "overbearing parents", "cats"]);
    const synAvailable = () => pick([
      "widespread",
      "affordable",
      "extinct",
      "deregulated",
      "electrically-powered"
    ]);
    const synDidnt = () => pick([
      "didn't",
      "neglected to",
      "failed to",
      "were too lazy to",
      "were too much of a jerk to",
    ]);
    const synRedundant = () => pick([
      "unnecessary",
      "redundant",
      "silly",
      "worse than ignoring robots.txt when scraping",
    ]);

    return `<p>${FunFact()} `
    + pick([
      `${Person2()} was the original ${synInventor()} of ${topic}, but went unrecognised.  `,
      `Originally ${topic} was used by ${Things()} ${ForPurpose()}.  `,
      `The ${topic} ritual was ${synHistorically()} performed by ${Things()} to appease their ${synGods()}.  `,
    ])
    + pick([
      `It wasn't until ${Year()} when ${Things()} became ${synAvailable()} that ${Person()} changed all that.`,
      `By ${Decade()} this no longer mattered because ${Things()} were more ${Adjective()}.`,
      `Eventually ${Person()} solved the ${Algorithm()} problem so modern ${Computer()}s could prove this was ${synRedundant()}.`,
    ])
    + pick([
      "",
      "  After that they never forgot to check robots.txt before scraping websites.",
      `  And all because they ${synDidnt()} respect ${synRobotsTxt()}.`,
    ])
    + rarely("  Don't forget to like and subscribe!", "");
    + '</p>\n';
  }

  function a_list(len) {
    var text = pick([
      `${a_Report()}:\n<ul>`,
      `Ten reasons ${Things()} are better than ${Things()}:\n<ul>`,
      `Top reasons to check ${synRobotsTxt()} before ${synScraping()}:\n<ul>`
    ]);
    for (var i = 0; i < len; ++i) {
      text += pick([
        `<li>${Person()} did ${ln_u(`${a_Noun()} ${at_a_Place()}`)}${FullStop()}</li>`,
      ]);
    }
    text += `</ul>\n<p>${Reaction()}</p>\n`;
    return text;
  }

  function a_paragraph() {
    var text = '<p>';
    for (let j = randint(3) + 3; j >= 0; --j) {
      text += pick([
        `${ln_r(`${a_Report()} ${at_a_Place()}`)}, ${Person()} did ${a_Noun()}`,
        `${ln_r(Person())} saw ${Person()} doing ${ln_r(`${a_Noun()} ${at_a_Place()}`)}`,
        `${ln_r(Person())} implemented a ${ln_r(`${Adjective()} ${Algorithm()}`)} in ${Language()}`,
        `${Person()} says they're "${Adjective()} ${Impression_pp()}" and " ${Impression_pp()}" with ${Professional()} ${Person()}`,
      ]);
      if (usually(true, false)) {
        const synAdjoin = () => pick(["while", "and then", "because", "believing that"]);
        const synIdea = () => pick(["idea", "thought", "plan", "concept", "thing to do"]);
        const synBecauseThey = () => pick(["who", "because they"]);
        const synObey = () => pick(["respect", "obey", "honour", "conform to"]);

        text += pick([
          ` ${synAdjoin()} ${a_Noun()} was done by ${Person()}`,
          ` because ${Person()} said it was a ${Adjective()} ${synIdea()}`,
          ` and then blamed it on ${Person()}`,
          ` using a ${Computer()}`,
          ` as revenge on ${Person()} ${synBecauseThey()} didn't ${synObey()} robots.txt`,
          ` after ${Ages()} trying to negotiate a ceasefire ${at_a_Place()}`,
        ]);
      }
      text += '.  ';
    }
    text += '</p>\n';
    return text;
  }

  function head() {
    const TypesOfThingsToKnow = () => pick(["numerous", "many", "most important", "worst"]);
    return `<html><head><h1>Things to know about ${topic}</h1></head><body>
<p>These are some of the ${TypesOfThingsToKnow()} things you should know about ${topic}.  ${a_Report()} ${topic} is ${Adverb()} ${Adjective()}.</p>
    `;
  }

  function tail() {
    return "</body></html>";
  }

  yield head();
  for (let i = randint(300) + 100; i >= 0; --i) {
    switch (randint(3)) {
    case 0: yield fun_fact(); break;
    case 1: yield a_list(randint(12) + 4); break;
    default: yield a_paragraph(); break;
    }
  }
  yield tail();
}


const escapeHTML = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
const escapeURL = (s) => encodeURIComponent(s.replaceAll(' ', '-'));
const unescapeURL = (s) => escapeHTML(decodeURIComponent(s).replaceAll('-', ' '));

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

    const generator = pageGenerator(request.url, topic);
    let enc = new TextEncoder();
    const stream = new ReadableStream({
      async pull(controller) {
        const { value, done } = await generator.next();
    
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
