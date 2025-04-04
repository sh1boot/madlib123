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

export const ml = (strings, ...args) => new mlObject(strings, args);
export const kw = (keyword) => new mlKeyword(keyword);
export const ln_r = (s, c) => (randnum) => ((randnum & 15) < 4 ? new mlLink(s, c) : s);
export const ln_u = (s, c) => (randnum) => ((randnum & 15) < 12 ? new mlLink(s, c) : s);

export class mlParser {
    data:Uint8Array = null;
    rngextra:Uint32Array = null;
    rngseed:number = 0;
    rngindex:number = 0;
    size:number = 0;
    length:number = 0;
    enc:TextEncoder = new TextEncoder();
    keywords:object = null;

    constructor(keywords:object, hash: Uint32Array, size: number, margin: number = 1024) {
        this.data = new Uint8Array(size + margin);
        this.size = size;
        this.rngextra = hash;
        this.rngseed = hash[1] ^ hash[2] ^ hash[3];
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
        let t: number = (this.rngseed + 0x9e3779b9) >>> 0;
        this.rngseed = t;
        t ^= this.rngextra[this.rngindex];
        this.rngindex = (this.rngindex + 1) & 7;
        t ^= t >>> 16;
        t = Math.imul(t, 0x21f0aaad);
        t ^= t >>> 15;
        t = Math.imul(t, 0x735a2d97);
        return (t ^ t >>> 15) >>> 1;  // TODO: see if 31-bit result actually helps performance
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
        this.#pushUTF8(input.strings[0]);
        input.args.forEach((arg, i) => {
            this.push(arg);
            this.#pushUTF8(input.strings[i + 1]);
        });
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
            if (c >= 128) return c;  // assume UTF-8 coding is clean
            const u = c & 0xdf;
            if (0x41 <= u && u <= 0x5a) return c;
            if ("-_.!~*'()".includes(String.fromCharCode(c))) return c;
            return 0x2d;
        }
        for (let i = start; i < stop; ++i) {
            let c = this.data[i];
            this.data[this.length++] = c;
            this.data[i] = urlsafe(c);
        }
        this.#pushString('</a>');
    }
};
