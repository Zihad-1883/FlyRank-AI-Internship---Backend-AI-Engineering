import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";

const USER_AGENT = "FlyRankInternshipA9/1.0 (+https://github.com/yourname/your-repo)";
const TIMEOUT_MS = 10000;

async function fetchWithCache(url, cachePath) {
    if (existsSync(cachePath)) {
        const html = await readFile(cachePath, "utf-8");
        console.log(`CACHE HIT (${html.length} bytes) — ${cachePath}`);
        return html;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
        signal: controller.signal,
    });
    clearTimeout(timeout);

    if (response.status !== 200) {
        throw new Error(`Failed fetch: status ${response.status} for ${url}`);
    }

    const html = await response.text();
    await mkdir("cache", { recursive: true });
    await writeFile(cachePath, html, "utf-8");
    console.log(`FETCH (${html.length} bytes) — saved to ${cachePath}`);
    return html;
}

async function main() {
    await fetchWithCache(
        "https://books.toscrape.com/catalogue/page-1.html",
        "cache/catalogue-page-1.html"
    );
}

main();