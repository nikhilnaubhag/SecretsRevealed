/* SecretsRevealed front-end. Content and feedback are connected through a Google Apps Script web app. */
const CONFIG = {
  // After deploying google-apps-script/Code.gs, paste its Web App URL below.
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbx8I9CTN_cgxUEFKbGyMwLWMvFHI4fbJmlopL-5SXIC7Hr0F9EI496Ytal-4FKfPZfY/exec",
  ownerEmail: "nikhilnaubhag777@gmail.com"
};

const demoContent = [
  {id:"demo-revelation",title:"Revelation: A Guided Study",category:"Revelation",description:"A placeholder for your chapter-by-chapter notes on imagery, worship, endurance and the hope at the heart of Revelation.",url:"",format:"Study guide",featured:true,cover:"✦",updatedAt:"Add your first resource",demo:true},
  {id:"demo-journal-01",title:"A Journal Through the Psalms",category:"Bible Journal",description:"A reflective journal template for reading slowly, noticing the text, writing a prayer and carrying one truth into the day.",url:"",format:"Journal",featured:false,cover:"❧",updatedAt:"Add your first resource",demo:true},
  {id:"demo-ebook-01",title:"Faith in a Changing World",category:"E-book",description:"A sample listing for a book about living with faith, compassion and wisdom in a world that never seems to stand still.",url:"",format:"E-book",featured:false,cover:"✝",updatedAt:"Add your first resource",demo:true},
  {id:"demo-journal-02",title:"The Quiet Time Notebook",category:"Bible Journal",description:"A place to collect Scripture observations, honest questions, gratitude and simple next steps after Bible reading.",url:"",format:"Journal",featured:false,cover:"✧",updatedAt:"Add your first resource",demo:true},
  {id:"demo-news-01",title:"Faith, News & Discernment",category:"News & Articles",description:"A placeholder for sourced commentary that connects current conversations with careful thought, humility and Christian conviction.",url:"",format:"Article",featured:false,cover:"◉",updatedAt:"Add your first resource",demo:true},
  {id:"demo-study-01",title:"The Gospel Reading Notes",category:"Study Notes",description:"A sample study entry for observations, cross-references, historical context and personal reflection while reading the Gospels.",url:"",format:"Study notes",featured:false,cover:"⌘",updatedAt:"Add your first resource",demo:true}
];

const quizQuestions = [
  {question:"Who received the visions recorded in the Book of Revelation?",options:["Peter","John","Paul","Moses"],correct:1,explanation:"Revelation opens by identifying John as the servant who received and bore witness to the vision (Revelation 1:1–2)."},
  {question:"According to John 8:12, Jesus describes himself as the…",options:["Bread of Life","Good Shepherd","Light of the World","True Vine"],correct:2,explanation:"Jesus says, “I am the light of the world” in John 8:12. Read the surrounding passage to explore what this means."},
  {question:"Which book begins with the words, “In the beginning God created…”?",options:["Exodus","Psalms","Genesis","Isaiah"],correct:2,explanation:"Genesis 1:1 introduces the biblical account of creation: “In the beginning God created the heavens and the earth.”"},
  {question:"What is named as a fruit of the Spirit in Galatians 5?",options:["Patience","Fame","Wealth","Influence"],correct:0,explanation:"Patience (often translated longsuffering) is among the fruit of the Spirit listed in Galatians 5:22–23."},
  {question:"In Revelation 1:8, which title does the Lord use for himself?",options:["The Great Teacher","Alpha and Omega","Son of Thunder","Prince of Egypt"],correct:1,explanation:"Revelation 1:8 uses “Alpha and Omega,” a title expressing God as the beginning and the end."}
];

let allContent = [...demoContent];
let isPreviewMode = true;
let activeFilter = "all";
let searchTerm = "";
let toastTimer = null;
let quizState = {index:0,score:0,chosen:null,checked:false};

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
let currentLanguage = "en";
const originalTextNodes = new WeakMap();
const originalAttributes = new WeakMap();
function phraseTranslation(source, language=currentLanguage) {
  const sourceText = String(source ?? "").trim();
  if (language === "en" || !sourceText) return sourceText;
  const pack = window.SR_TRANSLATIONS && window.SR_TRANSLATIONS[language];
  return pack && pack[sourceText] ? pack[sourceText] : sourceText;
}
function translateTextNode(node, language=currentLanguage) {
  if (!node || !node.parentElement) return;
  const parent = node.parentElement;
  if (parent.closest("[data-i18n],script,style,noscript,textarea,svg,canvas")) return;
  if (!originalTextNodes.has(node)) originalTextNodes.set(node, node.nodeValue || "");
  const source = originalTextNodes.get(node);
  const trimmed = source.trim();
  if (!trimmed) { node.nodeValue = source; return; }
  const localized = phraseTranslation(trimmed, language);
  const leading = source.match(/^\s*/)?.[0] || "";
  const trailing = source.match(/\s*$/)?.[0] || "";
  node.nodeValue = language === "en" ? source : `${leading}${localized}${trailing}`;
}
function translateAttributes(root=document.body, language=currentLanguage) {
  if (!root) return;
  const attrs = ["placeholder", "aria-label", "aria-description", "title", "alt"];
  const elements = [];
  if (root.nodeType === 1) elements.push(root);
  if (root.querySelectorAll) elements.push(...root.querySelectorAll("*"));
  elements.forEach(element => {
    if (!originalAttributes.has(element)) originalAttributes.set(element, {});
    const base = originalAttributes.get(element);
    attrs.forEach(attr => {
      if (!element.hasAttribute(attr)) return;
      if (!(attr in base)) base[attr] = element.getAttribute(attr) || "";
      const source = base[attr];
      element.setAttribute(attr, language === "en" ? source : phraseTranslation(source, language));
    });
  });
}
function translateSubtree(root=document.body, language=currentLanguage) {
  if (!root) return;
  if (root.nodeType === Node.TEXT_NODE) { translateTextNode(root, language); return; }
  const elements = [];
  if (root.nodeType === 1) elements.push(root);
  if (root.querySelectorAll) elements.push(...root.querySelectorAll("*"));
  elements.forEach(element => {
    if (element.matches && element.matches("[data-i18n]")) return;
    if (element.closest && element.closest("[data-i18n]")) return;
    for (const node of Array.from(element.childNodes || [])) {
      if (node.nodeType === Node.TEXT_NODE) translateTextNode(node, language);
    }
  });
  translateAttributes(root, language);
}
function initDynamicTranslation() {
  if (!document.body || !window.MutationObserver) return;
  const observer = new MutationObserver(records => {
    for (const record of records) {
      record.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) translateSubtree(node, currentLanguage);
      });
    }
  });
  observer.observe(document.body, {childList:true, subtree:true});
}

const safeText = (value="") => String(value ?? "");
const escapeHTML = (value="") => safeText(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const normalize = value => safeText(value).toLowerCase().trim();
function readPreference(key) { try { return safeText(window.localStorage.getItem(key)); } catch { return ""; } }
function savePreference(key,value) { try { window.localStorage.setItem(key,value); } catch { /* Preference storage is optional; the controls still work for this visit. */ } }
const isPublished = item => !item.status || ["published","yes","true","1"].includes(normalize(item.status));
const boolValue = value => [true,1,"1","true","yes","y","featured"].includes(typeof value === "string" ? normalize(value) : value);

function categoryType(category="") {
  const value = normalize(category);
  if (value.includes("revelation")) return "revelation";
  if (value.includes("journal") || value.includes("devotional")) return "journal";
  if (value.includes("news") || value.includes("article") || value.includes("newspaper")) return "news";
  if (value.includes("e-book") || value.includes("ebook") || value.includes("book")) return "ebook";
  if (value.includes("study") || value.includes("notes") || value.includes("bible")) return "study";
  return "other";
}
function localizedItemField(item, field, fallback="") {
  const suffix = currentLanguage === "hi" ? "Hi" : currentLanguage === "ne" ? "Ne" : currentLanguage === "bn" ? "Bn" : "";
  const localized = suffix ? safeText(item[`${field}${suffix}`] || "").trim() : "";
  const source = safeText(item[field] || fallback);
  return localized || phraseTranslation(source, currentLanguage) || source;
}
function categoryLabel(item) { return safeText(item.category || item.format || "Reading"); }
function iconFor(item) {
  if (item.cover && !/^https?:\/\//i.test(item.cover)) return safeText(item.cover).slice(0, 8);
  const type = categoryType(item.category);
  return ({revelation:"✦",journal:"❧",news:"◉",ebook:"✝",study:"⌘",other:"✧"})[type] || "✧";
}
function toneFor(item, index=0) {
  const type = categoryType(item.category);
  return ({revelation:266,journal:154,news:202,ebook:36,study:226,other:280})[type] + (index % 3) * 8;
}
function safeURL(value) {
  try { const url = new URL(value, window.location.href); return ["https:","http:"].includes(url.protocol) ? url.href : ""; }
  catch { return ""; }
}
function getDocumentURL(item) { return safeURL(item.url || item.documentUrl || item.documentURL || item.link || ""); }
function getPublishedContent() { return allContent.filter(isPublished); }

async function loadContent() {
  if (!CONFIG.appsScriptUrl.trim()) {
    isPreviewMode = true;
    updateCatalogStatus();
    renderAllContent();
    return;
  }
  try {
    const endpoint = new URL(CONFIG.appsScriptUrl);
    endpoint.searchParams.set("action", "content");
    endpoint.searchParams.set("_", String(Date.now()));
    const response = await fetch(endpoint.toString(), {method:"GET",cache:"no-store",redirect:"follow"});
    if (!response.ok) throw new Error("Content service did not respond");
    const payload = await response.json();
    if (payload.ok === false) throw new Error(payload.error || "The content service reported an error");
    const rows = payload.items || payload.content || payload.data || [];
    if (!Array.isArray(rows)) throw new Error("Unexpected content format");
    allContent = rows.map((row,index) => ({
      id:safeText(row.id || `resource-${index}`),title:safeText(row.title || "Untitled resource"),category:safeText(row.category || row.format || "Reading"),
      description:safeText(row.description || "Open this resource to read more."),url:safeText(row.url || row.documentUrl || row.documentURL || row.link || ""),
      format:safeText(row.format || row.category || "Reading"),featured:boolValue(row.featured),cover:safeText(row.cover || ""),updatedAt:safeText(row.updatedAt || row.updated || ""),status:safeText(row.status || "Published"),demo:false,
      titleHi:safeText(row.titleHi || row.titleHindi || row["Title (Hindi)"] || ""),titleNe:safeText(row.titleNe || row.titleNepali || row["Title (Nepali)"] || ""),titleBn:safeText(row.titleBn || row.titleBengali || row["Title (Bengali)"] || ""),
      descriptionHi:safeText(row.descriptionHi || row.descriptionHindi || row["Description (Hindi)"] || ""),descriptionNe:safeText(row.descriptionNe || row.descriptionNepali || row["Description (Nepali)"] || ""),descriptionBn:safeText(row.descriptionBn || row.descriptionBengali || row["Description (Bengali)"] || ""),
      categoryHi:safeText(row.categoryHi || row.categoryHindi || row["Category (Hindi)"] || ""),categoryNe:safeText(row.categoryNe || row.categoryNepali || row["Category (Nepali)"] || ""),categoryBn:safeText(row.categoryBn || row.categoryBengali || row["Category (Bengali)"] || "")
    })).filter(isPublished);
    isPreviewMode = false;
    updateCatalogStatus();
    renderAllContent();
  } catch (error) {
    console.warn("SecretsRevealed content connection failed.", error);
    isPreviewMode = true;
    allContent = [...demoContent];
    updateCatalogStatus("Connection unavailable · showing sample cards. Check your Apps Script deployment URL.");
    renderAllContent();
  }
}
function updateCatalogStatus(customText) {
  const status = $("#catalogStatus");
  if (!status) return;
  if (customText) { status.innerHTML = `<span class="status-dot"></span>${escapeHTML(customText)}`; return; }
  status.innerHTML = isPreviewMode
    ? `<span class="status-dot"></span>${escapeHTML(phraseTranslation("Preview library · add your own Google Drive links to publish real work"))}`
    : `<span class="status-dot"></span>${escapeHTML(phraseTranslation("Connected library"))} · ${getPublishedContent().length} ${escapeHTML(phraseTranslation("published resources"))} · ${escapeHTML(phraseTranslation("view-only for visitors"))}`;
}

function coverImageURL(value) {
  const raw = safeText(value).trim();
  if (!raw) return "";
  try {
    const url = new URL(raw, window.location.href);
    if (!["https:", "http:"].includes(url.protocol)) return "";
    if (url.hostname === "drive.google.com") {
      const fileMatch = url.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      const id = url.searchParams.get("id") || (fileMatch && fileMatch[1]);
      if (id) return `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w1200`;
    }
    return url.href;
  } catch { return ""; }
}
function resourceCard(item,index=0) {
  const itemTitle = escapeHTML(localizedItemField(item, "title", "Untitled resource"));
  const description = escapeHTML(localizedItemField(item, "description", "A resource for reading and reflection."));
  const localizedCategory = localizedItemField(item, "category", "Reading");
  const id = escapeHTML(item.id);
  const hue = toneFor(item,index);
  const featured = boolValue(item.featured);
  const type = localizedCategory || phraseTranslation(categoryLabel(item)) || categoryLabel(item);
  const coverURL = coverImageURL(item.cover);
  const coverMedia = coverURL ? `<img class="cover-image" src="${escapeHTML(coverURL)}" alt="Cover of ${itemTitle}" loading="lazy" referrerpolicy="no-referrer">` : `<div class="cover-generated-art" aria-hidden="true"><span class="cover-orbit cover-orbit-one"></span><span class="cover-orbit cover-orbit-two"></span><span class="cover-cross">✝</span></div>`;
  return `<article class="resource-card">
    <div class="resource-cover ${coverURL ? "has-cover-image" : "has-generated-cover"}" style="--hue:${hue}">${coverMedia}<span class="cover-shade" aria-hidden="true"></span><span class="cover-label">${escapeHTML(type.toUpperCase())}</span><span class="cover-title">${itemTitle}</span><span class="cover-subtitle">SECRETSREVEALED · READ / REFLECT / REVEAL</span>${item.demo?'<span class="resource-badge">SAMPLE</span>':featured?'<span class="resource-badge">FEATURED</span>':''}</div>
    <div class="resource-info"><div class="resource-meta"><span>${escapeHTML(type)}</span><span class="read-time">${item.demo?"Layout preview":escapeHTML(item.format || "Read online")}</span></div>
    <h3>${itemTitle}</h3><p>${description}</p><div class="resource-actions"><button class="resource-read" type="button" data-read-id="${id}">${item.demo?"Preview details":"Read resource"} <span>↗</span></button><button class="resource-feedback" type="button" data-feedback-open="${escapeHTML(type)}" data-feedback-item="${itemTitle}">Give feedback</button></div></div>
  </article>`;
}
function filterMatches(item,filter) {
  if (filter === "all") return true;
  const type = categoryType(item.category);
  if (filter === "revelation") return type === "revelation";
  if (filter === "journal") return type === "journal";
  if (filter === "news") return type === "news";
  if (filter === "ebook") return type === "ebook";
  return true;
}
function searchMatches(item) {
  if (!searchTerm) return true;
  return normalize([item.title,item.category,item.description,item.format].join(" ")).includes(normalize(searchTerm));
}
function renderLibrary() {
  const grid = $("#contentGrid");
  if (!grid) return;
  const items = getPublishedContent().filter(item => filterMatches(item,activeFilter) && searchMatches(item));
  grid.innerHTML = items.length ? items.map(resourceCard).join("") : `<div class="empty-state"><b>No matching resources yet.</b><p>Try another search or category, or send a suggestion for what should be added next.</p><button class="text-link" type="button" data-feedback-open="Library">Suggest a resource ↗</button></div>`;
}
function renderJournalShelf() {
  const wrap = $("#journalGrid");
  if (!wrap) return;
  let journals = getPublishedContent().filter(item => categoryType(item.category) === "journal").slice(0,4);
  if (!journals.length && isPreviewMode) journals = demoContent.filter(item=>categoryType(item.category)==="journal");
  if (!journals.length) {
    wrap.innerHTML = `<div class="journal-row"><span class="journal-row-icon">✧</span><div class="journal-row-text"><small>YOUR NEXT ENTRY</small><h4>First journal entry coming soon</h4><p>Published journals will appear here.</p></div></div>`;
    return;
  }
  wrap.innerHTML = journals.map((item,index)=>`<div class="journal-row"><span class="journal-row-icon">${escapeHTML(iconFor(item))}</span><div class="journal-row-text"><small>${escapeHTML(localizedItemField(item,"category",categoryLabel(item)))} · 0${index+1}</small><h4>${escapeHTML(localizedItemField(item,"title","Untitled resource"))}</h4><p>${escapeHTML(localizedItemField(item,"description","A page for Scripture and reflection."))}</p></div><button class="journal-open" type="button" data-read-id="${escapeHTML(item.id)}" aria-label="Open ${escapeHTML(localizedItemField(item,"title","resource"))}">↗</button></div>`).join("");
}
function renderNews() {
  const wrap = $("#newsGrid");
  if (!wrap) return;
  let items = getPublishedContent().filter(item=>categoryType(item.category)==="news").slice(0,3);
  if (!items.length && isPreviewMode) items = demoContent.filter(item=>categoryType(item.category)==="news");
  if (!items.length) {
    wrap.innerHTML = `<article class="news-card"><div class="news-art"><span class="news-symbol">✧</span><span class="news-date">COMING SOON</span></div><h3>The newsroom is getting ready.</h3><p>Christian reflections and dated, sourced articles will appear here after the site owner publishes them.</p><div class="news-footer"><span>News & reflections</span><button class="news-read" type="button" data-feedback-open="Newsroom">Suggest a topic ↗</button></div></article>`;
    return;
  }
  wrap.innerHTML = items.map((item,index)=>`<article class="news-card"><div class="news-art"><span class="news-symbol">${escapeHTML(iconFor(item))}</span><span class="news-date">${escapeHTML(item.updatedAt || phraseTranslation("NEW REFLECTION"))}</span></div><h3>${escapeHTML(localizedItemField(item,"title","Untitled resource"))}</h3><p>${escapeHTML(localizedItemField(item,"description","Open this article for the full reflection."))}</p><div class="news-footer"><span>${escapeHTML(localizedItemField(item,"category",categoryLabel(item)))}</span><button class="news-read" type="button" data-read-id="${escapeHTML(item.id)}">Read article ↗</button></div></article>`).join("");
}
function renderAllContent() { renderLibrary(); renderJournalShelf(); renderNews(); }

function drivePreviewURL(rawURL) {
  const url = safeURL(rawURL);
  if (!url) return "";
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const idInPath = parsed.pathname.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const queryId = parsed.searchParams.get("id");
    const id = idInPath?.[1] || queryId;
    if (!id) return url;
    if (host.includes("docs.google.com")) {
      if (/\/document\//.test(parsed.pathname)) return `https://docs.google.com/document/d/${id}/preview`;
      if (/\/spreadsheets\//.test(parsed.pathname)) return `https://docs.google.com/spreadsheets/d/${id}/preview`;
      if (/\/presentation\//.test(parsed.pathname)) return `https://docs.google.com/presentation/d/${id}/embed?start=false&loop=false&delayms=3000`;
    }
    if (host.includes("drive.google.com")) return `https://drive.google.com/file/d/${id}/preview`;
    return url;
  } catch { return url; }
}
function openReader(id) {
  const item = getPublishedContent().find(row=>safeText(row.id)===safeText(id));
  if (!item) return;
  const modal = $("#readerModal");
  $("#readerTitle").textContent = localizedItemField(item, "title", "Untitled resource");
  $("#readerMeta").textContent = `${localizedItemField(item, "category", categoryLabel(item))}${item.demo ? ` · ${phraseTranslation("sample listing")}` : item.updatedAt ? ` · ${item.updatedAt}` : ""}`;
  const original = getDocumentURL(item);
  const preview = drivePreviewURL(original);
  const frame = $("#readerFrame");
  const empty = $("#readerContent .reader-empty");
  const external = $("#readerExternal");
  frame.removeAttribute("src");
  frame.hidden = true;
  empty.hidden = false;
  external.hidden = !original;
  if (original) {
    external.href = original;
    if (preview) {
      frame.src = preview;
      frame.hidden = false;
      empty.hidden = true;
    }
  } else {
    empty.innerHTML = `<span>✧</span><h3>${item.demo ? "Your work belongs here." : "This resource is not linked yet."}</h3><p>${item.demo ? "This is a sample card showing the website layout, not a published book. Upload your document to Google Drive and add its view link to the private Content sheet to make it available to readers." : "The site owner can add a public Google Drive or Google Docs link to this resource in the Content sheet."}</p>`;
  }
  if (!modal.open) modal.showModal();
  document.body.classList.add("modal-open");
}
function closeReader() { $("#readerFrame").removeAttribute("src"); $("#readerModal").close(); updateBodyModalState(); }

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove("is-visible"),4200);
}
function openFeedback(section="Website", item="") {
  const modal = $("#feedbackModal");
  $("#feedbackSection").value = section;
  $("#feedbackItem").value = item;
  $("#feedbackStatus").textContent = "";
  if (!modal.open) modal.showModal();
  document.body.classList.add("modal-open");
  const message = $("#feedbackForm [name=message]");
  setTimeout(()=>message?.focus(),80);
}
function updateBodyModalState() {
  if (!$("#feedbackModal").open && !$("#readerModal").open) document.body.classList.remove("modal-open");
}
async function submitFeedback(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  if (safeText(data.get("website")).trim()) { $("#feedbackModal").close(); updateBodyModalState(); return; }
  const message = safeText(data.get("message")).trim();
  if (message.length < 5) { $("#feedbackStatus").textContent = "Please add a little more detail."; return; }
  const feedback = {
    action:"feedback", section:safeText(data.get("section")), itemTitle:safeText(data.get("itemTitle")),
    name:safeText(data.get("name")).trim(), email:safeText(data.get("email")).trim(), kind:safeText(data.get("kind")),
    rating:safeText(data.get("rating") || "3"), message
  };
  const status = $("#feedbackStatus");
  const submit = $("#feedbackForm button[type=submit]");
  submit.disabled = true; submit.style.opacity = ".65"; status.textContent = "Sending…";
  if (CONFIG.appsScriptUrl.trim()) {
    try {
      const body = new URLSearchParams(feedback);
      // Google Apps Script accepts a simple URL-encoded request without a CORS preflight.
      await fetch(CONFIG.appsScriptUrl, {method:"POST",mode:"no-cors",headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},body:body.toString()});
      status.textContent = "Thank you. Your feedback has been sent to SecretsRevealed.";
      form.reset();
      $("#feedbackSection").value = feedback.section || "Website";
      setTimeout(()=>{ if ($( "#feedbackModal").open) { $("#feedbackModal").close(); updateBodyModalState(); } },1500);
    } catch (error) {
      console.error("Feedback send failed",error);
      status.textContent = "Could not send. Please email the site owner directly.";
    }
  } else {
    const subject = `[SecretsRevealed] ${feedback.kind} — ${feedback.section}`;
    const bodyText = [`Section: ${feedback.section}`,`Resource: ${feedback.itemTitle || "—"}`,`Type: ${feedback.kind}`,`Rating: ${feedback.rating}/5`,`Name: ${feedback.name || "Not provided"}`,`Reply email: ${feedback.email || "Not provided"}`,"",feedback.message].join("\n");
    status.textContent = "Direct Google Sheets saving is not connected yet. Opening an email draft instead.";
    window.location.href = `mailto:${CONFIG.ownerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  }
  submit.disabled = false; submit.style.opacity = "1";
}

function renderQuiz() {
  const area = $("#quizQuestionArea");
  if (!area) return;
  const index = quizState.index;
  $("#quizCounter").textContent = `QUESTION ${String(Math.min(index+1,quizQuestions.length)).padStart(2,"0")} / ${String(quizQuestions.length).padStart(2,"0")}`;
  $("#quizProgress").style.width = `${index >= quizQuestions.length ? 100 : ((index+1)/quizQuestions.length)*100}%`;
  if (index >= quizQuestions.length) {
    const score = quizState.score;
    const takeaway = score===5 ? "Wonderful work. Keep going deeper into the passages." : score>=3 ? "Good effort. Revisit the verses and see what else you notice." : "Every quiz is a chance to learn. Open your Bible and explore the references.";
    area.innerHTML = `<div class="quiz-result"><div class="result-symbol">${score>=4?"✦":"✧"}</div><span class="result-score">${score} / ${quizQuestions.length}</span><h3>${score===5?"A thoughtful reader.":score>=3?"A good start.":"Keep seeking."}</h3><p>${takeaway}</p><button class="quiz-next" type="button" data-quiz-action="restart">Try again ↻</button></div>`;
    return;
  }
  const question = quizQuestions[index];
  const options = question.options.map((option,i)=>{
    let classes="quiz-option";
    if (quizState.checked && i===question.correct) classes += " is-correct";
    if (quizState.checked && i===quizState.chosen && i!==question.correct) classes += " is-wrong";
    return `<label class="${classes}"><input type="radio" name="quiz-answer" value="${i}" ${quizState.chosen===i?"checked":""} ${quizState.checked?"disabled":""}><span>${escapeHTML(option)}</span></label>`;
  }).join("");
  const feedback = quizState.checked ? `<div class="quiz-feedback"><strong>${quizState.chosen===question.correct?phraseTranslation("Correct!"):phraseTranslation("Let's learn:")}</strong> ${escapeHTML(phraseTranslation(question.explanation))}</div>` : "";
  const scoreLabel = quizState.checked ? `${phraseTranslation("Your score so far:")} ${quizState.score}/${index+1}` : phraseTranslation("Choose one answer to continue.");
  area.innerHTML = `<div class="quiz-question-kicker">${escapeHTML(phraseTranslation("QUESTION"))} ${String(index+1).padStart(2,"0")}</div><h3 class="quiz-question">${escapeHTML(phraseTranslation(question.question))}</h3><div class="quiz-options">${options}</div>${feedback}<div class="quiz-card-bottom"><small>${escapeHTML(scoreLabel)}</small><button class="quiz-next" type="button" data-quiz-action="${quizState.checked?"next":"check"}" ${!quizState.checked && quizState.chosen===null?"disabled":""}>${quizState.checked?(index===quizQuestions.length-1?phraseTranslation("See result"):phraseTranslation("Next question →")):phraseTranslation("Check answer")}</button></div>`;
}
function handleQuizClick(event) {
  const actionButton = event.target.closest("[data-quiz-action]");
  if (!actionButton) return;
  const action = actionButton.dataset.quizAction;
  if (action === "check" && quizState.chosen !== null && !quizState.checked) {
    if (quizState.chosen===quizQuestions[quizState.index].correct) quizState.score++;
    quizState.checked=true;
    renderQuiz();
  } else if (action === "next" && quizState.checked) {
    quizState.index++;
    quizState.chosen=null;quizState.checked=false;
    renderQuiz();
    if (quizState.index>=quizQuestions.length) sendQuizResult();
  } else if (action === "restart") {
    quizState={index:0,score:0,chosen:null,checked:false};
    renderQuiz();
  }
}
async function sendQuizResult() {
  if (!CONFIG.appsScriptUrl.trim()) return;
  const body = new URLSearchParams({action:"quiz",quizTitle:"The Word Challenge",score:String(quizState.score),total:String(quizQuestions.length)});
  try { await fetch(CONFIG.appsScriptUrl,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},body:body.toString()}); }
  catch (error) { console.warn("Quiz result could not be submitted",error); }
}


const uiTranslations = {
  en: {openingEyebrow:"A MOMENT OF STILLNESS · A WORLD OF DISCOVERY",openingDescription:"A quiet place to read, reflect, and discover the living truth of Scripture.",openingEnter:"Enter the sanctuary",openingSkip:"Skip introduction",navLibrary:"Library",navRevelation:"Revelation",navJournals:"Journals",navQuiz:"Bible Quiz",navNewsroom:"Newsroom",eyebrow:"A digital sanctuary for curious hearts",heroLine1:"Some truths are",heroLine2:"worth discovering.",aboutTitle:"About SecretsRevealed",aboutText:"SecretsRevealed is a welcoming space to read Scripture, reflect with purpose, and reveal the timeless truths that shape a life of faith. Explore Bible studies, journals, e-books, and thoughtful perspectives that encourage curiosity, wisdom, and a closer walk with Jesus.",explore:"Explore the library",begin:"Begin with Revelation",sectionLibrary:"A library for the curious.",sectionRevelation:"Unveil the wonder of Revelation.",sectionJournals:"Pause. Pray. Write.",sectionQuiz:"Test what you know. Grow as you go.",sectionNews:"Faith in the conversation."},
  hi: {openingEyebrow:"ठहराव का एक पल · खोज की एक दुनिया",openingDescription:"पवित्रशास्त्र के जीवित सत्य को पढ़ने, मनन करने और खोजने का शांत स्थान।",openingEnter:"इस आध्यात्मिक स्थान में प्रवेश करें",openingSkip:"परिचय छोड़ें",navLibrary:"पुस्तकालय",navRevelation:"प्रकाशितवाक्य",navJournals:"डायरी",navQuiz:"बाइबल प्रश्नोत्तरी",navNewsroom:"समाचार",eyebrow:"जिज्ञासु हृदयों के लिए एक डिजिटल स्थान",heroLine1:"कुछ सत्य ऐसे हैं",heroLine2:"जिन्हें खोजना ज़रूरी है।",aboutTitle:"SecretsRevealed के बारे में",aboutText:"SecretsRevealed पवित्रशास्त्र पढ़ने, उद्देश्य के साथ मनन करने और विश्वास को आकार देने वाले अनमोल सत्यों को खोजने का एक स्वागतपूर्ण स्थान है। बाइबल अध्ययन, डायरी, ई-पुस्तकें और ऐसे विचार खोजें जो जिज्ञासा, बुद्धि और यीशु के साथ निकटता बढ़ाएँ।",explore:"पुस्तकालय देखें",begin:"प्रकाशितवाक्य से शुरू करें",sectionLibrary:"जिज्ञासु लोगों के लिए पुस्तकालय।",sectionRevelation:"प्रकाशितवाक्य के अद्भुत संदेश खोजें।",sectionJournals:"ठहरें। प्रार्थना करें। लिखें।",sectionQuiz:"अपने ज्ञान को परखें और बढ़ें।",sectionNews:"विश्वास और आज की चर्चा।"},
  ne: {openingEyebrow:"शान्तिको एक क्षण · खोजको संसार",openingDescription:"धर्मशास्त्रको जीवित सत्य पढ्न, मनन गर्न र खोज्न शान्त ठाउँ।",openingEnter:"आध्यात्मिक यात्रामा प्रवेश गर्नुहोस्",openingSkip:"परिचय छोड्नुहोस्",navLibrary:"पुस्तकालय",navRevelation:"प्रकाश",navJournals:"डायरी",navQuiz:"बाइबल प्रश्नोत्तरी",navNewsroom:"समाचार",eyebrow:"जिज्ञासु मनका लागि डिजिटल आश्रय",heroLine1:"केही सत्यहरू",heroLine2:"खोज्न योग्य छन्।",aboutTitle:"SecretsRevealed बारेमा",aboutText:"SecretsRevealed पवित्रशास्त्र पढ्न, उद्देश्यसहित मनन गर्न र विश्वासलाई आकार दिने अनन्त सत्यहरू पत्ता लगाउन स्वागतयोग्य स्थान हो। बाइबल अध्ययन, डायरी, ई-पुस्तक र जिज्ञासा, बुद्धि तथा येशूसँगको नजिकपन बढाउने विचारहरू अन्वेषण गर्नुहोस्।",explore:"पुस्तकालय हेर्नुहोस्",begin:"प्रकाशको पुस्तकबाट सुरु गर्नुहोस्",sectionLibrary:"जिज्ञासुहरूका लागि पुस्तकालय।",sectionRevelation:"प्रकाशको पुस्तकको आश्चर्य खोज्नुहोस्।",sectionJournals:"रोक्नुहोस्। प्रार्थना गर्नुहोस्। लेख्नुहोस्।",sectionQuiz:"ज्ञान जाँच्नुहोस् र बढ्दै जानुहोस्।",sectionNews:"विश्वास र समसामयिक संवाद।"},
  bn: {openingEyebrow:"নীরবতার একটি মুহূর্ত · আবিষ্কারের এক জগৎ",openingDescription:"শাস্ত্রের জীবন্ত সত্য পড়া, ভাবা ও আবিষ্কারের একটি শান্ত স্থান।",openingEnter:"এই আধ্যাত্মিক পরিসরে প্রবেশ করুন",openingSkip:"পরিচয় এড়িয়ে যান",navLibrary:"পাঠাগার",navRevelation:"প্রকাশিত বাক্য",navJournals:"জার্নাল",navQuiz:"বাইবেল কুইজ",navNewsroom:"সংবাদ",eyebrow:"অনুসন্ধিৎসু হৃদয়ের জন্য একটি ডিজিটাল আশ্রয়",heroLine1:"কিছু সত্য আছে",heroLine2:"যা আবিষ্কারের যোগ্য।",aboutTitle:"SecretsRevealed সম্পর্কে",aboutText:"SecretsRevealed হলো শাস্ত্র পাঠ, উদ্দেশ্যপূর্ণ মনন এবং বিশ্বাসকে গড়ে তোলা চিরন্তন সত্য আবিষ্কারের একটি স্বাগতপূর্ণ স্থান। বাইবেল অধ্যয়ন, জার্নাল, ই-বুক ও এমন চিন্তাভাবনা অন্বেষণ করুন যা কৌতূহল, প্রজ্ঞা এবং যিশুর আরও কাছে চলতে সাহায্য করে।",explore:"পাঠাগার দেখুন",begin:"প্রকাশিত বাক্য দিয়ে শুরু করুন",sectionLibrary:"অনুসন্ধিৎসুদের জন্য পাঠাগার।",sectionRevelation:"প্রকাশিত বাক্যের বিস্ময় আবিষ্কার করুন।",sectionJournals:"থামুন। প্রার্থনা করুন। লিখুন।",sectionQuiz:"জ্ঞান যাচাই করুন, এগিয়ে চলুন।",sectionNews:"বিশ্বাস ও সমসাময়িক আলোচনা।"}
};
function applyLanguage(language) {
  currentLanguage = ["en","hi","ne","bn"].includes(language) ? language : "en";
  const dictionary = uiTranslations[currentLanguage] || uiTranslations.en;
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll("[data-i18n]").forEach(node => {
    const key = node.dataset.i18n;
    if (dictionary[key]) node.textContent = dictionary[key];
  });
  // Main headings retain their markup; their individual phrase nodes are translated below.
  document.title = currentLanguage === "en" ? "SecretsRevealed — Read. Reflect. Reveal." :
    currentLanguage === "hi" ? "SecretsRevealed — पढ़ें · मनन करें · खोजें" :
    currentLanguage === "ne" ? "SecretsRevealed — पढ्नुहोस् · मनन गर्नुहोस् · पत्ता लगाउनुहोस्" :
    "SecretsRevealed — পড়ুন · ভাবুন · আবিষ্কার করুন";
  translateSubtree(document.body, currentLanguage);
}
function initOpeningExperience() {
  const screen = $("#openingScreen");
  if (!screen) return;
  const enter = () => {
    if (screen.classList.contains("is-closing")) return;
    screen.classList.add("is-closing");
    document.body.classList.remove("intro-active");
    document.body.classList.add("site-entered");
    document.dispatchEvent(new Event("sr:site-entered"));
    window.setTimeout(() => screen.remove(), 850);
  };
  const bible = $("#openingBible");
  window.setTimeout(() => { if (bible) bible.classList.add("is-opening"); }, 550);
  window.setTimeout(() => screen.classList.add("dove-released"), 1250);
  $("#enterWebsite")?.addEventListener("click", enter);
  $("#skipOpening")?.addEventListener("click", enter);
  const introDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1800 : 6800;
  const timer = window.setTimeout(enter, introDuration);
  screen.addEventListener("click", event => { if (event.target === screen) { window.clearTimeout(timer); enter(); } });
}
function initVerseLoop() {
  const left = $("#verseLeft"), right = $("#verseRight"), reference = $("#verseReference");
  if (!left || !right || !reference) return;
  const verses = [
    {left:"In the beginning,",right:"God created the heavens and earth.",ref:"Genesis 1:1"},
    {left:"Let there be light,",right:"and there was light.",ref:"Genesis 1:3"},
    {left:"The light shines",right:"in the darkness.",ref:"John 1:5"},
    {left:"Your word is a lamp",right:"to my feet and my path.",ref:"Psalm 119:105"}
  ];
  let index = 0, started = false;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const startLoop = () => {
    if (started) return;
    started = true;
    window.setInterval(() => {
      index = (index + 1) % verses.length;
      const next = verses[index];
      [left,right,reference].forEach(node => node.classList.add("verse-changing"));
      window.setTimeout(() => {
        left.textContent = next.left;
        right.textContent = next.right;
        reference.textContent = next.ref;
        [left,right,reference].forEach(node => node.classList.remove("verse-changing"));
      }, reduced ? 0 : 350);
    }, reduced ? 9000 : 5200);
  };
  if (document.body.classList.contains("site-entered")) startLoop();
  else document.addEventListener("sr:site-entered", startLoop, {once:true});
}

function initStarfield() {
  const canvas = $("#starfield");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  let stars=[]; let width=0,height=0,frame=0;
  const setup=()=>{
    const dpr=Math.min(window.devicePixelRatio||1,2);
    width=window.innerWidth;height=Math.min(Math.max(document.documentElement.scrollHeight,1200),2600);
    canvas.width=width*dpr;canvas.height=height*dpr;canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;ctx.setTransform(dpr,0,0,dpr,0,0);
    const count=Math.floor(width*height/10000);stars=Array.from({length:Math.min(count,220)},()=>({x:Math.random()*width,y:Math.random()*height,r:Math.random()*1.25+.2,a:Math.random()*.5+.12,phase:Math.random()*6.28,speed:Math.random()*.012+.003}));
  };
  const draw=()=>{
    ctx.clearRect(0,0,width,height);
    for(const star of stars){star.phase+=star.speed;const alpha=star.a*(.68+.32*Math.sin(star.phase));ctx.beginPath();ctx.arc(star.x,star.y,star.r,0,Math.PI*2);ctx.fillStyle=`rgba(220,216,255,${alpha})`;ctx.fill();}
    frame=requestAnimationFrame(draw);
  };
  setup();draw();
  let resizeTimeout;window.addEventListener("resize",()=>{clearTimeout(resizeTimeout);resizeTimeout=setTimeout(setup,180);},{passive:true});
  window.addEventListener("beforeunload",()=>cancelAnimationFrame(frame),{once:true});
}

function init() {
  $("#yearNow").textContent = String(new Date().getFullYear());
  const languageSelect = $("#languageSelect");
  const themeSelect = $("#themeSelect");
  if (languageSelect) {
    const savedLanguage = readPreference("sr-language");
    if (["en","hi","ne","bn"].includes(savedLanguage)) languageSelect.value = savedLanguage;
    languageSelect.addEventListener("change", () => {
      savePreference("sr-language", languageSelect.value);
      applyLanguage(languageSelect.value);
      // Rebuild the library using translated item fields, then apply phrase-level UI translations.
      renderAllContent();
      renderQuiz();
      translateSubtree(document.body, currentLanguage);
    });
    applyLanguage(languageSelect.value);
    initDynamicTranslation();
  }
  if (themeSelect) {
    const savedTheme = readPreference("sr-theme");
    const availableThemes = ["midnight","ocean","forest","plum","warm","burgundy","sapphire","teal","amethyst","crimson","pine","slate","indigo"];
    if (availableThemes.includes(savedTheme)) themeSelect.value = savedTheme;
    document.body.dataset.theme = themeSelect.value || "midnight";
    themeSelect.addEventListener("change", () => {
      const nextTheme = availableThemes.includes(themeSelect.value) ? themeSelect.value : "midnight";
      document.body.dataset.theme = nextTheme;
      savePreference("sr-theme", nextTheme);
    });
  }
  initOpeningExperience();
  initVerseLoop();
  $("#searchInput").addEventListener("input",event=>{searchTerm=event.target.value;renderLibrary();});
  $$("[data-filter]").forEach(button=>button.addEventListener("click",()=>{
    activeFilter=button.dataset.filter;
    $$("[data-filter]").forEach(item=>{const on=item===button;item.classList.toggle("is-active",on);item.setAttribute("aria-pressed",String(on));});
    renderLibrary();
  }));
  document.addEventListener("click",event=>{
    const feedbackButton=event.target.closest("[data-feedback-open]");
    if(feedbackButton){event.preventDefault();openFeedback(feedbackButton.dataset.feedbackOpen || "Website",feedbackButton.dataset.feedbackItem || "");return;}
    const readerButton=event.target.closest("[data-read-id]");
    if(readerButton){openReader(readerButton.dataset.readId);return;}
    if(event.target.closest("[data-close-modal]")){ $("#feedbackModal").close();updateBodyModalState(); }
    if(event.target.closest("[data-close-reader]")){ closeReader(); }
  });
  $("#feedbackForm").addEventListener("submit",submitFeedback);
  $("#feedbackModal").addEventListener("close",updateBodyModalState);
  $("#readerModal").addEventListener("close",updateBodyModalState);
  $("#readerModal").addEventListener("click",event=>{if(event.target===$("#readerModal"))closeReader();});
  $("#feedbackModal").addEventListener("click",event=>{if(event.target===$("#feedbackModal")){ $("#feedbackModal").close();updateBodyModalState(); }});
  $("#menuToggle").addEventListener("click",()=>{const nav=$("#primaryNav");const open=nav.classList.toggle("is-open");$("#menuToggle").setAttribute("aria-expanded",String(open));$("#menuToggle").setAttribute("aria-label",open?"Close navigation":"Open navigation");});
  $$("#primaryNav a").forEach(link=>link.addEventListener("click",()=>{$("#primaryNav").classList.remove("is-open");$("#menuToggle").setAttribute("aria-expanded","false");$("#menuToggle").setAttribute("aria-label","Open navigation");}));
  $("#revelationExplore").addEventListener("click",()=>{activeFilter="revelation";searchTerm="";$("#searchInput").value="";$$("[data-filter]").forEach(item=>{const on=item.dataset.filter==="revelation";item.classList.toggle("is-active",on);item.setAttribute("aria-pressed",String(on));});renderLibrary();$("#library").scrollIntoView({behavior:"smooth"});});
  $("#quizQuestionArea").addEventListener("change",event=>{if(event.target.name==="quiz-answer"&&!quizState.checked){quizState.chosen=Number(event.target.value);const next=$("[data-quiz-action=check]");if(next)next.disabled=false;}});
  $("#quizQuestionArea").addEventListener("click",handleQuizClick);
  document.addEventListener("keydown",event=>{if(event.key==="Escape"){updateBodyModalState();}});
  renderQuiz();initStarfield();loadContent();
}
document.addEventListener("DOMContentLoaded",init);
