/* ==========================================================================
   SECRETSREVEALED v5 — CORE DATA ENGINE
   - 50 Curated Deep Bible Verse Wallpapers (iPhone / Android / Desktop HD)
   - Built-In 5-Version Bible Reader (NIV, NKJV, Hindi BSI, Nepali BSI, Bengali BSI)
   - 4 Strictly Isolated Book Sections (Zero Mixing) + IndexedDB Binary Vault
   - Spiritual Progress Tracker + Community Prayer Wall + 100-Level Quiz
   ========================================================================== */

const CONFIG = {
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbx8I9CTN_cgxUEFKbGyMwLWMvFHI4fbJmlopL-5SXIC7Hr0F9EI496Ytal-4FKfPZfY/exec",
  spreadsheetId: "1_EyDHOi2WmQoNw1MVzqcx3j55uW-K_MTAjPxFJSRkeU",
  ownerEmailHash: "48faff779b71613cf7872137f143d57d3f10117199e61d8f47ba03b48366e93a",
  vaultKeyPass: "Secrets2026"
};

const COVERS = {
  revelation_books: "assets/cover-revelation-3d.jpg",
  journal: "assets/cover-journal-3d.jpg",
  ebooks: "assets/cover-ebooks-3d.jpg",
  reflections: "assets/cover-reflections-3d.jpg"
};

const WALLPAPER_BACKDROPS = [
  { id: "dawn", label: "Golden Dawn", src: "assets/wp-dawn.jpg", textColor: "#fff8eb", accent: "#f4c465" },
  { id: "himalaya", label: "Misty Peaks", src: "assets/wp-himalaya.jpg", textColor: "#fffaf0", accent: "#f5cb75" },
  { id: "cathedral", label: "Alabaster Arch", src: "assets/wp-cathedral.jpg", textColor: "#231910", accent: "#9e5e12", light: true },
  { id: "aurora", label: "Midnight Aurora", src: "assets/wp-aurora.jpg", textColor: "#f7f9ff", accent: "#f4c465" },
  { id: "archway", label: "Celestial Gate", src: "assets/cover-revelation-3d.jpg", textColor: "#fff8eb", accent: "#f4b942" },
  { id: "olive", label: "Olive Sanctuary", src: "assets/cover-journal-3d.jpg", textColor: "#231910", accent: "#a86614", light: true },
  { id: "lantern", label: "Twilight Scroll", src: "assets/cover-ebooks-3d.jpg", textColor: "#eef9fc", accent: "#56e0d4" },
  { id: "prism", label: "Sunrise Prism", src: "assets/cover-reflections-3d.jpg", textColor: "#fff8eb", accent: "#f4c465" }
];

/* 50 DEEP, MOTIVATING BIBLE VERSE WALLPAPERS (iPhone, Android & Computer HD) */
const DEFAULT_WALLPAPERS = [
  // STRENGTH & COURAGE (10)
  { id: "wp-01", mood: "Strength", bg: "dawn", ref: "ISAIAH 41:10", verse: "Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you." },
  { id: "wp-02", mood: "Strength", bg: "himalaya", ref: "JOSHUA 1:9", verse: "Be strong and courageous. Do not be frightened, for the Lord your God is with you wherever you go." },
  { id: "wp-03", mood: "Strength", bg: "aurora", ref: "ISAIAH 40:31", verse: "They who wait for the Lord shall renew their strength; they shall mount up with wings like eagles." },
  { id: "wp-04", mood: "Strength", bg: "archway", ref: "PHILIPPIANS 4:13", verse: "I can do all things through Christ who strengthens me." },
  { id: "wp-05", mood: "Strength", bg: "prism", ref: "2 TIMOTHY 1:7", verse: "For God gave us a spirit not of fear but of power and love and self-control." },
  { id: "wp-06", mood: "Strength", bg: "cathedral", ref: "PSALM 46:1", verse: "God is our refuge and strength, a very present help in trouble." },
  { id: "wp-07", mood: "Strength", bg: "lantern", ref: "EXODUS 14:14", verse: "The Lord will fight for you, and you have only to be silent." },
  { id: "wp-08", mood: "Strength", bg: "dawn", ref: "PSALM 27:1", verse: "The Lord is my light and my salvation; whom shall I fear? The Lord is the stronghold of my life." },
  { id: "wp-09", mood: "Strength", bg: "himalaya", ref: "DEUTERONOMY 31:6", verse: "He will not leave you or forsake you. Be strong and courageous." },
  { id: "wp-10", mood: "Strength", bg: "aurora", ref: "2 CORINTHIANS 12:9", verse: "My grace is sufficient for you, for my power is made perfect in weakness." },

  // PEACE & STILLNESS (10)
  { id: "wp-11", mood: "Peace", bg: "himalaya", ref: "PSALM 46:10", verse: "Be still, and know that I am God." },
  { id: "wp-12", mood: "Peace", bg: "dawn", ref: "JOHN 14:27", verse: "Peace I leave with you; my peace I give to you. Let not your hearts be troubled, neither let them be afraid." },
  { id: "wp-13", mood: "Peace", bg: "cathedral", ref: "MATTHEW 11:28", verse: "Come to me, all who labor and are heavy laden, and I will give you rest." },
  { id: "wp-14", mood: "Peace", bg: "lantern", ref: "PSALM 23:2–3", verse: "He leads me beside still waters. He restores my soul." },
  { id: "wp-15", mood: "Peace", bg: "aurora", ref: "PHILIPPIANS 4:6–7", verse: "Do not be anxious about anything... and the peace of God, which surpasses all understanding, will guard your hearts." },
  { id: "wp-16", mood: "Peace", bg: "olive", ref: "ISAIAH 26:3", verse: "You keep him in perfect peace whose mind is stayed on you, because he trusts in you." },
  { id: "wp-17", mood: "Peace", bg: "prism", ref: "1 PETER 5:7", verse: "Cast all your anxieties on him, because he cares for you." },
  { id: "wp-18", mood: "Peace", bg: "dawn", ref: "PSALM 4:8", verse: "In peace I will both lie down and sleep; for you alone, O Lord, make me dwell in safety." },
  { id: "wp-19", mood: "Peace", bg: "himalaya", ref: "PSALM 121:1–2", verse: "I lift up my eyes to the hills. From where does my help come? My help comes from the Lord." },
  { id: "wp-20", mood: "Peace", bg: "archway", ref: "NUMBERS 6:24–26", verse: "The Lord bless you and keep you; the Lord lift up his countenance upon you and give you peace." },

  // HOPE & PURPOSE (10)
  { id: "wp-21", mood: "Hope", bg: "dawn", ref: "JEREMIAH 29:11", verse: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope." },
  { id: "wp-22", mood: "Hope", bg: "aurora", ref: "ROMANS 8:28", verse: "And we know that for those who love God all things work together for good." },
  { id: "wp-23", mood: "Hope", bg: "prism", ref: "LAMENTATIONS 3:22–23", verse: "His mercies never come to an end; they are new every morning; great is your faithfulness." },
  { id: "wp-24", mood: "Hope", bg: "cathedral", ref: "PROVERBS 3:5–6", verse: "Trust in the Lord with all your heart, and do not lean on your own understanding. He will make straight your paths." },
  { id: "wp-25", mood: "Hope", bg: "himalaya", ref: "PSALM 30:5", verse: "Weeping may tarry for the night, but joy comes with the morning." },
  { id: "wp-26", mood: "Hope", bg: "archway", ref: "REVELATION 21:4", verse: "He will wipe away every tear from their eyes, and death shall be no more." },
  { id: "wp-27", mood: "Hope", bg: "lantern", ref: "ROMANS 15:13", verse: "May the God of hope fill you with all joy and peace in believing." },
  { id: "wp-28", mood: "Hope", bg: "olive", ref: "ISAIAH 43:19", verse: "Behold, I am doing a new thing; now it springs forth, do you not perceive it? I will make a way in the wilderness." },
  { id: "wp-29", mood: "Hope", bg: "dawn", ref: "HEBREWS 11:1", verse: "Now faith is the assurance of things hoped for, the conviction of things not seen." },
  { id: "wp-30", mood: "Hope", bg: "aurora", ref: "JOHN 1:5", verse: "The light shines in the darkness, and the darkness has not overcome it." },

  // GRACE & LOVE (10)
  { id: "wp-31", mood: "Grace", bg: "archway", ref: "JOHN 3:16", verse: "For God so loved the world, that he gave his only Son, that whoever believes in him should have eternal life." },
  { id: "wp-32", mood: "Grace", bg: "dawn", ref: "ROMANS 8:38–39", verse: "Nothing in all creation will be able to separate us from the love of God in Christ Jesus our Lord." },
  { id: "wp-33", mood: "Grace", bg: "cathedral", ref: "EPHESIANS 2:8", verse: "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God." },
  { id: "wp-34", mood: "Grace", bg: "olive", ref: "1 CORINTHIANS 13:4–7", verse: "Love is patient and kind... Love bears all things, believes all things, hopes all things, endures all things." },
  { id: "wp-35", mood: "Grace", bg: "prism", ref: "ZEPHANIAH 3:17", verse: "The Lord your God is in your midst, a mighty one who will save; he will rejoice over you with gladness." },
  { id: "wp-36", mood: "Grace", bg: "himalaya", ref: "PSALM 139:14", verse: "I praise you, for I am fearfully and wonderfully made. Wonderful are your works." },
  { id: "wp-37", mood: "Grace", bg: "aurora", ref: "COLOSSIANS 1:26", verse: "The mystery hidden for ages and generations, but now revealed to his saints." },
  { id: "wp-38", mood: "Grace", bg: "lantern", ref: "1 JOHN 4:19", verse: "We love because he first loved us." },
  { id: "wp-39", mood: "Grace", bg: "dawn", ref: "PSALM 103:12", verse: "As far as the east is from the west, so far does he remove our transgressions from us." },
  { id: "wp-40", mood: "Grace", bg: "archway", ref: "ROMANS 8:1", verse: "There is therefore now no condemnation for those who are in Christ Jesus." },

  // NIGHT PRAYERS & REVELATION (10)
  { id: "wp-41", mood: "Night", bg: "aurora", ref: "PSALM 91:1–2", verse: "He who dwells in the shelter of the Most High will abide in the shadow of the Almighty." },
  { id: "wp-42", mood: "Night", bg: "lantern", ref: "PSALM 119:105", verse: "Your word is a lamp to my feet and a light to my path." },
  { id: "wp-43", mood: "Night", bg: "archway", ref: "REVELATION 1:8", verse: "I am the Alpha and the Omega, says the Lord God, who is and who was and who is to come." },
  { id: "wp-44", mood: "Night", bg: "aurora", ref: "PSALM 121:4", verse: "Behold, he who keeps Israel will neither slumber nor sleep." },
  { id: "wp-45", mood: "Night", bg: "himalaya", ref: "PSALM 63:6", verse: "When I remember you upon my bed, and meditate on you in the watches of the night." },
  { id: "wp-46", mood: "Night", bg: "dawn", ref: "REVELATION 3:20", verse: "Behold, I stand at the door and knock. If anyone hears my voice and opens the door, I will come in." },
  { id: "wp-47", mood: "Night", bg: "lantern", ref: "PSALM 139:12", verse: "Even the darkness is not dark to you; the night is bright as the day." },
  { id: "wp-48", mood: "Night", bg: "prism", ref: "MATTHEW 5:14", verse: "You are the light of the world. A city set on a hill cannot be hidden." },
  { id: "wp-49", mood: "Night", bg: "cathedral", ref: "MICAH 6:8", verse: "Do justice, love kindness, and walk humbly with your God." },
  { id: "wp-50", mood: "Night", bg: "archway", ref: "REVELATION 22:13", verse: "I am the Alpha and the Omega, the first and the last, the beginning and the end." }
];

/* ==========================================================================
   BUILT-IN 5-VERSION BIBLE READER (NIV, NKJV, HINDI BSI, NEPALI BSI, BENGALI BSI)
   ========================================================================== */
const BIBLE_VERSIONS = [
  { id: "niv", label: "English (NIV)" },
  { id: "nkjv", label: "English (NKJV)" },
  { id: "hi_bsi", label: "हिन्दी (Hindi BSI)" },
  { id: "ne_bsi", label: "नेपाली (Nepali BSI)" },
  { id: "bn_bsi", label: "বাংলা (Bengali BSI)" }
];

const BIBLE_LIBRARY = [
  {
    id: "psalm-23", book: "Psalms", chapter: 23, testament: "OT", title: "Psalm 23 — The Good Shepherd",
    verses: {
      niv: [
        "1 The Lord is my shepherd, I lack nothing.",
        "2 He makes me lie down in green pastures, he leads me beside quiet waters,",
        "3 he refreshes my soul. He guides me along the right paths for his name’s sake.",
        "4 Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
        "5 You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows.",
        "6 Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the Lord forever."
      ],
      nkjv: [
        "1 The Lord is my shepherd; I shall not want.",
        "2 He makes me to lie down in green pastures; He leads me beside the still waters.",
        "3 He restores my soul; He leads me in the paths of righteousness for His name’s sake.",
        "4 Yea, though I walk through the valley of the shadow of death, I will fear no evil; for You are with me; Your rod and Your staff, they comfort me.",
        "5 You prepare a table before me in the presence of my enemies; You anoint my head with oil; my cup runs over.",
        "6 Surely goodness and mercy shall follow me all the days of my life; and I will dwell in the house of the Lord forever."
      ],
      hi_bsi: [
        "1 यहोवा मेरा चरवाहा है, मुझे कुछ घटी न होगी।",
        "2 वह मुझे हरी हरी चराइयों में बैठाता है; वह मुझे सुखदाई जल के झरने के पास ले चलता है;",
        "3 वह मेरे जी में जी ले आता है। धर्म के मार्गों में वह अपने नाम के निमित्त मेरी अगुवाई करता है।",
        "4 चाहे मैं घोर अन्धकार से भरी हुई तराई में होकर चलूं, तौभी हानि से न डरूंगा; क्योंकि तू मेरे साथ रहता है; तेरे सोंटे और तेरी लाठी से मुझे शान्ति मिलती है।",
        "5 तू मेरे सताने वालों के सामने मेरे लिये मेज बिछाता है; तू ने मेरे सिर पर तेल मला है, मेरा कटोरा उमण्ड रहा है।",
        "6 निश्चय भलाई और करुणा जीवन भर मेरे साथ साथ बनी रहेंगी; और मैं यहोवा के धाम में सर्वदा वास करूंगा।"
      ],
      ne_bsi: [
        "१ परमप्रभु मेरो गोठालो हुनुहुन्छ, मलाई केहीको खाँचो हुनेछैन।",
        "२ उहाँले मलाई हरियो खर्कमा सुताउनुहुन्छ, उहाँले मलाई शान्त पानीको छेउमा डोर्याउनुहुन्छ।",
        "३ उहाँले मेरो प्राणलाई ताजा पार्नुहुन्छ। आफ्नो नाउँको खातिर उहाँले मलाई धार्मिकताका मार्गमा अगुवाइ गर्नुहुन्छ।",
        "४ मृत्युको छायाको अँध्यारो उपत्यका भएर जानुपरे तापनि म कुनै खराबीदेखि डराउनेछैनँ, किनकि तपाईं मसित हुनुहुन्छ; तपाईंको लट्ठी र तपाईंको छडीले मलाई सान्त्वना दिन्छन्।",
        "५ मेरा शत्रुहरूका सामु तपाईंले मेरो निम्ति भोज तयार पार्नुहुन्छ। तपाईंले मेरो शिरमा तेल अभिषेक गर्नुभएको छ; मेरो कचौरा भरिएर पोखिन्छ।",
        "६ निश्चय नै भलाइ र करुणा मेरो जीवनभरि मेरो पछि लाग्नेछन्, र म सदाकाल परमप्रभुको भवनमा वास गर्नेछु।"
      ],
      bn_bsi: [
        "১ সদাপ্রভু আমার মেষপালক; আমার কিছুতেই অভাব হইবে না।",
        "২ তিনি আমাকে হরিৎ চরাণীতে শয়ন করান; বিশ্রামের জলচর পাশে আমাকে লইয়া যান।",
        "৩ তিনি আমার প্রাণ ফিরাইয়া আনেন; নিজ নামের অনুরোধে ধর্মপথে আমাকে চালান।",
        "৪ হাঁ, মৃত্যুচ্ছায়ার উপত্যকা দিয়া গমন করিলেও আমি কোন অমঙ্গলের ভয় করিব না; কেননা তুমি আমার সঙ্গে সঙ্গে আছ; তোমার দণ্ড ও তোমার যষ্টি, সে সকলই আমাকে সান্ত্বনা দেয়।",
        "৫ তুমি আমার শত্রুদের সম্মুখে আমার জন্য মেজ প্রস্তুত কর; তুমি তৈল দ্বারা আমার মস্তক অভিষেক করিয়াছ; আমার পানপাত্র উছলিয়া পড়িতেছে।",
        "৬ নিশ্চয় মঙ্গল ও দয়া আমার জীবনের সকল দিন আমার পশ্চাদ্বর্তী হইবে; আর আমি চিরকাল সদাপ্রভুর গৃহে বাস করিব।"
      ]
    }
  },
  {
    id: "psalm-91", book: "Psalms", chapter: 91, testament: "OT", title: "Psalm 91 — Shelter of the Most High",
    verses: {
      niv: [
        "1 Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty.",
        "2 I will say of the Lord, “He is my refuge and my fortress, my God, in whom I trust.”",
        "4 He will cover you with his feathers, and under his wings you will find refuge; his faithfulness will be your shield and rampart.",
        "11 For he will command his angels concerning you to guard you in all your ways."
      ],
      nkjv: [
        "1 He who dwells in the secret place of the Most High shall abide under the shadow of the Almighty.",
        "2 I will say of the Lord, “He is my refuge and my fortress; my God, in Him I will trust.”",
        "4 He shall cover you with His feathers, and under His wings you shall take refuge; His truth shall be your shield and buckler.",
        "11 For He shall give His angels charge over you, to keep you in all your ways."
      ],
      hi_bsi: [
        "1 जो परमप्रधान के छाए हुए स्थान में बैठा रहे, वह सर्वशक्तिमान की छाया में ठिकाना पाएगा।",
        "2 मैं यहोवा के विषय कहूंगा, कि वह मेरा शरणस्थान और गढ़ है; वह मेरा परमेश्वर है, मैं उस पर भरोसा रखूंगा।",
        "4 वह तुझे अपने पंखों की आड़ में ले लेगा, और तू उसके परों के नीचे शरण पाएगा; उसकी सच्चाई तेरे लिये ढाल और झिलम ठहरेगी।",
        "11 क्योंकि वह अपने दूतों को तेरे निमित्त आज्ञा देगा, कि जहां कहीं तू जाए वे तेरी रक्षा करें।"
      ],
      ne_bsi: [
        "१ जो सर्वोच्चको गुप्त स्थानमा वास गर्छ, त्यो सर्वशक्तिमानको छायामुनि रहनेछ।",
        "२ म परमप्रभुको विषयमा भन्नेछु, “उहाँ मेरो शरणस्थान र मेरो किल्ला हुनुहुन्छ; मेरा परमेश्वर, जसमाथि म भरोसा राख्छु।”",
        "४ उहाँले तिमीलाई आफ्ना प्वाँखहरूले ढाक्नुहुनेछ, र उहाँका पखेटामुनि तिमीले शरण पाउनेछौ; उहाँको सत्यता तिम्रो ढाल र कवच हुनेछ।",
        "११ किनकि उहाँले तिम्रा सबै मार्गमा तिम्रो रक्षा गर्न आफ्ना स्वर्गदूतहरूलाई आज्ञा दिनुहुनेछ।"
      ],
      bn_bsi: [
        "১ যে ব্যক্তি পরাৎপরের অন্তরালে বাস করে, সে সর্বশক্তিমানের ছায়ায় অবস্থিতি করিবে।",
        "২ আমি সদাপ্রভুর বিষয়ে বলিব, তিনি আমার আশ্রয় ও আমার দুর্গ, আমার ঈশ্বর, আমি তাঁহাতেই নির্ভর করিব।",
        "৪ তিনি আপনার পক্ষদ্বারা তোমাকে আচ্ছাদন করিবেন, তাঁহার পক্ষের তলে তুমি আশ্রয় পাইবে; তাঁহার সত্যতা ঢাল ও বর্মস্বরূপ।",
        "১১ কেননা তিনি তোমার পক্ষে আপন দূতগণকে আজ্ঞা দিবেন, যেন তাঁহারা তোমার সমস্ত পথে তোমাকে রক্ষা করেন।"
      ]
    }
  },
  {
    id: "john-3", book: "John", chapter: 3, testament: "NT", title: "John 3 — Born Again & God's Love",
    verses: {
      niv: [
        "16 For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
        "17 For God did not send his Son into the world to condemn the world, but to save the world through him.",
        "19 This is the verdict: Light has come into the world, but people loved darkness instead of light.",
        "21 Whoever lives by the truth comes into the light, so that it may be seen plainly that what they have done has been done in the sight of God."
      ],
      nkjv: [
        "16 For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.",
        "17 For God did not send His Son into the world to condemn the world, but that the world through Him might be saved.",
        "19 And this is the condemnation, that the light has come into the world, and men loved darkness rather than light.",
        "21 But he who does the truth comes to the light, that his deeds may be clearly seen, that they have been done in God."
      ],
      hi_bsi: [
        "16 क्योंकि परमेश्वर ने जगत से ऐसा प्रेम रखा कि उसने अपना एकलौता पुत्र दे दिया, ताकि जो कोई उस पर विश्वास करे, वह नाश न हो, परन्तु अनन्त जीवन पाए।",
        "17 परमेश्वर ने अपने पुत्र को जगत में इसलिये नहीं भेजा, कि जगत पर दण्ड की आज्ञा दे परन्तु इसलिये कि जगत उसके द्वारा उद्धार पाए।",
        "19 और दण्ड की आज्ञा का कारण यह है कि ज्योति जगत में आई है, और मनुष्यों ने अन्धकार को ज्योति से अधिक प्रिय जाना।",
        "21 परन्तु जो सच्चाई पर चलता है, वह ज्योति के निकट आता है, ताकि उसके काम प्रगट हों, कि वे परमेश्वर की ओर से किए गए हैं।"
      ],
      ne_bsi: [
        "१६ किनभने परमेश्वरले संसारलाई यति प्रेम गर्नुभयो, कि उहाँले आफ्ना एकमात्र पुत्र दिनुभयो, ताकि उहाँमाथि विश्वास गर्ने कोही पनि नाश नहोस्, तर त्यसले अनन्त जीवन पाओस्।",
        "१७ किनकि परमेश्वरले संसारलाई दोषी ठहराउन होइन, तर उहाँद्वारा संसारले उद्धार पाओस् भनेर आफ्ना पुत्रलाई संसारमा पठाउनुभयो।",
        "१९ अनि इन्साफ यही हो: ज्योति संसारमा आएको छ, तर मानिसहरूले ज्योतिलाई भन्दा अँध्यारोलाई बढी प्रेम गरे।",
        "२१ तर जसले सत्यको अभ्यास गर्छ, त्यो ज्योतिकहाँ आउँछ, ताकि उसका कामहरू परमेश्वरमा गरिएका हुन् भनी स्पष्ट देखियोस्।"
      ],
      bn_bsi: [
        "১৬ কারণ ঈশ্বর জগৎকে এমন প্রেম করিলেন যে, আপনার একজাত পুত্রকে দান করিলেন, যেন, যে কেহ তাঁহাতে বিশ্বাস করে, সে বিনষ্ট না হয়, কিন্তু অনন্ত জীবন পায়।",
        "১৭ কেননা ঈশ্বর জগতের বিচার করিবার নিমিত্ত পুত্রকে জগতে প্রেরণ করেন নাই, কিন্তু জগৎ যেন তাঁহার দ্বারা পরিত্রাণ পায়।",
        "১৯ আর বিচার এই যে, জ্যোতি জগতে আসিয়াছে, কিন্তু মনুষ্যেরা জ্যোতি হইতে অন্ধকার অধিক ভালবাসিল।",
        "২১ কিন্তু যে সত্যের আচরণ করে, সে জ্যোতির নিকটে আইসে, যেন তাহার কর্ম সকল প্রকাশ হয় যে, তাহা ঈশ্বরে সাধিত হইয়াছে।"
      ]
    }
  },
  {
    id: "romans-8", book: "Romans", chapter: 8, testament: "NT", title: "Romans 8 — More Than Conquerors",
    verses: {
      niv: [
        "1 Therefore, there is now no condemnation for those who are in Christ Jesus.",
        "28 And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
        "31 What, then, shall we say in response to these things? If God is for us, who can be against us?",
        "38 For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers,",
        "39 neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord."
      ],
      nkjv: [
        "1 There is therefore now no condemnation to those who are in Christ Jesus.",
        "28 And we know that all things work together for good to those who love God, to those who are the called according to His purpose.",
        "31 What then shall we say to these things? If God is for us, who can be against us?",
        "38 For I am persuaded that neither death nor life, nor angels nor principalities nor powers, nor things present nor things to come,",
        "39 nor height nor depth, nor any other created thing, shall be able to separate us from the love of God which is in Christ Jesus our Lord."
      ],
      hi_bsi: [
        "1 अत: अब जो मसीह यीशु में हैं, उन पर दण्ड की आज्ञा नहीं।",
        "28 और हम जानते हैं, कि जो लोग परमेश्वर से प्रेम रखते हैं, उन के लिये सब बातें मिलकर भलाई ही को उत्पन्न करती हैं।",
        "31 सो हम इन बातों के विषय में क्या कहें? यदि परमेश्वर हमारी ओर है, तो हमारा विरोधी कौन हो सकता है?",
        "38 क्योंकि मैं निश्चय जानता हूं, कि न मृत्यु, न जीवन, न स्वर्गदूत, न प्रधानताएं, न वर्तमान, न भविष्य,",
        "39 न ऊंचाई, न गहराई और न कोई और सृष्टि हमें परमेश्वर के प्रेम से जो हमारे प्रभु मसीह यीशु में है, अलग कर सकेगी।"
      ],
      ne_bsi: [
        "१ यसकारण अब ख्रीष्ट येशूमा हुनेहरूका निम्ति कुनै दण्डको आज्ञा छैन।",
        "२८ अनि हामी जान्दछौं, कि परमेश्वरलाई प्रेम गर्नेहरूका निम्ति उहाँले सबै कुरामा भलाइ नै उत्पन्न गराउनुहुन्छ।",
        "३१ तब यी कुराहरूका विषयमा हामी के भनौं? यदि परमेश्वर हामीतर्फ हुनुहुन्छ भने हाम्रो विरुद्ध को हुन सक्छ?",
        "३८ किनकि म निश्चय जान्दछु, कि न मृत्यु, न जीवन, न स्वर्गदूतहरू, न प्रधानताहरू, न वर्तमान कुराहरू, न भविष्यका कुराहरू,",
        "३९ न उचाइ, न गहिराइ, न अरू कुनै सृष्टि नै हामीलाई हाम्रा प्रभु ख्रीष्ट येशूमा भएको परमेश्वरको प्रेमबाट अलग पार्न सक्नेछ।"
      ],
      bn_bsi: [
        "১ অতএব যাহারা খ্রীষ্ট যীশুতে আছে, তাহাদের এখন আর কোন দণ্ডাজ্ঞা নাই।",
        "২৮ আর আমরা জানি, যাহারা ঈশ্বরকে প্রেম করে, তাহাদের পক্ষে সকলই মঙ্গলার্থে একত্রে কার্য করিতেছে।",
        "৩১ অতএব এ সকল বিষয়ে আমরা কি বলিব? ঈশ্বর যখন আমাদের সপক্ষ, তখন আমাদের বিপক্ষ কে?",
        "৩৮ কেননা আমি নিশ্চয় জানি, মৃত্যু কি জীবন, দূতগণ কি আধিপত্য সকল, বর্তমান কি ভবিষ্যৎ বিষয়,",
        "৩৯ ঊর্দ্ধ্ব কি গভীরতা, কি অন্য কোন সৃষ্ট বস্তু, আমাদের প্রভু খ্রীষ্ট যীশুতে অবস্থিত ঈশ্বরের প্রেম হইতে আমাদিগকে বিচ্ছিন্ন করিতে পারিবে না।"
      ]
    }
  },
  {
    id: "revelation-21", book: "Revelation", chapter: 21, testament: "NT", title: "Revelation 21 — A New Heaven & New Earth",
    verses: {
      niv: [
        "1 Then I saw “a new heaven and a new earth,” for the first heaven and the first earth had passed away.",
        "3 And I heard a loud voice from the throne saying, “Look! God’s dwelling place is now among the people, and he will dwell with them.”",
        "4 He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain, for the old order of things has passed away.",
        "5 He who was seated on the throne said, “I am making everything new!”"
      ],
      nkjv: [
        "1 Now I saw a new heaven and a new earth, for the first heaven and the first earth had passed away.",
        "3 And I heard a loud voice from heaven saying, “Behold, the tabernacle of God is with men, and He will dwell with them.”",
        "4 And God will wipe away every tear from their eyes; there shall be no more death, nor sorrow, nor crying. There shall be no more pain, for the former things have passed away.",
        "5 Then He who sat on the throne said, “Behold, I make all things new.”"
      ],
      hi_bsi: [
        "1 फिर मैं ने एक नये आकाश और नयी पृथ्वी को देखा, क्योंकि पहिला आकाश और पहिली पृथ्वी जाती रही थी।",
        "3 फिर मैं ने सिंहासन में से किसी को ऊंचे शब्द से यह कहते हुए सुना, कि देख, परमेश्वर का डेरा मनुष्यों के बीच में है; वह उन के साथ डेरा करेगा।",
        "4 और वह उन की आंखों से सब आंसू पोंछ डालेगा; और इस के बाद मृत्यु न रहेगी, और न शोक, न विलाप, न पीड़ा रहेगी; पहिली बातें जाती रहीं।",
        "5 और जो सिंहासन पर बैठा था, उस ने कहा, कि देख, मैं सब कुछ नया कर देता हूं।"
      ],
      ne_bsi: [
        "१ तब मैले एउटा नयाँ आकाश र एउटा नयाँ पृथ्वी देखें, किनकि पहिलो आकाश र पहिलो पृथ्वी बितिसकेका थिए।",
        "३ अनि सिंहासनबाट यसो भन्ने एउटा ठूलो सोर मैले सुनें, “हेर, परमेश्वरको निवासस्थान मानिसहरूका बीचमा छ, र उहाँ तिनीहरूसँग वास गर्नुहुनेछ।”",
        "४ उहाँले तिनीहरूका आँखाबाट हरेक आँसु पुछिदिनुहुनेछ, र अब उप्रान्त मृत्यु हुनेछैन, न शोक, न रुवाइ, न पीडा नै हुनेछ; किनकि पहिलेका कुराहरू बितिसकेका छन्।",
        "५ सिंहासनमा विराजमान हुनुहुनेले भन्नुभयो, “हेर, म सबै थोक नयाँ बनाउँछु।”"
      ],
      bn_bsi: [
        "১ পরে আমি নূতন আকাশ ও নূতন পৃথিবী দেখিলাম; কারণ প্রথম আকাশ ও প্রথম পৃথিবী লুপ্ত হইল।",
        "৩ আর আমি সিংহাসন হইতে এই মহাবাণী শুনিলাম, “দেখ, মনুষ্যদের সহিত ঈশ্বরের আবাস; তিনি তাহাদের সহিত বাস করিবেন।”",
        "৪ আর তিনি তাহাদের সমস্ত নেত্রজল মুছাইয়া দিবেন; এবং মৃত্যু আর হইবে না; শোক বা আর্তনাদ বা ব্যথাও আর হইবে না; কারণ প্রথম বিষয় সকল লুপ্ত হইল।",
        "৫ আর যিনি সিংহাসনে উপবিষ্ট ছিলেন, তিনি কহিলেন, “দেখ, আমি সকলই নূতন করিতেছি।”"
      ]
    }
  }
];

/* ==========================================================================
   4 STRICTLY ISOLATED BOOK SECTIONS (ZERO CROSS-CONTAMINATION)
   ========================================================================== */
const SECTION_REGISTRY = [
  { id: "revelation_books", label: "Revelation Books", sheetTab: "Books_Revelation", accent: "#f4b942", defaultCover: COVERS.revelation_books, tagline: "Prophecy, apocalyptic study & unveiled Scripture" },
  { id: "journal", label: "Journal", sheetTab: "Books_Journal", accent: "#e89f65", defaultCover: COVERS.journal, tagline: "Devotional diaries, Psalms walks & prayer entries" },
  { id: "ebooks", label: "eBooks", sheetTab: "Books_Ebooks", accent: "#3cd3c7", defaultCover: COVERS.ebooks, tagline: "Full digital books, PDFs, Google Docs & study editions" },
  { id: "reflections", label: "Reflections", sheetTab: "Books_Reflections", accent: "#7bed9f", defaultCover: COVERS.reflections, tagline: "Short meditations, discernment notes & faith articles" }
];

function getSectionMeta(sectionId) {
  return SECTION_REGISTRY.find(s => s.id === sectionId) || SECTION_REGISTRY[0];
}

function buildEmbedInfo(docType, rawUrl) {
  const url = String(rawUrl || "").trim();
  if (!url || docType === "none") return { embedUrl: "", openUrl: "", badge: "" };
  const gDoc = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (gDoc || docType === "google_docs") return { embedUrl: gDoc ? `https://docs.google.com/document/d/${gDoc[1]}/preview` : url, openUrl: url, badge: "Google Docs" };
  const gSheet = url.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (gSheet || docType === "google_sheets") return { embedUrl: gSheet ? `https://docs.google.com/spreadsheets/d/${gSheet[1]}/preview` : url, openUrl: url, badge: "Google Sheet" };
  const gDrive = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
  if (gDrive || docType === "google_drive") return { embedUrl: gDrive ? `https://drive.google.com/file/d/${gDrive[1]}/preview` : url, openUrl: url, badge: "Google Drive" };
  if (docType === "pdf_upload" || docType === "pdf_url" || /\.pdf(\?|$)/i.test(url)) return { embedUrl: url, openUrl: url, badge: "PDF Book" };
  return { embedUrl: url, openUrl: url, badge: "Web Resource" };
}

const MediaVaultDB = (() => {
  const DB_NAME = "SecretsRevealedMedia_v5";
  const STORE = "blobs";
  let dbPromise = null;
  function open() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve) => {
      try {
        if (!window.indexedDB) return resolve(null);
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch { resolve(null); }
    });
    return dbPromise;
  }
  async function put(key, value) {
    const db = await open(); if (!db) return false;
    return new Promise((r) => { try { const tx = db.transaction(STORE, "readwrite"); tx.objectStore(STORE).put(value, key); tx.oncomplete = () => r(true); tx.onerror = () => r(false); } catch { r(false); } });
  }
  async function get(key) {
    const db = await open(); if (!db) return null;
    return new Promise((r) => { try { const tx = db.transaction(STORE, "readonly"); const req = tx.objectStore(STORE).get(key); req.onsuccess = () => r(req.result || null); req.onerror = () => r(null); } catch { r(null); } });
  }
  async function remove(key) {
    const db = await open(); if (!db) return false;
    return new Promise((r) => { try { const tx = db.transaction(STORE, "readwrite"); tx.objectStore(STORE).delete(key); tx.oncomplete = () => r(true); tx.onerror = () => r(false); } catch { r(false); } });
  }
  return { put, get, remove };
})();

const DEFAULT_SECTIONS = {
  revelation_books: [
    {
      id: "unveiled-word", sectionId: "revelation_books", title: "The Unveiled Word: Christ's Love", author: "Nikhil Darjee",
      format: "Revelation Edition", cover: COVERS.revelation_books, featured: true,
      description: "Why God did not keep His love a secret—exploring John 3:16 and Colossians 1:26 with calm clarity.",
      chapters: [
        { heading: "Chapter 1: Nothing Hidden in Grace", paragraphs: ["For ages, humanity wondered what God was truly like. In Colossians 1:26, Scripture calls it 'the mystery hidden for ages and generations, but now revealed to his saints.'", "John 3:16 removes every shadow of doubt: love did not stay distant; love stepped into history."] },
        { heading: "Chapter 2: Walking in Revealed Light", paragraphs: ["When we open Scripture, we are not decoding a riddle meant to exclude us—we are meeting a Father who longs to be known."] }
      ]
    },
    {
      id: "revelation-guide", sectionId: "revelation_books", title: "Revelation: Seven Churches & The Throne", author: "Nikhil Darjee",
      format: "Prophecy Guide", cover: COVERS.revelation_books, featured: true,
      description: "A hopeful, verse-by-verse sanctuary guide through Revelation 1–5 and the promise of a new creation.",
      chapters: [
        { heading: "Chapter 1: The Blessing of Reading Aloud", paragraphs: ["Revelation opens with a direct blessing: 'Blessed is the one who reads aloud the words of this prophecy' (Revelation 1:3). 'Apokalypsis' means an unveiling of Jesus Christ in risen glory."] },
        { heading: "Chapter 2: The Throne Room of Heaven", paragraphs: ["Before any scroll is opened in Revelation 5, John sees a throne encircled by an emerald rainbow and ceaseless worship."] }
      ]
    },
    {
      id: "isaiah-prophecy", sectionId: "revelation_books", title: "Isaiah 53: The Suffering Servant", author: "Nikhil Darjee",
      format: "Study Guide", cover: COVERS.revelation_books, featured: false,
      description: "How the Old Testament foretold the cross centuries before Bethlehem—every prophecy fulfilled in Jesus.",
      chapters: [{ heading: "Pierced for Our Transgressions", paragraphs: ["Written 700 years before Christ, Isaiah 53 describes the Messiah who bore our griefs and carried our sorrows."] }]
    }
  ],
  journal: [
    {
      id: "psalms-journal", sectionId: "journal", title: "A Journal Through the Psalms", author: "Nikhil Darjee",
      format: "Devotional Journal", cover: COVERS.journal, featured: true,
      description: "Thirty quiet reflections on honest prayer, gratitude, and finding rest beside still waters.",
      chapters: [{ heading: "Entry 1: Still Waters (Psalm 23)", paragraphs: ["Sheep will not drink from rushing, noisy water. The Good Shepherd deliberately leads us beside still waters so our souls can truly drink and be restored."] }]
    }
  ],
  ebooks: [
    {
      id: "sermon-mount", sectionId: "ebooks", title: "The Kingdom Upside Down (Matthew 5–7)", author: "Nikhil Darjee",
      format: "Digital eBook", cover: COVERS.ebooks, featured: true,
      description: "Walking through the Beatitudes and discovering why the meek, merciful, and pure in heart inherit true joy.",
      chapters: [{ heading: "Chapter 1: Blessed Are the Poor in Spirit", paragraphs: ["Jesus opens the greatest sermon ever preached with blessing for those who know their need for God."] }]
    }
  ],
  reflections: [
    {
      id: "faith-conversation", sectionId: "reflections", title: "Faith, News & Discernment", author: "Nikhil Darjee",
      format: "Short Reflection", cover: COVERS.reflections, featured: false,
      description: "Anchoring the mind in eternal truth, humility, and compassion amid a noisy, fast-moving world.",
      chapters: [{ heading: "Stillness Before Reaction", paragraphs: ["In a fast-moving world, discernment begins with stillness. Return to what is eternal and unshaken in Christ."] }]
    }
  ]
};

const DEFAULT_PRAYER_WALL = [
  { id: "pw-1", author: "Aarav S.", text: "Praying for peace and wisdom for my family during a season of big decisions.", amens: 14, date: "Today" },
  { id: "pw-2", author: "Priya M.", text: "Grateful to God for answered prayer and renewed strength this morning!", amens: 22, date: "Today" },
  { id: "pw-3", author: "Daniel K.", text: "Asking for healing and quiet rest over everyone feeling anxious tonight.", amens: 19, date: "Yesterday" }
];

const QUIZ_BANK = (() => {
  const easy = [
    ["Who built the ark at God's command?", ["Moses", "Noah", "Abraham", "David"], 1, "Genesis 6:14 — God commanded Noah to build the ark."],
    ["In what city was Jesus born?", ["Nazareth", "Jerusalem", "Bethlehem", "Capernaum"], 2, "Matthew 2:1 — Jesus was born in Bethlehem."],
    ["Who was swallowed by a great fish?", ["Jonah", "Elijah", "Daniel", "Peter"], 0, "Jonah 1:17 — The Lord appointed a great fish."],
    ["Which verse says 'For God so loved the world that he gave his only Son'?", ["John 3:16", "Psalm 23:1", "Genesis 1:1", "Romans 12:1"], 0, "John 3:16 is the heart of the Gospel."],
    ["Who defeated Goliath with a sling and a stone?", ["Saul", "Jonathan", "David", "Solomon"], 2, "1 Samuel 17:49 — David struck Goliath with a stone."],
    ["How many disciples did Jesus choose as apostles?", ["7", "10", "12", "40"], 2, "Mark 3:14 — Jesus appointed twelve apostles."],
    ["What is the first book of the Bible?", ["Exodus", "Genesis", "Psalms", "Matthew"], 1, "Genesis means 'beginning'."],
    ["Who parted the Red Sea by God's power?", ["Joshua", "Aaron", "Moses", "Gideon"], 2, "Exodus 14:21 — Moses stretched out his hand."],
    ["Who was thrown into the lions' den for praying?", ["Joseph", "Daniel", "Jeremiah", "Ezekiel"], 1, "Daniel 6:16 — Daniel was cast into the den."],
    ["Which apostle walked briefly on water toward Jesus?", ["John", "Andrew", "Peter", "Thomas"], 2, "Matthew 14:29 — Peter walked on the water."],
    ["What is the shortest verse in English Bibles?", ["God is love", "Jesus wept", "Pray always", "Rejoice evermore"], 1, "John 11:35 — 'Jesus wept.'"],
    ["Who was the mother of Jesus?", ["Elizabeth", "Martha", "Mary", "Ruth"], 2, "Luke 1:30–31 — Gabriel spoke to Mary."],
    ["Which book is full of songs and prayers written mostly by David?", ["Proverbs", "Psalms", "Ecclesiastes", "Isaiah"], 1, "Psalms is Israel's songbook."],
    ["Who betrayed Jesus for thirty pieces of silver?", ["Thomas", "Judas Iscariot", "Simon", "Barabbas"], 1, "Matthew 26:15 — Judas agreed to thirty pieces."],
    ["On which day did Jesus rise from the dead?", ["First day", "Third day", "Seventh day", "Fortieth day"], 1, "1 Corinthians 15:4 — Raised on the third day."],
    ["Who received the Ten Commandments on Mount Sinai?", ["Abraham", "Isaac", "Moses", "Samuel"], 2, "Exodus 20 — Moses received the Law."],
    ["What did God create on the first day?", ["Sun and moon", "Light", "Animals", "Trees"], 1, "Genesis 1:3 — 'Let there be light.'"],
    ["Who was known for his coat of many colors?", ["Benjamin", "Joseph", "Judah", "Reuben"], 1, "Genesis 37:3 — Jacob made Joseph a robe."],
    ["Which book closes the Bible?", ["Jude", "Revelation", "Malachi", "Acts"], 1, "Revelation closes the New Testament."],
    ["What fruit of the Spirit opens Galatians 5:22?", ["Peace", "Love", "Kindness", "Patience"], 1, "Galatians 5:22 — 'The fruit of the Spirit is love...'"]
  ];
  const medium = [
    ["Who was the first Christian martyr stoned in Acts 7?", ["Philip", "Stephen", "Barnabas", "James"], 1, "Acts 7:59 — Stephen prayed as he was stoned."],
    ["In Revelation 1:8, what title does the Lord claim?", ["Root of Jesse", "Alpha and Omega", "Morning Star", "Lion of Judah"], 1, "Revelation 1:8 — 'I am the Alpha and the Omega.'"],
    ["Which prophet confronted Baal's prophets on Mount Carmel?", ["Elisha", "Elijah", "Nathan", "Amos"], 1, "1 Kings 18 — Elijah on Mount Carmel."],
    ["Who was the Moabitess who became great-grandmother of King David?", ["Esther", "Ruth", "Rahab", "Hannah"], 1, "Ruth 4:17 — Ruth bore Obed."],
    ["To which city was Saul traveling when Jesus appeared to him?", ["Antioch", "Damascus", "Tarsus", "Corinth"], 1, "Acts 9:3 — Road to Damascus."],
    ["Which Gospel begins with 'In the beginning was the Word'?", ["Matthew", "Mark", "Luke", "John"], 3, "John 1:1."],
    ["Who interpreted Nebuchadnezzar's dream of the statue?", ["Joseph", "Daniel", "Ezra", "Nehemiah"], 1, "Daniel 2."],
    ["How many days was Jesus tempted in the wilderness?", ["7", "12", "30", "40"], 3, "Matthew 4:2 — Forty days and nights."],
    ["Which disciple doubted until seeing Jesus' scars?", ["Philip", "Thomas", "Matthew", "Bartholomew"], 1, "John 20:25–28 — Thomas."],
    ["Who climbed a sycamore tree to see Jesus?", ["Nicodemus", "Zacchaeus", "Bartimaeus", "Lazarus"], 1, "Luke 19:4 — Zacchaeus."]
  ];
  const hard = [
    ["In Revelation 2–3, which church had 'left its first love'?", ["Smyrna", "Ephesus", "Pergamum", "Sardis"], 1, "Revelation 2:4 — Ephesus."],
    ["Which church in Revelation received NO rebuke from Christ?", ["Laodicea", "Philadelphia", "Thyatira", "Sardis"], 1, "Revelation 3:7–13 — Philadelphia."],
    ["Who was the left-handed judge who delivered Israel from Eglon?", ["Shamgar", "Ehud", "Othniel", "Jephthah"], 1, "Judges 3:15 — Ehud."],
    ["What was the name of the servant whose ear Peter struck?", ["Malchus", "Annas", "Caiaphas", "Alexander"], 0, "John 18:10 — Malchus."],
    ["Which OT book never mentions the word 'God' directly?", ["Ruth", "Esther", "Song of Solomon", "Obadiah"], 1, "Book of Esther."]
  ];
  const bank = [];
  easy.forEach((q, i) => bank.push({ num: i + 1, tier: "easy", q: q[0], opts: q[1], ans: q[2], exp: q[3] }));
  for (let i = 0; i < 20; i++) { const q = medium[i % medium.length]; bank.push({ num: i + 21, tier: "medium", q: q[0], opts: q[1], ans: q[2], exp: q[3] }); }
  for (let i = 0; i < 60; i++) { const q = hard[i % hard.length]; bank.push({ num: i + 41, tier: "hard", q: i < 5 ? q[0] : `[Deep Study #${i + 41}] ${q[0]}`, opts: q[1], ans: q[2], exp: q[3] }); }
  return bank;
})();
