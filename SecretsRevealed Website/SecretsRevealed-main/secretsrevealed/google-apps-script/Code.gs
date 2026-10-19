/**
 * SecretsRevealed Google Sheets bridge.
 * Public visitors may read only rows whose Status is "Published" and submit feedback/quiz results.
 * Keep the spreadsheet private. Do not put service credentials in the website source.
 */
const SPREADSHEET_ID = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';
const OWNER_EMAIL = 'nikhilnaubhag777@gmail.com';
const CONTENT_TAB = 'Content';
const FEEDBACK_TAB = 'Feedback';
const QUIZ_TAB = 'Quiz Results';

function setupSecretsRevealed() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID.indexOf('PASTE_') === 0) {
    throw new Error('Open Code.gs and replace SPREADSHEET_ID with the ID from your Google Sheet URL.');
  }
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  ensureTab_(ss, CONTENT_TAB, ['ID','Title','Category','Description','Document URL','Format','Status','Featured','Cover','Updated At','Title (Hindi)','Title (Nepali)','Title (Bengali)','Category (Hindi)','Category (Nepali)','Category (Bengali)','Description (Hindi)','Description (Nepali)','Description (Bengali)']);
  ensureTab_(ss, FEEDBACK_TAB, ['Timestamp','Section','Resource','Type','Rating','Name','Reply Email','Message']);
  ensureTab_(ss, QUIZ_TAB, ['Timestamp','Quiz','Score','Total']);
  return 'SecretsRevealed sheets are ready. Add published content to the Content tab.';
}

function authorizeSecretsRevealed() {
  // Run once in the Apps Script editor to approve spreadsheet and email-notification permissions.
  getSpreadsheet_().getName();
  const remainingMailQuota = MailApp.getRemainingDailyQuota();
  return 'Authorization check complete. Remaining daily email quota: ' + remainingMailQuota;
}

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'content';
  if (action === 'health') return json_({ok:true, service:'SecretsRevealed', message:'Service is online.'});
  if (action !== 'content') return json_({ok:false, error:'Unknown action.'});
  try {
    const ss = getSpreadsheet_();
    const sheet = ss.getSheetByName(CONTENT_TAB);
    if (!sheet || sheet.getLastRow() < 2) return json_({ok:true, items:[]});
    const values = sheet.getDataRange().getValues();
    const headers = values.shift().map(h => String(h).trim());
    const rows = values.map(row => {
      const obj = {};
      headers.forEach((header, index) => obj[header] = row[index]);
      return obj;
    }).filter(row => String(row.Status || '').trim().toLowerCase() === 'published')
      .map(row => ({
        id: String(row.ID || ''),
        title: String(row.Title || 'Untitled resource'),
        category: String(row.Category || 'Reading'),
        description: String(row.Description || ''),
        url: String(row['Document URL'] || ''),
        format: String(row.Format || row.Category || 'Reading'),
        featured: isTruthy_(row.Featured),
        cover: String(row.Cover || ''),
        updatedAt: formatDate_(row['Updated At']),
        titleHi: String(row['Title (Hindi)'] || row.TitleHi || row.TitleHindi || ''),
        titleNe: String(row['Title (Nepali)'] || row.TitleNe || row.TitleNepali || ''),
        titleBn: String(row['Title (Bengali)'] || row.TitleBn || row.TitleBengali || ''),
        descriptionHi: String(row['Description (Hindi)'] || row.DescriptionHi || row.DescriptionHindi || ''),
        descriptionNe: String(row['Description (Nepali)'] || row.DescriptionNe || row.DescriptionNepali || ''),
        descriptionBn: String(row['Description (Bengali)'] || row.DescriptionBn || row.DescriptionBengali || ''),
        categoryHi: String(row['Category (Hindi)'] || row.CategoryHi || row.CategoryHindi || ''),
        categoryNe: String(row['Category (Nepali)'] || row.CategoryNe || row.CategoryNepali || ''),
        categoryBn: String(row['Category (Bengali)'] || row.CategoryBn || row.CategoryBengali || ''),
        status: 'Published' 
      }))
      .sort((a,b) => Number(b.featured) - Number(a.featured));
    return json_({ok:true, items:rows});
  } catch (err) {
    console.error(err);
    return json_({ok:false, error:'Unable to load published content.'});
  }
}

function doPost(e) {
  try {
    const params = getParams_(e);
    const action = String(params.action || '').trim().toLowerCase();
    // Bot trap: silently ignore submissions where a hidden field was filled.
    if (String(params.website || '').trim()) return json_({ok:true});
    const ss = getSpreadsheet_();
    if (action === 'feedback') return saveFeedback_(ss, params);
    if (action === 'quiz') return saveQuiz_(ss, params);
    return json_({ok:false, error:'Unknown submission type.'});
  } catch (err) {
    console.error(err);
    return json_({ok:false, error:'Submission could not be saved.'});
  }
}

function saveFeedback_(ss, p) {
  const message = limit_(p.message, 4000).trim();
  if (message.length < 5) return json_({ok:false, error:'Please provide a longer message.'});
  const sheet = ss.getSheetByName(FEEDBACK_TAB);
  if (!sheet) throw new Error('Feedback tab not found. Run setupSecretsRevealed() first.');
  const name = limit_(p.name, 100).trim();
  const email = limit_(p.email, 200).trim();
  const section = limit_(p.section, 120).trim() || 'Website';
  const item = limit_(p.itemTitle, 250).trim();
  const kind = limit_(p.kind, 100).trim() || 'General feedback';
  const rating = Math.max(1, Math.min(5, parseInt(p.rating, 10) || 3));
  sheet.appendRow([new Date(), safeCell_(section), safeCell_(item), safeCell_(kind), rating, safeCell_(name || 'Anonymous'), safeCell_(email), safeCell_(message)]);
  SpreadsheetApp.flush();
  // An email notification is best-effort; a notification failure must not discard the saved feedback.
  try {
    MailApp.sendEmail({
      to: OWNER_EMAIL,
      subject: '[SecretsRevealed] ' + kind + ' — ' + section,
      body: 'New website feedback\n\nSection: ' + section + '\nResource: ' + (item || '—') + '\nType: ' + kind + '\nRating: ' + rating + '/5\nName: ' + (name || 'Anonymous') + '\nReply email: ' + (email || 'Not provided') + '\n\nMessage:\n' + message + '\n\nSaved in the Feedback tab of your private Google Sheet.'
    });
  } catch (mailErr) {
    console.warn('Feedback saved, but email notification failed: ' + mailErr);
  }
  return json_({ok:true});
}

function saveQuiz_(ss, p) {
  const sheet = ss.getSheetByName(QUIZ_TAB);
  if (!sheet) throw new Error('Quiz Results tab not found. Run setupSecretsRevealed() first.');
  const total = Math.max(1, Math.min(100, parseInt(p.total, 10) || 5));
  const score = Math.max(0, Math.min(total, parseInt(p.score, 10) || 0));
  sheet.appendRow([new Date(), safeCell_(limit_(p.quizTitle, 200) || 'The Word Challenge'), score, total]);
  SpreadsheetApp.flush();
  return json_({ok:true});
}

function getSpreadsheet_() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID.indexOf('PASTE_') === 0) throw new Error('Set SPREADSHEET_ID in Code.gs first.');
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}
function ensureTab_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setWrap(true);
    sheet.autoResizeColumns(1, headers.length);
  }
}
function getParams_(e) {
  if (e && e.parameter) return e.parameter;
  if (e && e.postData && e.postData.contents) {
    try { return JSON.parse(e.postData.contents); } catch (_) {}
  }
  return {};
}
function isTruthy_(value) {
  return value === true || ['true','yes','1','featured'].indexOf(String(value || '').trim().toLowerCase()) >= 0;
}
function limit_(value, maxLength) { return String(value == null ? '' : value).slice(0, maxLength); }
function safeCell_(value) {
  const text = String(value == null ? '' : value).slice(0, 5000);
  // Avoid interpreting public text as a spreadsheet formula.
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
function formatDate_(value) {
  if (!value) return '';
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value)) {
    return Utilities.formatDate(value, Session.getScriptTimeZone() || 'Asia/Kolkata', 'dd MMM yyyy');
  }
  return String(value);
}
function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
