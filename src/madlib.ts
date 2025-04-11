const utf8enc = new TextEncoder();
const UTF8 = (s:string):Uint8Array => utf8enc.encode(s);

class mlTemplate {
    static readonly utf8cache = new WeakMap();
    readonly strings:Uint8Array[];
    readonly args:mlType[];

    constructor(strings:TemplateStringsArray, args:mlType[]) {
        if (!mlTemplate.utf8cache.has(strings)) {
            const enc = new TextEncoder();
            mlTemplate.utf8cache.set(strings, strings.map((s:string) => enc.encode(s)));
        }
        this.strings = mlTemplate.utf8cache.get(strings);
        this.args = args;
    }
};

class mlKeyword {
    readonly keyword:string;
    constructor(keyword:string) {
        this.keyword = keyword;
    }
};

class mlLink {
    readonly content:mlType;  // TODO: maybe restrict to mlTemplate?
    readonly code:Uint8Array;
    readonly probability:number;
    constructor(content:mlType, code:string, probability:number = 100) {
        const enc = new TextEncoder();
        this.content = content;
        this.code = enc.encode(code);
        this.probability = probability;
    }
};

class mlRepeat {
    readonly content:mlTemplate;
    readonly min:number = 0;
    readonly max:number = 0;
    constructor(content:mlTemplate, min:number, max:number) {
        this.content = content;
        this.min = min || 0;
        this.max = max || min || 10;
    }
};

interface keywordType {
    [key: string]: mlType;
}
type mlFunction = (randnum:number, keywords:object|undefined)=>mlType;
export type mlType = Uint8Array | mlTemplate | mlFunction | number | mlKeyword | mlLink | mlRepeat | mlType[];

export const ml = (strings:TemplateStringsArray, ...args:mlType[]) => new mlTemplate(strings, args);
export const kw = (keyword:string) => new mlKeyword(keyword);
export const rep = (s:mlTemplate, min:number, max:number) => new mlRepeat(s, min, max);
export const ln_r = (s:mlType, c:string) => new mlLink(s, c, 25);
export const ln_u = (s:mlType, c:string) => new mlLink(s, c, 75);
// TODO: back(n)

export class mlParser {
    readonly keywords:keywordType;
    data:Uint8Array;
    rngstate:Uint32Array;
    length:number = 0;

    constructor(keywords:keywordType, hash: Uint32Array, size: number, margin: number = 1024) {
        this.data = new Uint8Array(size + margin);
        this.rngstate = hash;
        this.rngstate[6] |= 1;
        this.rngstate[7] |= 1;
        this.keywords = keywords;
    }

    reset() {
        this.length = 0;
    }

    bytes(n:number = -1) {
        if (n < 0 || n > this.length) n = this.length;
        return this.data.subarray(0, n);
    }

    shift(n: number) {
        if (n >= this.length) return this.reset();
        this.data.copyWithin(0, n, this.length);
        this.length -= n;
    }

    rand() {
        let t = this.rngstate[4] >>> 0;
        let s = this.rngstate[0] >>> 0;
        let c = this.rngstate[5] + this.rngstate[6];
        let d = Math.imul(c, this.rngstate[7]);
        this.rngstate[4] = this.rngstate[3];
        this.rngstate[3] = this.rngstate[2];
        this.rngstate[2] = this.rngstate[1];
        this.rngstate[1] = s;
        t ^= t >>> 2;
        t ^= t << 1;
        t ^= s ^ (s << 4);
        this.rngstate[0] = t;
        this.rngstate[5] = c;
        return (t ^ d) >>> 0;
    }

    randint(n: number) {
        const r = this.rand();
        return r % n;
    }

    static readonly kOOPS = UTF8("***OOPS***");
    push(value:mlType):boolean {
        let ok = true;
        while (ok) {
            switch (value?.constructor) {
            case Function: value = <mlFunction> value;
                value = value(this.rand(), this.keywords);
                break;
            case Uint8Array: value = <Uint8Array> value;
                this.data.set(value, this.length);
                this.length += value.length;
                return true;
            case Array: value = <mlType[]> value;
                {
                    let n = this.randint(value.length);
                    value = value[n];
                }
                break;
            case Number: value = <number> value;
                this.#pushNumber(value);
                return true;
            case mlKeyword: value = <mlKeyword> value;
                if (value.keyword in this.keywords) {
                    value = this.keywords[value.keyword];
                    break;
                }
                // An optimistic (do-nothing) exit to what is actually a failure.
                return true;
            case mlRepeat: value = <mlRepeat> value;
                {
                    let n = this.randint(value.max - value.min) + value.min;
                    for (let i = 0; i < n; ++i) {
                        this.push(value.content);
                    }
                }
                return true;
            case mlTemplate: value = <mlTemplate> value;
                // TODO: inline and flatten, don't recurse
                this.#pushMlTemplate(value);
                return true;
            case mlLink: value = <mlLink> value;
                if (this.randint(100) >= value.probability) {
                    value = value.content;
                    break;
                }
                this.#pushLink(value);
                return true;
            default:
                console.log("value has wrong type:", value);
                ok = false;
            }
        }
        // This should never happen
        console.log("fell out of expansion loop with value", value);
        this.data.set(mlParser.kOOPS, this.length);
        this.length += mlParser.kOOPS.length;
        return false;
    }

    #pushMlTemplate(input:mlTemplate):void {
        // TODO: keep a list of push stop-start pairs for
        // use by back-references.
        if (input.strings[0].length) this.data.set(input.strings[0], this.length);
        this.length += input.strings[0].length;
        for (let i = 0; i < input.args.length; ++i) {
            this.push(input.args[i]);
            if (input.strings[i + 1].length) this.data.set(input.strings[i + 1], this.length);
            this.length += input.strings[i + 1].length;
        }
    }
    #pushNumber(n:number):void {
        let tmp = this.length + 16;
        let end = tmp;
        do {
            let r = n >>> 0;
            n = n / 10 >>> 0;
            r -= n * 10;
            this.data[tmp--] = 0x30 + r;
        } while (n > 0);
        while (tmp < end) {
            this.data[this.length++] = this.data[++tmp];
        }
    }
    static readonly kBadChars = new Uint32Array([0xffffffff, 0xfc00987d, 0x78000001, 0xa8000001]);
    static readonly kLinkStart = ml`<a href="${kw('root')}/${(r:number)=>r>>>16}/${(r:number)=>r>>>16}/`;
    static readonly kLinkEnd = UTF8('/">');
    static readonly kSpanEnd = UTF8('</a>');
    static readonly kSlash = 47;
    #pushLink(obj:mlLink):void {
        this.push(mlParser.kLinkStart);
        if (obj.code) {
            this.data.set(obj.code, this.length);
            this.length += obj.code.length;
            this.data[this.length++] = mlParser.kSlash;
        }
        const start = this.length;
        this.push(obj.content);
        const stop = this.length;
        this.data.set(mlParser.kLinkEnd, this.length);
        this.length += mlParser.kLinkEnd.length;
        for (let i = start; i < stop; ++i) {
            let c = this.data[i];
            this.data[this.length++] = c;
            if (c < 128) {
                if ((mlParser.kBadChars[c >>> 5] >>> (c & 31)) & 1) c = 0x2d;
            }
            this.data[i] = c;
        }
        this.data.set(mlParser.kSpanEnd, this.length);
        this.length += mlParser.kSpanEnd.length;
    }
};
