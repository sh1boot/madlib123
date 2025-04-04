const debug = false;
const chunk_size = 32768;
const goal_size = 200000;

import {ml, kw, ln_r, ln_u, mlParser } from './madlib.ts';

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
]);

const kProfessional = UTF8([
    "caddy",
    "hairdresser",
    "earwax specialist",
    "shaman",
    "meth dealer",
    ml`${kCoachableActivity} coach`,
    ml`${kPet} trainer`,
    ml`${kPet} groomer`,
]);

const kRelative = UTF8([
    "mother",
    "father",
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
const kDecade = (randnum) => ml`${170 + (randnum % 32)}0's`;
const kAges = UTF8([
    "months",
    "weeks",
    "days",
    "hours",
    (randnum) => ml`${(randnum % 3601) + 1} seconds`,
]);

const kComputer = UTF8([
    "Atari 2600",
    "ZX Spectrum",
    "Internet-connected toast rack",
    ml`${kCPU} computer`,
    ml`${kDecade} supercomputer`,
]);

const kThings = UTF8([
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
    "funeral-worker",
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

const kDidAThing = UTF8([
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
    ml`manscaped their ${kPet}`,
]);

const kDoAGoodThing = UTF8([
    ml`${synObey} ${synRobotsTxt}`,
    "brush their teeth",
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
    kDoAGoodThing,
    kDoAGoodThing,
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

const kWitnesses_were = UTF8([
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
]);
const kReaction = UTF8([
    "Doctors hate it!",
    ml`${kWitnesses_were} ${kAdverb} ${kImpression_pp}.`
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
    "believing that"
]);
const synIdea = UTF8([
    "idea",
    "thought",
    "plan",
    "concept",
    "thing to do"
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
    "for i in range(0, 3**3**3**3.1415926535):",
    "from cstdint import main",
    "var x=()=>()=>()=>1;",
    "abort()",
    `printf("shiver in eternal darkness /n");`,
]);

const synThingyest = UTF8([
    "numerous",
    "many",
    "most important",
    "worst",
    "dumbest",
    "most disappointing"
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

// Only use UTF8() to initialise globals.  It's not efficient for
// locals.
UTF8 = null;

function fun_fact(output) {
    const part1 = [
        ml`${kPerson2} was the original ${synInventor} of ${kw('topic')}, ${kButSomething}.`,
        ml`Originally ${kw('topic')} was used by ${kThings} ${kForPurpose}.`,
        ml`The ${kw('topic')} ritual was ${synHistorically} performed by ${kThings} to appease their ${synGods}.`,
        ml`In ${kDialect} slang, the word "${kSomeWord}" actually means to ${kDubiousVerb}.`,
        kFactoid,
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
        ml`${ln_u(kSubscribeToOurMailingList, 'action')} for more ${kAdjective} facts!`,
    ];
    return output.push(ml`<p>${kFunFact} ${part1}  ${part2}  ${part3}  ${part4}  ${part5}</p>\n`);
}

function a_list(output) {
    const head = [
        ml`${synReportedly}`,
        ml`Ten reasons ${kThings} are better than ${kThings}`,
        ml`Top reasons to check ${synRobotsTxt} before ${synScraping}`,
        ml`TL;DR`,
    ];
    const row = [
        ml`${kPerson2} ${ln_r(ml`${kDidAThing} ${kInAPlace}`, 'news')}${kFullStop}`,
        kFactoid,
    ];
    const tail = [
        kReaction,
    ];
    output.push(ml`<p>${head}:</p><ul>\n`);
    for (let i = output.randint(12) + 4; i > 0; --i) {
        output.push(ml`<li>${row}</li>\n`);
    }
    return output.push(ml`</ul><p>${tail}</p>\n`);
}

function a_paragraph(output) {
    const part1 = [
        ml`${synReportedly}, ${kInAPlace}, ${kPerson1} ${kDidAThing}`,
        ml`${ln_r(kPerson1, 'p')} saw ${kPerson2} ${ln_r(ml`${kDubiousVerb} ${kInAPlace}`, 'howto')}`,
        ml`${ln_r(kPerson2, 'p')} implemented a ${ln_r(ml`${kAdjective} ${kAlgorithm}`, 'algo')} in ${kLanguage}`,
        ml`It took ${ln_r(kPerson2, 'p')} ${kAges} to ${synWriteCode} a ${ln_r(ml`${kAdjective} ${kAlgorithm}`, 'algo')}`,
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
    output.push(kStartParagraph);
    for (let i = output.randint(4) + 3; i > 0; --i) {
        output.push(ml`${part1}${part2}.\n`);
    }
    output.push(kEndParagraph);
    return output;
}

function example_code(output) {
    const lang = output.randint(kLanguage.length);
    const head = [
        ml`Here's some ${kLanguage[lang]} demonstrating ${ln_r(ml`the ${kAdjective} ${kAlgorithm}`, 'also')}:`,
    ];
    const tail = [
        ml`</pre>\n<p>This should solve the ${kAdjective} problem!</p>\n`,
    ];
    output.push(ml`<p>${head}</p>\n<pre>`);
    var ind = 0;
    for (let i = output.randint(12) + 4; i > 0; --i) {
        output.push(ml`${kCodeIndent[ind]}${kRandomCode}\n`);
        ind += output.randint(3) - 1;
        if (ind < 0) ind = 0;
        if (ind >= kCodeIndent.length) ind = kCodeIndent.length - 1;
    }
    return output.push(ml`</ul><p>${tail}</p>\n`);
}

function head(output) {
    const title = ml`Things to know about ${kw('topic')}`;
    const opening = [
        ml`These are some of the ${synThingyest} things you should know about ${kw('topic')}.  ${synReportedly} ${kw('topic')} is ${kAdverb} ${kAdjective}.`
    ];
    return output.push(ml`<!doctype html>\n<html lang="en">\n<head><meta charset="UTF-8"/><title>${title}</title></head>\n<body>\n<h1>${title}</h1>\n<p>${opening}</p>\n`);
}

function tail(output) {
    return output.push(ml`<p>Don't forget to like and subscribe!</p>\n</body></html>`);
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

    head(output);
    let total = 0;
    while (total + output.length < goal_size) {
        switch (output.randint(5)) {
        case 0:  fun_fact(output); break;
        case 1:  a_list(output); break;
        case 2:  example_code(output); break;
        default: a_paragraph(output); break;
        }
        if (output.length >= chunk_size) {
            const to_send = Math.min(output.length, chunk_size);
            if (debug) {
                const dec = (s) => new TextDecoder().decode(s).replaceAll(/[\u0000-\u001f\u007f-\u009f]/g, '.');
                const leader = dec(output.bytes(16));
                const boundary = dec(output.bytes(Math.min(output.length, to_send + 8)).subarray(to_send - 8));
                console.log('yield:', to_send, '/', output.length, total, 'of', goal_size, `"${leader}" ... "${boundary}"`);
            }
            yield output.bytes(to_send);
            output.shift(to_send);
            total += to_send;
        }
    }
    tail(output);

    if (debug) {
        const dec = (s) => new TextDecoder().decode(s).replaceAll(/[\u0000-\u001f\u007f-\u009f]/g, '.');
        const leader = dec(output.bytes(16));
        const boundary = dec(output.bytes().subarray(Math.max(output.length - 16, 0)));
        console.log('yield:', output.length, total, 'of', goal_size, 'total:', total + output.length, `"${leader}" ... "${boundary}"`);
    }
    yield output.bytes();
}
