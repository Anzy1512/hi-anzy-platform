export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "What We Do", to: "/what-we-do" },
  { label: "How We Work", to: "/how-we-work" },
  { label: "Work", to: "/work" },
  { label: "Network", to: "/network" },
  { label: "Why hiAnzy", to: "/why-hi-anzy" },
  { label: "Insights", to: "/insights" },
];

export const FOOTER_LINKS = [
  { label: "Who We Work With", to: "/who-we-work-with" },
  { label: "Collaborate", to: "/collaborate" },
  { label: "Careers", to: "/careers" },
  { label: "Resources", to: "/resources" },
  { label: "Privacy", to: "/resources#privacy" },
  { label: "Terms", to: "/resources#terms" },
];

/* The six systems. Each one is also its own page at /what-we-do/:slug, so a
   search result can land on the specific thing someone asked for rather than
   on a menu they then have to read. */
export const CATEGORIES = [
  {
    num: "01",
    slug: "business-audit-strategy",
    label: "SEE CLEARLY",
    title: "Business Audit & Strategy",
    copy: "Before spending money on the solution, make sure you diagnosed the right problem.",
    capabilities: ["Business diagnostics", "Market intelligence", "Customer understanding", "Positioning", "Opportunity mapping", "Transformation roadmaps", "Go-to-market strategy", "Operating model improvement"],
    services: [
      "Foundation workshop",
      "Deep-dive consultation",
      "Brand and business audit",
      "Founder vision mapping",
      "Market analysis and benchmarking",
      "Competition analysis",
      "Consumer study",
      "Audience mapping",
      "Pain point extraction",
      "Brand positioning and differentiation",
      "Value proposition mapping",
      "Objectives definition",
      "Brand repositioning",
      "Market strategy",
      "Go-to-market strategy",
      "Product line launch roadmap",
      "Distribution channel planning",
      "Threat and risk analysis",
      "Brand naming and domain",
      "Business registration and trademarks",
      "Operating model improvement",
      "Transformation roadmap",
    ],
    methodStage: "AUDIT",
    why: "Every expensive mistake we have ever been called to fix started with a skipped diagnosis. This is where we make sure yours doesn't.",
    lede: "Most businesses do not have an information problem. They have a too-much-information-and-no-agreement problem.",
    body: [
      "You already know something is off. The revenue is fine but the margin is not. The team is busy but the roadmap has not moved. Two departments are each certain the other one is the bottleneck. What is missing is not more data — it is a shared, honest reading of what the data means.",
      "So we look. At the numbers, the workflows and the customer's real journey rather than the tidy version in the deck. We talk to the people who actually do the work, because they usually know exactly where the body is buried and have simply never been asked.",
      "What comes out is a diagnosis you can act on: the problem named in plain language, the causes ranked by how much they actually cost you, and a sequence that says what to fix first. Occasionally the finding is that you are fine and the panic was inherited. That is a good outcome too, and a cheap one."
    ],
    signals: [
      "Your reports disagree with each other and everyone has a favourite",
      "Growth has flattened and nobody can say precisely when it started",
      "You are about to spend serious money on a fix nobody has stress-tested",
      "Every department is individually hitting targets while the business is not"
    ],
    deliverables: ["Business, brand and technology audit", "Customer journey walk-through, end to end", "Prioritised findings ranked by cost", "Transformation roadmap with named owners"],
    typical: "2–6 weeks",
    faqs: [
      { q: "How is this different from a consultancy report?", a: "A report tells you what is wrong. Ours ends with a sequence — what to fix first, who owns it, and what has to be true before the next thing starts. If it cannot be acted on the following Monday, we have not finished." },
      { q: "What if the audit says we do not need the project we planned?", a: "Then we say so and you keep the money. We would rather lose the follow-on work than take payment for building something you did not need." }
    ]
  },
  {
    num: "02",
    slug: "brand-experience",
    label: "MAKE SENSE",
    title: "Brand & Experience",
    copy: "People rarely buy what they do not understand. Clarity converts before the CTA does.",
    capabilities: ["Brand strategy", "Naming", "Identity", "Messaging", "Packaging", "UX/UI", "Customer journeys", "Product experience", "Founder positioning"],
    services: [
      "Brand strategy",
      "Brand persona and archetype",
      "Personality framework",
      "Tone of voice",
      "Messaging architecture",
      "Logo and visual identity system",
      "Typography and colour palette",
      "Iconography and symbol system",
      "Brand elements and sample creatives",
      "Brand guidelines document",
      "Founder personal branding",
      "Packaging design",
      "Labelling and packaging",
      "Unboxing experience design",
      "Product design concept",
      "Product design and customisation",
      "3D modelling and photorealistic rendering",
      "Print solutions and branded collateral",
      "Merchandising and digital assets",
      "Custom brand kits for online retail",
      "Retail display and POS design",
      "Website and app UI/UX blueprints",
      "E-commerce product UI/UX",
      "Customer journey design",
    ],
    methodStage: "ARCHITECT",
    why: "A brand is the shortcut a customer takes to a decision. We make sure the shortcut leads somewhere true.",
    lede: "A brand is not what you say about yourself. It is the shortcut a tired person takes when deciding whether to trust you.",
    body: [
      "Human attention is expensive and easily spent. Someone landing on your site is running a very fast, largely unconscious calculation: do I understand this, and do I believe it? Confusion reads as risk. Risk reads as no.",
      "So this work starts with meaning rather than decoration. What are you actually for, who is it for, and why should they care this year rather than in principle? Then the visible layer — name, identity, message, packaging, interface — gets built to carry that meaning without the customer having to work for it.",
      "The test is not whether the brand wins an award. It is whether a stranger can explain what you do, accurately, after thirty seconds. That is a surprisingly hard bar and a very profitable one."
    ],
    signals: [
      "Your best customers describe you differently than your website does",
      "The sales team has quietly built their own deck because the official one does not land",
      "You are competing on price against people who are not actually your competitors",
      "The product is genuinely good and the conversion rate disagrees"
    ],
    deliverables: ["Brand strategy and positioning", "Messaging architecture", "Identity system", "Customer journey and UX design"],
    typical: "4–10 weeks",
    faqs: [
      { q: "Do we need a full rebrand?", a: "Usually not. More often the strategy is sound and the expression is inconsistent, which is a cheaper and faster fix. We will tell you which one you are looking at before you commit to either." },
      { q: "Can you work with our existing identity?", a: "Yes, and frequently that is the right call. Equity you have already built is an asset; throwing it away to feel decisive is an expensive habit." }
    ]
  },
  {
    num: "03",
    slug: "digital-technology-automation",
    label: "MAKE IT WORK",
    title: "Digital, Technology & Automation",
    copy: "Technology should remove friction. Not create a new Slack channel about friction.",
    capabilities: ["Websites", "Commerce", "Applications", "Dashboards", "CRM", "Integrations", "Cloud", "AI systems", "Workflow automation", "Internal tools"],
    services: [
      "Website design and development",
      "Static and dynamic websites",
      "D2C and e-commerce builds",
      "Shopify and WooCommerce setup",
      "CMS development (WordPress, Joomla)",
      "Webflow development",
      "Mobile app development (iOS and Android)",
      "Custom in-house software",
      "Cloud-based applications",
      "Cloud setup and migration",
      "Backend analytics dashboards",
      "Analytics, pixel and tag setup",
      "CRM setup and integration",
      "Customer data platform (CDP)",
      "Workflow automation (n8n, Zapier, HubSpot)",
      "Email and WhatsApp automation",
      "E-commerce and API integration",
      "Loyalty and reward platform",
      "AI solutions (chatbots, GPT API, Copilot)",
      "Personalised GPT API",
      "AI voice assistant integration",
      "AI-driven automation",
      "Predictive consumer insights",
      "Blockchain development",
      "IoT development",
      "Web3 development",
      "Internal tools",
    ],
    methodStage: "BUILD",
    why: "Good design opens the door. Good systems keep the lights on. This is the keep-the-lights-on department.",
    lede: "Every tool was bought to save time. Somehow the week got shorter anyway.",
    body: [
      "The usual pattern is not a lack of technology — it is six tools that each solve a slice of the problem and none of which talk to each other. So a human becomes the integration layer, copying figures between systems and quietly becoming the single point of failure.",
      "We build the machinery: the site, the commerce, the dashboards, the CRM, the integrations, the automations that remove the copy-and-paste jobs entirely. Built to the blueprint rather than to whatever was trending at the last conference.",
      "And built to be operated. If a system needs its author present to function, it is not finished. Documentation, sensible defaults and an honest handover are part of the build, not an optional extra you get quoted for later."
    ],
    signals: [
      "Someone's job is substantially moving data between two systems",
      "Your reporting requires a spreadsheet nobody is allowed to touch",
      "The site works but nobody can update it without an agency ticket",
      "You bought AI and it has so far produced enthusiasm rather than output"
    ],
    deliverables: ["Websites, commerce and applications", "Integrations and workflow automation", "Dashboards and reporting", "Documentation and team handover"],
    typical: "6–16 weeks",
    faqs: [
      { q: "Will we be locked into you afterwards?", a: "No. You own the code, the accounts and the documentation. We consider a client who could leave and chooses not to a better outcome than one who cannot." },
      { q: "Do you actually build, or do you specify and hand off?", a: "We build. The network brings specialists where a problem needs them, and the accountability stays in one place regardless." }
    ]
  },
  {
    num: "04",
    slug: "growth-content-commerce",
    label: "MAKE IT MOVE",
    title: "Growth, Content & Commerce",
    copy: "Attention is useful. What happens after attention pays the bills.",
    capabilities: ["Content strategy", "Social", "Performance marketing", "SEO", "Funnels", "Lifecycle marketing", "CRO", "Marketplace growth", "Campaigns"],
    services: [
      "Digital launch campaign planning",
      "Pre-launch social strategy and calendar",
      "Pre-launch teaser campaigns",
      "Platform setup and branding",
      "Platform management (Meta, Google, LinkedIn, X)",
      "Content strategy and buckets",
      "Social media marketing (organic and paid)",
      "Search engine optimisation",
      "SEO setup and keyword planning",
      "Search engine marketing",
      "Google Ads and YouTube Ads",
      "Paid media buying strategy",
      "Performance campaigns",
      "Remarketing campaigns",
      "Affiliate marketing setup",
      "Influencer collaboration campaigns",
      "Influencer seeding programme",
      "Contest and giveaway strategy",
      "Hashtag strategy",
      "Social listening setup",
      "Landing page development",
      "Funnel design",
      "Email marketing funnels",
      "Email campaigns and drip sequences",
      "Lead development",
      "Conversion rate optimisation",
      "Growth hacking",
      "E-commerce setup",
      "Marketplace growth",
      "AI-powered content creation",
    ],
    methodStage: "SCALE",
    why: "A better funnel cannot rescue a confused offer. Once the offer is right, this is where it learns to travel.",
    lede: "Going viral is a lovely feeling and a poor business model.",
    body: [
      "Growth work fails most often for an unglamorous reason: it is asked to compensate for an offer that has not been made clear. No amount of creative rescues a proposition the customer does not understand. Fix the offer, and the same spend starts behaving very differently.",
      "Once it is right, this is the department that teaches it to travel. Content that earns the click rather than buying it twice. Funnels that respect the fact people leave and come back. Lifecycle work, because the cheapest customer is one you already have and have not annoyed.",
      "We measure the part that matters — what happened after the click. Impressions are a vanity metric with excellent PR."
    ],
    signals: [
      "Traffic is up and revenue is doing something else entirely",
      "Ad costs keep climbing and the answer keeps being 'spend more'",
      "You have an audience that likes you and does not buy from you",
      "Retention is quietly leaking while acquisition takes the credit"
    ],
    deliverables: ["Content and channel strategy", "Performance marketing and SEO", "Funnel and conversion optimisation", "Lifecycle and retention programmes"],
    typical: "Ongoing, reviewed quarterly",
    faqs: [
      { q: "Can you just run our ads?", a: "We can, but if the offer or the landing experience is the actual constraint we will say so first. Spending your money efficiently on the wrong thing is still spending your money on the wrong thing." },
      { q: "How quickly will we see results?", a: "Paid channels report in weeks, SEO and lifecycle in months. Anyone promising otherwise is selling a timeline rather than an outcome." }
    ]
  },
  {
    num: "05",
    slug: "media-creators-experiences",
    label: "MAKE IT TRAVEL",
    title: "Media, Creators & Experiences",
    copy: "A good idea should travel further than your own feed.",
    capabilities: ["Creators", "PR", "Media", "Events", "Venues", "Production", "Collaborations", "Institutional partnerships", "Experiential campaigns"],
    services: [
      "Video production (reels, ads, documentaries)",
      "Brand film and manifesto video",
      "Launch teaser video",
      "Explainer videos",
      "Animation and motion graphics",
      "Post production",
      "Creative direction",
      "Copywriting and scripting",
      "Product photography",
      "Concept and lifestyle shoots",
      "Retail display visuals",
      "Sound production",
      "Sonic branding (jingle, audio logo)",
      "UI/UX sound design",
      "Audio ads (Spotify, Gaana, JioSaavn, podcasts)",
      "Ambient sound design",
      "Branded playlists",
      "Branded podcast development",
      "Podcast shooting and setup",
      "Voiceovers and music licensing",
      "AI voice over",
      "Event soundscapes",
      "Artist collaboration (DJs, musicians, producers)",
      "Creator marketing strategy",
      "Gaming and esports tie-ups",
      "UGC campaign development",
      "Brand ambassador shortlisting",
      "Co-branded music content",
      "City pop-up tours",
      "College festivals and youth events",
      "Music and gaming festival partnerships",
      "Co-branded stages",
      "Venue partnerships",
      "Event branding and visuals",
      "Booth and stall branding",
      "Event content and coverage",
      "Livestream setup",
      "Merchandise and collections",
      "Creator and influencer meetups",
      "Launch strategy and execution",
      "TV commercials",
      "Cinema advertising",
      "Outdoor advertising (OOH, DOOH)",
      "Programmatic OOH",
      "Transit media",
      "Local radio spots",
      "Integrated ATL campaigns",
      "Proactive media placement",
    ],
    methodStage: "CONNECT",
    why: "Reach can be purchased. Relevance has to be designed. The network exists so both happen on purpose.",
    lede: "Reach can be bought by anyone with a card. Relevance has to be designed on purpose.",
    body: [
      "There is a meaningful difference between being seen and being remembered. Plenty of campaigns achieve the first and quietly fail the second, because the audience was rented rather than earned and had no particular reason to care.",
      "This is where the network does the heavy lifting: creators, media, venues, producers, institutional partners — chosen because they already hold the attention of the people you actually need, not because they were available.",
      "Experiences included. A room full of the right people remains one of the most underrated distribution channels in existence, largely because it does not come with a dashboard."
    ],
    signals: [
      "You need to reach an audience that does not trust advertising",
      "Your category is crowded and everyone is saying the same three things",
      "A launch is coming and the plan is currently 'post about it'",
      "You have budget for reach and no view on which reach is relevant"
    ],
    deliverables: ["Creator and media partnerships", "PR and institutional collaborations", "Events, venues and production", "Experiential campaign design"],
    typical: "Campaign-based",
    faqs: [
      { q: "Do you have your own roster?", a: "We have a network rather than a roster, and we label who did what on every piece of work. The team is assembled per problem, which is the point." },
      { q: "Is this just influencer marketing?", a: "That is one instrument in it. Used alone and without a reason, it is an expensive way to reach people who were already scrolling past." }
    ]
  },
  {
    num: "06",
    slug: "advisory-security-scale",
    label: "MAKE IT LAST",
    title: "Advisory, Security & Scale",
    copy: "Growth is exciting until the weak systems start introducing themselves.",
    capabilities: ["Founder advisory", "Technology advisory", "Security", "Privacy readiness", "Reputation", "Operations", "Customer systems", "Scale planning"],
    services: [
      "Founder advisory",
      "Technology advisory",
      "Growth and brand consulting",
      "Brand workshops and training",
      "Internal branding for teams",
      "Community building strategy",
      "Loyalty programmes and referral models",
      "Customer success programmes",
      "Customer engagement and retention planning",
      "Customer support ticketing",
      "Refund and replacement workflows",
      "Online review monitoring",
      "ORM strategy",
      "Sentiment analysis",
      "Crisis communication",
      "Reputation management",
      "Feedback loops and brand listening",
      "UGC systems",
      "Security",
      "Privacy readiness",
      "Operations and fulfilment",
      "Scale planning",
      "Measurement and reporting",
      "Long-term growth support",
    ],
    methodStage: "SCALE",
    why: "Clever ideas get attention. Reliable execution gets remembered. This is the remembered part.",
    lede: "Scale is an excellent stress test. It finds every shortcut you took and introduces them to your customers.",
    body: [
      "Things that work at ten customers behave differently at ten thousand. The manual step someone was doing quietly becomes a queue. The permissive access setting becomes an incident. The process that lived in one person's head becomes a risk with a notice period.",
      "This is the work of making growth survivable: operations that hold, security proportionate to what you actually hold, privacy readiness before a regulator asks, and advisory for the decisions that are too consequential to make from inside the weather.",
      "Unglamorous, and the reason anyone is still around in five years to enjoy the glamorous parts."
    ],
    signals: [
      "You are growing faster than your processes were designed for",
      "Security is currently a spreadsheet and a strong sense of optimism",
      "Key knowledge lives with one person and they have earned a holiday",
      "A funding round or audit is coming and diligence will ask hard questions"
    ],
    deliverables: ["Founder and technology advisory", "Security and privacy readiness", "Operations and customer systems", "Scale planning and risk mapping"],
    typical: "Retained or milestone-based",
    faqs: [
      { q: "Is this a compliance service?", a: "It is broader than compliance and proportionate by design. Customer data, payments and access get real rigour; things that do not matter do not get security theatre performed over them." },
      { q: "We are small — is this premature?", a: "The cheapest moment to fix an access model or a manual dependency is before it has grown roots. It rarely gets less expensive with time." }
    ]
  },
];

export const CATEGORY_BY_SLUG = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]));

/* Each stage carries the detail that used to live nowhere: what we need from
   you, what lands at the end, and the honest failure mode. The stage cards on
   /how-we-work only fill five of twelve columns; this is what fills the rest. */
export const METHOD_STAGES = [
  {
    label: "AUDIT",
    title: "See what's really happening.",
    page: "First, we look.",
    body: "The numbers, the workflows, the customer's actual experience — not the org chart version of it. Fragments become visible. Some of them are surprising. That is the point.",
    duration: "2–4 weeks",
    inputs: ["Access to your numbers, warts included", "30 minutes each with the people who do the work", "Permission to ask awkward questions"],
    outputs: ["Findings ranked by what they actually cost", "A named problem, in one sentence", "The shortlist of what to fix first"],
    pitfall: "The usual failure here is politeness — an audit that confirms what leadership already believed. We would rather be useful than welcome.",
  },
  {
    label: "ARCHITECT",
    title: "Turn the mess into a map.",
    page: "Then, we decide.",
    body: "What changes, what stays, what gets retired without a funeral. The blueprint names owners, sequences moves and decides what deserves to happen first.",
    duration: "2–4 weeks",
    inputs: ["Decisions, not just opinions", "One person who can say yes", "Your real constraints — budget, people, timing"],
    outputs: ["A sequenced blueprint with owners", "What is explicitly not happening", "Dependencies mapped before they bite"],
    pitfall: "Plans die when everything is priority one. If nothing on the list is allowed to go last, the list is a wish, not a plan.",
  },
  {
    label: "BUILD",
    title: "Make the plan real.",
    page: "Then, we make.",
    body: "Systems, brand, technology, content — built to the blueprint, not to the mood of the week. Objects gain structure. Promises gain deadlines.",
    duration: "6–16 weeks",
    inputs: ["Content, assets and access, on time", "A named reviewer with actual authority", "Tolerance for seeing it half-finished"],
    outputs: ["The thing itself, working", "Documentation your team can act on", "A handover that does not need us present"],
    pitfall: "Scope creep rarely arrives as a request. It arrives as 'while you're in there' — which is why changes go in writing.",
  },
  {
    label: "CONNECT",
    title: "Bring the right minds into the room.",
    page: "Then, we bring in whoever the problem needs.",
    body: "Strategists, designers, technologists, creators, media, venues, operators. The team changes shape per problem. The accountability doesn't.",
    duration: "Per engagement",
    inputs: ["Clarity on what success looks like", "Introductions where relationships matter", "Room for people who disagree with you"],
    outputs: ["A roster assembled for this problem", "Labelled credit — who did what, always", "Relationships that outlast the project"],
    pitfall: "Bringing in specialists too early is expensive theatre. They should arrive when the problem is defined enough to brief them properly.",
  },
  {
    label: "SCALE",
    title: "Keep what works. Improve what doesn't.",
    page: "Then, we prove whether it worked.",
    body: "Measurement, iteration, and the discipline to stop doing things that only look productive. Momentum becomes measurable.",
    duration: "Ongoing, reviewed quarterly",
    inputs: ["Agreement on the measure, set in advance", "Willingness to kill what is not working", "A quarterly hour to look honestly"],
    outputs: ["Results against the measure you agreed", "A shorter list of things you still do", "Systems that survive your growth"],
    pitfall: "The hardest part is stopping. Sunk cost is a genuine cognitive bias, and it is usually wearing a spreadsheet.",
  },
];

export const WHY_HOW_NOW = [
  { key: "WHY", q: "What are we actually trying to change?", items: ["Ambition", "Customer", "Market", "Position", "The problem behind the problem"] },
  { key: "HOW", q: "What needs to exist for that change to happen?", items: ["Systems", "Technology", "Processes", "People", "Experiences", "Infrastructure"] },
  { key: "NOW", q: "What deserves to happen first?", items: ["Priorities", "Execution", "Measurement", "Momentum"] },
];

export const SOMETHINGS_OFF = [
  "Sales are growing but margins are not invited.",
  "Marketing is busy. Nobody can explain what the busy-ness returns.",
  "The website gets traffic. The traffic gets confused. The confusion leaves.",
  "Four tools, three spreadsheets and one person who knows how it all connects. She is on leave.",
  "Everything looks normal. That is occasionally the most expensive symptom of all.",
];

export const DIAGNOSTIC_AREAS = ["Business", "Brand", "Customer", "Sales", "Marketing", "Technology", "Data", "Operations", "Automation", "Security", "Growth"];

export const DIAGNOSTIC_OUTCOMES = [
  "What is happening",
  "Why it matters",
  "What it is costing you",
  "What should change",
  "What happens first",
  "Who should own it",
  "How success gets measured",
];

/* Each principle opens to explain itself. The headline is what we promise;
   the detail is what that actually costs us to keep. */
export const TRUST_PRINCIPLES = [
  {
    name: "Defined problem",
    detail:
      "We will not start until we can say the problem out loud in one sentence, without using the word ‘synergy’. If that sentence keeps changing, we have not found the problem yet — we have found a symptom wearing a convincing hat.",
  },
  {
    name: "Clear roadmap",
    detail:
      "A roadmap is not a wish list with dates attached. Ours names what happens, in what order, and what has to be true before the next thing can start. You should be able to read it on a Monday and know what Friday looks like.",
  },
  {
    name: "Named ownership",
    detail:
      "Every item has a human name on it. Not a department, not ‘the team’. Diffusion of responsibility is a genuine psychological effect: the more people who could act, the less likely any one of them does. We design that effect out.",
  },
  {
    name: "Relevant specialists",
    detail:
      "The roster is assembled per problem, not sold from a shelf. If your challenge is distribution, you do not need a brand refresh with a distribution chapter — you need someone who has actually moved product. We would rather bring the right stranger than the familiar face.",
  },
  {
    name: "Transparent scope",
    detail:
      "What is included, what is not, and what would change the price. Written down before we begin. Scope creep is rarely malicious; it is usually two people who each assumed the other had it covered.",
  },
  {
    name: "Measurable goals",
    detail:
      "If we cannot agree on what ‘better’ looks like in numbers, we are not setting a goal — we are setting a mood. We define the measure first, so success is something you can verify rather than something we get to claim.",
  },
  {
    name: "Documentation",
    detail:
      "The work is written down so it survives the people who made it, including us. A system only one person understands is not an asset. It is a hostage situation with better branding.",
  },
  {
    name: "Operational thinking",
    detail:
      "Anything we build has to run on an ordinary Tuesday, staffed by ordinary humans who have other things on. We design for the tired version of your team, not the launch-day version.",
  },
  {
    name: "Security where it matters",
    detail:
      "Proportionate, not paranoid. Customer data, payments and access get real rigour; the office snack spreadsheet does not. Security theatre is expensive and protects nothing but feelings.",
  },
];

export const AUDIENCES = [
  "Idea builders",
  "Entrepreneurs",
  "Founder-led companies",
  "Established businesses modernising systems",
  "D2C businesses",
  "Commerce businesses",
  "Hospitality",
  "Service companies",
  "Experience-led businesses",
  "Internal innovation teams",
  "Companies adopting AI or automation",
  "Teams entering the next stage of growth",
];

export const FILTER_LIST = [
  "Price is the only strategy.",
  "Decisions follow whatever trended this week.",
  "The brief changes faster than the work.",
  "The solution was decided before the problem was discussed.",
  "\"Can you make the logo bigger?\" — asked without a why.",
];

export const NETWORK_CATEGORIES_HOME = ["STRATEGY", "DESIGN", "TECHNOLOGY", "AI", "AUTOMATION", "MEDIA", "CREATORS", "PRODUCTION", "EXPERIENCES", "PR", "SECURITY", "OPERATIONS"];

export const BRAND_REFS = [
  "The Hosteller", "KNMA", "RootsBIM", "Hyundai", "Realme", "Paytm", "JioHotstar", "Adani", "Hitachi", "Airtel", "PepsiCo",
  "Canon", "Sunburn", "Comic-Con", "Ministry of Power", "The Oberoi", "NDTV", "Times of India", "Zee Network",
];

/**
 * The curated top tier of BRAND_REFS, for the one place on the site that
 * claims to show only the biggest names: the Work page marquee.
 *
 * BRAND_REFS above is the full honest list — everyone from a single-location
 * teahouse to a UN agency, credited without ranking. This is deliberately
 * smaller: publications, ministries and niche/regional names are real
 * relationships but not what "the biggest names" means, so they are left out
 * here without being erased from BRAND_REFS itself.
 *
 * Sourced from two places, both traceable: names already verified against the
 * brand deck's own client-logo page, plus a few pulled from the portfolio
 * credits in seed_data.py (Hero MotoCorp, Ashok Leyland, Bath & Body Works),
 * which carry a live campaign URL each rather than being asserted from a logo
 * alone. Nothing here is a name hiAnzy has not actually worked with.
 */
export const TOP_CLIENT_MARKS = [
  "Hyundai", "PepsiCo", "UNICEF", "Airtel", "Adani", "Paytm",
  "Canon", "Hitachi", "Hero MotoCorp", "Bath & Body Works", "JioHotstar", "Ashok Leyland",
];

export const CHARACTERS = [
  { img: "/brand/char-visionary.jpg", name: "The Visionary", line: "Sees the big picture before it's even drawn" },
  { img: "/brand/char-challenger.jpg", name: "The Challenger", line: "Bold ideas, always questioning norms" },
  { img: "/brand/char-fixer.jpg", name: "The Fixer", line: "Turns roadblocks into pathways" },
  { img: "/brand/char-anchor.jpg", name: "The Anchor", line: "Keeps the chaos in check, the clock ticking" },
  { img: "/brand/char-expressionist.jpg", name: "The Expressionist", line: "The artist, the performer, the voice to the world" },
  { img: "/brand/char-trendsetter.jpg", name: "The Trendsetter", line: "Senses style, spots culture, lives trends" },
];

export const TEAM_QUOTE = "We're just a bunch of curious minds trying to build something that grows with us and maybe, just maybe, leaves a dent in the world. Along the way, we keep each other grounded — and make sure it never gets boring.";

/** Subcategories shown inside the Network constellation when a cluster is focused. */
export const NETWORK_SUBCATS = {
  Strategy: ["Diagnostics", "Positioning", "Roadmaps", "Go-to-market", "Pricing"],
  Brand: ["Naming & story", "Identity systems", "Tone of voice", "Repositioning", "Founder brand"],
  Design: ["UX/UI", "Packaging", "Motion design", "Design systems"],
  Technology: ["Web dev", "Shopify / Woo", "CRM integration", "Backend & hosting", "Analytics setup"],
  AI: ["AI systems", "Assistants & agents", "Readiness audits"],
  Automation: ["Workflows", "n8n / Zapier", "Internal tools", "Drip systems"],
  Performance: ["Paid social", "Google & YouTube", "Funnel design", "CRO", "Growth loops"],
  Media: ["Print & digital", "Broadcast", "Entertainment", "Intl. press", "Vertical desks"],
  Creators: ["Singers", "Comedians", "Sketch artists", "Podcasters", "Vloggers", "Voice artists"],
  Production: ["Video & TVC", "Photography", "Motion graphics", "Sound design", "Post production"],
  Events: ["Festivals", "Campus circuit", "Launches", "Co-branded stages"],
  Venues: ["Hotels", "Clubs", "Stadiums", "Institutions"],
  Experiences: ["Pop-up tours", "Stage design", "Booth branding", "Merchandise"],
  PR: ["Media placement", "ORM", "Crisis comms", "Sentiment"],
  Security: ["Audits", "Privacy readiness", "Infra hardening"],
  Operations: ["Fulfilment", "Merch production", "Event ops", "Logistics"],
};

export const ROTATING_QUOTES = [
  { q: "Looking busy is not a growth strategy.", tag: "BUSINESS, UNPACKED" },
  { q: "Complexity is common. Clarity is engineered.", tag: "THE ANZY WAY" },
  { q: "Attention gets you noticed. Trust gets you chosen.", tag: "BRAND, DECODED" },
  { q: "A better funnel cannot rescue a confused offer.", tag: "GROWTH, WITH RECEIPTS" },
  { q: "Reach can be purchased. Relevance has to be designed.", tag: "MEDIA & CREATORS" },
  { q: "AI is not the strategy. The business outcome is.", tag: "TECH, WITHOUT THEATRE" },
];

export const INSIGHT_CATEGORIES = [
  { name: "Business, Unpacked", blurb: "Business systems and consulting." },
  { name: "Brand, Decoded", blurb: "Positioning, identity and customer experience." },
  { name: "Tech, Without Theatre", blurb: "Technology, automation and AI." },
  { name: "Growth, With Receipts", blurb: "Marketing, commerce and performance." },
  { name: "Things We Noticed", blurb: "Observations, patterns and founder notes." },
];

export const PROVENANCE_STYLES = {
  "HI ANZY": { cls: "bg-[#232A2A] text-[#F7F5EE]", bar: false },
  "HI ANZY DIRECT": { cls: "bg-[#232A2A] text-[#F7F5EE]", bar: false },
  "HI ANZY + PARTNER": { cls: "bg-[#F19020]/15 text-[#232A2A] border border-[#F19020]", bar: false },
  "HI ANZY + COLLABORATOR": { cls: "bg-[#F19020]/15 text-[#232A2A] border border-[#F19020]", bar: false },
  "COLLABORATOR WORK": { cls: "bg-[#F7F5EE] text-[#232A2A] border border-[#232A2A]/30", bar: true },
  "COLLABORATOR CREDENTIAL": { cls: "bg-[#F7F5EE] text-[#232A2A] border border-[#232A2A]/30", bar: true },
  NETWORK: { cls: "bg-transparent text-[#232A2A] border border-dashed border-[#232A2A]/40", bar: false },
  "NETWORK ACCESS": { cls: "bg-transparent text-[#232A2A] border border-dashed border-[#232A2A]/40", bar: false },
};


/* ── Engagement model ────────────────────────────────────────────────────────
   Work is grouped by development stage rather than sold as a flat menu, so the
   sequence is the default. Stage keys line up with METHOD_STAGES above. */
export const PACKAGES = [
  {
    key: "diagnose",
    stage: "01",
    name: "Clarity Diagnostic",
    tagline: "Name the problem before you fund the fix.",
    forWho: "Something is clearly off, but the reports disagree about what.",
    timeline: "2–4 weeks",
    pricing: "Fixed scope, fixed price",
    includes: [
      "Business, brand and technology audit",
      "Customer journey walk-through, end to end",
      "Data and reporting sanity check",
      "Prioritised blueprint with named owners",
    ],
    outcome: "A named problem, a sequenced plan, and a decision you can defend to a board.",
    nextStage: "define",
  },
  {
    key: "define",
    stage: "02",
    name: "Positioning & Story",
    tagline: "Decide what you are, in language people repeat.",
    forWho: "The problem is named; the market still hears something vague.",
    timeline: "3–5 weeks",
    pricing: "Fixed scope",
    includes: [
      "Positioning and category decision",
      "Messaging hierarchy and proof points",
      "Naming, identity direction and tone of voice",
      "Offer architecture and pricing narrative",
    ],
    outcome: "A story your sales team, your site and your investors all tell the same way.",
    nextStage: "build",
  },
  {
    key: "build",
    stage: "03",
    name: "Brand Operating System",
    tagline: "Make the decision real, in public.",
    forWho: "The thinking is settled and the machinery does not exist yet.",
    timeline: "6–12 weeks",
    pricing: "Scoped from the blueprint",
    includes: [
      "Website or commerce build",
      "Design system and content templates",
      "CRM, analytics and automation wiring",
      "Launch assets and internal handover",
    ],
    outcome: "A system that ships work without a meeting about how to ship work.",
    nextStage: "connect",
  },
  {
    key: "connect",
    stage: "04",
    name: "Network Activation",
    tagline: "Bring in the specialists the problem actually needs.",
    forWho: "The machinery runs; the right people and channels are not wired to it.",
    timeline: "Per engagement",
    pricing: "Retainer or per project",
    includes: [
      "Specialist, creator and media matching",
      "Production and campaign management",
      "Partner and venue access",
      "Single accountable point of contact",
    ],
    outcome: "A team that changes shape per problem, with accountability that does not.",
    nextStage: "scale",
  },
  {
    key: "scale",
    stage: "05",
    name: "Growth & Measurement",
    tagline: "Keep what works. Retire what only looks productive.",
    forWho: "It works, and now it needs to compound instead of plateau.",
    timeline: "Ongoing, quarterly reviews",
    pricing: "Monthly retainer",
    includes: [
      "Performance, SEO and answer-engine visibility",
      "Content engine and editorial calendar",
      "Conversion and funnel iteration",
      "Quarterly systems review",
    ],
    outcome: "Momentum you can measure, and a written reason for every thing you stop doing.",
    nextStage: null,
  },
];

/* Recurring stage pairings. These exist because these are the combinations
   businesses actually arrive needing — not because bundling looks tidy. */
export const COMBOS = [
  {
    key: "reset",
    name: "The Reset",
    stages: ["diagnose", "define"],
    tagline: "Diagnosis plus positioning, in one run.",
    forWho: "Founder-led businesses that have outgrown the story they launched with.",
    timeline: "5–8 weeks",
    highlight: false,
  },
  {
    key: "launchpad",
    name: "Launchpad",
    stages: ["define", "build"],
    tagline: "Decide it and build it, without a handover gap.",
    forWho: "New products, new markets, or a rebrand that has to ship on a date.",
    timeline: "9–16 weeks",
    highlight: true,
  },
  {
    key: "operating-system",
    name: "Full Operating System",
    stages: ["diagnose", "define", "build", "connect", "scale"],
    tagline: "The whole arc, sequenced and owned end to end.",
    forWho: "Multi-channel groups where several parts contradict each other.",
    timeline: "6–12 months",
    highlight: false,
  },
];