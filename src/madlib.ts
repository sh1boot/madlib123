const debug = false;

class mlTemplate {
    static utf8cache = new WeakMap();
    static utf8enc = new TextEncoder();
    strings:Uint8Array[] = null;
    args: object[] = null;

    constructor(strings:strings[], args:object[]) {
        if (debug) {
            const badargs = args.some((x) => x === null || x === undefined || typeof x === 'string');
            if (badargs) {
                console.log(strings, 'bad ml args:', args);
            }
        }
        if (!mlTemplate.utf8cache.has(strings)) {
            mlTemplate.utf8cache.set(strings, strings.map((s) => mlTemplate.utf8enc.encode(s)));
        }
        this.strings = mlTemplate.utf8cache.get(strings);
        this.args = args;
    }
};

class mlKeyword {
    keyword:string = null;
    constructor(keyword:string) {
        this.keyword = keyword;
    }
};

class mlLink {
    static utf8enc = new TextEncoder();
    content:mlTemplate = null;
    code:Uint8Array = null;
    probability:number = 100;
    constructor(content:mlTemplate, code:string, probability:number = 100) {
        this.content = content;
        this.code = mlLink.utf8enc.encode(code);
        this.probability = probability;
    }
};

class mlRepeat {
    content:mlTemplate = null;
    min:number = 0;
    max:number = 0;
    constructor(content:mlTemplate, min:number, max:number) {
        this.content = content;
        this.min = min || 0;
        this.max = max || min || 10;
    }
};

export const ml = (strings, ...args) => new mlTemplate(strings, args);
export const kw = (keyword) => new mlKeyword(keyword);
export const rep = (s, min, max) => new mlRepeat(s, min, max);
export const ln_r = (s, c) => new mlLink(s, c, 25);
export const ln_u = (s, c) => new mlLink(s, c, 75);
// TODO: back(n)

export class mlParser {
    data:Uint8Array = null;
    rngstate:Uint32Array = null;
    size:number = 0;
    length:number = 0;
    enc:TextEncoder = new TextEncoder();
    keywords:object = null;

    constructor(keywords:object, hash: Uint32Array, size: number, margin: number = 1024) {
        this.data = new Uint8Array(size + margin);
        this.size = size;
        this.rngstate = hash;
        this.rngstate[6] |= 1;
        this.rngstate[7] |= 1;
        this.keywords = keywords;
    }

    reset() {
        this.length = 0;
    }

    bytes(n: number = null) {
        if (n === null || n > this.length) n = this.length;
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

    static kOOPS = new TextEncoder().encode("***OOPS***");
    push(value) {
        while (!(value === null || value === undefined)) {
            // TODO: surely there's a better way!
            if (value instanceof Uint8Array) {
                this.data.set(value, this.length);
                this.length += value.length;
                return true;
            } else if (Array.isArray(value)) {
                let n = this.randint(value.length);
                value = value[n];
            } else if (typeof value === 'number') {
                this.#pushNumber(value);
                return true;
            } else if (value instanceof mlKeyword) {
                value = this.keywords[value.keyword];
            } else if (value instanceof mlRepeat) {
                let n = this.randint(value.max - value.min) + value.min;
                for (let i = 0; i < n; ++i) {
                    this.push(value.content);
                }
                return true;
            } else if (typeof value === 'function') {
                value = value(this.rand(), this.keywords);
            } else if (value instanceof mlTemplate) {
                // TODO: inline and flatten, don't recurse
                this.#pushMlTemplate(value);
                return true;
            } else if (value instanceof mlLink) {
                this.#pushLink(value);
                return true;
            } else {
                console.log("value has wrong type:", value);
                break;
            }
        }
        // This should never happen
        console.log("fell out of expansion loop with value", value);
        this.data.set(mlParser.kOOPS, this.length);
        this.length += mlParser.kOOPS.length;
        return false;
    }

    #pushMlTemplate(input) {
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
    #pushNumber(n:number) {
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
    static kBadChars = new Uint32Array([0xffffffff, 0xfc00987d, 0x78000001, 0xa8000001]);
    static kLinkStart = new TextEncoder().encode('<a href="/');
    static kLinkEnd = new TextEncoder().encode('/">');
    static kSpanEnd = new TextEncoder().encode('</a>');
    static kSlash = '/'.charCodeAt();
    #pushLink(obj) {
        if (this.randint(100) >= obj.probability) {
            this.push(obj.content);
            return;
        }
        // TODO: randomly inject hostnames from a list of other generators
        this.data.set(mlParser.kLinkStart, this.length);
        this.length += mlParser.kLinkStart.length;
        this.#pushNumber(this.rand() & 0xffff);
        this.data[this.length++] = mlParser.kSlash;
        this.#pushNumber(this.rand() & 0xffff);
        this.data[this.length++] = mlParser.kSlash;
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
