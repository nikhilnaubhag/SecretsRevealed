/**
 * ============================================================================
 * SECRETSREVEALED v4 — FULL-STACK GOOGLE APPS SCRIPT BACKEND (Code.gs)
 * Connected to Google Sheet: "SecretsRevealed Content & Feedback"
 * Sheet ID: 1_EyDHOi2WmQoNw1MVzqcx3j55uW-K_MTAjPxFJSRkeU
 *
 * ISOLATED 4-SECTION BOOK STORAGE:
 *   - revelation_books -> Tab "Books_Revelation"
 *   - journal          -> Tab "Books_Journal"
 *   - ebooks           -> Tab "Books_Ebooks"
 *   - reflections      -> Tab "Books_Reflections"
 *
 * HOW TO UPDATE YOUR DEPLOYMENT IN 30 SECONDS:
 * 1. Open your Google Sheet "SecretsRevealed Content & Feedback"
 *    -> Extensions -> Apps Script.
 * 2. Replace the entire code in Code.gs with this file and click Save.
 * 3. Select "authorizeAndTestEmails" in the toolbar dropdown and click Run once.
 * 4. Click Deploy -> Manage deployments -> Edit (Pencil) -> Version: "New version"
 *    -> Deploy (Web app, Execute as: Me, Who has access: Anyone).
 * ============================================================================
 */

const SPREADSHEET_ID = '1_EyDHOi2WmQoNw1MVzqcx3j55uW-K_MTAjPxFJSRkeU';
const OWNER_EMAIL = 'nikhilnaubhag777@gmail.com';

const SECTION_TABS = {
  revelation_books: 'Books_Revelation',
  journal: 'Books_Journal',
  ebooks: 'Books_Ebooks',
  reflections: 'Books_Reflections'
};

const BOOK_HEADERS = [
  'ID', 'CreatedAt', 'SectionId', 'Title', 'Author', 'PublishMode',
  'Description', 'CoverUrl', 'ExternalUrl', 'ExternalLabel',
  'DocType', 'DocUrl', 'ChaptersJSON', 'Featured', 'Status', 'FormatLabel'
];

function authorizeAndTestEmails() {
  MailApp.sendEmail({
    to: OWNER_EMAIL,
    subject: '✅ [SecretsRevealed v4] Full-Stack Sanctuary Backend Active',
    body: 'Blessings Nikhil!\n\nYour SecretsRevealed v4 Google Apps Script backend is authorized and active:\n1. 4 Isolated Book Section Tabs (Books_Revelation, Books_Journal, Books_Ebooks, Books_Reflections).\n2. Multi-mode Publishing (Link & Cover, Direct Summary/Optional Chapters, PDF / Google Docs / Drive / Sheets).\n3. 6-digit Email OTP verification & Visitor Feedback Thank-You emails.\n\nWarmly,\nSecretsRevealed Sanctuary'
  });
  ensureAllSectionTabs();
  Logger.log('SecretsRevealed v4 backend verified & 4 isolated tabs initialized.');
}

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function parsePayload(e) {
  const merged = {};
  if (e && e.parameter) {
    Object.keys(e.parameter).forEach(function(k) { merged[k] = e.parameter[k]; });
  }
  if (merged.payload) {
    try {
      const decoded = JSON.parse(merged.payload);
      Object.keys(decoded).forEach(function(k) { merged[k] = decoded[k]; });
    } catch (ignore) {}
  }
  if (e && e.postData && e.postData.contents) {
    const raw = String(e.postData.contents || '').trim();
    if (raw) {
      try {
        const parsedJson = JSON.parse(raw);
        if (parsedJson && typeof parsedJson === 'object') {
          Object.keys(parsedJson).forEach(function(k) { merged[k] = parsedJson[k]; });
        }
      } catch (notJson) {
        raw.split('&').forEach(function(pair) {
          const idx = pair.indexOf('=');
          if (idx > 0) {
            const k = decodeURIComponent(pair.slice(0, idx).replace(/\+/g, ' '));
            const v = decodeURIComponent(pair.slice(idx + 1).replace(/\+/g, ' '));
            merged[k] = v;
          }
        });
      }
    }
  }
  return merged;
}

function getSpreadsheetSafely() {
  try {
    if (SPREADSHEET_ID && SPREADSHEET_ID.indexOf('PASTE_') === -1) {
      return SpreadsheetApp.openById(SPREADSHEET_ID);
    }
  } catch (err) {}
  try { return SpreadsheetApp.getActiveSpreadsheet(); } catch (err2) { return null; }
}

function ensureSectionSheet(ss, sectionId) {
  const tabName = SECTION_TABS[sectionId] || SECTION_TABS.revelation_books;
  let sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(BOOK_HEADERS);
    sheet.getRange(1, 1, 1, BOOK_HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function ensureAllSectionTabs() {
  const ss = getSpreadsheetSafely();
  if (!ss) return;
  Object.keys(SECTION_TABS).forEach(function(secId) {
    ensureSectionSheet(ss, secId);
  });
}

function dispatchEmail(to, subject, plainBody, htmlBody, replyTo) {
  const opts = { to: to, subject: subject, body: plainBody, name: 'SecretsRevealed Sanctuary' };
  if (htmlBody) opts.htmlBody = htmlBody;
  if (replyTo) opts.replyTo = replyTo;
  try {
    MailApp.sendEmail(opts);
    return true;
  } catch (err1) {
    GmailApp.sendEmail(to, subject, plainBody, {
      name: 'SecretsRevealed Sanctuary',
      htmlBody: htmlBody || undefined,
      replyTo: replyTo || undefined
    });
    return true;
  }
}

function getOtpEmailCopy(lang, name, otp) {
  const safeName = name || 'Reader';
  const copies = {
    en: {
      subject: 'Your SecretsRevealed Verification Code (OTP): ' + otp,
      greeting: 'Hello ' + safeName + ',',
      lead: 'Welcome to SecretsRevealed ("Read. Reflect. Reveal."). Please use the 6-digit verification code below to complete your sign-in:',
      note: 'If you did not request this code, you can safely ignore this email.',
      signoff: 'Blessings in Christ,\nSecretsRevealed Sanctuary'
    },
    ne: {
      subject: 'तपाईंको SecretsRevealed प्रमाणिकरण कोड (OTP): ' + otp,
      greeting: 'नमस्कार ' + safeName + ',',
      lead: 'SecretsRevealed मा स्वागत छ। कृपया आफ्नो साइन-इन पूरा गर्न तलको ६-अंकको OTP कोड प्रयोग गर्नुहोस्:',
      note: '(Use the 6-digit OTP code above to complete your sign-in.)',
      signoff: 'ख्रीष्टको प्रेम र आशिष् सहित,\nSecretsRevealed Sanctuary'
    },
    hi: {
      subject: 'आपका SecretsRevealed सत्यापन कोड (OTP): ' + otp,
      greeting: 'नमस्ते ' + safeName + ',',
      lead: 'SecretsRevealed में आपका स्वागत है। कृपया अपना साइन-इन पूरा करने के लिए नीचे दिए गए 6-अंकों के OTP कोड का उपयोग करें:',
      note: '(Use the 6-digit OTP code above to complete your sign-in.)',
      signoff: 'मसीह के प्रेम और आशीष के साथ,\nSecretsRevealed Sanctuary'
    },
    bn: {
      subject: 'আপনার SecretsRevealed যাচাইকরণ কোড (OTP): ' + otp,
      greeting: 'নমস্কার ' + safeName + ',',
      lead: 'SecretsRevealed-এ আপনাকে স্বাগতম। আপনার সাইন-ইন সম্পন্ন করতে নিচের ৬-সংখ্যার OTP কোডটি ব্যবহার করুন:',
      note: '(Use the 6-digit OTP code above to complete your sign-in.)',
      signoff: 'খ্রিস্টের প্রেম ও আশীর্বাদসহ,\nSecretsRevealed Sanctuary'
    }
  };
  const c = copies[lang] || copies.en;
  const plain = c.greeting + '\n\n' + c.lead + '\n\n    ' + otp + '\n\n' + c.note + '\n\n' + c.signoff;
  const html = '<div style="font-family:Georgia,serif;max-width:540px;margin:0 auto;padding:24px;background:#0d1322;color:#f4f6fb;border-radius:16px;border:1px solid #f4b942;">' +
    '<div style="font-size:12px;letter-spacing:2px;color:#f4b942;font-weight:bold;margin-bottom:8px;">SECRETSREVEALED SANCTUARY · READ · REFLECT · REVEAL</div>' +
    '<h2 style="color:#fff6e6;margin:0 0 12px 0;">' + c.greeting + '</h2>' +
    '<p style="color:#d6dff2;line-height:1.6;font-size:15px;">' + c.lead + '</p>' +
    '<div style="margin:20px 0;padding:16px;background:#162038;border:2px dashed #f4b942;border-radius:12px;text-align:center;">' +
    '<span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#f4b942;font-family:monospace;">' + otp + '</span></div>' +
    '<p style="color:#aab4c8;font-size:13px;line-height:1.5;">' + c.note + '</p>' +
    '<hr style="border:none;border-top:1px solid rgba(255,255,255,0.12);margin:18px 0;" />' +
    '<p style="color:#f4b942;font-size:14px;white-space:pre-line;margin:0;">' + c.signoff + '</p></div>';
  return { subject: c.subject, plain: plain, html: html };
}

function getFeedbackConfirmationCopy(lang, name, kind, message) {
  const safeName = name || 'Friend';
  const copies = {
    en: {
      subject: 'Thank you for submitting your feedback — SecretsRevealed',
      greeting: 'Dear ' + safeName + ',',
      body1: 'Thank you so much for submitting your feedback to SecretsRevealed! We have received your message and truly appreciate you sharing your heart with us.',
      body2: 'We would love to see you again whenever you wish to read Scripture, listen to worship music, or pause in prayer. May God richly bless you!',
      yourMsgLabel: 'Your submitted note:',
      signoff: 'With gratitude and faith,\nNikhil Darjee & SecretsRevealed Sanctuary'
    },
    ne: {
      subject: 'तपाईंको प्रतिक्रियाको लागि धन्यवाद — SecretsRevealed',
      greeting: 'प्रिय ' + safeName + ',',
      body1: 'SecretsRevealed मा आफ्नो प्रतिक्रिया पठाउनुभएकोमा हार्दिक धन्यवाद! हामीले तपाईंको सन्देश प्राप्त गरेका छौं।',
      body2: 'हामी तपाईंलाई फेरि भेट्न पाउँदा खुसी हुनेछौं। परमेश्वरले तपाईंलाई प्रशस्त आशिष् दिऊन्!',
      yourMsgLabel: 'तपाईंको सन्देश:',
      signoff: 'विश्वास र कृतज्ञता सहित,\nNikhil Darjee & SecretsRevealed Sanctuary'
    },
    hi: {
      subject: 'आपकी प्रतिक्रिया के लिए धन्यवाद — SecretsRevealed',
      greeting: 'प्रिय ' + safeName + ',',
      body1: 'SecretsRevealed पर अपना फीडबैक साझा करने के लिए आपका हृदय से धन्यवाद! हमें आपका संदेश प्राप्त हो गया है।',
      body2: 'हमें आपको फिर से वेबसाइट पर देखकर बहुत खुशी होगी। परमेश्वर आपको भरपूर आशीष दे!',
      yourMsgLabel: 'आपका संदेश:',
      signoff: 'विश्वास और आभार के साथ,\nNikhil Darjee & SecretsRevealed Sanctuary'
    },
    bn: {
      subject: 'আপনার মতামতের জন্য ধন্যবাদ — SecretsRevealed',
      greeting: 'প্রিয় ' + safeName + ',',
      body1: 'SecretsRevealed-এ আপনার মতামত জানানোর জন্য আন্তরিক ধন্যবাদ! আমরা আপনার বার্তাটি পেয়েছি।',
      body2: 'আমরা আপনাকে আবার দেখতে পেলে আনন্দিত হব। ঈশ্বর আপনাকে আশীর্বাদ করুন!',
      yourMsgLabel: 'আপনার বার্তা:',
      signoff: 'বিশ্বাস ও কৃতজ্ঞতাসহ,\nNikhil Darjee & SecretsRevealed Sanctuary'
    }
  };
  const c = copies[lang] || copies.en;
  const plain = c.greeting + '\n\n' + c.body1 + '\n\n' + c.body2 + '\n\n' + c.yourMsgLabel + ' [' + (kind || 'Feedback') + ']\n"' + (message || '') + '"\n\n' + c.signoff;
  const html = '<div style="font-family:Georgia,serif;max-width:540px;margin:0 auto;padding:24px;background:#0d1322;color:#f4f6fb;border-radius:16px;border:1px solid #f4b942;">' +
    '<div style="font-size:12px;letter-spacing:2px;color:#f4b942;font-weight:bold;margin-bottom:8px;">SECRETSREVEALED SANCTUARY · READ · REFLECT · REVEAL</div>' +
    '<h2 style="color:#fff6e6;margin:0 0 12px 0;">' + c.greeting + '</h2>' +
    '<p style="color:#d6dff2;line-height:1.6;font-size:15px;">' + c.body1 + '</p>' +
    '<p style="color:#d6dff2;line-height:1.6;font-size:15px;">' + c.body2 + '</p>' +
    '<div style="margin:18px 0;padding:14px;background:#162038;border-left:4px solid #f4b942;border-radius:8px;color:#eef2fa;font-size:14px;">' +
    '<strong style="color:#f4b942;display:block;margin-bottom:4px;">' + c.yourMsgLabel + ' (' + (kind || 'Feedback') + ')</strong>' +
    '<em>"' + String(message || '').replace(/</g, '&lt;') + '"</em></div>' +
    '<hr style="border:none;border-top:1px solid rgba(255,255,255,0.12);margin:18px 0;" />' +
    '<p style="color:#f4b942;font-size:14px;white-space:pre-line;margin:0;">' + c.signoff + '</p></div>';
  return { subject: c.subject, plain: plain, html: html };
}

function respondJson(obj, callbackName) {
  const jsonStr = JSON.stringify(obj);
  if (callbackName) {
    return ContentService.createTextOutput(callbackName + '(' + jsonStr + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(jsonStr).setMimeType(ContentService.MimeType.JSON);
}

function handleRequest(e) {
  const p = parsePayload(e);
  const callbackName = p.callback ? String(p.callback).replace(/[^a-zA-Z0-9_$.]/g, '') : '';
  try {
    const action = String(p.action || '').trim().toLowerCase();
    const lang = String(p.lang || 'en').trim().toLowerCase();

    // ------------------------------------------------------------------------
    // 1. FETCH ALL 4 ISOLATED BOOK SECTIONS FROM GOOGLE SHEETS
    // ------------------------------------------------------------------------
    if (action === 'get_books') {
      const ss = getSpreadsheetSafely();
      const sections = { revelation_books: [], journal: [], ebooks: [], reflections: [] };
      if (ss) {
        Object.keys(SECTION_TABS).forEach(function(secId) {
          const sheet = ensureSectionSheet(ss, secId);
          const rows = sheet.getDataRange().getValues();
          for (let r = 1; r < rows.length; r++) {
            const row = rows[r];
            if (!row[0] || !row[3]) continue;
            let chapters = [];
            try { chapters = JSON.parse(row[12] || '[]'); } catch (err) {}
            sections[secId].push({
              id: String(row[0]),
              createdAt: String(row[1] || ''),
              sectionId: secId,
              title: String(row[3] || ''),
              author: String(row[4] || 'Nikhil Darjee'),
              publishMode: String(row[5] || 'direct'),
              description: String(row[6] || ''),
              cover: String(row[7] || ''),
              externalUrl: String(row[8] || ''),
              externalLabel: String(row[9] || 'Open Link ↗'),
              docType: String(row[10] || 'none'),
              docUrl: String(row[11] || ''),
              chapters: Array.isArray(chapters) ? chapters : [],
              featured: String(row[13]) === 'true',
              status: String(row[14] || 'published'),
              format: String(row[15] || 'Owner Edition')
            });
          }
        });
      }
      return respondJson({ ok: true, action: 'get_books', sections: sections }, callbackName);
    }

    // ------------------------------------------------------------------------
    // 2. PUBLISH OR UPDATE A BOOK IN ITS STRICTLY ISOLATED SECTION TAB
    // ------------------------------------------------------------------------
    if (action === 'publish_book' || action === 'update_book') {
      const ss = getSpreadsheetSafely();
      if (!ss) return respondJson({ ok: false, error: 'Spreadsheet not connected.' }, callbackName);
      const secId = SECTION_TABS[p.sectionId] ? p.sectionId : 'revelation_books';
      const sheet = ensureSectionSheet(ss, secId);
      const bookId = String(p.id || ('book-' + new Date().getTime()));
      const rowData = [
        bookId,
        String(p.createdAt || new Date().toISOString()),
        secId,
        String(p.title || 'Untitled'),
        String(p.author || 'Nikhil Darjee'),
        String(p.publishMode || 'direct'),
        String(p.description || ''),
        String(p.cover || ''),
        String(p.externalUrl || ''),
        String(p.externalLabel || 'Open Resource ↗'),
        String(p.docType || 'none'),
        String(p.docUrl || ''),
        typeof p.chapters === 'string' ? p.chapters : JSON.stringify(p.chapters || []),
        String(p.featured === true || p.featured === 'true'),
        String(p.status || 'published'),
        String(p.format || 'Owner Edition')
      ];

      // Update in place if ID already exists in this section tab
      const values = sheet.getDataRange().getValues();
      let updatedRow = -1;
      for (let r = 1; r < values.length; r++) {
        if (String(values[r][0]) === bookId) {
          updatedRow = r + 1;
          break;
        }
      }
      if (updatedRow > 0) {
        sheet.getRange(updatedRow, 1, 1, rowData.length).setValues([rowData]);
      } else {
        sheet.appendRow(rowData);
      }
      return respondJson({ ok: true, action: action, id: bookId, sectionId: secId, tab: SECTION_TABS[secId] }, callbackName);
    }

    // ------------------------------------------------------------------------
    // 3. DELETE A BOOK FROM ITS ISOLATED SECTION TAB
    // ------------------------------------------------------------------------
    if (action === 'delete_book') {
      const ss = getSpreadsheetSafely();
      const secId = SECTION_TABS[p.sectionId] ? p.sectionId : 'revelation_books';
      const bookId = String(p.id || '');
      let deleted = false;
      if (ss && bookId) {
        const sheet = ensureSectionSheet(ss, secId);
        const values = sheet.getDataRange().getValues();
        for (let r = values.length - 1; r >= 1; r--) {
          if (String(values[r][0]) === bookId) {
            sheet.deleteRow(r + 1);
            deleted = true;
            break;
          }
        }
      }
      return respondJson({ ok: true, action: 'delete_book', id: bookId, sectionId: secId, deleted: deleted }, callbackName);
    }

    // ------------------------------------------------------------------------
    // 4. SEND 6-DIGIT EMAIL OTP TO READER
    // ------------------------------------------------------------------------
    if (action === 'send_otp') {
      const email = String(p.email || p.replyEmail || '').trim();
      const name = String(p.name || 'Reader').trim();
      const phone = String(p.phone || '').trim();
      const otp = String(p.otp || '').trim();
      if (!email || !otp) return respondJson({ ok: false, error: 'Missing email or OTP code.' }, callbackName);

      const copy = getOtpEmailCopy(lang, name, otp);
      dispatchEmail(email, copy.subject, copy.plain, copy.html);

      try {
        const ss = getSpreadsheetSafely();
        if (ss) {
          const uSheet = ss.getSheetByName('Users') || ss.insertSheet('Users');
          if (uSheet.getLastRow() === 0) uSheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Language', 'Status']);
          uSheet.appendRow([new Date(), name, email, phone, lang, 'OTP Sent']);
        }
      } catch (sheetErr) {}

      return respondJson({ ok: true, action: 'send_otp', emailSent: true, recipient: email }, callbackName);
    }

    // ------------------------------------------------------------------------
    // 5. FEEDBACK SUBMISSION -> VISITOR CONFIRMATION + OWNER NOTIFICATION
    // ------------------------------------------------------------------------
    if (action === 'feedback') {
      const visitorEmail = String(p.email || p.replyEmail || '').trim();
      const visitorName = String(p.name || 'Reader').trim();
      const section = String(p.section || 'Website').trim();
      const resource = String(p.itemTitle || p.resource || '—').trim();
      const kind = String(p.kind || p.type || 'General feedback').trim();
      const rating = String(p.rating || '5').trim();
      const message = String(p.message || '').trim();

      let visitorSent = false;
      if (visitorEmail && visitorEmail.indexOf('@') !== -1) {
        const confirmCopy = getFeedbackConfirmationCopy(lang, visitorName, kind, message);
        visitorSent = dispatchEmail(visitorEmail, confirmCopy.subject, confirmCopy.plain, confirmCopy.html, OWNER_EMAIL);
      }

      const ownerBody = 'New website feedback\n\nSection: ' + section + '\nResource: ' + resource +
        '\nType: ' + kind + '\nRating: ' + rating + '/5\nName: ' + visitorName +
        '\nReply email: ' + (visitorEmail || 'No email') + '\nLanguage: ' + lang.toUpperCase() +
        '\n\nMessage:\n' + message;
      const ownerSent = dispatchEmail(OWNER_EMAIL, '[SecretsRevealed] ' + kind + ' — ' + section, ownerBody, null, visitorEmail || undefined);

      try {
        const ss = getSpreadsheetSafely();
        if (ss) {
          const sheet = ss.getSheetByName('Feedback') || ss.insertSheet('Feedback');
          sheet.appendRow([new Date(), section, resource, kind, rating, visitorName, visitorEmail, message]);
        }
      } catch (sheetErr) {}

      return respondJson({ ok: true, action: 'feedback', emailSent: true, visitorEmailSent: visitorSent, ownerEmailSent: ownerSent }, callbackName);
    }

    // ------------------------------------------------------------------------
    // 6. QUIZ SCORE LOGGING
    // ------------------------------------------------------------------------
    if (action === 'quiz') {
      try {
        const ss = getSpreadsheetSafely();
        if (ss) {
          const sheet = ss.getSheetByName('Quiz Results') || ss.insertSheet('Quiz Results');
          sheet.appendRow([new Date(), p.quizTitle || 'The Word Challenge', p.score || 0, p.total || 20]);
        }
      } catch (sheetErr) {}
      return respondJson({ ok: true, action: 'quiz' }, callbackName);
    }

    return respondJson({
      ok: true,
      status: 'SecretsRevealed v4 Full-Stack Sanctuary Backend Active',
      isolatedTabs: SECTION_TABS,
      supports: ['get_books', 'publish_book', 'update_book', 'delete_book', 'send_otp', 'feedback', 'quiz']
    }, callbackName);

  } catch (err) {
    return respondJson({ ok: false, error: String(err) }, callbackName);
  }
}
