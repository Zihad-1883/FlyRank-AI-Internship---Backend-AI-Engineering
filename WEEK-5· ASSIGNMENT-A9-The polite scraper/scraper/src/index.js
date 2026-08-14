import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import * as cheerio from "cheerio"

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function discoverBookUrls() {
    let pageUrl = "https://books.toscrape.com/catalogue/page-1.html";
    let pageNum = 1;
    const MAX_PAGES = 3;
    const allLinks = [];

    while (pageUrl) {
        const cachePath = `cache/catalogue-page-${pageNum}.html`;
        const wasCached = existsSync(cachePath);
        const html = await fetchWithCache(pageUrl, cachePath);

        const $ = cheerio.load(html);
        $("article.product_pod h3 a").each((i, el) => {
            const href = $(el).attr("href");
            const absolute = new URL(href, pageUrl).href;
            allLinks.push(absolute);
        });

        const nextHref = $("li.next a").attr("href");
        if (nextHref && pageNum < MAX_PAGES) {
            pageUrl = new URL(nextHref, pageUrl).href;
            pageNum++;
            if (!wasCached) await sleep(500);
        } else {
            pageUrl = null;
        }
    };

    const uniqueUrls = [...new Set(allLinks)];

    console.log(`catalogue_pages=${pageNum}`);
    console.log(`discovered=${allLinks.length}`);
    console.log(`unique_urls=${uniqueUrls.length}`);

    return uniqueUrls;
}

async function main() {
    await discoverBookUrls();
}

main();