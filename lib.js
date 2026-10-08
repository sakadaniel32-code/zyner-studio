/* Zyner Studio: style library and document types.
   Styles are written as plain descriptions plus design tokens, so new ones can be added
   by studying reference PDFs (by hand, or with the "Learn a style from a PDF" button). */
window.STYLES = [
 {id:'editorial-dark', name:'Editorial Dark', bestFor:'Identity concepts, pitches, bold or tech-led brands',
  desc:'Near-black covers, warm paper pages, heavy condensed headlines and the brand colour on section breaks.',
  guide:'Confident and editorial. Few words per page, big declarative headlines, lots of space. Dark pages for drama (cover, brand mark, closing), paper pages for explanation, accent pages only to open a section. Work goes on large tiles. Never more than one idea per page.',
  t:{dark:'#0e0e0e',paper:'#f4f2ee',ink:'#111111',accent:'#d2571f',hf:'Archivo',hs:'72%',hw:800,hl:'-0.005em',hcase:'none',ccase:'uppercase',bf:'Inter',r:14,grain:1,cover:'dark',divider:'accent',content:'paper',alt:'dark'}},
 {id:'swiss-clean', name:'Swiss Clean', bestFor:'Brand guidelines, proposals, corporate and fintech brands',
  desc:'White pages, tight black sans headlines, strict grid, colour used only where it means something.',
  guide:'Calm, precise, systematic. Mostly white pages, black dividers. Headlines are short and factual. Use tables and numbered lists freely. Colour appears only in swatches and the work itself. Sharp corners, no decoration.',
  t:{dark:'#111111',paper:'#ffffff',ink:'#0b0b0b',accent:'#1f4bff',hf:'Inter',hs:'100%',hw:700,hl:'-0.04em',hcase:'none',ccase:'none',bf:'Inter',r:0,grain:0,cover:'paper',divider:'dark',content:'paper',alt:'paper'}},
 {id:'serif-quiet', name:'Quiet Serif', bestFor:'Luxury, hospitality, fashion, food, personal brands',
  desc:'Cream pages, soft serif headlines, deep brown-black covers, slow pacing.',
  guide:'Understated and warm. Serif headlines in sentence case, generous margins, short paragraphs. Use quotes and statement pages to set mood. Dark pages sparingly. Small rounded corners.',
  t:{dark:'#1d1a16',paper:'#efe9df',ink:'#1d1a16',accent:'#8a5a3b',hf:'Fraunces',hs:'100%',hw:400,hl:'-0.02em',hcase:'none',ccase:'none',bf:'Inter',r:4,grain:1,cover:'dark',divider:'paper',content:'paper',alt:'dark'}},
 {id:'colour-block', name:'Colour Block', bestFor:'Youth, lifestyle, consumer apps, events, campus brands',
  desc:'The brand colour takes over covers and breaks, rounded tiles, punchy geometric headlines.',
  guide:'Energetic and direct. Covers and section breaks fill with the brand colour. Rounded tiles, chunky geometric headlines, short punchy copy. Mix dark and light pages for rhythm.',
  t:{dark:'#121212',paper:'#f7f5f0',ink:'#121212',accent:'#ff5a1f',hf:'Space Grotesk',hs:'100%',hw:700,hl:'-0.035em',hcase:'none',ccase:'none',bf:'Inter',r:26,grain:0,cover:'accent',divider:'accent',content:'paper',alt:'dark'}},
 {id:'campaign', name:'Campaign', bestFor:'Movements, nonprofits, social enterprises, community and purpose-led brands, impact reports',
  desc:'Heavy geometric headlines that switch colour halfway, a deep brand colour on every big moment, and U-shaped panels that hold the copy.',
  guide:'Loud, warm and human, like a campaign poster. Headlines are two short sentences: the first states it, the second lands it, and the second sentence takes the accent colour. Open sections with full deep-colour pages and one huge headline. Body copy sits inside rounded U-shaped panels or beside them. Use plenty of statement pages and short, staccato sentences. Show people and real work wherever possible.',
  t:{kit:'campaign',dark:'auto',paper:'#ffffff',ink:'#2b2140',accent:'#f47c2c',hf:'Montserrat',hs:'100%',hw:900,hl:'-0.025em',hcase:'none',ccase:'none',bf:'Montserrat',r:0,grain:0,cover:'dark',divider:'dark',content:'paper',alt:'dark'}},
 {id:'grid-editorial', name:'Gallery Grid', bestFor:'Brand guidelines, cultural and city brands, institutions, studios, design-led brands',
  desc:'Pale grey pages on a strict three-column grid, numbered sections in the left column, hairline rules and a brand-colour band along the bottom.',
  guide:'Quiet, exact and gallery-like. Every page uses the same grid: a numbered section title in the left column (like 5.2), copy in the middle column, work across the right two columns. Headlines are short and factual in a medium-weight grotesk, never shouty. Hairline rules separate header from content. The brand colours appear as a thin band at the foot of every page and as a stacked swatch on the cover. Dark pages only for the cover, section openers and the thank-you page.',
  t:{kit:'grid',dark:'#141417',paper:'#e6e4e4',ink:'#0d0d0f',accent:'#e0b942',hf:'Inter Tight',hs:'100%',hw:500,hl:'-0.035em',hcase:'none',ccase:'none',bf:'Inter Tight',r:0,grain:0,cover:'dark',divider:'dark',content:'paper',alt:'dark'}},
 {id:'industrial', name:'Industrial', bestFor:'Engineering, construction, energy, logistics, manufacturing, B2B services and corporate guides',
  desc:'Tall condensed uppercase headlines, a black navigation bar across the top of every page, boxed callouts and hard colour blocks.',
  guide:'Strong, direct and corporate. Every page carries a black bar listing the document sections, with the current one in the accent colour. Each headline has a small accent kicker above it naming the section. Headlines are tall, condensed and uppercase; body copy is plain and practical. Put the one line that matters in an outlined accent box. Section openers are black with full-width colour blocks. Use tables and spec-style lists freely. No rounded corners.',
  t:{kit:'ind',dark:'#000000',paper:'#ffffff',ink:'#000000',accent:'#d3222a',hf:'Oswald',hs:'100%',hw:500,hl:'0',hcase:'uppercase',ccase:'uppercase',bf:'Source Sans 3',r:0,grain:0,cover:'dark',divider:'dark',content:'paper',alt:'dark'}},
 {id:'signal', name:'Signal', bestFor:'Safety, infrastructure, mobility, tech and any brand built on one high-visibility colour',
  desc:'Warm white pages, bold sans headlines top left, one high-visibility accent, cut-corner panels, corner brackets and a colour strip along the bottom.',
  guide:'Clear, reliable and visible. Headlines sit top left and say the point plainly. Content pages are warm white with the accent as a strip along the bottom edge and the brand name small in the corner. Dark pages open sections with just the section name. Group points in dark panels with one cut corner. Frame key images with accent corner brackets. Use do and don\u2019t comparisons, tables with a dark header row, and triple chevrons to point forward. Keep copy short and direct.',
  t:{kit:'sig',dark:'#212427',paper:'#fefef4',ink:'#212427',accent:'#e0ff00',hf:'Inter',hs:'100%',hw:700,hl:'-0.025em',hcase:'none',ccase:'none',bf:'Inter',r:0,grain:0,cover:'dark',divider:'dark',content:'paper',alt:'accent'}},
 {id:'poster', name:'Poster', bestFor:'Apps, consumer tech, youth and social brands, media, anything built on one loud signature colour',
  desc:'Full-bleed signature-colour cover and closing, huge condensed uppercase type, black section breaks and soft grey cards on the right half of white pages.',
  guide:'Bold, simple and confident, like an app brand book. The cover and the thank-you page are flooded with the signature colour and carry one giant condensed uppercase line at the bottom left. Sections open on plain black pages with the title at the bottom left. Content pages are white: a small running header across the top, the headline top left in condensed caps, a short explanation in the left column, and the work, rules or specs stacked in soft grey rounded cards on the right half. Keep words few and use clear do and don\u2019t lists.',
  t:{kit:'poster',dark:'#000000',paper:'#ffffff',ink:'#000000',accent:'#fffc00',hf:'Barlow Condensed',hs:'100%',hw:700,hl:'0',hcase:'uppercase',ccase:'uppercase',bf:'DM Sans',r:10,grain:0,cover:'accent',divider:'dark',content:'paper',alt:'accent'}}
];



window.DOCTYPES = [
 {id:'identity', name:'Brand identity concept', short:'Present a new identity and the thinking behind it.', tint:'#d2571f',
  guide:'Cover; the idea (statement); what the brand solves and how it should be perceived; a divider into the identity; one page per key piece (logo, symbol, sub-brands); supporting pieces grouped; colour; typography if any; a closing page on what stays fixed and what can flex.'},
 {id:'guide', name:'Brand guidelines', short:'The rules for using the brand properly.', tint:'#1f4bff',
  guide:'Cover; contents; who the brand is; values or personality; logo section with each logo piece and clear rules (list of do and don\'t); colour with usage notes; typography; other brand elements; voice; contact.'},
 {id:'proposal', name:'Project proposal', short:'Win the job: problem, approach, scope, timeline, price.', tint:'#0f9d6b',
  guide:'Cover (prepared for the client); what we heard (the problem); our approach; what you get (deliverables list); how we will work (steps/timeline); investment (table from details); why us; next steps.'},
 {id:'pitch', name:'Pitch deck', short:'Sell the business or idea to investors or partners.', tint:'#7a3cff',
  guide:'Cover; problem; solution; product (pieces); market; business model; traction or numbers (table); team; the ask.'},
 {id:'logo', name:'Logo presentation', short:'Show a logo, how it was built and how it works.', tint:'#e0a100',
  guide:'Cover; the idea behind the mark; each logo piece on its own page; variations; colour; the logo in use (supporting pieces); closing.'},
 {id:'strategy', name:'Brand strategy', short:'Purpose, positioning, audience, personality, voice.', tint:'#c2185b',
  guide:'Cover; what the brand is about; the problem it solves; who it is for; how it should be perceived; personality traits (list); messaging pillars (list); voice; closing.'},
 {id:'brief', name:'Creative brief', short:'Align the team before design starts.', tint:'#00838f',
  guide:'Cover; overview; the problem; audience; the one thing to remember (statement); deliverables (list); timeline and details (table); closing.'},
 {id:'case', name:'Case study', short:'Show finished work and what it changed.', tint:'#5d4037',
  guide:'Cover; the client; the challenge; the approach; the work (key pieces, supporting pieces, colour); the result; closing.'}
];

window.LAYOUTS = {
 cover:'Title page. Uses document title, brand name and the hero piece.',
 statement:'One big headline (h) with a short body (b). For the core idea or a key belief.',
 text:'Headline (h) on the left, body (b) on the right. For explanation.',
 divider:'Section break. h is the section name.',
 list:'h plus items: 3 to 6 short points, each "Title: one sentence".',
 steps:'h plus items: 3 to 5 sequential steps, each "Step name: one sentence".',
 table:'h, optional b, rows: 2 to 8 rows of [label, value].',
 piece:'One piece shown large. pieces: [one piece id]. h and b explain it.',
 pieces:'Grid of several pieces. pieces: [ids]. h and b introduce them.',
 colours:'Colour palette with h and b.',
 type:'Typography specimens with h and b.',
 quote:'A memorable line in h, attribution or context in b.',
 closing:'Final page. h and b, plus contact details.'
};
