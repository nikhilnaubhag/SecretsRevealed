/* ==========================================================================
   SECRETSREVEALED v7 — COMPLETE 66-BOOK HOLY BIBLE ENGINE (GENESIS–REVELATION)
   - All 66 Books (39 Old Testament + 27 New Testament = 1,189 Chapters)
   - 5 Translations: English (NIV), English (KJV), Hindi, Nepali, Bengali
   - Powered by Bolls.life Open CORS API + Dynamic Translation Auto-Discovery
     + Automatic Offline LocalStorage Cache + Built-In Instant Fallback
   - Tap any verse to Highlight + Identical 2-Language Side-by-Side Compare
   ========================================================================== */

const BIBLE_BOOKS_66 = [
  // Old Testament (1 - 39)
  { id: 1,  name: "Genesis",         chapters: 50, test: "OT" },
  { id: 2,  name: "Exodus",          chapters: 40, test: "OT" },
  { id: 3,  name: "Leviticus",       chapters: 27, test: "OT" },
  { id: 4,  name: "Numbers",         chapters: 36, test: "OT" },
  { id: 5,  name: "Deuteronomy",     chapters: 34, test: "OT" },
  { id: 6,  name: "Joshua",          chapters: 24, test: "OT" },
  { id: 7,  name: "Judges",          chapters: 21, test: "OT" },
  { id: 8,  name: "Ruth",            chapters: 4,  test: "OT" },
  { id: 9,  name: "1 Samuel",        chapters: 31, test: "OT" },
  { id: 10, name: "2 Samuel",        chapters: 24, test: "OT" },
  { id: 11, name: "1 Kings",         chapters: 22, test: "OT" },
  { id: 12, name: "2 Kings",         chapters: 25, test: "OT" },
  { id: 13, name: "1 Chronicles",    chapters: 29, test: "OT" },
  { id: 14, name: "2 Chronicles",    chapters: 36, test: "OT" },
  { id: 15, name: "Ezra",            chapters: 10, test: "OT" },
  { id: 16, name: "Nehemiah",        chapters: 13, test: "OT" },
  { id: 17, name: "Esther",          chapters: 10, test: "OT" },
  { id: 18, name: "Job",             chapters: 42, test: "OT" },
  { id: 19, name: "Psalms",          chapters: 150, test: "OT" },
  { id: 20, name: "Proverbs",        chapters: 31, test: "OT" },
  { id: 21, name: "Ecclesiastes",    chapters: 12, test: "OT" },
  { id: 22, name: "Song of Solomon", chapters: 8,  test: "OT" },
  { id: 23, name: "Isaiah",          chapters: 66, test: "OT" },
  { id: 24, name: "Jeremiah",        chapters: 52, test: "OT" },
  { id: 25, name: "Lamentations",    chapters: 5,  test: "OT" },
  { id: 26, name: "Ezekiel",         chapters: 48, test: "OT" },
  { id: 27, name: "Daniel",          chapters: 12, test: "OT" },
  { id: 28, name: "Hosea",           chapters: 14, test: "OT" },
  { id: 29, name: "Joel",            chapters: 3,  test: "OT" },
  { id: 30, name: "Amos",            chapters: 9,  test: "OT" },
  { id: 31, name: "Obadiah",         chapters: 1,  test: "OT" },
  { id: 32, name: "Jonah",           chapters: 4,  test: "OT" },
  { id: 33, name: "Micah",           chapters: 7,  test: "OT" },
  { id: 34, name: "Nahum",           chapters: 3,  test: "OT" },
  { id: 35, name: "Habakkuk",        chapters: 3,  test: "OT" },
  { id: 36, name: "Zephaniah",       chapters: 3,  test: "OT" },
  { id: 37, name: "Haggai",          chapters: 2,  test: "OT" },
  { id: 38, name: "Zechariah",       chapters: 14, test: "OT" },
  { id: 39, name: "Malachi",         chapters: 4,  test: "OT" },
  // New Testament (40 - 66)
  { id: 40, name: "Matthew",         chapters: 28, test: "NT" },
  { id: 41, name: "Mark",            chapters: 16, test: "NT" },
  { id: 42, name: "Luke",            chapters: 24, test: "NT" },
  { id: 43, name: "John",            chapters: 21, test: "NT" },
  { id: 44, name: "Acts",            chapters: 28, test: "NT" },
  { id: 45, name: "Romans",          chapters: 16, test: "NT" },
  { id: 46, name: "1 Corinthians",   chapters: 16, test: "NT" },
  { id: 47, name: "2 Corinthians",   chapters: 13, test: "NT" },
  { id: 48, name: "Galatians",       chapters: 6,  test: "NT" },
  { id: 49, name: "Ephesians",       chapters: 6,  test: "NT" },
  { id: 50, name: "Philippians",     chapters: 4,  test: "NT" },
  { id: 51, name: "Colossians",      chapters: 4,  test: "NT" },
  { id: 52, name: "1 Thessalonians", chapters: 5,  test: "NT" },
  { id: 53, name: "2 Thessalonians", chapters: 3,  test: "NT" },
  { id: 54, name: "1 Timothy",       chapters: 6,  test: "NT" },
  { id: 55, name: "2 Timothy",       chapters: 4,  test: "NT" },
  { id: 56, name: "Titus",           chapters: 3,  test: "NT" },
  { id: 57, name: "Philemon",        chapters: 1,  test: "NT" },
  { id: 58, name: "Hebrews",         chapters: 13, test: "NT" },
  { id: 59, name: "James",           chapters: 5,  test: "NT" },
  { id: 60, name: "1 Peter",         chapters: 5,  test: "NT" },
  { id: 61, name: "2 Peter",         chapters: 3,  test: "NT" },
  { id: 62, name: "1 John",          chapters: 5,  test: "NT" },
  { id: 63, name: "2 John",          chapters: 1,  test: "NT" },
  { id: 64, name: "3 John",          chapters: 1,  test: "NT" },
  { id: 65, name: "Jude",            chapters: 1,  test: "NT" },
  { id: 66, name: "Revelation",      chapters: 22, test: "NT" }
];

const WholeBibleEngine = (() => {
  /* 5 Core Translations: English NIV, English KJV, Hindi, Nepali, Bengali */
  const TRANSLATIONS = [
    { key: "niv", label: "English (NIV)", codes: ["NIV", "NIV2011", "NKJV", "WEB"], langMatch: "english" },
    { key: "kjv", label: "English (KJV)", codes: ["KJV", "NKJV", "ASV"], langMatch: "english" },
    { key: "hi",  label: "हिन्दी (Hindi)", codes: ["HINDI", "IRVHin", "HIN"], langMatch: "hindi" },
    { key: "ne",  label: "नेपाली (Nepali)", codes: ["NNRV", "NEP", "NPB", "NEPALI"], langMatch: "nepali" },
    { key: "bn",  label: "বাংলা (Bengali)", codes: ["BENGALI", "IRVBen", "BEN", "BOV"], langMatch: "bengali" }
  ];

  let discoveredCodes = null;
  const memCache = {};

  function sanitizeVerseHtml(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = String(html || "");
    tmp.querySelectorAll("s, sup.footnote, .note").forEach(n => n.remove());
    return (tmp.textContent || "").replace(/\s+/g, " ").trim();
  }

  /* Dynamically resolve exact live Bolls.life translation slugs once */
  async function discoverLiveCodes() {
    if (discoveredCodes) return discoveredCodes;
    discoveredCodes = {};
    try {
      const res = await fetch("https://bolls.life/static/bolls/app/views/languages.json");
      if (res.ok) {
        const groups = await res.json();
        if (Array.isArray(groups)) {
          groups.forEach(g => {
            const lname = String(g.language || "").toLowerCase();
            const trs = Array.isArray(g.translations) ? g.translations : [];
            if (lname.includes("hindi") && trs.length) discoveredCodes.hi = trs.map(x => x.short_name);
            if (lname.includes("nepali") && trs.length) discoveredCodes.ne = trs.map(x => x.short_name);
            if ((lname.includes("bengali") || lname.includes("bangla")) && trs.length) discoveredCodes.bn = trs.map(x => x.short_name);
          });
        }
      }
    } catch {}
    return discoveredCodes;
  }

  function getLocalFallback(transKey, bookId, chapter) {
    // Check built-in offline chapters from v5-data.js first
    const keyMap = { niv: "niv", kjv: "nkjv", hi: "hi_bsi", ne: "ne_bsi", bn: "bn_bsi" };
    const bookObj = BIBLE_BOOKS_66.find(b => b.id === bookId);
    if (typeof BIBLE_LIBRARY !== "undefined" && bookObj) {
      const found = BIBLE_LIBRARY.find(c => c.book.toLowerCase() === bookObj.name.toLowerCase() && c.chapter === chapter);
      if (found && found.verses) {
        const arr = found.verses[keyMap[transKey]] || found.verses.niv || [];
        return arr.map((line, i) => {
          const m = String(line).match(/^([0-9०-९০-৯]+)\s+(.*)$/);
          return { verse: m ? Number(m[1]) || (i + 1) : (i + 1), text: m ? m[2] : line };
        });
      }
    }
    return null;
  }

  async function fetchChapter(transKey, bookId, chapter) {
    const cacheKey = `${transKey}:${bookId}:${chapter}`;
    if (memCache[cacheKey]) return memCache[cacheKey];

    // Check offline localStorage cache first
    try {
      const stored = window.localStorage.getItem("sr_bible_cache_" + cacheKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length) {
          memCache[cacheKey] = parsed;
          return parsed;
        }
      }
    } catch {}

    await discoverLiveCodes();
    const tr = TRANSLATIONS.find(x => x.key === transKey) || TRANSLATIONS[0];
    const candidateCodes = [...new Set([...(discoveredCodes?.[transKey] || []), ...tr.codes])];

    for (const code of candidateCodes) {
      try {
        const res = await fetch(`https://bolls.life/get-text/${encodeURIComponent(code)}/${bookId}/${chapter}/`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const clean = data.map(v => ({ verse: v.verse, text: sanitizeVerseHtml(v.text) })).filter(v => v.text);
            if (clean.length) {
              memCache[cacheKey] = clean;
              try { window.localStorage.setItem("sr_bible_cache_" + cacheKey, JSON.stringify(clean)); } catch {}
              return clean;
            }
          }
        }
      } catch {}
    }

    // Fallback to bible-api.com for English KJV/WEB if Bolls is temporarily unreachable
    if (transKey === "kjv" || transKey === "niv") {
      try {
        const b = BIBLE_BOOKS_66.find(x => x.id === bookId);
        if (b) {
          const res = await fetch(`https://bible-api.com/${encodeURIComponent(b.name + " " + chapter)}?translation=${transKey === "kjv" ? "kjv" : "web"}`);
          if (res.ok) {
            const d = await res.json();
            if (Array.isArray(d.verses) && d.verses.length) {
              const clean = d.verses.map(v => ({ verse: v.verse, text: String(v.text || "").trim() }));
              memCache[cacheKey] = clean;
              return clean;
            }
          }
        }
      } catch {}
    }

    // Offline built-in fallback
    const local = getLocalFallback(transKey, bookId, chapter);
    if (local) return local;

    return [{ verse: 1, text: "Connect to the internet once to load this chapter; once opened, it is automatically cached for offline reading." }];
  }

  return { TRANSLATIONS, BOOKS: BIBLE_BOOKS_66, fetchChapter };
})();
