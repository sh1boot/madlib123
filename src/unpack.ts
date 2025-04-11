import { pageGenerator } from "./english";

export async function unpack() {
    const enc = new TextEncoder();
    const dec = new TextDecoder();
    const url = new URL(document.URL);
    const hash = new Uint32Array(await crypto.subtle.digest("SHA-256", enc.encode(url.href)));
    let size = (hash[7] & 0x3fffff) + 0x10000;
    let gen = pageGenerator(hash, url.search, size, 8192, `${url.pathname}?s=${size>>>10}&q=`);
    document.open();
    for (let chunk of gen) {
        document.write(dec.decode(chunk));
    }
    document.close();
}

window.addEventListener('load', unpack);
