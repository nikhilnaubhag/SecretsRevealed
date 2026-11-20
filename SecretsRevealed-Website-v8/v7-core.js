/* ==========================================================================
   SECRETSREVEALED v7 — COMPLETE UNIFIED ENGINE (ZERO REMOVALS, ALL UPGRADES)
   - Whole 66-Book Holy Bible (Genesis 1 – Revelation 22, 5 Translations,
     Tap-to-Highlight, Identical 2-Language Side-by-Side Compare)
   - Full 100-Level Bible Quiz Competition (Guest 10-Q Gate -> Sign-In Unlock
     for Levels 11–100 & Live Reader Leaderboard!)
   - Feedback Form + Pause & Pray Stillness + 50+ HD Wallpapers Overlay
   - 4 Strictly Isolated Book Sections + Private Owner Studio via Unified Sign-In
   ========================================================================== */

window.SR7 = {
  user: null,
  sections: JSON.parse(JSON.stringify(DEFAULT_SECTIONS)),
  wallpapers: JSON.parse(JSON.stringify(DEFAULT_WALLPAPERS)),
  leaderboard: [
    { name: "Grace K.", score: 18, tier: "easy", date: "2026-11-18" },
    { name: "Daniel R.", score: 16, tier: "easy", date: "2026-11-19" }
  ],
  feedback: [],
  tracker: { bibleOpens: 1, versesRead: 6, booksRead: 1, versesWritten: 0, wallpapersDownloaded: 0, streakDays: 1, writtenLog: [] },
  bible: { bookId: 1, chapter: 1, verA: "niv", verB: "hi", compare: false, highlights: {} },
  wpFilter: "All",
  activeSectionFilter: "all",
  searchTerm: "",
  currentBook: null,
  currentChapterIdx: 0,
  studioSeat: "revelation_books",
  studioChapters: [],
  studioCoverData: "",
  studioPdfKey: "",
  studioPdfName: "",
  quiz: { tier: "easy", pool: [], index: 0, score: 0, chosen: null, checked: false }
};

function showToast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("is-visible");
  clearTimeout(window._t7);
  window._t7 = setTimeout(() => el.classList.remove("is-visible"), 3200);
}
window.showToast = showToast;

function safeGet(k) { try { return window.localStorage.getItem(k) || ""; } catch { return ""; } }
function safeSet(k, v) { try { window.localStorage.setItem(k, v); } catch {} }

async function sha256(str) {
  if (!window.crypto || !crypto.subtle) return str;
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function loadState() {
  try {
    const s = JSON.parse(safeGet("sr_v7_state") || "null");
    if (s) {
      if (s.sections) SECTION_REGISTRY.forEach(sec => { if (Array.isArray(s.sections[sec.id])) SR7.sections[sec.id] = s.sections[sec.id]; });
      if (Array.isArray(s.wallpapers) && s.wallpapers.length >= 50) SR7.wallpapers = s.wallpapers;
      if (Array.isArray(s.leaderboard)) SR7.leaderboard = s.leaderboard;
      if (Array.isArray(s.feedback)) SR7.feedback = s.feedback;
      if (s.tracker) SR7.tracker = { ...SR7.tracker, ...s.tracker };
      if (s.highlights) SR7.bible.highlights = s.highlights;
    }
  } catch {}
}

function saveState() {
  try {
    safeSet("sr_v7_state", JSON.stringify({
      sections: SR7.sections, wallpapers: SR7.wallpapers, leaderboard: SR7.leaderboard,
      feedback: SR7.feedback, tracker: SR7.tracker, highlights: SR7.bible.highlights
    }));
  } catch {}
}

function trackSpiritualEvent(key, delta = 1) {
  SR7.tracker[key] = (SR7.tracker[key] || 0) + delta;
  saveState();
  renderTracker();
}
window.trackSpiritualEvent = trackSpiritualEvent;

function getAllBooksFlat() {
  const out = [];
  SECTION_REGISTRY.forEach(s => (SR7.sections[s.id] || []).forEach(b => out.push(b)));
  return out;
}

function findBookById(id) {
  for (const s of SECTION_REGISTRY) {
    const f = (SR7.sections[s.id] || []).find(b => b.id === id);
    if (f) return f;
  }
  return null;
}

/* ==========================================================================
   1. WHOLE 66-BOOK HOLY BIBLE RENDERER (TAP TO HIGHLIGHT + 2-LANG COMPARE)
   ========================================================================== */
function populateChapterDropdown() {
  const chSel = document.getElementById("bibleChapterSelect");
  if (!chSel) return;
  const book = WholeBibleEngine.BOOKS.find(b => b.id === SR7.bible.bookId) || WholeBibleEngine.BOOKS[0];
  let opts = "";
  for (let i = 1; i <= book.chapters; i++) {
    opts += `<option value="${i}" ${i === SR7.bible.chapter ? "selected" : ""}>Chapter ${i}</option>`;
  }
  chSel.innerHTML = opts;
}

async function renderWholeBible() {
  const container = document.getElementById("bibleVersesContainer");
  if (!container) return;
  const book = WholeBibleEngine.BOOKS.find(b => b.id === SR7.bible.bookId) || WholeBibleEngine.BOOKS[0];
  const heading = document.getElementById("bibleChapterHeading");
  if (heading) heading.textContent = `${book.name} ${SR7.bible.chapter}`;

  const toggleBtn = document.getElementById("bibleCompareToggleBtn");
  if (toggleBtn) {
    toggleBtn.classList.toggle("is-active", SR7.bible.compare);
    toggleBtn.textContent = SR7.bible.compare ? "Single View" : "Compare Versions";
  }

  container.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--text-muted);font-size:0.88rem;">Loading ${book.name} ${SR7.bible.chapter}...</div>`;

  const versesA = await WholeBibleEngine.fetchChapter(SR7.bible.verA, book.id, SR7.bible.chapter);

  if (!SR7.bible.compare) {
    container.innerHTML = `<div class="bible-clean-prose">${versesA.map(v => {
      const hKey = `${book.id}:${SR7.bible.chapter}:${v.verse}`;
      const hl = SR7.bible.highlights[hKey] ? "is-highlighted" : "";
      return `<p class="bible-clean-verse ${hl}" data-tap-hl="${hKey}" title="Tap verse to highlight"><span class="vnum">${v.verse}</span>${v.text}</p>`;
    }).join("")}</div>`;

    container.querySelectorAll("[data-tap-hl]").forEach(p => p.addEventListener("click", () => {
      const k = p.dataset.tapHl;
      SR7.bible.highlights[k] = !SR7.bible.highlights[k];
      p.classList.toggle("is-highlighted", !!SR7.bible.highlights[k]);
      saveState();
    }));
    return;
  }

  // Identical 2-Language Side-by-Side Comparison View
  const versesB = await WholeBibleEngine.fetchChapter(SR7.bible.verB, book.id, SR7.bible.chapter);
  const mapB = {};
  versesB.forEach(v => { mapB[v.verse] = v.text; });

  const optsA = WholeBibleEngine.TRANSLATIONS.map(t => `<option value="${t.key}" ${t.key === SR7.bible.verA ? "selected" : ""}>${t.label}</option>`).join("");
  const optsB = WholeBibleEngine.TRANSLATIONS.map(t => `<option value="${t.key}" ${t.key === SR7.bible.verB ? "selected" : ""}>${t.label}</option>`).join("");

  const rows = versesA.map((vA, idx) => {
    const txtB = mapB[vA.verse] || (versesB[idx] ? versesB[idx].text : "");
    const hKey = `${book.id}:${SR7.bible.chapter}:${vA.verse}`;
    const hl = SR7.bible.highlights[hKey] ? "is-highlighted" : "";
    return `<div class="bible-cmp-row">
      <div class="bible-cmp-cell left-col ${hl}" data-tap-hl="${hKey}"><span class="vnum">${vA.verse}</span>${vA.text}</div>
      <div class="bible-cmp-cell ${hl}" data-tap-hl="${hKey}"><span class="vnum">${vA.verse}</span>${txtB}</div>
    </div>`;
  }).join("");

  container.innerHTML = `
    <div class="bible-compare-grid">
      <div class="bible-cmp-head"><select id="cmpVerA" class="comfort-select" style="width:100%;">${optsA}</select></div>
      <div class="bible-cmp-head"><select id="cmpVerB" class="comfort-select" style="width:100%;">${optsB}</select></div>
      ${rows}
    </div>`;

  document.getElementById("cmpVerA")?.addEventListener("change", (e) => {
    SR7.bible.verA = e.target.value;
    const m = document.getElementById("bibleVersionSelect"); if (m) m.value = SR7.bible.verA;
    renderWholeBible();
  });
  document.getElementById("cmpVerB")?.addEventListener("change", (e) => {
    SR7.bible.verB = e.target.value;
    renderWholeBible();
  });
  container.querySelectorAll("[data-tap-hl]").forEach(cell => cell.addEventListener("click", () => {
    const k = cell.dataset.tapHl;
    SR7.bible.highlights[k] = !SR7.bible.highlights[k];
    saveState();
    renderWholeBible();
  }));
}

/* ==========================================================================
   2. FULL 100-LEVEL BIBLE QUIZ COMPETITION + GUEST 10-Q SIGN-IN GATE + LEADERBOARD
   ========================================================================== */
function loadQuizTier(tier) {
  SR7.quiz = {
    tier,
    pool: tier === "all" ? [...QUIZ_BANK] : QUIZ_BANK.filter(x => x.tier === tier),
    index: 0, score: 0, chosen: null, checked: false
  };
  const badge = document.getElementById("quizTierBadge");
  const labels = { easy: "Levels 1–20 · Easy", medium: "Levels 21–40 · Medium", hard: "Levels 41–100 · Hard", all: "Full 1–100 Gauntlet" };
  if (badge) badge.textContent = labels[tier] || labels.easy;
  renderQuiz();
}

function renderLeaderboard() {
  const list = document.getElementById("leaderboardList");
  if (!list) return;
  const top = [...(SR7.leaderboard || [])].sort((a, b) => b.score - a.score).slice(0, 6);
  list.innerHTML = top.length ? top.map((e, i) => `
    <div style="display:flex;align-items:center;justify-content:space-between;background:var(--bg-elevated);border:1px solid var(--border-soft);border-radius:12px;padding:0.6rem 0.85rem;font-size:0.84rem;margin-bottom:0.45rem;">
      <div style="display:flex;align-items:center;gap:0.55rem;font-weight:700;">
        <span style="color:var(--accent);">#${i + 1}</span><span>${e.name}</span>
      </div>
      <span style="color:var(--accent);font-weight:800;">${e.score} pts (${e.tier})</span>
    </div>`).join("") : `<p style="font-size:0.84rem;color:var(--text-dim);">Sign in and complete a quiz round to claim #1!</p>`;
}

function saveQuizToLeaderboard() {
  if (!SR7.user || !SR7.user.email) return;
  SR7.leaderboard.push({ name: SR7.user.name, score: SR7.quiz.score, tier: SR7.quiz.tier, date: new Date().toLocaleDateString() });
  saveState();
  renderLeaderboard();
}

function renderQuiz() {
  const area = document.getElementById("quizQuestionArea");
  if (!area) return;
  const { pool, index, score, chosen, checked, tier } = SR7.quiz;
  const isGuest = !SR7.user || !SR7.user.email;

  const cEl = document.getElementById("quizCounter"), sEl = document.getElementById("quizScoreLive"), pEl = document.getElementById("quizProgress");
  if (cEl) cEl.textContent = `LEVEL ${String(Math.min(index + 1, pool.length)).padStart(2, "0")} / ${pool.length}`;
  if (sEl) sEl.textContent = `Score: ${score}`;
  if (pEl) pEl.style.width = `${(Math.min(index + 1, pool.length) / Math.max(1, pool.length)) * 100}%`;

  // GUEST 10-LEVEL GATE -> TAKES TO SIGN IN TO UNLOCK LEVELS 11–100 & LEADERBOARD!
  if (isGuest && (index >= 10 || tier !== "easy")) {
    area.innerHTML = `
      <div class="quiz-feedback" style="border-left:3px solid var(--accent);">
        <strong>Great job reaching Level 10!</strong> Guest readers can play Levels 1–10. Sign in to unlock <strong>Levels 11–100</strong>, save your competition score, and join the Reader Leaderboard.
      </div>
      <div style="display:flex;gap:0.6rem;flex-wrap:wrap;">
        <button type="button" class="btn btn-primary btn-small" id="quizUnlockSignInBtn">Sign In to Unlock Levels 11–100 →</button>
        <button type="button" class="btn btn-outline btn-small" id="quizRestartGuestBtn">Replay Levels 1–10</button>
      </div>`;
    document.getElementById("quizUnlockSignInBtn").addEventListener("click", () => document.getElementById("unifiedAuthModal")?.showModal());
    document.getElementById("quizRestartGuestBtn").addEventListener("click", () => loadQuizTier("easy"));
    return;
  }

  if (index >= pool.length) {
    area.innerHTML = `<h3>Completed! Score: ${score} / ${pool.length}</h3><p style="font-size:0.84rem;color:var(--text-muted);margin:0.4rem 0 0.9rem;">Your score has been added to the Leaderboard.</p><button type="button" class="btn btn-primary btn-small" id="quizPlayAgainBtn">Play Again ↻</button>`;
    document.getElementById("quizPlayAgainBtn").addEventListener("click", () => loadQuizTier(tier));
    return;
  }

  const item = pool[index];
  area.innerHTML = `
    <h3 style="font-size:1rem;margin-bottom:0.75rem;">#${item.num}. ${item.q}</h3>
    <div class="quiz-options">${item.opts.map((o, i) => {
      let cls = "quiz-option";
      if (checked && i === item.ans) cls += " is-correct";
      if (checked && i === chosen && i !== item.ans) cls += " is-wrong";
      return `<label class="${cls}"><input type="radio" name="qopt" value="${i}" ${chosen === i ? "checked" : ""} ${checked ? "disabled" : ""} /><span>${o}</span></label>`;
    }).join("")}</div>
    ${checked ? `<div class="quiz-feedback">${item.exp}</div>` : ""}
    <div style="display:flex;gap:0.55rem;flex-wrap:wrap;">
      <button type="button" class="btn btn-primary btn-small" id="qActBtn" ${!checked && chosen === null ? "disabled" : ""}>${checked ? "Next Level →" : "Check Answer"}</button>
      <button type="button" class="btn btn-outline btn-small" id="qQuitBtn">Quit &amp; Save</button>
    </div>`;

  area.querySelectorAll('input[name="qopt"]').forEach(inp => inp.addEventListener("change", () => {
    SR7.quiz.chosen = Number(inp.value);
    document.getElementById("qActBtn").disabled = false;
  }));
  document.getElementById("qActBtn").addEventListener("click", () => {
    if (!SR7.quiz.checked) { if (SR7.quiz.chosen === item.ans) SR7.quiz.score++; SR7.quiz.checked = true; renderQuiz(); }
    else { SR7.quiz.index++; SR7.quiz.chosen = null; SR7.quiz.checked = false; if (SR7.quiz.index >= pool.length) saveQuizToLeaderboard(); renderQuiz(); }
  });
  document.getElementById("qQuitBtn").addEventListener("click", () => {
    saveQuizToLeaderboard();
    showToast(`Quiz saved! Score: ${SR7.quiz.score}`);
    loadQuizTier(tier);
  });
}

/* ==========================================================================
   3. WALLPAPERS, 4 ISOLATED BOOK SECTIONS, TRACKER & PRIVATE OWNER STUDIO
   ========================================================================== */
function renderWallpapers() {
  const grid = document.getElementById("wallpaperGrid");
  if (!grid) return;
  const list = SR7.wpFilter === "All" ? SR7.wallpapers : SR7.wallpapers.filter(w => w.mood === SR7.wpFilter);
  const cEl = document.getElementById("wallpaperCountLabel");
  if (cEl) cEl.textContent = `${list.length} HD Wallpapers`;

  grid.innerHTML = list.map(wp => {
    const bg = wp.customBgData ? { src: wp.customBgData, light: false } : WallpaperStudio.getBackdrop(wp.bg);
    return `
      <div class="wp-card card-3d-tilt ${bg.light ? "is-light" : ""}">
        <img src="${bg.src}" alt="${wp.ref}" class="wp-bg-img" loading="lazy" />
        <div class="wp-scrim"></div>
        <div class="wp-content">
          <span class="wp-mood-pill">${wp.mood}</span>
          <p class="wp-verse-preview">“${wp.verse}”</p>
          <span class="wp-ref-tag">${wp.ref}</span>
        </div>
        <div class="wp-hover-actions">
          <button type="button" class="btn btn-primary btn-small" data-dl-wp="${wp.id}" data-dev="iphone">iPhone</button>
          <button type="button" class="btn btn-outline btn-small" style="background:rgba(7,11,20,0.75);color:#fff;" data-dl-wp="${wp.id}" data-dev="android">Android</button>
          <button type="button" class="btn btn-outline btn-small" style="background:rgba(7,11,20,0.75);color:#fff;" data-dl-wp="${wp.id}" data-dev="desktop">PC</button>
        </div>
      </div>`;
  }).join("");

  grid.querySelectorAll("[data-dl-wp]").forEach(btn => btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const wp = SR7.wallpapers.find(x => x.id === btn.dataset.dlWp);
    if (wp) WallpaperStudio.downloadWallpaper(wp, btn.dataset.dev || "iphone");
  }));
}

function renderLibrary() {
  const chips = document.getElementById("sectionFilterChips");
  if (chips) {
    const total = getAllBooksFlat().length;
    chips.innerHTML = [
      `<button type="button" class="filter-chip ${SR7.activeSectionFilter === "all" ? "is-active" : ""}" data-filter="all">All Works <span class="chip-count">${total}</span></button>`,
      ...SECTION_REGISTRY.map(s => `<button type="button" class="filter-chip ${SR7.activeSectionFilter === s.id ? "is-active" : ""}" data-filter="${s.id}">
        <span style="width:7px;height:7px;border-radius:50%;background:${s.accent};"></span>${s.label} <span class="chip-count">${(SR7.sections[s.id] || []).length}</span>
      </button>`)
    ].join("");
    chips.querySelectorAll(".filter-chip").forEach(c => c.addEventListener("click", () => { SR7.activeSectionFilter = c.dataset.filter; renderLibrary(); }));
  }

  const grid = document.getElementById("contentGrid");
  if (!grid) return;
  const pool = SR7.activeSectionFilter === "all" ? getAllBooksFlat() : [...(SR7.sections[SR7.activeSectionFilter] || [])];
  const q = (SR7.searchTerm || "").trim().toLowerCase();
  const items = pool.filter(b => !q || `${b.title} ${b.description} ${b.author || ""}`.toLowerCase().includes(q));

  grid.innerHTML = items.length ? items.map(b => {
    const meta = getSectionMeta(b.sectionId);
    return `
      <article class="resource-card card-3d-tilt" style="--card-accent:${meta.accent};">
        <div class="card-cover-wrap" data-open-book="${b.id}">
          <img src="${b.cover || meta.defaultCover}" alt="${b.title}" loading="lazy" />
          <span class="card-cover-tag">${meta.label}</span>
          <span class="card-format-tag">${b.format || "Edition"}</span>
        </div>
        <div class="card-body"><h3>${b.title}</h3><p>${b.description}</p></div>
        <div class="card-footer-row">
          <span style="font-size:0.74rem;color:var(--text-dim);">By ${b.author || "Nikhil Darjee"}</span>
          <button type="button" class="btn btn-primary btn-small" data-open-book="${b.id}">Read ↗</button>
        </div>
      </article>`;
  }).join("") : `<div class="panel-card" style="grid-column:1/-1;text-align:center;color:var(--text-muted);">No works in this section yet.</div>`;

  grid.querySelectorAll("[data-open-book]").forEach(el => el.addEventListener("click", () => openBookReader(el.dataset.openBook)));
}

function renderReaderChapter() {
  const b = SR7.currentBook, stage = document.getElementById("readerTextStage");
  if (!b || !b.chapters || !b.chapters.length) { if (stage) stage.classList.add("hidden"); return; }
  stage.classList.remove("hidden");
  const ch = b.chapters[SR7.currentChapterIdx] || b.chapters[0];
  document.getElementById("readerPageIndicator").textContent = `Chapter ${SR7.currentChapterIdx + 1} of ${b.chapters.length}`;
  document.getElementById("readerProse").innerHTML = `<h3>${ch.heading}</h3>${(ch.paragraphs || []).map(p => `<p>${p}</p>`).join("")}`;
  document.getElementById("prevPageBtn").disabled = SR7.currentChapterIdx === 0;
  document.getElementById("nextPageBtn").disabled = SR7.currentChapterIdx >= b.chapters.length - 1;
}

async function openBookReader(bookId) {
  const b = findBookById(bookId); if (!b) return;
  SR7.currentBook = b; SR7.currentChapterIdx = 0;
  trackSpiritualEvent("booksRead", 1);
  const meta = getSectionMeta(b.sectionId);
  document.getElementById("readerTitle").textContent = b.title;
  document.getElementById("readerMeta").textContent = `${meta.label} · ${b.format || "Edition"} · By ${b.author || "Nikhil Darjee"}`;
  const sumEl = document.getElementById("readerSummaryStage");
  sumEl.innerHTML = b.description ? `<div class="reader-summary-card"><strong>Overview</strong><p>${b.description}</p></div>` : "";
  sumEl.classList.toggle("hidden", !b.description);
  const linkEl = document.getElementById("readerLinkStage");
  if (b.externalUrl) {
    linkEl.classList.remove("hidden");
    linkEl.innerHTML = `<div class="reader-link-banner"><span>${b.externalUrl}</span><a href="${b.externalUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-small">Open Link ↗</a></div>`;
  } else linkEl.classList.add("hidden");
  const docEl = document.getElementById("readerDocumentStage"); docEl.innerHTML = "";
  if (b.docType === "pdf_upload" && b.pdfBlobKey) {
    const blob = await MediaVaultDB.get(b.pdfBlobKey);
    if (blob?.dataUrl) { docEl.classList.remove("hidden"); docEl.innerHTML = `<iframe class="reader-doc-frame" src="${blob.dataUrl}" title="${b.title}"></iframe>`; }
    else docEl.classList.add("hidden");
  } else if (b.docType && b.docType !== "none" && b.docUrl) {
    const emb = buildEmbedInfo(b.docType, b.docUrl);
    docEl.classList.remove("hidden");
    docEl.innerHTML = `<div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;"><span class="studio-fmt-pill">${emb.badge}</span><a href="${emb.openUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-small">Fullscreen ↗</a></div><iframe class="reader-doc-frame" src="${emb.embedUrl}" title="${b.title}"></iframe>`;
  } else docEl.classList.add("hidden");
  renderReaderChapter();
  document.getElementById("readerModal").showModal();
}

function renderTracker() {
  const tr = SR7.tracker;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = String(v); };
  set("statBibleOpens", tr.bibleOpens); set("statVersesRead", tr.versesRead);
  set("statBooksRead", tr.booksRead); set("statVersesWritten", tr.versesWritten);
  set("statStreak", `${tr.streakDays}d`);
  const logEl = document.getElementById("writtenVersesList");
  if (logEl) {
    logEl.innerHTML = (tr.writtenLog || []).length ? tr.writtenLog.slice(0, 4).map(item => `
      <div class="written-verse-card">
        <div style="display:flex;justify-content:space-between;font-size:0.72rem;color:var(--accent);font-weight:700;"><span>${item.ref}</span><span>${item.date}</span></div>
        <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:1.05rem;font-style:italic;margin-top:3px;">“${item.text}”</p>
      </div>`).join("") : `<p style="font-size:0.82rem;color:var(--text-dim);">Write a Bible verse above to log your Scripture journal.</p>`;
  }
}

function renderPrivateOwnerStudio() {
  const seats = document.getElementById("studioSectionSeats");
  if (seats) {
    seats.innerHTML = SECTION_REGISTRY.map(s => `<button type="button" class="section-seat-btn ${SR7.studioSeat === s.id ? "is-active" : ""}" data-seat="${s.id}" style="--seat-accent:${s.accent};">
      <span class="seat-dot" style="background:${s.accent};"></span>${s.label} <span class="seat-count">${(SR7.sections[s.id] || []).length}</span>
    </button>`).join("");
    seats.querySelectorAll("[data-seat]").forEach(b => b.addEventListener("click", () => { SR7.studioSeat = b.dataset.seat; renderPrivateOwnerStudio(); }));
  }
  const meta = getSectionMeta(SR7.studioSeat);
  const badge = document.getElementById("composerTargetBadge"); if (badge) badge.textContent = `Isolated Seat: ${meta.label} (${meta.sheetTab})`;
  const subBtn = document.getElementById("pubSubmitBtn"); if (subBtn) subBtn.textContent = `Publish to ${meta.label} ↗`;
  const chList = document.getElementById("pubChaptersList");
  if (chList) {
    chList.innerHTML = SR7.studioChapters.length ? SR7.studioChapters.map((c, i) => `
      <div class="chapter-editor-item">
        <div style="display:flex;justify-content:space-between;font-size:0.78rem;color:var(--accent);"><strong>Chapter ${i + 1}</strong><button type="button" class="comfort-btn" data-rm-ch="${i}">Remove</button></div>
        <input type="text" class="owner-input ch-h" data-i="${i}" value="${c.heading || ""}" placeholder="Chapter heading" />
        <textarea class="owner-input ch-b" data-i="${i}" rows="2" placeholder="Chapter text...">${(c.paragraphs || []).join("\n\n")}</textarea>
      </div>`).join("") : `<div class="empty-chapters-hint">Chapters are optional — publish with Cover &amp; Link, PDF/Google Docs/Sheets, or add chapters anytime.</div>`;
    chList.querySelectorAll("[data-rm-ch]").forEach(b => b.addEventListener("click", () => { SR7.studioChapters.splice(Number(b.dataset.rmCh), 1); renderPrivateOwnerStudio(); }));
    chList.querySelectorAll(".ch-h").forEach(inp => inp.addEventListener("input", () => { SR7.studioChapters[Number(inp.dataset.i)].heading = inp.value; }));
    chList.querySelectorAll(".ch-b").forEach(ta => ta.addEventListener("input", () => { SR7.studioChapters[Number(ta.dataset.i)].paragraphs = ta.value.split(/\n\s*\n/).filter(Boolean); }));
  }
  const itemsList = document.getElementById("studioSectionItemsList");
  if (itemsList) {
    const items = SR7.sections[SR7.studioSeat] || [];
    itemsList.innerHTML = items.map(b => `
      <div class="studio-item-row">
        <img src="${b.cover || meta.defaultCover}" alt="${b.title}" class="studio-item-thumb" />
        <div style="flex:1;min-width:160px;"><strong>${b.title}</strong><p style="font-size:0.76rem;color:var(--text-muted);">${b.description}</p></div>
        <button type="button" class="comfort-btn" data-del-work="${b.id}">Delete</button>
      </div>`).join("") || `<p style="color:var(--text-dim);font-size:0.84rem;">No works in ${meta.label} yet.</p>`;
    itemsList.querySelectorAll("[data-del-work]").forEach(btn => btn.addEventListener("click", () => {
      SR7.sections[SR7.studioSeat] = SR7.sections[SR7.studioSeat].filter(x => x.id !== btn.dataset.delWork);
      saveState(); renderPrivateOwnerStudio(); renderLibrary(); showToast("Removed from " + meta.label);
    }));
  }
}

/* ==========================================================================
   INITIALIZATION (SHARED BY WEBSITE v7 & MOBILE APP v7)
   ========================================================================== */
function initSecretsRevealedV7() {
  loadState();
  Sanctuary3DFX.init();

  // Themes
  document.querySelectorAll("[data-theme-select]").forEach(sel => {
    const saved = safeGet("sr_v7_theme") || "obsidian";
    document.body.setAttribute("data-theme", saved); sel.value = saved;
    sel.addEventListener("change", () => {
      document.body.setAttribute("data-theme", sel.value); safeSet("sr_v7_theme", sel.value);
      document.querySelectorAll("[data-theme-select]").forEach(o => { o.value = sel.value; });
    });
  });

  // Worship Soundscapes
  document.querySelectorAll("[data-music-select]").forEach(sel => {
    sel.innerHTML = WORSHIP_TRACKS.map(t => `<option value="${t.id}">${t.name}</option>`).join("");
    sel.addEventListener("change", (e) => WorshipAudioEngine.setTrack(e.target.value));
  });
  document.querySelectorAll("[data-music-toggle]").forEach(b => b.addEventListener("click", () => WorshipAudioEngine.toggle()));
  document.querySelectorAll("[data-music-vol]").forEach(s => s.addEventListener("input", (e) => WorshipAudioEngine.setVolume(e.target.value)));

  // Unified Sign-In -> Routes Owner Directly to Private Owner Studio; Unlocks Quiz Levels 11–100 for Readers!
  const authModal = document.getElementById("unifiedAuthModal");
  const ownerOverlay = document.getElementById("privateOwnerOverlay");
  document.querySelectorAll("[data-open-signin]").forEach(b => b.addEventListener("click", () => authModal?.showModal()));
  document.getElementById("closeAuthModalBtn")?.addEventListener("click", () => authModal?.close());
  document.getElementById("closeOwnerOverlayBtn")?.addEventListener("click", () => ownerOverlay?.classList.add("hidden"));

  document.getElementById("unifiedAuthForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("authNameInput").value.trim();
    const email = document.getElementById("authEmailInput").value.trim().toLowerCase();
    const pass = document.getElementById("authPassInput").value;
    const status = document.getElementById("authStatusText");

    const emailHash = await sha256(email);
    if (emailHash === CONFIG.ownerEmailHash && pass === CONFIG.vaultKeyPass) {
      authModal.close(); e.currentTarget.reset(); if (status) status.textContent = "";
      if (ownerOverlay) { ownerOverlay.classList.remove("hidden"); renderPrivateOwnerStudio(); }
      showToast("Owner verified. Private Studio unlocked.");
      return;
    }
    if (!email || !email.includes("@")) { if (status) status.textContent = "Please enter a valid email address."; return; }
    SR7.user = { name: name || email.split("@")[0], email };
    document.querySelectorAll("[data-account-label]").forEach(el => { el.textContent = SR7.user.name; });
    authModal.close();
    renderQuiz(); // Immediately unlocks Levels 11–100!
    showToast(`Signed in as ${SR7.user.name} — Levels 11–100 unlocked!`);
  });

  // In-Page Full-Screen Bible & Wallpapers Overlays (Website)
  const bibleOverlay = document.querySelector("[data-bible-overlay]");
  document.querySelectorAll("[data-open-bible]").forEach(b => b.addEventListener("click", () => {
    if (bibleOverlay) { bibleOverlay.classList.remove("hidden"); trackSpiritualEvent("bibleOpens", 1); renderWholeBible(); }
  }));
  document.querySelector("[data-close-bible]")?.addEventListener("click", () => bibleOverlay?.classList.add("hidden"));

  const wpOverlay = document.querySelector("[data-wallpapers-overlay]");
  document.querySelectorAll("[data-open-wallpapers]").forEach(b => b.addEventListener("click", () => {
    if (wpOverlay) { wpOverlay.classList.remove("hidden"); renderWallpapers(); }
  }));
  document.querySelector("[data-close-wallpapers]")?.addEventListener("click", () => wpOverlay?.classList.add("hidden"));

  // Whole 66-Book Bible Selectors & Prev/Next Chapter
  const bookSel = document.getElementById("bibleBookSelect");
  const chSel = document.getElementById("bibleChapterSelect");
  const verSel = document.getElementById("bibleVersionSelect");
  if (bookSel) {
    const ot = WholeBibleEngine.BOOKS.filter(b => b.test === "OT").map(b => `<option value="${b.id}">${b.name} (${b.chapters} ch)</option>`).join("");
    const nt = WholeBibleEngine.BOOKS.filter(b => b.test === "NT").map(b => `<option value="${b.id}">${b.name} (${b.chapters} ch)</option>`).join("");
    bookSel.innerHTML = `<optgroup label="Old Testament (39 Books)">${ot}</optgroup><optgroup label="New Testament (27 Books)">${nt}</optgroup>`;
    bookSel.value = String(SR7.bible.bookId);
    bookSel.addEventListener("change", () => {
      SR7.bible.bookId = Number(bookSel.value); SR7.bible.chapter = 1;
      populateChapterDropdown(); trackSpiritualEvent("bibleOpens", 1); renderWholeBible();
    });
  }
  populateChapterDropdown();
  chSel?.addEventListener("change", () => { SR7.bible.chapter = Number(chSel.value); renderWholeBible(); });
  if (verSel) {
    verSel.innerHTML = WholeBibleEngine.TRANSLATIONS.map(t => `<option value="${t.key}">${t.label}</option>`).join("");
    verSel.value = SR7.bible.verA;
    verSel.addEventListener("change", () => { SR7.bible.verA = verSel.value; renderWholeBible(); });
  }
  document.getElementById("bibleCompareToggleBtn")?.addEventListener("click", () => { SR7.bible.compare = !SR7.bible.compare; renderWholeBible(); });
  document.getElementById("biblePrevChBtn")?.addEventListener("click", () => {
    if (SR7.bible.chapter > 1) { SR7.bible.chapter--; populateChapterDropdown(); renderWholeBible(); }
  });
  document.getElementById("bibleNextChBtn")?.addEventListener("click", () => {
    const b = WholeBibleEngine.BOOKS.find(x => x.id === SR7.bible.bookId);
    if (b && SR7.bible.chapter < b.chapters) { SR7.bible.chapter++; populateChapterDropdown(); renderWholeBible(); }
  });
  document.getElementById("markChapterReadBtn")?.addEventListener("click", () => {
    const b = WholeBibleEngine.BOOKS.find(x => x.id === SR7.bible.bookId);
    trackSpiritualEvent("versesRead", 15);
    showToast(`Marked ${b?.name} ${SR7.bible.chapter} as Read (+15 verses)`);
  });

  // Quiz Tier Buttons
  document.querySelectorAll("[data-tier]").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll("[data-tier]").forEach(x => x.classList.remove("is-active"));
    b.classList.add("is-active");
    loadQuizTier(b.dataset.tier);
  }));

  // Feedback Form
  document.getElementById("feedbackForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();
    if (name.length < 2 || !email.includes("@") || message.length < 4) return;
    SR7.feedback.unshift({ name, email, message, date: new Date().toLocaleDateString() });
    saveState(); e.currentTarget.reset();
    const st = document.getElementById("feedbackStatus");
    if (st) st.textContent = `Thank you, ${name}! Your feedback has been recorded.`;
    showToast("Feedback submitted!");
  });

  // Wallpapers Filter, Search, Reader, Tracker, Stillness & Owner Studio
  document.querySelectorAll("[data-wp-mood]").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll("[data-wp-mood]").forEach(x => x.classList.remove("is-active"));
    b.classList.add("is-active"); SR7.wpFilter = b.dataset.wpMood; renderWallpapers();
  }));
  document.getElementById("searchInput")?.addEventListener("input", (e) => { SR7.searchTerm = e.target.value; renderLibrary(); });
  document.getElementById("closeReaderBtn")?.addEventListener("click", () => document.getElementById("readerModal").close());
  document.getElementById("prevPageBtn")?.addEventListener("click", () => { if (SR7.currentChapterIdx > 0) { SR7.currentChapterIdx--; renderReaderChapter(); } });
  document.getElementById("nextPageBtn")?.addEventListener("click", () => { if (SR7.currentBook && SR7.currentChapterIdx < (SR7.currentBook.chapters || []).length - 1) { SR7.currentChapterIdx++; renderReaderChapter(); } });
  document.getElementById("writeVerseForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const ref = document.getElementById("writeVerseRef").value.trim() || "Reflection";
    const text = document.getElementById("writeVerseText").value.trim(); if (text.length < 4) return;
    SR7.tracker.writtenLog.unshift({ ref, text, date: new Date().toLocaleDateString() });
    trackSpiritualEvent("versesWritten", 1); e.currentTarget.reset(); showToast("Verse saved!");
  });

  let praySec = 180, prayIv = null, isPray = false;
  const pClock = document.getElementById("prayerClock"), pBtn = document.getElementById("prayerStartBtn"), halo = document.getElementById("prayerBreathingHalo");
  const drawClk = () => { if (pClock) pClock.textContent = `${String(Math.floor(praySec / 60)).padStart(2, "0")}:${String(praySec % 60).padStart(2, "0")}`; };
  document.querySelectorAll("[data-pray-min]").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll("[data-pray-min]").forEach(x => x.classList.remove("is-active"));
    b.classList.add("is-active"); praySec = Number(b.dataset.prayMin) * 60; drawClk();
  }));
  pBtn?.addEventListener("click", () => {
    if (isPray) { isPray = false; clearInterval(prayIv); halo?.classList.remove("is-breathing"); if ("speechSynthesis" in window) window.speechSynthesis.cancel(); pBtn.textContent = "Start Stillness"; return; }
    isPray = true; pBtn.textContent = "Pause Stillness"; halo?.classList.add("is-breathing");
    const mode = document.getElementById("prayerModeSelect")?.value || "silent_halo";
    if (mode === "silent_halo") { WorshipAudioEngine.setTrack(4); WorshipAudioEngine.start(); }
    else if ("speechSynthesis" in window) {
      WorshipAudioEngine.stop();
      const u = new SpeechSynthesisUtterance("Be still, and know that I am God. The Lord is my shepherd, I lack nothing.");
      const v = pickBestNeuralVoice(mode); if (v) u.voice = v; u.rate = 0.85; window.speechSynthesis.speak(u);
    }
    prayIv = setInterval(() => {
      if (praySec > 0) { praySec--; drawClk(); }
      else { isPray = false; clearInterval(prayIv); halo?.classList.remove("is-breathing"); pBtn.textContent = "Amen"; }
    }, 1000);
  });

  // Owner Studio Handlers
  document.getElementById("pubAddChapterBtn")?.addEventListener("click", () => { SR7.studioChapters.push({ heading: `Chapter ${SR7.studioChapters.length + 1}`, paragraphs: [""] }); renderPrivateOwnerStudio(); });
  document.getElementById("pubDocType")?.addEventListener("change", (e) => {
    document.getElementById("pubPdfUploadRow")?.classList.toggle("hidden", e.target.value !== "pdf_upload");
    document.getElementById("pubDocUrlRow")?.classList.toggle("hidden", e.target.value === "none" || e.target.value === "pdf_upload");
  });
  document.getElementById("pubPdfFile")?.addEventListener("change", (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader(); r.onload = async () => {
      const key = "pdf-" + Date.now(); await MediaVaultDB.put(key, { dataUrl: r.result, name: f.name });
      SR7.studioPdfKey = key; SR7.studioPdfName = f.name;
      const st = document.getElementById("pubPdfStatus"); if (st) st.textContent = `Attached: ${f.name}`;
    }; r.readAsDataURL(f);
  });
  document.getElementById("pubCoverFile")?.addEventListener("change", (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => { SR7.studioCoverData = r.result; showToast("Cover selected"); }; r.readAsDataURL(f);
  });
  document.getElementById("ownerPublisherForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("pubTitle").value.trim(); if (!title) return;
    const meta = getSectionMeta(SR7.studioSeat);
    const docType = document.getElementById("pubDocType")?.value || "none";
    SR7.sections[SR7.studioSeat].unshift({
      id: "work-" + Date.now(), sectionId: SR7.studioSeat, title,
      author: document.getElementById("pubAuthor")?.value.trim() || "Nikhil Darjee",
      description: document.getElementById("pubDesc")?.value.trim() || `${meta.label} edition.`,
      cover: SR7.studioCoverData || meta.defaultCover,
      externalUrl: document.getElementById("pubExternalUrl")?.value.trim() || "",
      docType, docUrl: document.getElementById("pubDocUrl")?.value.trim() || "",
      pdfBlobKey: docType === "pdf_upload" ? SR7.studioPdfKey : "",
      chapters: SR7.studioChapters.filter(c => c.paragraphs && c.paragraphs.length),
      format: docType !== "none" ? docType.replace("_", " ").toUpperCase() : (SR7.studioChapters.length ? `${SR7.studioChapters.length} Chapters` : "Cover & Link")
    });
    SR7.studioChapters = []; SR7.studioCoverData = ""; SR7.studioPdfKey = "";
    saveState(); e.currentTarget.reset(); renderPrivateOwnerStudio(); renderLibrary();
    showToast(`Published to ${meta.label}`);
  });
  let customWpImg = "";
  document.getElementById("ownerWpImageInput")?.addEventListener("change", (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => { customWpImg = r.result; showToast("Wallpaper art selected"); }; r.readAsDataURL(f);
  });
  document.getElementById("ownerWallpaperForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const verse = document.getElementById("ownerWpVerse").value.trim();
    const ref = document.getElementById("ownerWpRef").value.trim(); if (!verse || !ref) return;
    SR7.wallpapers.unshift({ id: "wp-owner-" + Date.now(), mood: document.getElementById("ownerWpMood").value, bg: document.getElementById("ownerWpBg").value, ref, verse, customBgData: customWpImg || "" });
    customWpImg = ""; saveState(); e.currentTarget.reset(); renderWallpapers();
    showToast("New Bible Verse Wallpaper published!");
  });

  renderWholeBible();
  renderLibrary();
  renderTracker();
  renderWallpapers();
  renderLeaderboard();
  loadQuizTier("easy");
}
