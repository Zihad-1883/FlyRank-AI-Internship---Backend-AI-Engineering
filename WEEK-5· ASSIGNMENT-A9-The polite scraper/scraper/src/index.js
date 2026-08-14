import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync, utimes } from "fs";
import * as cheerio from "cheerio"
import { z } from "zod";

const BookSchema = z.object({
    title: z.string().min(1),
    product_url: z.string().url().startsWith("https://"),
    price_text: z.string().min(1),
    price_gbp: z.number().positive(),
    availability_text: z.string().min(1),
    rating_text: z.string().nullable(),
    description: z.string().nullable(),
    source_page: z.string().url(),
    fetched_at: z.string().datetime(),
});

const USER_AGENT = "FlyRankInternshipA9/1.0 (+https://github.com/yourname/your-repo)";
const TIMEOUT_MS = 15000;

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
    const records = [];

    while (pageUrl) {
        const cachePath = `cache/catalogue-page-${pageNum}.html`;
        const wasCached = existsSync(cachePath);
        const html = await fetchWithCache(pageUrl, cachePath);
        const $ = cheerio.load(html);

        $("article.product_pod h3 a").each((i, el) => {
            const href = $(el).attr("href");
            const absolute = new URL(href, pageUrl).href;
            records.push({ url: absolute, sourcePage: pageUrl });
        });

        const nextHref = $("li.next a").attr("href");
        if (nextHref && pageNum < MAX_PAGES) {
            pageUrl = new URL(nextHref, pageUrl).href;
            pageNum++;
            if (!wasCached) await sleep(500);
        } else {
            pageUrl = null;
        }
    }

    const seen = new Map();
    for (const r of records) {
        if (!seen.has(r.url)) seen.set(r.url, r.sourcePage);
    }

    console.log(`catalogue_pages=${pageNum}`);
    console.log(`discovered=${records.length}`);
    console.log(`unique_urls=${seen.size}`);

    return [...seen.entries()].map(([url, sourcePage]) => ({ url, sourcePage }));
}

async function extractBookDetails(url, sourcePage) {
    const parts = url.split("/").filter(Boolean);
    const slug = parts[parts.length - 2];
    const cachePath = `cache/book-${slug}.html`;
    const wasCached = existsSync(cachePath);

    const html = await fetchWithCache(url, cachePath);
    const $ = cheerio.load(html);
    const main = $(".product_main");

    const title = main.find("h1").text().trim();
    const price_text = main.find(".price_color").text().trim();
    const availability_text = main.find(".instock.availability").text().trim().replace(/\s+/g, " ");

    const ratingClass = main.find(".star-rating").attr("class") || "";
    const rating_text = ratingClass.replace("star-rating", "").trim() || null;

    const descDiv = $("#product_description");
    const description = descDiv.length
        ? descDiv.next("p").text().trim()
        : null;

    const record = {
        title,
        product_url: url,
        price_text,
        availability_text,
        rating_text,
        description,
        source_page: sourcePage,
        fetched_at: new Date().toISOString(),
    };

    if (!wasCached) await sleep(500);

    return record;
}

function parsePrice(priceText) {
    const cleaned = priceText.replace(/[^\d.]/g, "");
    return parseFloat(cleaned);
}

function validateRecords(records) {
    const valid = [];
    const errors = [];

    for (const record of records) {
        const result = BookSchema.safeParse(record);
        if (result.success) {
            valid.push(result.data);
        } else {
            errors.push({
                product_url: record.product_url,
                reason: result.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; "),
            })
        }
    }

    return { valid, errors };
}

async function saveResults(validRecords, errorRecords) {
    await mkdir("output", { recursive: true });

    const byUrl = new Map();
    for (const r of validRecords) byUrl.set(r.product_url, r);
    const deduped = [...byUrl.values()];

    await writeFile("output/books.json", JSON.stringify(deduped, null, 2), "utf-8");
    await writeFile("output/errors.json", JSON.stringify(errorRecords, null, 2), "utf-8");

    console.log(`valid_records=${deduped.length}`);
    console.log(`invalid_records=${errorRecords.length}`);
}

async function main() {
    const bookRefs = await discoverBookUrls();

    const rawRecords = [];
    for (const { url, sourcePage } of bookRefs) {
        const record = await extractBookDetails(url, sourcePage);
        rawRecords.push(record);
    }

    console.log(`detail_pages=${rawRecords.length}`);

    const normalizedRecords = rawRecords.map(r => ({
        ...r,
        price_gbp: parsePrice(r.price_text),
    }));

    const { valid, errors } = validateRecords(normalizedRecords);
    await saveResults(valid, errors);
}

main();