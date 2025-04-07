const debug = false;

const utf8cache = new WeakMap();
class mlObject {
    strings:Uint8Array[] = null;
    args: object[] = null;

    constructor(strings:strings[], args:object[]) {
        if (debug) {
            const badargs = args.some((x) => x === null || x === undefined || typeof x === 'string');
            if (badargs) {
                console.log(strings, 'bad ml args:', args);
            }
        }
        const UTF8 = (v) => {
            const utf8enc = new TextEncoder();
            if (!utf8cache.has(v)) {
                utf8cache.set(v, v.map((s) => utf8enc.encode(s)));
            }
            return utf8cache.get(v);
        }
        this.strings = UTF8(strings);
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
    content:mlObject = null;
    code:string = null;
    constructor(content:mlObject, code:string) {
        this.content = content;
        this.code = code;
    }
};

class mlRepeat {
    content:mlObject = null;
    min:number = 0;
    max:number = 0;
    constructor(content:mlObject, min:number, max:number) {
        this.content = content;
        this.min = min || 0;
        this.max = max || min || 10;
    }
};

export const ml = (strings, ...args) => new mlObject(strings, args);
export const kw = (keyword) => new mlKeyword(keyword);
export const rep = (s, min, max) => new mlRepeat(s, min, max);
export const ln_r = (s, c) => (randnum) => ((randnum & 15) < 4 ? new mlLink(s, c) : s);
export const ln_u = (s, c) => (randnum) => ((randnum & 15) < 12 ? new mlLink(s, c) : s);
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
        this.keywords = keywords;
    }

    reset() {
        this.length = 0;
    }

    bytes(n: number = null) {
        if (n === null || n > this.length) n = this.length;
        return this.data.subarray(0, n);
        this.rngseed = t;
        t ^= this.rngextra[this.rngindex];
        this.rngindex = (this.rngindex + 1) & 7;
        t ^= t >>> 16;
        t = Math.imul(t, 0x21f0aaad);
        t ^= t >>> 15;
        t = Math.imul(t, 0x735a2d97);
        return (t ^ t >>> 15) >>> 1;  // TODO: see if 31-bit result actually helps performance
    }

    shift(n: number) {
        if (n >= this.length) return this.reset();
        this.data.copyWithin(0, n, this.length);
        this.length -= n;
    }

    rand() {
        let t = this.rngstate[4] >>> 0;
        let s = this.rngstate[0] >>> 0;
        let c = this.rngstate[5] + 362437 >>> 0;
        this.rngstate[4] = this.rngstate[3];
        this.rngstate[3] = this.rngstate[2];
        this.rngstate[2] = this.rngstate[1];
        this.rngstate[1] = s;
        t ^= t >>> 2;
        t ^= t << 1;
        t ^= s ^ (s >>> 4);
        this.rngstate[0] = t;
        this.rngstate[5] = c;
        return t + c >>> 2;
    }

    randint(n: number) {
        const r = this.rand();
        return r % n;
    }

    push(value) {
        while (!(value === null || value === undefined)) {
            // TODO: surely there's a better way!
            if (value instanceof Uint8Array) {
                if (value.length) this.#pushUTF8(value);
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
                value = value(this.rand());
            } else if (value instanceof mlObject) {
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
        this.#pushString("***OOPS***");
        return false;
    }

    #pushMlTemplate(input) {
        // TODO: keep a list of push stop-start pairs for
        // use by back-references.
        this.#pushUTF8(input.strings[0]);
        for (let i = 0; i < input.args.length; ++i) {
            this.push(input.args[i]);
            this.#pushUTF8(input.strings[i + 1]);
        }
    }

    #pushUTF8(value: Uint8Array) {
        this.data.set(value, this.length);
        this.length += value.length;
    }

    #pushNumber(n:number) {
        this.length += this.enc.encodeInto(n.toString(), this.data.subarray(this.length)).written;
    }
    #pushChar(c:string) {
        this.data[this.length++] = c.charCodeAt();
    }
    #pushString(s:string) {
        this.length += this.enc.encodeInto(s, this.data.subarray(this.length)).written;
    }
    static badchars = new Uint32Array([0xffffffff, 0xfc00987d, 0x78000001, 0xa8000001]);
    #pushLink(obj) {
        // TODO: randomly inject hostnames from a list of other generators
        this.#pushString('<a href="/');
        this.#pushNumber(this.rand() & 0xffff);
        this.#pushChar('/');
        this.#pushNumber(this.rand() & 0xffff);
        this.#pushChar('/');
        if (obj.code) {
            this.#pushString(obj.code);
            this.#pushChar('/');
        }
        const start = this.length;
        this.push(obj.content);
        const stop = this.length;
        this.#pushString('/">');
        const urlsafe = (c: number) => {
            if (c >= 128) return c;  // assume (ASS-U-ME) UTF-8 coding is clean
            if ((mlParser.badchars[c >> 5] >>> (c & 31)) & 1) return 0x2d;
            return c;
        }
        for (let i = start; i < stop; ++i) {
            let c = this.data[i];
            this.data[this.length++] = c;
            this.data[i] = urlsafe(c);
        }
        this.#pushString('</a>');
    }
};
