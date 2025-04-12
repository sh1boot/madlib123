const debug = false;

import {mlParser, mlType, ml, kw, ln_r, ln_u, rep } from './madlib';

const UTF8 = (v:(string|mlType)[]):(Uint8Array|mlType)[] => {
    const utf8enc = new TextEncoder();
    return v.map((s) => (typeof s === 'string') ? utf8enc.encode(s) : s);
};

const UTF8s = (s:string):Uint8Array => {
    const utf8enc = new TextEncoder();
    return utf8enc.encode(s);
};

const kEmpty = new Uint8Array(0);

const rarely = (s:mlType, t:mlType = kEmpty):mlType[] => [ s, t, t, t ];
const evenly = (s:mlType, t:mlType = kEmpty):mlType[] => [ s, t ];
const usually = (s:mlType, t:mlType = kEmpty):mlType[] => rarely(t, s);

const Person = UTF8([
    "Donald Trump",
    "Elon Musk",
    "Vladimir Putin",
    "JD Vance",
    "Volodymyr Zelenskyy",
    "The King",
    "Prince Harry",
    "Kim Kardashian",
    "Kanye West",
    "Elvis Presley",
    "Abraham Lincoln",
    "Chuck Norris",
    "Taylor Swift",
    "Homer Simpson",
    "Scooby Doo",
    "Poopy McPoopFace",
    "My dog",
]);

const AdjectiveBad = UTF8([
    "smelly",
    "grody",
    "lumpy",
    "bilious",
    "clumsy",
    "indigestible",
    "messy",
]);

const Adjective = UTF8([
    "bilious",
    "cheesy",
    "clumpy",
    "clumsy",
    "colourful",
    "fragrant",
    "flavourful",
    "grody",
    "ground-breaking",
    "hairy",
    "high-tech",
    "hyperbolic",
    "hypersonic",
    "indigestible",
    "lumpy",
    "messy",
    "milky",
    "monotonous",
    "musky",
    "noisy",
    "psychedelic",
    "resounding",
    "scandalous",
    "serene",
    "smelly",
    "spectacular",
    "spicy",
    "tasty",
    "tangy",
    "thunderous",
    "wicked",
]);

const UsuallyAdjective = usually(Adjective);
const RarelyAdjective = rarely(Adjective);

const Adverb = UTF8([
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
]);

const synImpressed = UTF8([
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
]);

const CPU = UTF8([
    "6502",
    "z80",
    "Arm",
    "8086",
    "RISC-V",
    "6809",
    "8051",
    "PPC",
    "Saturn",
    "S/360",
]);

const Language = UTF8([
    "Python",
    "C++",
    "C#",
    "R",
    "Ruby",
    "Go",
    "Rust",
    "Brainfuck",
    "Eiffel",
    "Perl",
    "ALGOL",
    "COBOL",
    "Forth",
    "Fortran",
    "JavaScript",
    "APL",
    "GLSL",
    "Haskell",
    "Scratch",
    "Scratch Jr.",
    "Tcl/tk",
    "bash",
    "Vim script",
    ml`${CPU} assembly language`,
]);

const SortSort = UTF8([
    "bogo",
    "heap",
    "merge",
    "quick",
    "shell",
    "bubble",
    "poop",
]);


const Algorithm = UTF8([
    ml`${SortSort} sort`,
    "Pollard's rho factorisation",
    "Hello World",
    "forkbomb",
    "Miller-Rabin primality test",
    "knapsack packing",
    "binary search",
    "hash table",
    "cryptographic hash",
    "shortest path algorithm",
]);

const CoachableActivity = UTF8([
    "tennis",
    "golf",
    "pilates",
    "life",
    "birth",
    "flatulism",
]);

const Pet = UTF8([
    "cat",
    "dog",
    "axolotyl",
    "goat",
    "octopus",
    "hamster",
    "tarantula",
]);

const Professional = UTF8([
    "caddy",
    "hairdresser",
    "earwax specialist",
    "shaman",
    "meth dealer",
    ml`${CoachableActivity} coach`,
    ml`${Pet} trainer`,
    ml`${Pet} groomer`,
]);

const Relative = UTF8([
    "mother",
    "father",
    "cousin",
    "great great grandmother",
    "great great grandson",
]);

const MetaPerson = UTF8([
    ml`${Person}'s ${Pet}`,
    ml`${Person}'s ${Relative}`,
    ml`${Person}'s ${Professional}`,
]);

const MetaMetaPerson = UTF8([
    ml`${MetaPerson}'s ${Pet}`,
    ml`${MetaPerson}'s ${Relative}`,
    ml`${MetaPerson}'s ${Professional}`,
]);

const Person1 = UTF8([
    Person,
    MetaPerson,
]);
const Person2 = UTF8([
    Person,
    MetaPerson,
    MetaMetaPerson,
]);

const Year = (randnum:number) => 1700 + (randnum % 320);
const Decade = ml`1${(randnum:number) => randnum % 32 + 70}0's`;
const synAges = UTF8([
    "months",
    "weeks",
    "days",
    "hours",
    ml`${(randnum:number) => randnum % 3601 + 1} seconds`,
]);

const Computer = UTF8([
    "Atari 2600",
    "PDP-11",
    "ZX Spectrum",
    "Internet-connected toast rack",
    "HP-48",
    "TI-82",
    ml`${CPU} computer`,
    ml`${Decade} supercomputer`,
]);

const Things = UTF8([
    ml`${Pet}s`,
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
    ml`${Computer}s`,
]);

const WithExtras = UTF8([
    "with bells on",
    ml`with ${Adjective} wheels`,
]);

const Dialect = UTF8([
    "British",
    "Canadian",
    "military",
    "southern",
    "northern",
    "foamer",
    "biker",
    "crochet",
    "funeral",
    ml`${Language} coder`,
]);

const SomeWord = UTF8([
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
]);

const OtherSentenceEnd = UTF8([
    ".",
    "!",
    "?",
    "?!?",
    ", eh.",
    ", or whatever.",
]);

const FullStop = UTF8([
    ".",
    ".",
    ".",
    ".",
    "!",
    OtherSentenceEnd,
]);

const Verb = UTF8([
    "hang upside-down",
    "hop backwards on one leg",
    "burp",
    "run around flapping their arms and yelling profanity",
    "yell at clouds",
    "floss",
    "dance to polka music",
    ml`argue with ${Pet}s`,
    ml`obsess over ${Computer}s`,
]);

const InAPlace = UTF8([
    "in school",
    "in church",
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
    "on the dark web",
    "on the moon",
    ml`in ${Person1}'s bathtub`,
    ml`on ${Person1}'s car`,
    ml`in front of ${Person2}`,
]);

const synObey = UTF8([
    "respect",
    "obey",
    "honour",
    "conform to",
]);

const synIgnore = UTF8([
    "ignore",
    "disregard",
    "overlook",
]);

const synRobotsTxt = UTF8([
    "robots.txt",
    "ROBOTS.TXT",
    "Robots.Txt",
]);

const synDidnt = UTF8([
    "didn't",
    "neglected to",
    "failed to",
    "were too lazy to",
    "were too much of a jerk to",
]);

const synDid = UTF8([
    "did",
    "prefers to do",
    "wants to do",
    "loves to do",
    "refuses to do",
    "pretended to not do",
    "says they'll never do",
]);

const Verbed = UTF8([
    "farted",
    "trumped",
    "pooped",
    "exploded",
    "dropped their ice-cream",
    "took too much ecstacy",
    ml`${synDid} a ${Adjective} fart`,
    ml`${synDid} ${Adjective} farts`,
    ml`${synDid} a ${UsuallyAdjective} trump`,
    ml`${synDid} ${UsuallyAdjective} trumps`,
    ml`${synDid} a ${UsuallyAdjective} shart`,
    ml`${synDid} ${UsuallyAdjective} poops`,
    ml`${synDid} ${Adjective} ${Language} programming`,
    ml`${synDid} ${RarelyAdjective} street art`,
    ml`didn't ${synIgnore} ${synRobotsTxt}`,
    ml`ran over a ${Professional}`,
    ml`short-changed a ${Professional}`,
    ml`manscaped their ${Pet}`,
]);

const synDoing = UTF8([
    "doing",
    "preferring to do",
    "wanting to do",
    "loving to do",
    "refusing to do",
    "pretending to not do",
    "saying they'll never do",
]);

const Verbing = UTF8([
    "farting",
    "trumping",
    "pooping",
    ml`${synDoing} a ${Adjective} fart`,
    ml`${synDoing} a ${Adjective} trump`,
    ml`${synDoing} a ${UsuallyAdjective} bottom-burp`,
    ml`${synDoing} a ${UsuallyAdjective} shart`,
    ml`${synDoing} ${UsuallyAdjective} poops`,
    ml`${synDoing} ${Adjective} ${Language} programming`,
    ml`${synDoing} ${RarelyAdjective} street art`,
    ml`running over a ${Professional}`,
    ml`short-changing a ${Professional}`,
    ml`manscaping their ${Pet}`,
]);

const GoodVerb = UTF8([
    ml`${synObey} ${synRobotsTxt}`,
    "brush their teeth",
    "tidy their room",
]);

const DubiousVerb = UTF8([
    "fart",
    "trump",
    "poop",
    ml`do a ${Adjective} fart`,
    ml`do a ${Adjective} trump`,
    ml`do ${Adjective} poops`,
    ml`do a ${UsuallyAdjective} bottom-burp`,
    ml`do a ${UsuallyAdjective} shart`,
    ml`write ${Adjective} ${Language} code`,
    ml`create ${RarelyAdjective} street art`,
    ml`issue a ${Adjective} Executive Order`,
    GoodVerb,
    GoodVerb,
    Verb,
]);

const Reporters = UTF8([
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
    ml`Scientists ${InAPlace}`,
    ml`Close associates of ${Person1}`,
    ml`Anonymous sources ${InAPlace}`,
    Person2,
]);

const synReportedly = UTF8([
    ml`According to ${Reporters}`,
    ml`${Reporters} report that`,
    ml`${Reporters} told me`,
    ml`${Reporters} was quoted by ${Reporters} as saying`,
]);

const Group = UTF8([
    "Onlookers",
    "The boys",
    "The girls",
    "Their parents",
    "Senators",
    "Reporters",
    "The International Olympic Committee",
    "Most of the victims",
    ml`${Person1}`,
    ml`${Person1}'s ${Pet}s`,
    ml`${Person1}'s legal team`,
]);
const Reaction = UTF8([
    ml`${Professional}s hate this one weird trick!`,
    ml`${Group} were ${Adverb} ${synImpressed}.`,
]);

const synScraping = UTF8([
    "scraping",
    "downloading",
    "leeching content",
    "crawling",
]);

const FunFact = UTF8([
    "Fun fact;",
    "Little-known fact;",
    "Did you know,",
    ml`According to ${Reporters}`,
]);
const ForPurpose = UTF8([
    "for self defense",
    "to attract mates",
    "to prevent baldness",
    "as a toothpaste substitute",
]);
const synInventor = UTF8(["inventor", "creator", "discoverer"]);
const synHistorically = UTF8(["originally", "traditionally", "historically"]);
const synGods = UTF8(["gods", "tax auditors", "overbearing parents", "cats"]);
const synAvailable = UTF8([
    "widespread",
    "affordable",
    "extinct",
    "deregulated",
    "electrically-powered",
]);
const synRedundant = UTF8([
    "unnecessary",
    "redundant",
    "silly",
    "futile",
    "ineffective",
    ml`more ${AdjectiveBad} than ignoring ${synRobotsTxt} when ${synScraping}`,
]);
const synWhile = UTF8([
    "while",
    "and then",
    "because",
    "believing that",
]);
const synIdea = UTF8([
    "idea",
    "thought",
    "plan",
    "concept",
    "thing to do",
]);

const synWriteCode = UTF8([
    "write",
    "code",
    "create",
    "implement",
    "author",
]);

const synBecauseThey = UTF8([
    "who",
    "because they",
]);

const RandomCode = UTF8([
    "int main(int argc, char* argv[]) {",
    "os.system('rm -rf /');",
    "for i in range(0, 100):",
    "from cstdint import golfcart",
    "const f = (x, y) => x / y;",
    "xor ax, ax",
    "eieio",
    "JSR #$2020",
    "def sort(A, lo, hi):",
    "if lo >= hi || lo < 0:",
    "abort()",
    "return i",
    "(a[i], a[j]) = (a[j], a[i])",
    'assert("!this should never happen");',
    "// This should never happen.",
    "// Ensure lo < hi",
    'printf("shiver in eternal darkness /n");',
    ml`10 PRINT "${Person} IS COOL!!" : GOTO 10`,
]);

const synThingyest = UTF8([
    "numerous",
    "many",
    "most important",
    "worst",
    "dumbest",
    "most disappointing",
]);

const CodeIndent = UTF8([
    "  ",
    "    ",
    "    \t",
    "    \t  ",
    "    \t    \t",
    "   \t     \t ",
]);

const ButSomething = UTF8([
    "but went unrecognised",
    "but was not recognised",
    "but never earned credit",
]);

const SubscribeToOurMailingList = UTF8s("Subscribe to our mailing list");

const Gossip = UTF8([
    ml`${synReportedly}, ${InAPlace}, ${Person1} ${Verbed}`,
    ml`${ln_r(Person1, 'p')} saw ${Person2} ${ln_r(ml`${DubiousVerb} ${InAPlace}`, 'howto')}`,
    ml`${ln_r(Person2, 'p')} implemented a ${ln_r(ml`${Adjective} ${Algorithm}`, 'algo')} in ${Language}`,
    ml`It took ${ln_r(Person2, 'p')} ${synAges} to ${synWriteCode} a ${ln_r(ml`${Adjective} ${Algorithm}`, 'algo')}`,
    ml`${Person2} says they're "${Adverb} ${synImpressed}" and "${synImpressed}" with ${Professional} ${Person2}`,
]);

const GossipBecause = UTF8([
    kEmpty,
    kEmpty,
    ml` ${synWhile} ${Person1} tried to see how long they could ${Verb} for`,
    ml` because ${Person2} said it was a ${Adjective} ${synIdea}`,
    ml` and then blamed it on ${Person}`,
    ml` using a ${Computer}`,
    ml` as revenge on ${Person2} ${synBecauseThey} didn't ${GoodVerb}`,
    ml` after spending ${synAges} trying to negotiate a ceasefire ${InAPlace}`,
]);

const Factoid = UTF8([
    ml`${Things} can ${Verb} for ${synAges} without once needing to ${DubiousVerb}${FullStop}`,
]);

const kFactPart1 = UTF8([
    ml`${Person2} was the original ${synInventor} of ${kw('topic')}, ${ButSomething}.`,
    ml`Originally ${kw('topic')} was used by ${Things} ${ForPurpose}.`,
    ml`The ${kw('topic')} ritual was ${synHistorically} performed by ${Things} to appease their ${synGods}.`,
    ml`In ${Dialect} slang, the word "${SomeWord}" actually means to ${DubiousVerb}.`,
    Factoid,
]);

const kFactPart2 = UTF8([
    ml`It wasn't until ${Year} when ${Things} became ${synAvailable} that ${Person1} changed all that.`,
    ml`By the ${Decade} this no longer mattered because ${Things} were more ${Adjective}.`,
    ml`Eventually ${Person} solved the ${Algorithm} problem so modern ${Computer}s could prove this was ${synRedundant}.`,
]);

const kFactPart3 = UTF8([
    kEmpty,
    ml`But to this day most ${Things} remain ${Adjective}.`,
    ml`Very few modern ${Professional}s still use this ${ForPurpose}.`,
    ml`Thankfully today we have ${Things}, instead.`,
]);

const kFactPart4 = UTF8([
    kEmpty,
    ml`This is why they have always respected ${synRobotsTxt} until this very day!`,
    ml`After that they never forgot to check ${synRobotsTxt} before ${synScraping} websites.`,
    ml`And all because they ${synDidnt} ${GoodVerb}.`,
]);

const kFactPart5 = UTF8([
    kEmpty,
    kEmpty,
    ml`${ln_u(SubscribeToOurMailingList, 'action')} for more ${Adjective} facts!`,
]);

const ListHead = UTF8([
    ml`${synReportedly}`,
    ml`Ten reasons ${Things} are better than ${Things}`,
    ml`Top reasons to check ${synRobotsTxt} before ${synScraping}`,
    ml`TL;DR`,
]);

const synSoThere = UTF8([
    ". So there.",
    ".  Checkmate!",
    ml`, which totally proves it${FullStop}`,
]);

const ListRow = UTF8([
    ml`${Person2} ${ln_r(ml`${Verbed} ${InAPlace}`, 'news')}${synSoThere}`,
    Factoid,
]);

const PageTitle = UTF8([
    ml`A ${kw('topic')} resource page, by ${MetaMetaPerson}.`,
    ml`Things to know about ${kw('topic')}`,
]);

const PageOpening = UTF8([
    ml`These are some of the ${synThingyest} things you should know about ${kw('topic')}.\n${synReportedly} ${kw('topic')} is ${Adverb} ${Adjective}.`,
    ml`This is a collection of ${Adjective} information on ${kw('topic')}.`,
]);

const PageSignoff = UTF8([
    kEmpty,
    "Don't forget to like and subscribe!",
]);

const CodeHead = ml`demonstrating ${ln_r(ml`the ${Adjective} ${Algorithm}`, 'algo')}:`;

const CodeTail = UTF8([
    ml`This should solve the problem.`,
    ml`Hope this helps.`,
    ml`Good luck!`,
]);

const StackOverflowQuestion = UTF8([
    ml`How can I write a ${Algorithm} in ${Language}? I'd like to create a program where ${Person} can input words (like nouns, verbs, adjectives, etc.), and the program will generate a ${Adjective} story using those words. Could you explain how to structure the code and what functions I should use?`,
    ml`How can I prevent my program from ${Verbing} when ${Person} selects an invalid option? What is the best way to handle this error gracefully, so the program prompts the user again instead of ${Verbing}?`,
]);

const StackOverflowThanks = UTF8([
    ml`Please hurry, I have to hand this in tomorrow.`,
    ml`Thanks in advance for any help!`,
    ml`I'm just a beginner, so please don't be too hard on me.`,
]);

const HeadingBlock = UTF8([
    ml`<h2>${kw('topic')} in the news</h2>\n`,
    ml`<h2>${MetaMetaPerson}'s views on ${kw('topic')}</h2>\n`,
    ml`<h3>What this means for ${Person2}'s associates</h3>\n`,
    ml`<h3>The implications for ${Group}</h3>\n`,
]);

const ParagraphBlock = ml`<p>${rep(ml`${Gossip}${GossipBecause}.\n`, 3, 7)}</p>\n`;

const FunFactBlock = ml`<p>${FunFact} ${kFactPart1}  ${kFactPart2}  ${kFactPart3}  ${kFactPart4}  ${kFactPart5}</p>\n`;

const ListBlock = ml`<p>${ListHead}:</p><ul>${rep(ml`<li>${ListRow}</li>\n`, 4, 16)}</ul><p>${Reaction}</p>\n`;

const StackOverflowBlock = ml`<p>${StackOverflowQuestion}\n${StackOverflowThanks}</p>\n`;

// TODO: figure out a way to manage indentation logic better
const CodeBlock = ml`<p>Here's some ${Language} ${CodeHead}</p>\n<pre>\n${rep(ml`${CodeIndent}${RandomCode}\n`, 10, 20)}\n</pre>\n<p>${CodeTail}</p>\n`;


const otherRoots = UTF8([
    "/cs?q=",
    "/cs?q=",
    "/cs?q=",
    "https://html.duckduckgo.com/html/?q=robots.txt&ignore=",
    // otherHosts, /* TODO: List of participating hosts goes here.
]);

const roots = UTF8([
    ml`${kw('realroot')}`,
    ml`${kw('realroot')}`,
    ml`${kw('realroot')}`,
    ml`${kw('realroot')}`,
    ml`${kw('realroot')}`,
    ml`${kw('realroot')}`,
    ml`${kw('realroot')}`,
    otherRoots,
]);

const outputModes = [
    ParagraphBlock,
    ParagraphBlock,
    ParagraphBlock,
    FunFactBlock,
    FunFactBlock,
    FunFactBlock,
    ListBlock,
    ListBlock,
    ListBlock,
    StackOverflowBlock,
    StackOverflowBlock,
    CodeBlock,
    CodeBlock,
    HeadingBlock,
];

function head(output:mlParser) {
    return output.push(ml`<!doctype html>
<html lang="en">
<head><meta charset="UTF-8"/>
  <title>${PageTitle}</title>
  <script type="text/javascript" src="unpack.js"> </script>
</head>
<body>
<h1>${PageTitle}</h1>
<p>${PageOpening}</p>
`);
}

function tail(output:mlParser) {
    return output.push(ml`<p>${PageSignoff}</p>\n</body></html>`);
}

function URItoHTML(s:string):string {
    s = decodeURIComponent(s);
    s = s.slice(-200);
    s = s.replaceAll('-', ' ');
    return s.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
             .replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

export function* pageGenerator(
        hash: Uint32Array,
        path: string,
        goal_size:number = 1048500,
        chunk_size: number = 16384,
        root: string|undefined = undefined) {
    path = URItoHTML(path);
    const enc = new TextEncoder();
    let vpath:string[] = path.split('/');
    let code = vpath.slice(-3)[0];
    let topic = vpath.slice(-2)[0];
    let kw = {
        topic: topic.length > 3 ? enc.encode(topic) : synRobotsTxt[0],
        code: code.length > 0 ? enc.encode(code) : kEmpty,
        realroot: root?.length ? enc.encode(root) : kEmpty,
        root: roots,
    };
    let output = new mlParser(kw, hash, chunk_size, 8192);

    let total = 0;

    head(output);
    if (false) {
        yield output.bytes();
        output.reset();
    }

    while (total + output.length < goal_size) {
        output.push(outputModes[output.randint(outputModes.length)]);
        if (output.length >= chunk_size) {
            const to_send = Math.min(output.length, chunk_size);
            yield output.bytes(to_send);
            output.shift(to_send);
            total += to_send;
        }
    }
    tail(output);

    yield output.bytes();
   output.reset();
}
