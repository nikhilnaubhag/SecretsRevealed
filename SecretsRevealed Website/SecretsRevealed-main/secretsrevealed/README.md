# SecretsRevealed — website starter

A responsive, celestial-themed Christian reading website branded **SecretsRevealed** and credited to **Nikhil Darjee**. It includes a searchable library, Revelation feature, Bible-journal shelf, interactive Bible quiz, newsroom, document reader modal, and feedback forms available from the main sections and footer.

## What is included

- `index.html` — website structure and accessible dialogs.
- `styles.css` — responsive visual design, a CSS 3D Bible welcome sequence, verse-loop styling, book-cover artwork, mobile layouts and reduced-motion support.
- `app.js` — search, content filters, optional image covers, Google Drive/Docs previews, quiz behavior, feedback form, language/theme preferences and optional Google Apps Script connection.
- `translations.js` — phrase translations for the site interface in Hindi, Nepali and Bengali; English remains the source language.
- `favicon.svg` — small site icon.
- `google-apps-script/Code.gs` — Google Sheets bridge for published content, feedback, optional feedback email alerts and quiz scores.
- `google-apps-script/appsscript.json` — Apps Script runtime settings.

The site uses plain HTML, CSS and browser JavaScript, with Google Apps Script as a lightweight backend. Java and JavaScript are different languages; a Java/Spring server would add deployment work without improving this simple Google Drive + Google Sheets workflow. No npm install or build step is needed.

## Important publishing rule

**Keep your Google Sheet private.** The website shows only rows in the `Content` tab whose `Status` value is exactly `Published`. Visitors can read documents you intentionally share publicly, take the quiz, and submit feedback; they do not receive editing access to the spreadsheet.

Do not put private drafts, personal details or confidential information in published documents. A Drive document marked **Anyone with the link — Viewer** can be opened by anyone who receives its link. That sharing setting is needed for a public reading website, so only use it on resources you intend to make public.

## Setup: connect Google Drive and Google Sheets

### 1. Create the private spreadsheet

1. Sign into the Google account you will use to own the website content.
2. Create a new Google Sheet named `SecretsRevealed Content & Feedback`.
3. Copy the spreadsheet ID from its URL. It is the text between `/d/` and `/edit` in a URL such as `https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit`.
4. Keep this spreadsheet private. Do **not** share the spreadsheet itself with the public.

### 2. Install the Apps Script bridge

1. From the new Sheet, open **Extensions → Apps Script** (or create a project at `script.google.com` and use the same spreadsheet ID).
2. Replace the starter contents of `Code.gs` with the contents of `google-apps-script/Code.gs` in this project.
3. In the first lines of `Code.gs`, replace `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` with your spreadsheet ID. Keep `OWNER_EMAIL` set to `nikhilnaubhag777@gmail.com` or change it to the email where you want feedback alerts.
4. Save the project.
5. In the function selector, choose `setupSecretsRevealed` and click **Run**. Approve the requested Google permissions. This creates three tabs: `Content`, `Feedback`, and `Quiz Results`.
6. Choose `authorizeSecretsRevealed` and click **Run** once. This checks the sheet connection and requests the email-notification permission used by feedback alerts.

If you prefer, you can copy `appsscript.json` settings into the Apps Script project's manifest file (Project Settings → Show `appsscript.json` manifest file).

### 3. Deploy the bridge as a web app

1. In Apps Script, click **Deploy → New deployment**.
2. Select the gear icon/type **Web app**.
3. Description: `SecretsRevealed public content and feedback`.
4. **Execute as:** Me (your account).
5. **Who has access:** Anyone, if your Google account permits this. This allows the site to fetch published rows and accept feedback. The script does not provide a public method to edit content.
6. Click **Deploy**, approve any authorization prompt, and copy the **Web app URL** ending in `/exec`.
7. Test that URL by opening it in a browser. It should return JSON with `ok: true` and `items: []` before you add content. You can also test the health endpoint by adding `?action=health` to the URL.

If your school/work Google account does not allow public Apps Script web apps, use a personal Google account you control or ask the account administrator about deployment restrictions.

### 4. Connect your website to the bridge

Open `app.js` and find:

```js
const CONFIG = {
  appsScriptUrl: "",
  ownerEmail: "nikhilnaubhag777@gmail.com"
};
```

Paste your deployed Web app URL between the quotes for `appsScriptUrl`. Save the file. The website will then load its published catalog from your Sheet and submit feedback there. Feedback is recorded in the private `Feedback` tab and the script attempts to send an email notification to the owner. Quiz scores are recorded in `Quiz Results`.

When the endpoint is blank, the site intentionally stays in **preview mode** with clearly marked sample cards. Feedback opens an email draft rather than saving to Sheets.


### Add an attractive cover image to a library resource

The `Cover` column in the private `Content` sheet is supported. You can leave it blank to use the built-in generated book-cover design, enter a direct HTTPS image URL, or paste a Google Drive file-sharing URL for a cover image. For Drive images, make the image itself available to viewers (not the spreadsheet), then paste the sharing URL into `Cover`. The front-end converts standard Drive file links to thumbnail URLs. Keep the `Cover` cell empty while using the automatic cover artwork.

## How to publish a book, journal, article or newspaper

1. Upload your PDF or other file to Google Drive. Google Docs, Google Sheets, Google Slides and PDFs can be linked.
2. For a resource that should be publicly readable, set its own sharing to **Anyone with the link — Viewer**. Do not share the entire catalog spreadsheet.
3. Copy the document's URL.
4. In the private spreadsheet's `Content` tab, add one row using the header columns below. Do not change the header names.
5. Set `Status` to `Published` when you are ready for visitors to see it. Use any other status (for example `Draft`) while preparing it.
6. Refresh the site. Published content appears in the library and is automatically grouped into the relevant journal, Revelation or news area based on the `Category`.

| Column | What to enter | Example |
|---|---|---|
| `ID` | Unique short ID, no spaces preferred | `rev-study-01` |
| `Title` | Public resource title | `Revelation: Chapter One` |
| `Category` | Used to group the resource | `Revelation`, `Bible Journal`, `E-book`, `News & Articles`, `Study Notes` |
| `Description` | A short summary | `Notes on Revelation 1 and its opening vision.` |
| `Title (Hindi)` | Optional Hindi title | `प्रकाशितवाक्य: पहला अध्याय` |
| `Title (Nepali)` | Optional Nepali title | `प्रकाशको पुस्तक: पहिलो अध्याय` |
| `Title (Bengali)` | Optional Bengali title | `প্রকাশিত বাক্য: প্রথম অধ্যায়` |
| `Category (Hindi)` / `(Nepali)` / `(Bengali)` | Optional translated category label | Localized category names |
| `Description (Hindi)` / `(Nepali)` / `(Bengali)` | Optional translated summary | Localized resource summary |
| `Document URL` | Google Drive/Docs/Sheets/Slides view link | `https://docs.google.com/document/d/.../edit` |
| `Format` | Short format label | `PDF`, `Journal`, `E-book`, `Article` |
| `Status` | Use `Published` to show it publicly | `Published` |
| `Featured` | Optional highlight flag | `Yes` or `No` |
| `Cover` | Optional short symbol/emoji | `✦`, `✝`, `❧` |
| `Updated At` | Optional display date or revision label | `18 Oct 2026` |

For an existing `Content` tab, add these optional translation columns manually to the first row if they are not present: `Title (Hindi)`, `Title (Nepali)`, `Title (Bengali)`, `Category (Hindi)`, `Category (Nepali)`, `Category (Bengali)`, `Description (Hindi)`, `Description (Nepali)`, and `Description (Bengali)`. Running setup again does not add columns to a tab that already has headers.

The `Document URL` should point to the individual resource, not to your private content spreadsheet. The website tries to show Google Drive and Google Docs previews inside a reading dialog. Some document types or Google sharing policies may require visitors to click **Open original** instead.

## How to read visitor feedback

- Open your private spreadsheet and select the `Feedback` tab. Each submission includes timestamp, section, resource (if any), feedback type, rating, optional name/email and the message.
- Feedback notifications are sent to `nikhilnaubhag777@gmail.com` when Apps Script email permission and quota allow it. The sheet remains the primary record if email fails.
- To work with the responses in Excel, use **File → Download → Microsoft Excel (.xlsx)** in Google Sheets.
- Quiz scores are stored in the `Quiz Results` tab. The quiz does not require a name or email.

## Put the website online

This folder is a static website, so you can host it on **GitHub Pages**, **Netlify**, or another static host. For a non-technical first deployment, Netlify's manual deploy workflow can publish the folder by drag-and-drop; GitHub Pages is a good option if you want to keep the source in a repository. Hosting dashboards and choices can change, so follow the host's current instructions when you publish.

Before you launch, check these items:

- `appsScriptUrl` is set to your deployed `/exec` URL.
- The Web app's access setting allows intended public visitors.
- The Google Sheet itself is still private.
- Only resources intended for the public have public viewer links.
- At least one row has `Status` set to `Published` and its URL opens in a signed-out/incognito window.
- Feedback arrives in the `Feedback` tab and the owner email is correct.
- Replace sample cards with your actual writing. Sample cards are not real published writings.

## Practical limitations and privacy

- The public Apps Script endpoint can be called by anyone, as required for a public site. Basic input limits and a hidden bot-trap field are included, but this is not enterprise-grade spam protection or authentication. For a high-traffic site, add stronger rate-limiting and abuse controls.
- The site is read-only for visitors because content editing happens in your private Google Sheet and Google Drive. No public upload/edit interface is exposed.
- Email notifications depend on Google's authorization and sending quota. Check the Sheet if a notification is missing.
- This starter does not scrape LinkedIn or claim to have reviewed your profile. The design uses the project details provided in the request.


## Recent UI enhancements

- Uses the supplied emblem beside the native SecretsRevealed wordmark; the emblem is slightly larger and aligned with the text.
- Includes an About SecretsRevealed introduction beneath the main headline.
- Includes 13 dark colour themes; no white page-background theme is offered.
- Translates all fixed website interface text into English, Hindi, Nepali and Bengali, including navigation, all homepage sections, library filters, dynamically rendered resource cards, quiz questions/options/feedback, feedback forms, reader labels, footer, accessibility labels and placeholders. Language selection is built in and does not depend on the browser translate feature.
- Optional language-specific resource columns (`Title (Hindi)`, `Title (Nepali)`, `Title (Bengali)`, plus matching `Description (...)` and `Category (...)` columns) can translate custom library-card content. Resource documents opened inside Google Drive/Docs previews still use their own source language unless a translated document is provided or a browser translation tool is used.
- The welcome sequence animates a Bible opening and a dove flying upward toward the sky; the hero Scripture loop remains intact.
- Responsive header, controls, hero layout and typography adjustments for desktop, tablet and phone screens.
