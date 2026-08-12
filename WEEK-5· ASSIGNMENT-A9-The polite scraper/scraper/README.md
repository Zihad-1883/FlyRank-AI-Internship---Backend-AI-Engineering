## Target classification

- **Site:** books.toscrape.com
- **What it is:** A public sandbox site built by ScrapingHub/Zyte specifically for people 
  to practice web scraping on. Confirmed by reading toscrape.com directly.
- **Scope:** Only the first 3 catalogue pages, plus the individual book detail pages 
  linked from them (60 books total).
- **Data collected:** title, product URL, price, availability, star rating, description, 
  source page, fetch timestamp.
- **robots.txt check:** Requested https://books.toscrape.com/robots.txt — returned 404. 
  No robots file found. This is not permission, just an absence of a file; I'm relying 
  instead on the site's own stated purpose as a scraping sandbox.
- **Why this is appropriate:** The site exists explicitly for scraping practice, and I'm 
  only taking a small, one-time, non-disruptive sample from it.

I will not reuse this code on another site without checking its rules and terms first.