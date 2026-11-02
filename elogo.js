/* Frenchfries777: 이모티콘을 로고 그림으로 바꿔 보여 주는 공용 스크립트예요.
   글자 속 이모티콘(표시용 글자만)을 emoji/*.svg 로 바꿔요. 선택 상자, 입력 칸, 글자 기호(★ ♥ ✓ ✕)는 그대로 둬요. */
(function(){
'use strict';
var M={"🎩": "hat", "💾": "floppy", "🎯": "target", "🧬": "dna", "🤖": "robot", "🔒": "lock", "⚙": "gear", "⚓": "anchor", "🍟": "fries", "🔍": "search", "✅": "okcheck", "⚡": "bolt", "🏫": "school", "📊": "graph", "🎲": "dice", "🏆": "trophy", "🔥": "fire", "🔊": "speaker", "🔇": "mute", "💬": "chat", "🐻": "bear", "🌅": "sunrise", "🏹": "bow", "🏯": "castle", "🪷": "lotus", "👑": "crown", "🌊": "wave", "🍂": "mapleleaf", "🥀": "wilted", "🤝": "handshake", "🐎": "horse", "🛕": "hindutemple", "⛵": "sailboat", "🏛": "temple", "📜": "scroll", "🗣": "speak", "⚔": "swords", "🐴": "horse", "📚": "book", "📖": "book", "🖨": "printer", "🔙": "back", "🌧": "rain", "🔤": "abc", "🐢": "turtle", "💊": "pill", "🧓": "oldman", "🏰": "castle", "⛓": "chain", "🌾": "wheat", "🦅": "eagle", "🌲": "tree", "🎉": "party", "💥": "boom", "✊": "fist", "🛣": "road", "🕯": "candle", "📣": "megaphone", "🏅": "medal", "📉": "chartdown", "🕊": "dove", "⚽": "ball", "🔺": "triangle", "⚖": "scale", "🏃": "runner", "🏺": "vase", "🐉": "dragon", "🗡": "dagger", "🏚": "ruin", "🌙": "crescent", "🛡": "shield", "🏇": "horse", "🐀": "rat", "✝": "church", "🏔": "mountain", "🚢": "ship", "🗽": "liberty", "🎖": "medal", "⛴": "ship", "🎌": "flags", "🏮": "lantern", "💣": "bomb", "🚩": "flag", "✈": "plane", "🪔": "oillamp", "⭐": "star", "🚀": "rocket", "🌕": "fullmoon", "🧱": "brick", "🏳": "whiteflag", "🌈": "rainbow", "🏙": "city", "✍": "writing", "📐": "triruler", "🌍": "globe", "📄": "page", "☀": "sun", "🔭": "telescope", "🍎": "apple", "💉": "syringe", "🚂": "train", "📨": "mail", "🧪": "potion", "☎": "telephone", "💡": "bulb", "🚗": "car", "🩻": "xray", "☢": "radiation", "🛩": "plane", "📧": "mail", "📞": "telephone", "🔬": "microscope", "📱": "phone", "🏁": "flag"};
var BASE=(function(){ var s=document.currentScript&&document.currentScript.src||''; return s.replace(/[^\/]*$/,'')+'emoji/'; })();
var RE=new RegExp('('+Object.keys(M).sort(function(a,b){ return b.length-a.length; }).map(function(k){ return k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }).join('|')+')\\uFE0F?','g');
var SKIP={SCRIPT:1,STYLE:1,TEXTAREA:1,OPTION:1,SELECT:1,INPUT:1,TITLE:1,NOSCRIPT:1,CANVAS:1};
var st=document.createElement('style'); st.textContent='img.el{width:1.15em;height:1.15em;vertical-align:-.2em;display:inline-block;object-fit:contain;pointer-events:none;}'; document.head.appendChild(st);
function fix(t){
  var p=t.parentNode; if(!p||SKIP[p.nodeName]||(p.closest&&p.closest('[data-noel]'))) return;
  var s=t.nodeValue; RE.lastIndex=0; if(!RE.test(s)) return; RE.lastIndex=0;
  var f=document.createDocumentFragment(), i=0, m;
  while((m=RE.exec(s))){ if(m.index>i) f.appendChild(document.createTextNode(s.slice(i,m.index)));
    var im=document.createElement('img'); im.className='el'; im.alt=m[1]; im.src=BASE+M[m[1]]+'.svg'; im.draggable=false; im.setAttribute('aria-hidden','true'); f.appendChild(im); i=m.index+m[0].length; }
  if(i<s.length) f.appendChild(document.createTextNode(s.slice(i)));
  p.replaceChild(f,t);
}
function walk(n){
  if(n.nodeType===3){ fix(n); return; }
  if(n.nodeType!==1||SKIP[n.nodeName]) return;
  var w=document.createTreeWalker(n,NodeFilter.SHOW_TEXT,null), a=[], x; while((x=w.nextNode())) a.push(x);
  a.forEach(fix);
}
function start(){
  walk(document.body);
  new MutationObserver(function(ms){ ms.forEach(function(m){
    if(m.type==='characterData'){ fix(m.target); return; }
    m.addedNodes.forEach(walk); }); }).observe(document.body,{childList:true,subtree:true,characterData:true});
}
if(document.body) start(); else document.addEventListener('DOMContentLoaded',start);
})();
