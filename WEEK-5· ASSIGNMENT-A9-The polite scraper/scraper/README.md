# The Polite Scraper — FlyRank Internship A9

A small scraping pipeline that fetches the first 3 catalogue pages of Books to Scrape,
visits all 60 book pages, extracts and validates the data, and reports what happened.

## Target classification

- **Site:** books.toscrape.com
- **What it is:** A public sandbox site built specifically for people to practice web
  scraping on. Confirmed by reading toscrape.com directly.
- **Scope:** Only the first 3 catalogue pages, plus the 60 individual book pages linked
  from them.
- **Data collected:** title, product URL, price, availability, star rating, description,
  source page, fetch timestamp.
- **robots.txt check:** Requested https://books.toscrape.com/robots.txt — returned 404.
  No robots file found. This is not permission, just an absence of a file; I'm relying
  instead on the site's own stated purpose as a scraping sandbox.
- **Why this is appropriate:** The site exists explicitly for scraping practice, and I'm
  only taking a small, one-time, non-disruptive sample from it.

I will not reuse this code on another site without checking its rules and terms first.

## How to run it

**Requirements:** Node.js 20+

```bash
git clone https://github.com/Zihad-1883/FlyRank-AI-Internship---Backend-AI-Engineering
cd WEEK-5· ASSIGNMENT-A9-The polite scraper/scraper
npm install
node src/index.js
```

Output appears in `src/output/books.json` and `src/output/run-report.json`.
A second run reads from `src/cache/` and produces the same 60 records.

## Record schema

Each entry in `books.json`:

| Field               | Type            | Notes                                  |
|---------------------|-----------------|-----------------------------------------|
| title               | string          | required                                |
| product_url         | string (URL)    | required, canonical identity of record  |
| price_text          | string          | required, raw text e.g. "£51.77"        |
| price_gbp           | number          | required, normalized e.g. 51.77         |
| availability_text   | string          | required                                |
| rating_text         | string or null  | required key, value may be null         |
| description         | string or null  | required key, value may be null         |
| source_page         | string (URL)    | required, catalogue page it was found on|
| fetched_at          | string (ISO 8601)| required, timestamp of this run        |

Validated with Zod before being written. Records that fail validation are written to
`errors.json` with a reason instead of `books.json`.

## Politeness rules

- Identifies itself with a custom User-Agent: `FlyRankInternshipA9/1.0 (+repo link)`
- 15-second timeout per request; requests that hang are aborted, not left to hang forever
- Waits at least 500ms between real (non-cached) requests
- Checks HTTP status before parsing; only 200 is treated as success
- Retries once on timeout or 5xx server errors; never retries 404 or 403
- Caches every downloaded page to `cache/` so repeated development runs read from disk
  instead of re-hitting the site

## Why no browser was needed

The book data (title, price, description, etc.) is already present in the raw HTML the
server sends back — there's no JavaScript rendering step required to see it. A headless
browser (like Playwright) would only add startup cost and complexity for zero benefit here.

## Sample run report

```json
{
  "start_time": "2026-08-14T09:40:27.410Z",
  "duration_ms": 252,
  "valid_records": 60,
  "invalid_records": 0,
  "failed_pages": 0,
  "failed_page_details": []
}
```

## Known limitation

[Write one honest one, e.g.:] Retry logic only retries once and doesn't use exponential
backoff — if a page is slow twice in a row, it's logged as failed rather than retried
further. Next week's assignment (A16) builds proper backoff and structured retry logic
on top of this.

## Ethics note

I only scrape sites that are explicitly meant to be scraped, or where I've checked
robots.txt and terms first. I never bypass logins, paywalls, or access blocks — those
are a clear signal I'm not welcome. Where an official API exists for a service, I use
that instead of scraping HTML. I collect only the specific fields I actually need, at a
slow, respectful pace, and I cache aggressively so I never ask a site for the same page
twice in one session.