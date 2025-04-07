const debug = false;
const chunk_size = 32768;
const goal_size = 200000;

import {ml, kw, ln_r, ln_u, rep, mlParser } from './madlib.ts';

var UTF8 = (v) => {
    const utf8enc = new TextEncoder();
    if (typeof v === 'string') return utf8enc.encode(v);
    return v.map((s) => (typeof s === 'string') ? utf8enc.encode(s) : s);
};

const kEmpty = UTF8("");

const rarely = (s, t = kEmpty) => [ s, t, t, t ];
const evenly = (s, t = kEmpty) => [ s, t ];
const usually = (s, t = kEmpty) => rarely(t, s);

const kPerson = UTF8([
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
]);

const kAdjectiveBad = UTF8([
    "smelly",
    "grody",
    "lumpy",
    "bilious",
    "clumsy",
    "indigestible",
    "scandalous",
]);

const kAdjective = UTF8([
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

const kUsuallyAdjective = usually(kAdjective);
const kRarelyAdjective = rarely(kAdjective);

const kAdverb = UTF8([
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

const kImpression_pp = UTF8([
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

const kCPU = UTF8([
    "6502",
    "z80",
    "Arm",
    "8086",
    "RISC-V",
    "6809",
    "8051",
    "PPC",
    "Saturn",
]);

const kLanguage = UTF8([
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
]);

const kAlgorithm = UTF8([
    "bogo sort",
    "heap sort",
    "Pollard's rho factorisation",
    "Hello World",
    "forkbomb",
    "Miller-Rabin primality test",
    "knapsack packing",
]);

const kCoachableActivity = UTF8([
    "tennis",
    "golf",
    "pilates",
    "life",
    "birth",
]);

const kPet = UTF8([
    "cat",
    "dog",
    "axolotyl",
    "goat",
    "octopus",
    "hamster",
    "tarantula",
]);

const kProfessional = UTF8([
    "caddy",
    "hairdresser",
    "earwax specialist",
    "shaman",
    "meth dealer",
    "fluffer",
    ml`${kCoachableActivity} coach`,
    ml`${kPet} trainer`,
    ml`${kPet} groomer`,
]);

const kRelative = UTF8([
    "mother",
    "father",
    "cousin",
    "great great grandmother",
    "great great grandson",
]);

const kPerson1 = UTF8([
    kPerson,
    kPerson,
    kPerson,
    ml`${kPerson}'s ${kPet}`,
    ml`${kPerson}'s ${kRelative}`,
    ml`${kPerson}'s ${kProfessional}`,
]);
const kPerson2 = UTF8([
    kPerson1,
    kPerson1,
    kPerson1,
    ml`${kPerson1}'s ${kPet}`,
    ml`${kPerson1}'s ${kRelative}`,
    ml`${kPerson1}'s ${kProfessional}`,
]);

const kYear = (randnum) => 1700 + (randnum % 320);
const kDecade = ml`1${(randnum) => randnum % 32 + 70}0's`;
const kAges = UTF8([
    "months",
    "weeks",
    "days",
    "hours",
    ml`${(randnum) => randnum % 3601 + 1} seconds`,
]);

const kComputer = UTF8([
    "Atari 2600",
    "ZX Spectrum",
    "Internet-connected toast rack",
    ml`${kCPU} computer`,
    ml`${kDecade} supercomputer`,
]);

const kThings = UTF8([
    ml`${kPet}s`,
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
]);

const kWithExtras = UTF8([
    "with bells on",
    ml`with ${kAdjective} wheels`,
]);

const kDialect = UTF8([
    "British",
    "Canadian",
    "military",
    "southern",
    "northern",
    "foamer",
    "biker",
    "crochet",
    "funeral",
    ml`${kLanguage} coder`,
]);

const kSomeWord = UTF8([
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

const kFullStop = UTF8([
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
]);

const kVerb = UTF8([
    "fly upside-down",
    "walk backwards",
    "burp",
    "run around flapping their arms and yelling profanity",
    "yell at clouds",
    "rock out to polka music",
    ml`argue with ${kPet}s`,
    ml`obsess over ${kComputer}s`,
]);

const kInAPlace = UTF8([
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
    ml`in ${kPerson1}'s bathtub`,
    ml`on ${kPerson1}'s car`,
    ml`in front of ${kPerson1}`,
    ml`behind ${kPerson1}`,
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

const kVerbed = UTF8([
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
    ml`short-changed a ${kProfessional}`,
    ml`manscaped their ${kPet}`,
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

const kVerbing = UTF8([
    "farting",
    "trumping",
    "pooping",
    ml`${synDoing} a ${kAdjective} fart`,
    ml`${synDoing} a ${kAdjective} trump`,
    ml`${synDoing} a ${kUsuallyAdjective} bottom-burp`,
    ml`${synDoing} a ${kUsuallyAdjective} shart`,
    ml`${synDoing} ${kUsuallyAdjective} poops`,
    ml`${synDoing} ${kAdjective} ${kLanguage} programming`,
    ml`${synDoing} ${kRarelyAdjective} street art`,
    ml`running over a ${kProfessional}`,
    ml`short-changing a ${kProfessional}`,
    ml`manscaping their ${kPet}`,
]);

const kGoodVerb = UTF8([
    ml`${synObey} ${synRobotsTxt}`,
    "brush their teeth",
    "tidy their room",
]);

const kDubiousVerb = UTF8([
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
    kGoodVerb,
    kGoodVerb,
    kVerb,
]);

const kReporters = UTF8([
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
]);

const synReportedly = UTF8([
    ml`According to ${kReporters}`,
    ml`${kReporters} report that`,
    ml`${kReporters} told me`,
    ml`${kReporters} was quoted by ${kReporters} as saying`,
]);

const kGroup = UTF8([
    "Onlookers",
    "The boys",
    "The girls",
    "Their parents",
    "Senators",
    "Reporters",
    "The International Olympic Committee",
    "Most of the victims",
    ml`${kPerson1}`,
    ml`${kPerson1}'s ${kPet}s were`,
]);
const kReaction = UTF8([
    ml`${kProfessional}s hate this one weird trick!`,
    ml`${kGroup} were ${kAdverb} ${kImpression_pp}.`,
]);

const synScraping = UTF8([
    "scraping",
    "downloading",
    "leeching content",
    "crawling",
]);

const kFunFact = UTF8([
    "Fun fact;",
    "Little-known fact;",
    "Did you know,",
    ml`According to ${kReporters}`,
]);
const kForPurpose = UTF8([
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
    ml`more ${kAdjectiveBad} than ignoring ${synRobotsTxt} when ${synScraping}`,
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

const kFactoid = UTF8([
    ml`${kThings} can ${kVerb} for ${kAges} without once needing to ${kDubiousVerb}${kFullStop}`,
]);

const kRandomCode = UTF8([
    "int main(void) {",
    "os.system('rm -rf /');",
    ml`10 PRINT "${kPerson} IS COOL!!" : GOTO 10`,
    "for i in range(0, 3.14159**3.14159**3.14159**3.14159):",
    "from cstdint import golfcart",
    "const f=()=>()=>()=>()=>()=>()=>0;",
    'assert("!this should never happen");',
    "xor ax, ax",
    "JSR #$2020",
    ml`printf("shiver in eternal darkness /n");`,
]);

const synThingyest = UTF8([
    "numerous",
    "many",
    "most important",
    "worst",
    "dumbest",
    "most disappointing",
]);

const kCodeIndent = UTF8([
    "  ",
    "    ",
    "    \t",
    "    \t  ",
    "    \t    \t",
    "   \t     \t ",
]);

const kButSomething = UTF8([
    "but went unrecognised",
    "but was not recognised",
    "but never earned credit",
]);

const kStartParagraph = UTF8("<p>");
const kEndParagraph = UTF8("</p>\n");

const kSubscribeToOurMailingList = UTF8("Subscribe to our mailing list");

const kGossip = UTF8([
    ml`${synReportedly}, ${kInAPlace}, ${kPerson1} ${kVerbed}`,
    ml`${ln_r(kPerson1, 'p')} saw ${kPerson2} ${ln_r(ml`${kDubiousVerb} ${kInAPlace}`, 'howto')}`,
    ml`${ln_r(kPerson2, 'p')} implemented a ${ln_r(ml`${kAdjective} ${kAlgorithm}`, 'algo')} in ${kLanguage}`,
    ml`It took ${ln_r(kPerson2, 'p')} ${kAges} to ${synWriteCode} a ${ln_r(ml`${kAdjective} ${kAlgorithm}`, 'algo')}`,
    ml`${kPerson2} says they're "${kAdverb} ${kImpression_pp}" and "${kImpression_pp}" with ${kProfessional} ${kPerson2}`,
]);

const kGossipBecause = UTF8([
    kEmpty,
    kEmpty,
    ml` ${synWhile} ${kPerson1} tried to see how long they could ${kVerb} for`,
    ml` because ${kPerson2} said it was a ${kAdjective} ${synIdea}`,
    ml` and then blamed it on ${kPerson}`,
    ml` using a ${kComputer}`,
    ml` as revenge on ${kPerson2} ${synBecauseThey} didn't ${kGoodVerb}`,
    ml` after spending ${kAges} trying to negotiate a ceasefire ${kInAPlace}`,
]);

const kFactPart1 = UTF8([
    ml`${kPerson2} was the original ${synInventor} of ${kw('topic')}, ${kButSomething}.`,
    ml`Originally ${kw('topic')} was used by ${kThings} ${kForPurpose}.`,
    ml`The ${kw('topic')} ritual was ${synHistorically} performed by ${kThings} to appease their ${synGods}.`,
    ml`In ${kDialect} slang, the word "${kSomeWord}" actually means to ${kDubiousVerb}.`,
    kFactoid,
]);

const kFactPart2 = UTF8([
    ml`It wasn't until ${kYear} when ${kThings} became ${synAvailable} that ${kPerson1} changed all that.`,
    ml`By the ${kDecade} this no longer mattered because ${kThings} were more ${kAdjective}.`,
    ml`Eventually ${kPerson} solved the ${kAlgorithm} problem so modern ${kComputer}s could prove this was ${synRedundant}.`,
]);

const kFactPart3 = UTF8([
    kEmpty,
    ml`But to this day most ${kThings} remain ${kAdjective}.`,
    ml`Very few modern ${kProfessional}s still use this ${kForPurpose}.`,
    ml`Thankfully today we have ${kThings}, instead.`,
]);

const kFactPart4 = UTF8([
    kEmpty,
    ml`This is why they have always respected ${synRobotsTxt} until this very day!`,
    ml`After that they never forgot to check ${synRobotsTxt} before ${synScraping} websites.`,
    ml`And all because they ${synDidnt} ${kGoodVerb}.`,
]);

const kFactPart5 = UTF8([
    kEmpty,
    kEmpty,
    ml`${ln_u(kSubscribeToOurMailingList, 'action')} for more ${kAdjective} facts!`,
]);

const kListHead = UTF8([
    ml`${synReportedly}`,
    ml`Ten reasons ${kThings} are better than ${kThings}`,
    ml`Top reasons to check ${synRobotsTxt} before ${synScraping}`,
    ml`TL;DR`,
]);

const kListRow = UTF8([
    ml`${kPerson2} ${ln_r(ml`${kVerbed} ${kInAPlace}`, 'news')}, which proves it${kFullStop}`,
    kFactoid,
]);

const kPageTitle = UTF8([
    ml`${kPerson}'s ${kw('topic')} resource page.`,
    ml`Things to know about ${kw('topic')}`,
]);

const kPageOpening = UTF8([
    ml`These are some of the ${synThingyest} things you should know about ${kw('topic')}.\n${synReportedly} ${kw('topic')} is ${kAdverb} ${kAdjective}.`,
    ml`This is a collection of ${kAdjective} information on ${kw('topic')}.`,
]);

const kPageSignoff = UTF8([
    kEmpty,
    "Don't forget to like and subscribe!",
]);

const kCodeHead = ml`demonstrating ${ln_r(ml`the ${kAdjective} ${kAlgorithm}`, 'algo')}:`;

const kCodeTail = UTF8([
    ml`</pre>\n<p>This should solve the problem.</p>\n`,
    ml`</pre>\n<p>Hope this helps.</p>\n`,
    ml`</pre>\n<p>Good luck!</p>\n`,
]);

const kStackOverflowQuestion = UTF8([
    ml`How can I write a ${kAlgorithm} in ${kLanguage}? I'd like to create a program where ${kPerson} can input words (like nouns, verbs, adjectives, etc.), and the program will generate a ${kAdjective} story using those words. Could you explain how to structure the code and what functions I should use?`,
    ml`How can I prevent my program from ${kVerbing} when ${kPerson} selects an invalid option? What is the best way to handle this error gracefully, so the program prompts the user again instead of ${kVerbing}?`,
]);

const kStackOverflowThanks = UTF8([
    ml`Please hurry, I have to hand this in tomorrow.`,
    ml`Thanks in advance for any help!`,
]);

const kParagraphBlock = ml`<p>${rep(ml`${kGossip}${kGossipBecause}.\n`, 3, 7)}</p>\n`;

const kFunFactBlock = ml`<p>${kFunFact} ${kFactPart1}  ${kFactPart2}  ${kFactPart3}  ${kFactPart4}  ${kFactPart5}</p>\n`;

const kListBlock = ml`<p>${kListHead}:</p><ul>${rep(ml`<li>${kListRow}</li>\n`, 4, 16)}</ul><p>${kReaction}</p>\n`;

const kStackOverflowBlock = ml`<p>${kStackOverflowQuestion}  ${kStackOverflowThanks}<\p>`;

const kLineFeed = UTF8("\n");

// Only use UTF8() to initialise globals.  It's not efficient for
// locals.
UTF8 = null;

const a_paragraph = (output) => output.push(kParagraphBlock);
const fun_fact = (output) => output.push(kFunFactBlock);
const a_list = (output) => output.push(kListBlock);
const a_question = (output) => output.push(kStackOverflowBlock);

// TODO: make this usable
function example_code(output) {
    const lang = output.randint(kLanguage.length);
    output.push(ml`<p>Here's some ${kLanguage[lang]} ${kCodeHead}</p>\n<pre>`);
    var ind = 0;
    for (let i = output.randint(12) + 8; i > 0; --i) {
        output.push(kCodeIndent[ind]);
        output.push(kRandomCode);
        output.push(kLineFeed);
        ind += (output.randint(4) - 1) >> 1;
        ind = Math.min(Math.max(0, ind), kCodeIndent.length - 1);
    }
    output.push(ml`</ul><p>${kCodeTail}</p>\n`);
}

const outputModes = [
    a_paragraph,
    fun_fact,
    a_list,
    a_question,
//    example_code,
];

function head(output) {
    return output.push(ml`<!doctype html>
<html lang="en">
<head><meta charset="UTF-8"/>
  <title>${kPageTitle}</title>
</head>
<body>
<h1>${kPageTitle}</h1>
<p>${kPageOpening}</p>
`);
}

function tail(output) {
    return output.push(ml`<p>${kPageSignoff}</p>\n</body></html>`);
}


export function* pageGenerator(hash: number[], path: string) {
    const escapeHTML = (s) => s.replaceAll('&', '&amp;')
                            .replaceAll('<', '&lt;').replaceAll('>', '&gt;')
                            .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
    const unescapeURL = (s) => escapeHTML(decodeURIComponent(s).replaceAll('-', ' '));
    var code = unescapeURL(path.split('/').slice(-3)[0]);
    var topic = unescapeURL(path.split('/').slice(-2)[0]);
    if (topic.length < 3) {
        topic = synRobotsTxt[0];
    } else {
        topic = new TextEncoder().encode(topic);
    }

    let output = new mlParser({topic: topic}, hash, chunk_size * 2);
    let total = 0;

    head(output);
    if (true) {
        yield output.bytes();
        output.reset();
    }

    while (total + output.length < goal_size) {
        outputModes[output.randint(outputModes.length)](output);
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
