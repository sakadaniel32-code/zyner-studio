/* Zyner Studio v2 */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const paras=s=>esc(s).split(/\n\s*\n/).filter(x=>x.trim()).map(x=>'<p>'+x.trim().replace(/\n/g,'<br>')+'</p>').join('');
const uid=()=>Math.random().toString(36).slice(2,10);
const HEX=/^#[0-9a-f]{6}$/i;
function toast(m,err,ms=3200){const t=$('#toast');t.textContent=m;t.className=err?'err':'';t.style.display='block';clearTimeout(toast.t);if(ms)toast.t=setTimeout(()=>t.style.display='none',ms)}
function lum(hex){const h=(hex||'#000').replace('#','');if(!/^[0-9a-f]{6}$/i.test(h))return 0;const n=parseInt(h,16);return(0.299*(n>>16&255)+0.587*(n>>8&255)+0.114*(n&255))/255}
const mix=(a,b,t)=>'#'+[1,3,5].map(i=>Math.round(parseInt(a.substr(i,2),16)*(1-t)+parseInt(b.substr(i,2),16)*t).toString(16).padStart(2,'0')).join('');
const fg=hex=>lum(hex)>.6?'#111111':'#ffffff';
function readFile(f,as){return new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);as==='text'?fr.readAsText(f):fr.readAsDataURL(f)})}
async function shrink(u,max=1600){if(!u.startsWith('data:image/')||u.startsWith('data:image/svg'))return u;return new Promise(r=>{const im=new Image();im.onload=()=>{const s=Math.min(1,max/Math.max(im.width,im.height));if(s===1)return r(u);const c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);r(c.toDataURL('image/png'))};im.onerror=()=>r(u);im.src=u})}
function pick(accept,multi){return new Promise(r=>{const i=document.createElement('input');i.type='file';i.accept=accept;i.multiple=!!multi;i.onchange=()=>r([...i.files]);i.click()})}

/* ---------- state ---------- */
let S={projects:[],styles:[],me:{name:'',agency:''}};
const DB={db:null,open(){return new Promise((r,j)=>{const q=indexedDB.open('zyner-studio-2',1);q.onupgradeneeded=()=>q.result.createObjectStore('kv');q.onsuccess=()=>{this.db=q.result;r()};q.onerror=j})},
 get(k){return new Promise(r=>{const q=this.db.transaction('kv').objectStore('kv').get(k);q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)})},
 put(k,v){return new Promise(r=>{const t=this.db.transaction('kv','readwrite');t.objectStore('kv').put(v,k);t.oncomplete=r;t.onerror=r})}};
let sT;function save(){clearTimeout(sT);sT=setTimeout(()=>DB.put('state',S),350)}
const allStyles=()=>[...STYLES,...S.styles];
const styleBy=id=>allStyles().find(s=>s.id===id)||STYLES[0];
const typeBy=id=>DOCTYPES.find(d=>d.id===id)||DOCTYPES[0];
const proj=id=>S.projects.find(p=>p.id===id);
const KINDS=['Logo','Wordmark','Symbol','Lockup','Sub-brand','Product','App icon','Pattern','Illustration','Photography','Mockup','Social post','Packaging','Signage','Other'];
function newProject(o={}){return Object.assign({id:uid(),name:'Untitled project',type:'identity',style:'auto',accent:'',
 brand:{name:'',tagline:'',about:'',problem:'',audience:'',perception:'',voice:''},
 meta:{title:'',client:'',author:S.me.name||'',agency:S.me.agency||'',date:new Date().toLocaleDateString('en-GB',{month:'long',year:'numeric'}),contact:''},
 pieces:[],colours:[],fonts:[],notes:'',refs:[],details:[],docs:[],current:'',updated:Date.now()},o)}

/* ---------- icons ---------- */
const I={home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',folder:'<path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>',doc:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',grid:'<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
 brush:'<path d="M14 4l6 6-8 8H6v-6z"/><path d="M4 20h4"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',plus:'<path d="M12 5v14M5 12h14"/>',spark:'<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>',upload:'<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',back:'<path d="M15 5l-7 7 7 7"/>',dl:'<path d="M12 4v12M7 11l5 5 5-5M4 20h16"/>',zap:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'};
const ic=(n,s=16)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${I[n]}</svg>`;

/* ---------- document engine ---------- */
function accentOf(p,st){if(HEX.test(p.accent||''))return p.accent;const k=p.pieces.find(x=>x.include&&x.key&&x.colours?.find(c=>HEX.test(c)));if(k)return k.colours.find(c=>HEX.test(c));const c=p.colours.find(c=>HEX.test(c.hex));return c?c.hex:st.t.accent}
function surf(st,acc,tone,deep){const t=st.t;if(tone==='dark')return[t.dark==='auto'?(deep||'#1a1530'):t.dark,'#f3f1ec'];if(tone==='accent')return[acc,fg(acc)];return[t.paper,t.ink]}
function styleVars(st,acc){const t=st.t;return `--hf:'${t.hf}';--hs:${t.hs};--hw:${t.hw};--hl:${t.hl};--hc:${t.hcase};--cc:${t.ccase};--bf:'${t.bf}';--r:${t.r}px;--acc:${acc};--accfg:${fg(acc)};--ink:${t.ink}`}
function heroPiece(p){const ok=p.pieces.filter(x=>x.include&&x.files?.length);return ok.find(x=>x.key&&/Symbol|Logo/.test(x.kind))||ok.find(x=>x.key&&/Lockup|Wordmark/.test(x.kind))||ok.find(x=>x.key)||ok[0]}
function tileOf(x,st){return HEX.test(x.tile||'')?x.tile:(x.colours?.[1]&&HEX.test(x.colours[1])?x.colours[1]:'#e8e5df')}
function renderPages(p,doc,editable){
 const st=styleBy(doc.style),acc=HEX.test(doc.accent||'')?doc.accent:accentOf(p,st);
 const brand=esc(p.brand.name||p.name),title=esc(p.meta.title||typeBy(doc.type).name);
 const E=(i,f)=>editable?` contenteditable="true" data-ed="${i}.${f}"`:'';
 const K=st.t.kit||'',al=acc.toLowerCase();
 const uq=[...new Set([...p.colours.map(c=>c.hex),...p.pieces.filter(x=>x.include).flatMap(x=>x.colours||[])].filter(c=>HEX.test(c||'')).map(c=>c.toLowerCase()))];
 const sat=c=>{const v=[1,3,5].map(i=>parseInt(c.substr(i,2),16));return(Math.max(...v)-Math.min(...v))/255};
 const deep=uq.find(c=>c!==al&&lum(c)<.25&&sat(c)>.12)||mix(acc,'#0d0b18',.8);
 const band=[acc,...uq.filter(c=>c!==al&&lum(c)>.04)].slice(0,3);while(band.length<3)band.push(band.length===1?deep:mix(acc,'#ffffff',.55));
 const secs=doc.pages.filter(x=>x.layout==='divider').map(x=>x.h||'');
 const two=s=>{s=String(s||'');const m=s.match(/^(.+?[.!?])\s+(\S.*)$/);return K==='campaign'&&m?esc(m[1])+' <span class="a2">'+esc(m[2])+'</span>':esc(s)};
 let n=0,sec=0,sub=0;const out=[];
 doc.pages.forEach((pg,i)=>{
  const L=LAYOUTS[pg.layout]?pg.layout:'text';n++;
  let tone=pg.tone||(L==='cover'?st.t.cover:L==='divider'?st.t.divider:L==='closing'?st.t.alt:(['statement','quote'].includes(L)&&i%2?st.t.alt:st.t.content));
  const [bg,fgc]=surf(st,acc,tone,deep);if(L==='divider')sub=0;else if(L!=='cover')sub++;
  const H=`<h2 class="H"${E(i,'h')}>${two(pg.h)}</h2>`,B=`<div class="B"${E(i,'b')}>${paras(pg.b||'')||(editable?'<p style="opacity:.35">Body text</p>':'')}</div>`;
  const pcs=(pg.pieces||[]).map(id=>p.pieces.find(x=>x.id===id)).filter(x=>x&&x.include);
  const img=(x,k=0)=>x.files?.[k]?`<img src="${x.files[k]}">`:`<b style="font-size:28px;color:${fg(tileOf(x,st))}">${esc(x.name)}</b>`;
  let inner='';
  if(L==='cover'){const h=heroPiece(p);inner=`<div class="brand">${brand}</div><div class="tt"><h1 class="H"${E(i,'h')}>${pg.h?two(pg.h):title}</h1><div class="meta">${esc(pg.b||[p.meta.client&&'Prepared for '+p.meta.client,(p.meta.author||p.meta.agency)&&'by '+[p.meta.author,p.meta.agency].filter(Boolean).join(', '),p.meta.date].filter(Boolean).join(' · '))}</div></div>${h?`<div class="hero tile" style="background:${tileOf(h,st)===bg?'transparent':tileOf(h,st)}">${img(h)}</div>`:''}`}
  else if(L==='statement'||L==='text'||L==='quote'){inner=(L==='quote'?'<div class="q">“</div>':'')+H+B}
  else if(L==='divider'){sec++;inner=H+`<div class="num">${String(sec).padStart(2,'0')}</div>`}
  else if(L==='list'||L==='steps'){const it=(pg.items||[]).slice(0,6);inner=`<div class="hdr">${H}${B}</div><div class="items" style="grid-template-columns:repeat(${L==='steps'?Math.max(it.length,1):Math.min(Math.max(it.length,1),3)},1fr)">${it.map((s,k)=>{const [a,...r]=String(s).split(':');return `<div class="it"><div class="n">${String(k+1).padStart(2,'0')}</div><b>${esc(r.length?a:'')}</b><span>${esc(r.length?r.join(':').trim():a)}</span></div>`}).join('')}</div>`}
  else if(L==='table'){inner=`<div class="hdr">${H}${B}</div><table>${(pg.rows||[]).slice(0,8).map(r=>`<tr>${(Array.isArray(r)?r:[r]).slice(0,3).map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</table>`}
  else if(L==='piece'){const x=pcs[0];inner=`<div class="l">${H}${B}${x?`<div class="extra">${(x.files||[]).slice(1,3).map(f=>`<div class="tile" style="background:${tileOf(x,st)}"><img src="${f}"></div>`).join('')}<div class="chips">${(x.colours||[]).filter(c=>HEX.test(c)).map(c=>`<div class="chip"><i style="background:${c}"></i>${c.toUpperCase()}</div>`).join('')}</div></div>`:''}</div>${x?`<div class="r"><div class="tile" style="background:${tileOf(x,st)}">${img(x)}</div></div>`:''}`}
  else if(L==='pieces'){const xs=pcs.slice(0,8);const c=xs.length>4?4:Math.max(xs.length,1);inner=`<div class="hdr">${H}${B}</div><div class="tiles" style="grid-template-columns:repeat(${c},1fr)">${xs.map(x=>`<div class="cell"><div class="tile" style="background:${tileOf(x,st)}">${img(x)}</div><small>${esc(x.name)}</small></div>`).join('')}</div>`}
  else if(L==='colours'){const cs=[...p.colours.filter(c=>HEX.test(c.hex)),...p.pieces.filter(x=>x.include).flatMap(x=>(x.colours||[]).filter(c=>HEX.test(c)).map((c,k)=>({name:x.name+(k?' base':''),hex:c})))];const seen=new Set();const u=cs.filter(c=>!seen.has(c.hex.toLowerCase())&&seen.add(c.hex.toLowerCase())).slice(0,10);
   inner=`<div class="hdr">${H}${B}</div><div class="sw">${u.map(c=>`<div class="s" style="background:${c.hex};color:${fg(c.hex)}">${esc(c.name)}<span>${c.hex.toUpperCase()}</span></div>`).join('')}</div>`}
  else if(L==='type'){const fs=p.fonts.filter(f=>f.name).slice(0,3);inner=`<div class="hdr">${H}${B}</div><div class="fonts" style="grid-template-columns:repeat(${Math.max(fs.length,1)},1fr)">${fs.map(f=>`<div class="fc"><div class="aa" style="font-family:'${esc(f.name)}',var(--hf)">Aa</div><b>${esc(f.name)}</b><span>${esc(f.role||'')}</span></div>`).join('')}</div>`}
  else if(L==='closing'){const h=heroPiece(p);inner=H+B+`<div class="contact">${esc([p.meta.author,p.meta.agency,p.meta.contact].filter(Boolean).join(' · '))}</div>${h&&h.files?.[0]?`<div class="hero tile" style="background:${tileOf(h,st)===bg?'transparent':tileOf(h,st)}">${img(h)}</div>`:''}`}
  const sw=cs=>cs.map(c=>`<i style="background:${c}"></i>`).join('');
  let chrome=L==='cover'?'':`<div class="lab">${K==='grid'?`<span>${Math.max(sec,1)}.${L==='divider'?0:sub}</span>`:''}${esc(pg.label||'')}</div><div class="no">${String(n).padStart(2,'0')}</div>`+(K==='grid'?`<div class="foot"><span>${n}</span><span>${brand}</span><span>${title}</span></div>`:`<div class="foot"><span>${brand} · ${title}</span><span>${esc(p.meta.agency||p.meta.author||'')}</span></div>`);
  if(K==='campaign'&&L!=='cover')chrome+='<div class="rule"></div><div class="rule b"></div>';
  if(K==='grid')chrome+=L==='cover'?`<div class="rule"></div><div class="rule m"></div><div class="stack">${sw(band)}</div>`:`<div class="rule"></div><div class="stripe">${sw(band)}</div>`;
  if(K==='ind'&&L!=='cover'){chrome+=`<div class="nav">${(secs.length?secs:[brand]).map((s,k)=>`<span${k===sec-1||(!secs.length)?' class="on"':''}>${esc(s)}</span>`).join('<em>/</em>')}</div>`;if(L==='divider')chrome+=`<div class="blocks">${sw([band[0],'#ffffff',band[1]])}</div>`}
  if(K==='sig'){if(L!=='cover')chrome+=`<div class="strip"></div><div class="mark">${brand}</div>`;if(L==='statement'||L==='closing')chrome+='<div class="chev"><i></i><i></i><i></i></div>'}
  out.push(`<div class="pg L-${L} t-${tone}${K?' k-'+K:''}${st.t.grain?' grain':''}" style="${styleVars(st,acc)};--bg0:${bg};--fg0:${fgc};--deep:${deep}">${chrome}${inner}</div>`);
 });
 return out;
}

/* rule-based builder (works with no AI key) */
function basicDoc(p,styleId){
 const b=p.brand,pcs=p.pieces.filter(x=>x.include),key=pcs.filter(x=>x.key),sup=pcs.filter(x=>!x.key),logos=pcs.filter(x=>/Logo|Wordmark|Symbol|Lockup/.test(x.kind));
 const pg=[],add=(layout,o)=>pg.push(Object.assign({layout},o));
 const det=p.details.filter(d=>d.label||d.value).map(d=>[d.label,d.value]);
 const piecePages=xs=>xs.forEach(x=>add('piece',{label:x.kind,h:x.name,b:x.note||'',pieces:[x.id]}));
 const cols=()=>{if(p.colours.length||pcs.some(x=>x.colours?.length))add('colours',{label:'Colour',h:'Colour',b:''})};
 const type=()=>{if(p.fonts.some(f=>f.name))add('type',{label:'Typography',h:'Typography',b:''})};
 add('cover',{});
 switch(p.type){
  case 'guide':
   add('list',{label:'Contents',h:'Contents',items:['Who we are','Logo','Colour','Typography','Voice'].filter((s,i)=>i!==4||b.voice)});
   if(b.about)add('statement',{label:'Who we are',h:b.tagline||'Who we are',b:b.about});
   if(b.perception)add('text',{label:'Who we are',h:'How we want to be seen',b:b.perception});
   add('divider',{h:'Logo'});piecePages(logos);
   add('list',{label:'Logo',h:'Keep it consistent',items:["Don't stretch: scale the logo in proportion only.","Don't recolour: use the approved colours only.","Give it space: keep clear room around it.","Check contrast: place it on backgrounds it reads on."]});
   add('divider',{h:'Colour and type'});cols();type();
   if(sup.filter(x=>!logos.includes(x)).length)add('pieces',{label:'Brand elements',h:'Other brand elements',pieces:sup.filter(x=>!logos.includes(x)).map(x=>x.id)});
   if(b.voice)add('text',{label:'Voice',h:'How we sound',b:b.voice});
   add('closing',{h:'Questions about the brand?',b:'Get in touch before you use the brand in a new way.'});break;
  case 'proposal':
   if(b.problem)add('text',{label:'What we heard',h:'What we heard',b:b.problem});
   if(b.about)add('statement',{label:'Our approach',h:b.tagline||'Our approach',b:b.about});
   add('steps',{label:'How we work',h:'How we will work',items:['Discover: understand the business, the audience and the problem.','Define: agree the strategy and what the brand should say.','Design: build the identity and test it in real use.','Deliver: hand over files, guidelines and support.']});
   if(det.length)add('table',{label:'Investment',h:'Scope and investment',rows:det});
   add('closing',{h:'Next steps',b:'Confirm the scope and we will book a kickoff call.'});break;
  case 'pitch':
   if(b.problem)add('statement',{label:'Problem',h:'The problem',b:b.problem});
   if(b.about)add('statement',{label:'Solution',h:b.tagline||'Our solution',b:b.about});
   if(key.length)add('pieces',{label:'Product',h:'What we built',pieces:key.map(x=>x.id)});
   if(b.audience)add('text',{label:'Market',h:'Who it is for',b:b.audience});
   if(det.length)add('table',{label:'Numbers',h:'Where we are',rows:det});
   add('closing',{h:'Thank you',b:''});break;
  case 'strategy': case 'brief':
   if(b.about)add('statement',{label:'Overview',h:b.tagline||'What this is about',b:b.about});
   if(b.problem)add('text',{label:'The problem',h:'The problem',b:b.problem});
   if(b.audience)add('text',{label:'Audience',h:'Who it is for',b:b.audience});
   if(b.perception)add('quote',{label:'Perception',h:b.perception.split(/[.!?]/)[0],b:'How the brand should be seen'});
   if(b.voice)add('text',{label:'Voice',h:'How it sounds',b:b.voice});
   if(det.length)add('table',{label:'Details',h:'Details',rows:det});
   add('closing',{h:'Thank you',b:''});break;
  default: /* identity, logo, case */
   if(p.type==='case'&&b.problem)add('text',{label:'The challenge',h:'The challenge',b:b.problem});
   if(b.about)add('statement',{label:'The idea',h:b.tagline||'The idea',b:b.about});
   if(p.type!=='case'&&b.problem)add('text',{label:'The problem',h:'What it solves',b:b.problem});
   if(b.perception&&p.type!=='case')add('text',{label:'Perception',h:'How it should feel',b:b.perception});
   add('divider',{h:p.type==='case'?'The work':'The identity'});
   piecePages(p.type==='logo'?logos:key);
   const rest=p.type==='logo'?pcs.filter(x=>!logos.includes(x)):sup;
   if(rest.length)add('pieces',{label:'In use',h:p.type==='logo'?'In use':'Supporting pieces',pieces:rest.map(x=>x.id)});
   cols();type();
   add('closing',{h:p.type==='case'?'The result':'Thank you',b:p.type==='case'?(b.perception||''):''});
 }
 return {id:uid(),at:Date.now(),type:p.type,style:styleId,accent:'',why:'',pages:pg};
}

/* ---------- AI ---------- */
const AIDEF={gemini:'gemini-2.5-flash',openai:'gpt-4o-mini',anthropic:'claude-3-5-haiku-latest'};
const ai=()=>{const prov=localStorage.zsProv||'gemini';return{prov,key:localStorage['zsKey_'+prov]||'',model:localStorage['zsModel_'+prov]||AIDEF[prov]}};
async function callAI(user,system,pdfs=[]){const c=ai();if(!c.key)throw Error('Add your AI key in Settings first');
 if(c.prov==='gemini'){const parts=[{text:user},...pdfs.map(d=>({inline_data:{mime_type:'application/pdf',data:d.split(',')[1]}}))];
  const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(c.model)}:generateContent?key=${encodeURIComponent(c.key)}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({systemInstruction:{parts:[{text:system}]},contents:[{role:'user',parts}],generationConfig:{responseMimeType:'application/json',temperature:.7}})});
  const j=await r.json();if(!r.ok)throw Error('Gemini: '+(j.error?.message||r.status));return j.candidates?.[0]?.content?.parts?.map(x=>x.text||'').join('')||''}
 if(c.prov==='openai'){const r=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+c.key},body:JSON.stringify({model:c.model,response_format:{type:'json_object'},messages:[{role:'system',content:system},{role:'user',content:user}]})});
  const j=await r.json();if(!r.ok)throw Error('OpenAI: '+(j.error?.message||r.status));return j.choices[0].message.content}
 const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':c.key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model:c.model,max_tokens:8000,system,messages:[{role:'user',content:user}]})});
 const j=await r.json();if(!r.ok)throw Error('Claude: '+(j.error?.message||r.status));return j.content.map(x=>x.text||'').join('')}
function parseJSON(t){t=t.trim().replace(/^```(json)?/i,'').replace(/```$/,'').trim();return JSON.parse(t.slice(t.indexOf('{'),t.lastIndexOf('}')+1))}
const WRITER=`You are a senior brand strategist and art director building a presentation document. Write like a sharp consultant explaining their thinking to a smart client: plain words, specific reasons, short sentences, the why behind each decision.
Rules: use only facts found in the brief, notes and reference files; never invent statistics, clients, prices, dates or claims. If something is missing, leave that page out rather than making it up. No buzzwords or filler (elevate, seamless, vibrant, robust, leverage, journey, cutting-edge, game-changer, in today's world, testament, unlock). No em dashes or en dashes. No exclamation marks. Headlines are declarative takeaways in sentence case, 2 to 8 words. Return valid JSON only.`;
function briefText(p){const b=p.brand;const txt=p.refs.filter(f=>f.kind==='text').map(f=>`--- ${f.name} ---\n${f.data.slice(0,20000)}`).join('\n\n');
 return `DOCUMENT TYPE: ${typeBy(p.type).name}
BRAND: ${b.name||p.name}
TAGLINE: ${b.tagline}
WHAT IT IS / DOES: ${b.about}
WHAT IT SOLVES: ${b.problem}
WHO IT IS FOR: ${b.audience}
HOW IT SHOULD BE PERCEIVED: ${b.perception}
VOICE: ${b.voice}
CLIENT: ${p.meta.client}   PREPARED BY: ${[p.meta.author,p.meta.agency].filter(Boolean).join(', ')}
PIECES (id | kind | name | key or supporting | part of | colours | has image | note):
${p.pieces.filter(x=>x.include).map(x=>`${x.id} | ${x.kind} | ${x.name} | ${x.key?'key':'supporting'} | ${p.pieces.find(y=>y.id===x.parent)?.name||'-'} | ${(x.colours||[]).join(' ')} | ${x.files?.length?'yes':'no'} | ${x.note||''}`).join('\n')||'none'}
COLOURS: ${p.colours.map(c=>c.name+' '+c.hex).join(', ')||'none'}
TYPEFACES: ${p.fonts.map(f=>f.name+' ('+(f.role||'')+')').join(', ')||'none'}
DETAILS: ${p.details.map(d=>d.label+': '+d.value).join('; ')||'none'}
NOTES:
${p.notes||'(none)'}${txt?'\nREFERENCE FILES:\n'+txt:''}`}
async function aiDoc(p,styleChoice){
 const sts=allStyles(),t=typeBy(p.type);
 const user=`${briefText(p)}

DOCUMENT GUIDE for a ${t.name}: ${t.guide}

AVAILABLE STYLES:
${sts.map(s=>`- ${s.id}: ${s.name}. Best for: ${s.bestFor}. ${s.guide}`).join('\n')}
${styleChoice==='auto'?'Choose the style that best fits this brand, its audience and this document type, and say why in one sentence.':'Use style "'+styleChoice+'" and follow its guide.'}

AVAILABLE PAGE LAYOUTS:
${Object.entries(LAYOUTS).map(([k,v])=>'- '+k+': '+v).join('\n')}

Plan the document page by page (8 to 18 pages). Start with cover, end with closing. Only use colours/type layouts if colours/typefaces exist. Reference pieces only by the ids listed. Each page: layout, label (short section name), h, b (0 to 70 words, paragraphs separated by a blank line), and when needed items, rows or pieces. Optional tone: "dark", "light" or "accent" to vary rhythm.
Return JSON: {"style":"style-id","why":"one sentence","pages":[{"layout":"","label":"","h":"","b":"","items":[],"rows":[],"pieces":[]}]}`;
 const j=parseJSON(await callAI(user,WRITER,p.refs.filter(f=>f.kind==='pdf').map(f=>f.data)));
 const ids=new Set(p.pieces.map(x=>x.id));
 const pages=(j.pages||[]).filter(x=>LAYOUTS[x.layout]).map(x=>({layout:x.layout,label:x.label||'',h:x.h||'',b:x.b||'',items:Array.isArray(x.items)?x.items:[],rows:Array.isArray(x.rows)?x.rows:[],pieces:(x.pieces||[]).filter(i=>ids.has(i)),tone:{dark:'dark',light:'paper',accent:'accent'}[x.tone]}));
 if(!pages.length)throw Error('The AI reply had no pages. Try again.');
 if(pages[0].layout!=='cover')pages.unshift({layout:'cover'});
 const style=styleChoice!=='auto'?styleChoice:(sts.find(s=>s.id===j.style)?j.style:STYLES[0].id);
 return {id:uid(),at:Date.now(),type:p.type,style,accent:'',why:j.why||'',pages};
}
function autoStyle(p){const t=p.type;return t==='guide'||t==='proposal'?'swiss-clean':t==='pitch'?'colour-block':'editorial-dark'}
async function generate(p,btn){
 if(btn)btn.disabled=true;
 try{let d;if(ai().key){toast('Planning pages and writing…','',0);d=await aiDoc(p,p.style);toast('Done. Click any text on the pages to edit it.')}
  else{d=basicDoc(p,p.style==='auto'?autoStyle(p):p.style);d.why='Built without AI from what you filled in. Add an AI key in Settings for written copy and automatic style choice.';toast('Built from your inputs. Add an AI key for written copy.','',5000)}
  p.docs.unshift(d);p.docs=p.docs.slice(0,12);p.current=d.id;p.updated=Date.now();save();return d}
 catch(e){toast(e.message,1,9000)}finally{if(btn)btn.disabled=false}}

/* ---------- PDF ---------- */
async function downloadPDF(p,doc){const r=$('#printroot');r.innerHTML=renderPages(p,doc).join('');document.title=(p.brand.name||p.name)+' - '+(p.meta.title||typeBy(doc.type).name);
 await Promise.all([...r.querySelectorAll('img')].map(i=>i.complete?1:new Promise(z=>{i.onload=i.onerror=z})));await document.fonts.ready;setTimeout(()=>window.print(),150)}
addEventListener('afterprint',()=>{$('#printroot').innerHTML='';document.title='Zyner Studio'});

/* ---------- shell ---------- */
function thumb(p,doc){if(!doc)return `<div class="pthumb" style="display:grid;place-items:center;color:#555">${ic('doc',28)}</div>`;return `<div class="pthumb" data-thumb>${renderPages(p,{...doc,pages:doc.pages.slice(0,1)})[0]}</div>`}
function fitThumbs(){$$('[data-thumb]').forEach(t=>{const pg=t.firstElementChild;if(pg)pg.style.transform=`scale(${t.clientWidth/1280})`})}
function scaleDoc(){$$('.docw').forEach(d=>d.style.setProperty('--s',d.clientWidth/1280));fitThumbs()}
addEventListener('resize',scaleDoc);
const NAV=[['home','Home','home'],['projects','Projects','folder'],['documents','Documents','doc'],['types','Document types','grid'],['styles','Styles','brush']];
function shell(route,body){
 const init=(S.me.name||'Z S').split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase();
 return `<div class="shell"><aside class="side"><div class="ws"><div class="wslogo">Z</div><div><b>Zyner Studio</b><small>${esc(S.me.agency||'Your workspace')}</small></div></div>
 <nav class="nav">${NAV.map(([r,l,i])=>`<a href="#/${r}" class="${route===r?'on':''}">${ic(i)}${l}</a>`).join('')}</nav>
 <div class="navh">Setup</div><nav class="nav"><a href="#/settings" class="${route==='settings'?'on':''}">${ic('gear')}Settings and AI</a></nav>
 <div class="sidecta"><b>${ic('zap',14)} ${ai().key?'AI writer on':'AI writer off'}</b><span>${ai().key?'Using '+ai().prov+'. Generate writes your copy.':'Add a free Gemini key to get written copy.'}</span>${ai().key?'':'<div style="margin-top:8px"><a class="btn sm" href="#/settings">Add key</a></div>'}</div></aside>
 <section class="main"><div class="top"><label class="search">${ic('search')}<input id="q" placeholder="Search projects and documents" value="${esc(route==='projects'?(new URLSearchParams(location.hash.split('?')[1]).get('q')||''):'')}"></label><button class="btn pri" data-new>${ic('plus',14)}<span class="lbl">New project</span></button><a class="av" href="#/settings">${esc(init)}</a></div>
 <div class="wrap">${body}</div></section></div>
 <nav class="mnav">${[...NAV.slice(0,4),['settings','Settings','gear']].map(([r,l,i])=>`<a href="#/${r}" class="${route===r?'on':''}">${ic(i)}${{home:'Home',projects:'Projects',documents:'Docs',types:'Types',settings:'Settings'}[r]}</a>`).join('')}</nav>`}
function bindShell(){$$('[data-new]').forEach(b=>b.onclick=()=>newModal(b.dataset.type));const q=$('#q');if(q)q.onkeydown=e=>{if(e.key==='Enter')location.hash='#/projects?q='+encodeURIComponent(q.value)}}

/* ---------- screens ---------- */
function typeCard(t){return `<div class="tcard" data-new data-type="${t.id}" style="background:linear-gradient(140deg,${t.tint},#141414 120%)"><i></i><b>${esc(t.name)}</b><small>${esc(t.short)}</small></div>`}
function projCard(p){const d=p.docs.find(x=>x.id===p.current)||p.docs[0];return `<a class="pcard" href="#/p/${p.id}">${thumb(p,d)}<div class="pmeta"><b>${esc(p.name)}</b><small>${esc(typeBy(p.type).name)} · ${new Date(p.updated).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</small></div></a>`}
function vHome(){
 const rec=[...S.projects].sort((a,b)=>b.updated-a.updated).slice(0,6);const demo=S.projects.find(p=>p.demo);const dd=demo&&(demo.docs[0]);
 return shell('home',`<div class="quick">
  <button class="qa" data-new><div class="qi">${ic('plus')}</div><div><b>New document</b><small>Start from a document type</small></div></button>
  <a class="qa" href="#/settings"><div class="qi">${ic('spark')}</div><div><b>AI writer</b><small>Connect Gemini, ChatGPT or Claude</small></div></a>
  <a class="qa" href="#/styles"><div class="qi">${ic('brush')}</div><div><b>Learn a style</b><small>Teach it a look from a PDF</small></div></a>
  <button class="qa" id="qImport"><div class="qi">${ic('upload')}</div><div><b>Open project file</b><small>Bring in a saved project</small></div></button></div>
 <div class="hero"><div><h1>Turn your brand thinking into a finished document</h1><p>Add what you know about the brand, upload the pieces you have, pick a document type, then generate. It picks a layout style that suits the brand and writes from your notes.</p><div class="row"><button class="btn pri" data-new>Get started</button>${demo?`<a class="btn ghost" href="#/p/${demo.id}">Open the demo</a>`:''}</div></div>
 <div class="heroart">${dd?[0,1,2].map(k=>dd.pages[k]?`<div class="pv" data-thumb style="width:${[300,260,230][k]}px;aspect-ratio:16/9;right:${[20,170,60][k]}px;top:${[90,10,150][k]}px;z-index:${3-k}">${renderPages(demo,{...dd,pages:[dd.pages[[0,3,8][k]]||dd.pages[k]]})[0]}</div>`:'').join(''):''}</div></div>
 <div class="sec"><h2>Start from a document type</h2><a class="btn sm ghost" href="#/types">All types</a></div>
 <div class="carousel">${DOCTYPES.map(typeCard).join('')}</div>
 <div class="sec"><h2>Recent projects</h2><a class="btn sm ghost" href="#/projects">All projects</a></div>
 ${rec.length?`<div class="grid">${rec.map(projCard).join('')}</div>`:'<div class="empty">No projects yet.</div>'}`)}
function vProjects(){const q=(new URLSearchParams(location.hash.split('?')[1]).get('q')||'').toLowerCase();const ps=[...S.projects].sort((a,b)=>b.updated-a.updated).filter(p=>!q||(p.name+' '+p.brand.name).toLowerCase().includes(q));
 return shell('projects',`<h1 class="ph">Projects</h1><p class="sub">Every brand you're working on. One project can produce many documents.</p>${ps.length?`<div class="grid">${ps.map(projCard).join('')}</div>`:`<div class="empty">${q?'Nothing matches that search.':'No projects yet.'}</div>`}`)}
function vDocuments(){const ds=S.projects.flatMap(p=>p.docs.map(d=>({p,d}))).sort((a,b)=>b.d.at-a.d.at);
 return shell('documents',`<h1 class="ph">Documents</h1><p class="sub">Everything you've generated. Open one to edit text or download it as a PDF.</p>
 ${ds.length?`<div class="list">${ds.map(({p,d})=>`<div class="li">${thumb(p,d)}<div class="grow"><b>${esc(p.brand.name||p.name)} · ${esc(typeBy(d.type).name)}</b><div><span class="chipt">${esc(styleBy(d.style).name)}</span><span class="chipt">${d.pages.length} pages</span><small style="color:var(--mute)">${new Date(d.at).toLocaleString('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</small></div></div><a class="btn sm" href="#/p/${p.id}?doc=${d.id}">Open</a><button class="btn sm" data-dl="${p.id}|${d.id}">${ic('dl',13)}</button></div>`).join('')}</div>`:'<div class="empty">Generate a document in a project and it shows up here.</div>'}`)}
function vTypes(){return shell('types',`<h1 class="ph">Document types</h1><p class="sub">Pick what you're making. The same brand info works for all of them.</p><div class="grid">${DOCTYPES.map(t=>`<div class="pcard" data-new data-type="${t.id}"><div class="tcard" style="border-radius:0;background:linear-gradient(140deg,${t.tint},#141414 120%)"><i></i><b>${esc(t.name)}</b></div><div class="pmeta"><small style="font-size:12.5px">${esc(t.short)}</small><div style="margin-top:6px;color:#77726b;font-size:11.5px">${esc(t.guide)}</div></div></div>`).join('')}</div>`)}
const SAMPLE=()=>{const p=newProject({brand:{name:'Sample',tagline:'',about:'',problem:'',audience:'',perception:'',voice:''},meta:{title:'Brand Identity',author:'',agency:'',date:''}});return p};
function vStyles(){const p=SAMPLE();
 return shell('styles',`<h1 class="ph">Styles</h1><p class="sub">The looks the generator can choose from. Each one is a written guide plus colours and type, so it can be learned from a reference PDF.</p>
 <div class="row" style="margin-bottom:16px;flex-wrap:wrap"><button class="btn pri" id="learn">${ic('upload',14)} Learn a style from a PDF</button><span class="hint" style="margin:0">Needs a Gemini key. Upload a brand book or deck you like.</span></div>
 <div class="grid">${allStyles().map(s=>{const d={type:'identity',style:s.id,accent:s.t.accent,pages:[{layout:'statement',label:'The idea',h:'A clear idea, told simply',b:'This is how body copy sits in this style. Short paragraphs, real reasons.'}]};
  return `<div class="pcard" style="cursor:default">${thumb(p,d)}<div class="pmeta"><b>${esc(s.name)}${S.styles.includes(s)?' <span class="chipt">Learned</span>':''}</b><small>${esc(s.desc)}</small><div style="margin-top:6px;font-size:11.5px;color:#77726b">Best for: ${esc(s.bestFor)}</div>${S.styles.includes(s)?`<button class="btn sm" style="margin-top:8px" data-delst="${s.id}">Remove</button>`:''}</div></div>`}).join('')}</div>`)}
function vSettings(){const c=ai();return shell('settings',`<h1 class="ph">Settings and AI</h1><p class="sub">Keys stay on this device. They are never put into project files.</p>
 <div style="max-width:560px"><div class="two"><div><label class="l">Your name</label><input class="f" id="meName" value="${esc(S.me.name)}"></div><div><label class="l">Agency or studio</label><input class="f" id="meAg" value="${esc(S.me.agency)}"></div></div>
 <label class="l">AI provider</label><select class="f" id="prov"><option value="gemini">Google Gemini (free plan available)</option><option value="openai">OpenAI (ChatGPT)</option><option value="anthropic">Anthropic (Claude)</option></select>
 <label class="l">API key</label><input class="f" type="password" id="key" value="${esc(c.key)}" placeholder="Paste your key">
 <label class="l">Model</label><div class="row"><input class="f" id="model" value="${esc(c.model)}"><button class="btn sm" id="lm">Find models</button></div><select class="f" id="models" style="display:none;margin-top:8px"></select>
 <p class="hint" style="margin-top:12px">Free Gemini key: sign in at aistudio.google.com and choose Get API key. On the free plan Google may use what you send to improve its models, so keep sensitive client details out until you move to a paid key.</p>
 <div class="row"><button class="btn" id="test">Test connection</button></div></div>`)}

/* ---------- new project modal ---------- */
function newModal(type){let sel=type||'identity';const m=$('#modal');
 const draw=()=>{m.innerHTML=`<div class="mbox"><h3>New project</h3><p class="hint">Name it, pick what you're making. You can change both later.</p>
 <label class="l">Brand or project name</label><input class="f" id="nb" placeholder="e.g. Doit, Aiben, Mama Put Kitchen" autofocus>
 <label class="l">Document type</label><div class="tgrid">${DOCTYPES.map(t=>`<div class="topt ${t.id===sel?'on':''}" data-t="${t.id}"><b>${esc(t.name)}</b><small>${esc(t.short)}</small></div>`).join('')}</div>
 <div class="row" style="justify-content:flex-end;margin-top:18px"><button class="btn ghost" id="nc">Cancel</button><button class="btn pri" id="nk">Create and open</button></div></div>`;
  $$('.topt').forEach(o=>o.onclick=()=>{const v=$('#nb').value;sel=o.dataset.t;draw();$('#nb').value=v});
  $('#nc').onclick=()=>m.classList.remove('on');
  $('#nk').onclick=()=>{const n=$('#nb').value.trim()||'Untitled project';const p=newProject({name:n,type:sel});p.brand.name=n;S.projects.unshift(p);save();m.classList.remove('on');location.hash='#/p/'+p.id}};
 draw();m.classList.add('on');m.onclick=e=>{if(e.target===m)m.classList.remove('on')}}

/* ---------- workspace ---------- */
let W={step:'brand',pid:''};
function vWork(p){const docId=new URLSearchParams(location.hash.split('?')[1]).get('doc');if(docId&&p.docs.find(d=>d.id===docId))p.current=docId;
 const doc=p.docs.find(d=>d.id===p.current)||p.docs[0];
 return `<div class="wsp"><div class="wtop"><a class="btn sm ghost" href="#/projects">${ic('back',14)}</a><input class="name" id="pname" value="${esc(p.name)}">
 <select id="ptype" title="Document type">${DOCTYPES.map(t=>`<option value="${t.id}" ${t.id===p.type?'selected':''}>${esc(t.name)}</option>`).join('')}</select>
 <select id="pstyle" title="Style"><option value="auto">Style: let it choose</option>${allStyles().map(s=>`<option value="${s.id}" ${s.id===p.style?'selected':''}>Style: ${esc(s.name)}</option>`).join('')}</select>
 ${p.docs.length>1?`<select id="pver" title="Versions">${p.docs.map((d,k)=>`<option value="${d.id}" ${d.id===(doc&&doc.id)?'selected':''}>Version ${p.docs.length-k} · ${esc(typeBy(d.type).name)}</option>`).join('')}</select>`:''}
 <div style="flex:1"></div><button class="btn" id="gen">${ic('spark',14)} Generate</button><button class="btn pri" id="pdf" ${doc?'':'disabled'}>${ic('dl',14)} PDF</button></div>
 <div class="mobsw"><button class="st on" data-v="edit">Fill in</button><button class="st" data-v="prev">Document</button></div>
 <div class="wbody"><div class="phone"><div class="notch"><i></i></div><div class="steps" id="steps"></div><div class="pane" id="pane"></div>
 <div class="phfoot"><button class="btn" id="prevstep">Back</button><button class="btn pri" id="nextstep">Next</button></div></div>
 <div class="canvas">${doc?(doc.why?`<div class="why"><b>${esc(styleBy(doc.style).name)}</b> · ${esc(doc.why)}</div>`:''):''}<div class="docw" id="docw">${doc?renderPages(p,doc,true).map(x=>`<div class="pgwrap">${x}</div>`).join(''):`<div class="empty" style="margin-top:40px"><b style="color:#fff;font-size:16px">Fill in what you have, then Generate</b><br>Nothing is required. Empty sections are left out of the document.</div>`}</div></div></div></div>`}
const STEPS=[['brand','Brand'],['pieces','Pieces'],['look','Colour & type'],['notes','Notes'],['details','Details'],['people','Credits']];
function stepDone(p,s){const b=p.brand;return{brand:!!(b.name&&b.about),pieces:p.pieces.length>0,look:p.colours.length+p.fonts.length>0,notes:!!(p.notes||p.refs.length),details:p.details.length>0,people:!!(p.meta.author||p.meta.agency)}[s]}
function bindWork(p){
 if(W.pid!==p.id){W.pid=p.id;W.step='brand'}
 const touch=()=>{p.updated=Date.now();save()};
 $('#pname').oninput=e=>{p.name=e.target.value;touch()};
 $('#ptype').onchange=e=>{p.type=e.target.value;touch();drawPane(p)};
 $('#pstyle').onchange=e=>{p.style=e.target.value;touch();const d=p.docs.find(x=>x.id===p.current);if(d&&e.target.value!=='auto'){d.style=e.target.value;touch();route()}};
 if($('#pver'))$('#pver').onchange=e=>{p.current=e.target.value;touch();route()};
 $('#gen').onclick=async()=>{const d=await generate(p,$('#gen'));if(d){route();document.body.classList.add('vprev')}};
 $('#pdf').onclick=()=>{const d=p.docs.find(x=>x.id===p.current)||p.docs[0];if(d)downloadPDF(p,d)};
 $$('.mobsw .st').forEach(b=>b.onclick=()=>{$$('.mobsw .st').forEach(x=>x.classList.toggle('on',x===b));document.body.classList.toggle('vprev',b.dataset.v==='prev');scaleDoc()});
 $$('[data-ed]').forEach(el=>el.onblur=()=>{const [i,f]=el.dataset.ed.split('.');const d=p.docs.find(x=>x.id===p.current)||p.docs[0];d.pages[+i][f]=f==='b'?el.innerText.trim():el.innerText.trim();touch()});
 $('#prevstep').onclick=()=>{const k=STEPS.findIndex(s=>s[0]===W.step);W.step=STEPS[Math.max(0,k-1)][0];drawPane(p)};
 $('#nextstep').onclick=()=>{const k=STEPS.findIndex(s=>s[0]===W.step);if(k===STEPS.length-1)return $('#gen').click();W.step=STEPS[k+1][0];drawPane(p)};
 drawPane(p);
}
function fld(label,path,o={}){const v=path.split('.').reduce((a,k)=>a?.[k],o.obj)??'';return `<label class="l">${label}</label>${o.area?`<textarea class="f" data-f="${path}" placeholder="${esc(o.ph||'')}" ${o.rows?`style="min-height:${o.rows}px"`:''}>${esc(v)}</textarea>`:`<input class="f" data-f="${path}" value="${esc(v)}" placeholder="${esc(o.ph||'')}">`}`}
function drawPane(p){
 $('#steps').innerHTML=STEPS.map(([k,l])=>`<button class="st ${W.step===k?'on':''}" data-s="${k}">${l}<span class="d ${stepDone(p,k)?'ok':''}"></span></button>`).join('');
 $$('#steps .st').forEach(b=>b.onclick=()=>{W.step=b.dataset.s;drawPane(p)});
 $('#nextstep').textContent=W.step==='people'?'Generate':'Next';
 const o={obj:p};let h='';
 if(W.step==='brand')h=`<p class="hint">Start with the core: what it is, what it solves, how it should be seen. Skip anything you don't have.</p>${fld('Brand name','brand.name',o)}${fld('Tagline or one-line idea','brand.tagline',{...o,ph:'The line you want people to remember'})}${fld('What it is and what it does','brand.about',{...o,area:1})}${fld('What problem it solves','brand.problem',{...o,area:1})}${fld('Who it is for','brand.audience',{...o,area:1,rows:64})}${fld('How it should be perceived','brand.perception',{...o,area:1,rows:64})}${fld('How it sounds','brand.voice',{...o,area:1,rows:64,ph:'e.g. warm, direct, a bit playful'})}`;
 if(W.step==='pieces')h=`<p class="hint">List every piece you have: logos, symbols, sub-brands, products, icons, patterns, mockups. Mark the key ones. Link a piece to another only if it belongs to it.</p><div id="plist">${p.pieces.map((x,i)=>pieceCard(p,x,i)).join('')}</div><div class="row" style="flex-wrap:wrap"><button class="btn sm" id="addp">${ic('plus',13)} Add piece</button><button class="btn sm ghost" id="bulk">${ic('upload',13)} Upload several</button></div>`;
 if(W.step==='look')h=`<p class="hint">Brand colours and typefaces. Piece colours are added on their own.</p><label class="l">Colours</label><div id="clist">${p.colours.map((c,i)=>`<div class="kv" style="grid-template-columns:auto 1fr 1fr auto"><span class="cdot" style="background:${HEX.test(c.hex)?c.hex:'#000'}"><input type="color" data-ci="${i}" data-cf="hex" value="${HEX.test(c.hex)?c.hex:'#000000'}"></span><input class="f" data-ci="${i}" data-cf="name" value="${esc(c.name)}" placeholder="Name"><input class="f" data-ci="${i}" data-cf="hex" value="${esc(c.hex)}" placeholder="#000000"><button class="x" data-cdel="${i}">×</button></div>`).join('')}</div><button class="btn sm" id="addc">${ic('plus',13)} Add colour</button>
  <label class="l" style="margin-top:20px">Typefaces</label>${p.fonts.map((f,i)=>`<div class="kv"><input class="f" data-fi="${i}" data-ff="name" value="${esc(f.name)}" placeholder="Typeface name"><input class="f" data-fi="${i}" data-ff="role" value="${esc(f.role)}" placeholder="Headlines, body…"><button class="x" data-fdel="${i}">×</button></div>`).join('')}<button class="btn sm" id="addf">${ic('plus',13)} Add typeface</button>
  <label class="l" style="margin-top:20px">Document accent (optional)</label><div class="row"><span class="cdot" style="background:${HEX.test(p.accent)?p.accent:'#222'}"><input type="color" id="accp" value="${HEX.test(p.accent)?p.accent:'#000000'}"></span><input class="f" id="acc" value="${esc(p.accent)}" placeholder="Uses the first key piece colour if empty"></div>`;
 if(W.step==='notes')h=`<p class="hint">Dump everything: the brief, your reasoning, client conversations, the why behind each decision. The AI writes only from what's here and in your files.</p>${fld('Notes and explanations','notes',{...o,area:1,rows:260})}<label class="l">Reference files (.txt, .md, .pdf)</label><button class="btn sm" id="addr">${ic('upload',13)} Add files</button><div style="margin-top:8px">${p.refs.map((f,i)=>`<div class="kv" style="grid-template-columns:1fr auto"><span style="font-size:12.5px;padding:8px 10px;background:#1b1b1b;border-radius:8px">${esc(f.name)} <span class="chipt">${f.kind==='pdf'?'PDF, Gemini only':'text'}</span></span><button class="x" data-rdel="${i}">×</button></div>`).join('')}</div>`;
 if(W.step==='details')h=`<p class="hint">Anything that fits a table: deliverables and prices for a proposal, numbers for a pitch, timeline, contact. Leave empty if it doesn't apply.</p>${p.details.map((d,i)=>`<div class="kv"><input class="f" data-di="${i}" data-df="label" value="${esc(d.label)}" placeholder="Label"><input class="f" data-di="${i}" data-df="value" value="${esc(d.value)}" placeholder="Value"><button class="x" data-ddel="${i}">×</button></div>`).join('')}<button class="btn sm" id="addd">${ic('plus',13)} Add row</button>`;
 if(W.step==='people')h=`<p class="hint">What goes on the cover and the last page.</p>${fld('Document title (optional)','meta.title',{...o,ph:typeBy(p.type).name})}${fld('Prepared for (client)','meta.client',o)}<div class="two"><div>${fld('Prepared by','meta.author',o)}</div><div>${fld('Agency or studio','meta.agency',o)}</div></div>${fld('Date','meta.date',o)}${fld('Contact line','meta.contact',{...o,ph:'email, phone or website'})}`;
 $('#pane').innerHTML=h;$('#pane').scrollTop=0;bindPane(p)}
function pieceCard(p,x,i){const others=p.pieces.filter(y=>y.id!==x.id);return `<div class="piece ${x.include?'':'off'}"><div class="phd"><select class="kind" data-pi="${i}" data-pf="kind">${KINDS.map(k=>`<option ${k===x.kind?'selected':''}>${k}</option>`).join('')}</select><input data-pi="${i}" data-pf="name" value="${esc(x.name)}" placeholder="Name"><button class="tog ${x.key?'on':''}" data-ptog="${i}" data-k="key">${x.key?'Key':'Supporting'}</button><button class="x" data-pdel="${i}" title="Remove">×</button></div>
 <div class="files">${(x.files||[]).map((f,k)=>`<div class="fth" style="background-image:url(${f});background-color:${tileOf(x,styleBy('editorial-dark'))}"><button data-fdl="${i}|${k}">×</button></div>`).join('')}<button class="addf" data-padd="${i}">+</button></div>
 <div class="cols">${(x.colours||[]).map((c,k)=>`<span class="cdot" style="background:${c}" title="${c}"><input type="color" data-pc="${i}|${k}" value="${HEX.test(c)?c:'#000000'}"></span>`).join('')}<button class="addf" style="width:26px;height:26px;font-size:14px" data-pcadd="${i}">+</button><span style="font-size:11.5px;color:var(--mute);margin-left:4px">${x.colours?.length?'Right-click a colour to remove':'Colours'}</span></div>
 <span class="more" data-pmore="${i}">${x._open?'Less':'More: note, background, part of, hide'}</span>
 ${x._open?`<label class="l">Note (what it is, why it looks this way)</label><textarea class="f" data-pi="${i}" data-pf="note" style="min-height:60px">${esc(x.note||'')}</textarea>
 <div class="two"><div><label class="l">Show it on</label><input class="f" data-pi="${i}" data-pf="tile" value="${esc(x.tile||'')}" placeholder="#hex background"></div><div><label class="l">Part of</label><select class="f" data-pi="${i}" data-pf="parent"><option value="">Nothing</option>${others.map(y=>`<option value="${y.id}" ${y.id===x.parent?'selected':''}>${esc(y.name||y.kind)}</option>`).join('')}</select></div></div>
 <label class="chk" style="display:flex;gap:8px;margin-top:10px;font-size:13px"><input type="checkbox" data-ptog2="${i}" ${x.include?'checked':''}> Include in documents</label>`:''}</div>`}
function bindPane(p){
 const touch=()=>{p.updated=Date.now();save()},redraw=()=>{touch();drawPane(p)};
 $$('[data-f]').forEach(el=>el.oninput=()=>{const ks=el.dataset.f.split('.');let t=p;ks.slice(0,-1).forEach(k=>t=t[k]);t[ks.at(-1)]=el.value;touch()});
 $$('[data-f]').forEach(el=>el.onchange=()=>{$('#steps').querySelectorAll('.st').forEach((b,k)=>b.querySelector('.d').classList.toggle('ok',stepDone(p,STEPS[k][0])))});
 const P=i=>p.pieces[i];
 $$('[data-pf]').forEach(el=>{el.oninput=el.onchange=()=>{P(el.dataset.pi)[el.dataset.pf]=el.value;touch()}});
 $$('[data-ptog]').forEach(b=>b.onclick=()=>{const x=P(b.dataset.ptog);x.key=!x.key;redraw()});
 $$('[data-ptog2]').forEach(b=>b.onchange=()=>{P(b.dataset.ptog2).include=b.checked;redraw()});
 $$('[data-pmore]').forEach(b=>b.onclick=()=>{const x=P(b.dataset.pmore);x._open=!x._open;drawPane(p)});
 $$('[data-pdel]').forEach(b=>b.onclick=()=>{if(confirm('Remove this piece?')){p.pieces.splice(b.dataset.pdel,1);redraw()}});
 $$('[data-padd]').forEach(b=>b.onclick=async()=>{const fs=await pick('image/*',true);const x=P(b.dataset.padd);for(const f of fs)x.files.push(await shrink(await readFile(f)));redraw()});
 $$('[data-fdl]').forEach(b=>b.onclick=()=>{const [i,k]=b.dataset.fdl.split('|');P(i).files.splice(k,1);redraw()});
 $$('[data-pc]').forEach(el=>{const [i,k]=el.dataset.pc.split('|');el.onchange=()=>{P(i).colours[k]=el.value;redraw()};el.parentElement.oncontextmenu=e=>{e.preventDefault();P(i).colours.splice(k,1);redraw()}});
 $$('[data-pcadd]').forEach(b=>b.onclick=()=>{P(b.dataset.pcadd).colours.push('#e2601f');redraw()});
 if($('#addp'))$('#addp').onclick=()=>{p.pieces.push({id:uid(),kind:p.pieces.length?'Sub-brand':'Logo',name:'',key:true,parent:'',files:[],colours:[],tile:'',note:'',include:true,_open:false});redraw()};
 if($('#bulk'))$('#bulk').onclick=async()=>{const fs=await pick('image/*',true);for(const f of fs)p.pieces.push({id:uid(),kind:'Other',name:f.name.replace(/\.[^.]+$/,'').replace(/[-_]+/g,' '),key:false,parent:'',files:[await shrink(await readFile(f))],colours:[],tile:'',note:'',include:true});redraw()};
 $$('[data-cf]').forEach(el=>el.oninput=()=>{p.colours[el.dataset.ci][el.dataset.cf]=el.value;touch();if(el.type==='color')redraw()});
 $$('[data-cdel]').forEach(b=>b.onclick=()=>{p.colours.splice(b.dataset.cdel,1);redraw()});
 if($('#addc'))$('#addc').onclick=()=>{p.colours.push({name:'',hex:''});redraw()};
 $$('[data-ff]').forEach(el=>el.oninput=()=>{p.fonts[el.dataset.fi][el.dataset.ff]=el.value;touch()});
 $$('[data-fdel]').forEach(b=>b.onclick=()=>{p.fonts.splice(b.dataset.fdel,1);redraw()});
 if($('#addf'))$('#addf').onclick=()=>{p.fonts.push({name:'',role:''});redraw()};
 if($('#acc')){$('#acc').oninput=e=>{p.accent=e.target.value;touch()};$('#accp').onchange=e=>{p.accent=e.target.value;redraw()}}
 if($('#addr'))$('#addr').onclick=async()=>{const fs=await pick('.txt,.md,.pdf,text/plain,application/pdf',true);for(const f of fs){const pdf=/pdf/i.test(f.type)||/\.pdf$/i.test(f.name);p.refs.push({name:f.name,kind:pdf?'pdf':'text',data:await readFile(f,pdf?'url':'text')})}redraw()};
 $$('[data-rdel]').forEach(b=>b.onclick=()=>{p.refs.splice(b.dataset.rdel,1);redraw()});
 $$('[data-df]').forEach(el=>el.oninput=()=>{p.details[el.dataset.di][el.dataset.df]=el.value;touch()});
 $$('[data-ddel]').forEach(b=>b.onclick=()=>{p.details.splice(b.dataset.ddel,1);redraw()});
 if($('#addd'))$('#addd').onclick=()=>{p.details.push({label:'',value:''});redraw()};
}

/* ---------- style learning ---------- */
async function learnStyle(){const [f]=await pick('application/pdf');if(!f)return;if(ai().prov!=='gemini')return toast('Reading PDFs needs Gemini. Switch provider in Settings.',1,6000);
 try{toast('Studying '+f.name+'…','',0);const data=await readFile(f);
  const j=parseJSON(await callAI(`Study the attached reference document's visual style and describe it as a reusable presentation style.
Return JSON: {"name":"2-3 word style name","desc":"one sentence on the look","bestFor":"kinds of brands and documents it suits","guide":"3 to 5 sentences on pacing, how dark/light/colour pages are used, headline tone, density, and how work is shown","t":{"dark":"#hex for dark pages","paper":"#hex for light pages","ink":"#hex text on light pages","accent":"#hex accent colour","hf":"closest heading font from: Archivo, Inter, Inter Tight, Fraunces, Space Grotesk, Montserrat, Oswald","hs":"72% for condensed headings else 100%","hw":400 to 900,"hl":"letter spacing like -0.02em","hcase":"none or uppercase","ccase":"none or uppercase for cover title","bf":"Inter","r":corner radius 0 to 30,"grain":0 or 1,"cover":"dark, paper or accent","divider":"dark, paper or accent","content":"paper or dark","alt":"dark, paper or accent"}}`,'You are an art director who describes visual systems precisely. Return JSON only.',[data]));
  const s={id:'learned-'+uid(),name:j.name||f.name,desc:j.desc||'',bestFor:j.bestFor||'',guide:j.guide||'',t:Object.assign({},STYLES[0].t,j.t||{})};
  if(!['Archivo','Inter','Inter Tight','Fraunces','Space Grotesk','Montserrat','Oswald'].includes(s.t.hf))s.t.hf='Inter';s.t.bf='Inter';delete s.t.kit;
  S.styles.push(s);save();route();toast('Learned "'+s.name+'". The generator can now pick it.')}catch(e){toast(e.message,1,9000)}}

/* ---------- router ---------- */
function route(){const h=location.hash.replace(/^#\//,'').split('?')[0]||'home';const [r,id]=h.split('/');document.body.classList.remove('vprev');
 let html;if(r==='p'&&proj(id)){html=vWork(proj(id));$('#root').innerHTML=html;bindWork(proj(id));requestAnimationFrame(scaleDoc);return}
 html={projects:vProjects,documents:vDocuments,types:vTypes,styles:vStyles,settings:vSettings}[r]?.()||vHome();$('#root').innerHTML=html;bindShell();
 if($('#qImport'))$('#qImport').onclick=async()=>{const [f]=await pick('.json,application/json');if(!f)return;try{const j=JSON.parse(await readFile(f,'text'));const p=Object.assign(newProject(),j,{id:uid(),demo:false});S.projects.unshift(p);save();location.hash='#/p/'+p.id}catch(e){toast('That is not a Zyner project file',1)}};
 $$('[data-dl]').forEach(b=>b.onclick=()=>{const [pi,di]=b.dataset.dl.split('|');const p=proj(pi);downloadPDF(p,p.docs.find(d=>d.id===di))});
 if($('#learn'))$('#learn').onclick=learnStyle;
 $$('[data-delst]').forEach(b=>b.onclick=()=>{S.styles=S.styles.filter(s=>s.id!==b.dataset.delst);save();route()});
 if(r==='settings'){const c=ai();$('#prov').value=c.prov;$('#prov').onchange=e=>{localStorage.zsProv=e.target.value;route()};$('#key').oninput=e=>localStorage['zsKey_'+ai().prov]=e.target.value.trim();$('#model').oninput=e=>localStorage['zsModel_'+ai().prov]=e.target.value.trim();
  $('#meName').oninput=e=>{S.me.name=e.target.value;save()};$('#meAg').oninput=e=>{S.me.agency=e.target.value;save()};
  $('#models').onchange=e=>{$('#model').value=e.target.value;localStorage['zsModel_'+ai().prov]=e.target.value};
  $('#lm').onclick=async()=>{const c=ai();if(!c.key)return toast('Paste your key first',1);try{let ids=[];
   if(c.prov==='gemini'){const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=200&key='+encodeURIComponent(c.key));const j=await r.json();if(!r.ok)throw Error(j.error?.message);ids=j.models.filter(m=>m.supportedGenerationMethods?.includes('generateContent')).map(m=>m.name.replace('models/',''))}
   else if(c.prov==='openai'){const r=await fetch('https://api.openai.com/v1/models',{headers:{Authorization:'Bearer '+c.key}});const j=await r.json();if(!r.ok)throw Error(j.error?.message);ids=j.data.map(m=>m.id).filter(x=>/gpt|o\d/.test(x)).sort()}
   else{const r=await fetch('https://api.anthropic.com/v1/models',{headers:{'x-api-key':c.key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'}});const j=await r.json();if(!r.ok)throw Error(j.error?.message);ids=j.data.map(m=>m.id)}
   const s=$('#models');s.innerHTML=ids.map(i=>`<option ${i===c.model?'selected':''}>${esc(i)}</option>`).join('');s.style.display='block';toast(ids.length+' models found')}catch(e){toast('Could not list models: '+e.message,1,7000)}};
  $('#test').onclick=async()=>{try{toast('Testing…','',0);const t=await callAI('Reply with the JSON {"ok":true}','Return JSON only.');toast(/ok/.test(t)?'Connected. Generate will now write your copy.':'Connected, but the reply was odd.')}catch(e){toast(e.message,1,8000)}}}
 requestAnimationFrame(fitThumbs)}
addEventListener('hashchange',route);

/* ---------- demo ---------- */
async function demoProject(){const d=async n=>{const b=await (await fetch('demo/'+n+'.png')).blob();return readFile(b)};
 const p=newProject({name:'Aiben',type:'identity',style:'editorial-dark',demo:true});
 p.brand={name:'Aiben',tagline:'One parent, four products, one family',
  about:'Aiben Technologies runs four everyday services under one parent brand: Ride, Rider, Mart and Top-Up. The identity has one job. Each product should feel like its own thing, and it should still be obvious they all come from the same house.',
  problem:'Four products launched separately would look like four companies. People would not carry trust from one to the next.',
  audience:'Everyday city users in Nigeria who book rides, order groceries and buy airtime from their phone.',
  perception:'Quick, dependable and friendly. A tech company that feels local and human.',voice:'Plain, direct and warm.'};
 Object.assign(p.meta,{title:'Brand Identity Concept',author:'Daniel Saka',agency:'Zyner Limited',date:'October 2026'});
 const wm={id:uid(),kind:'Wordmark',name:'Aiben wordmark',key:true,parent:'',files:[await d('wm_black')],colours:['#111111'],tile:'#e8e5df',note:'Clean, heavy and easy to read at any size. Every product name sits on top of it, so it stays calm and confident.',include:true};
 const sp={id:uid(),kind:'Symbol',name:'The spark',key:true,parent:'',files:[await d('spark_blue')],colours:['#0F38FE'],tile:'#0e0e0e',note:'A small burst of energy that says something is about to move. It works alone and appears in every product icon.',include:true};
 const lk={id:uid(),kind:'Lockup',name:'Aiben lockup',key:false,parent:'',files:[await d('lockup_plain')],colours:[],tile:'#e8e5df',note:'The wordmark and spark together, for first introductions.',include:true};
 p.pieces=[wm,sp,lk];
 for(const [n,f,a,b,no] of [['Aiben Ride','ride','#FFC201','#161616','The passenger app. Warm yellow on charcoal keeps it bright and easy to spot.'],['Aiben Rider','rider','#0DFE81','#004248','The app for drivers and riders. Mint on deep teal gives it a calmer, working tone.'],['Aiben Mart','mart','#FBB03B','#333333','Groceries and everyday shopping. Amber on graphite feels warm and familiar.'],['Aiben Top-Up','topup','#00FD54','#031C03','Airtime, data and bills. Electric green on near-black signals speed.']])
  p.pieces.push({id:uid(),kind:'Sub-brand',name:n,key:true,parent:wm.id,files:[await d('wm_'+f),await d('icon_'+f)],colours:[a,b],tile:b,note:no,include:true});
 p.colours=[{name:'Aiben blue',hex:'#0F38FE'},{name:'Ink',hex:'#0E0E0E'},{name:'Paper',hex:'#F4F2EE'}];
 p.accent='#0F38FE';
 p.notes='Product wordmarks are never paired with the app icon on websites. App icons are for apps and favicons only. Colours are a starting point and can change if they clash with what a product team is building, as long as the family still works together.';
 const doc=basicDoc(p,'editorial-dark');doc.why='Bold, tech-led brand with a strong symbol, so dark editorial pages give the spark room.';
 const C=doc.pages.find(x=>x.layout==='closing');if(C){C.h='A system, not a set of logos';C.b='The structure stays fixed: parent wordmark, product script, spark in every icon. Colours and details can flex as the products grow.'}
 p.docs=[doc];p.current=doc.id;return p}

(async()=>{await DB.open();const s=await DB.get('state');if(s)S=Object.assign(S,s);
 if(!S.projects.length&&!localStorage.zsSeeded){try{S.projects.push(await demoProject());localStorage.zsSeeded=1;save()}catch(e){}}
 route()})();
