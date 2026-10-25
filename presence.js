/* Frenchfries777: "지금 N명 접속 중" 표시줄 (허브와 같은 ff_online 을 읽기만 해요)
   허브 첫 화면의 접속 표시와 같은 데이터를 보여 줘요. 이 사이트에서는 접속 신호를 보내지 않아요. */
(function(){
'use strict';
var URL_='https://kebsbuvuutilitwlvxzv.supabase.co', KEY='sb_publishable_4Egu0zm3p6cxWGvP_-GlIw_mlCpO1Nf', SKEY='sb-kebsbuvuutilitwlvxzv-auth-token';
var PLACE={hub:'허브',stickseum:'Stickseum',crownenvoy:'Crown Envoy',beaconfall:'Beaconfall',isleport:'Isleport',vowkeep:'Vowkeep',dummyparty:'Dummy Party',educations:'Educations',tools:'Tools'};
var ORDER=['hub','stickseum','crownenvoy','beaconfall','isleport','vowkeep','dummyparty','educations','tools'];
var anchor=document.getElementById('heroStats'); if(!anchor||!window.fetch) return;
var bar=document.createElement('div'); bar.id='onlineBar'; bar.className='onl'; bar.setAttribute('data-notr',''); bar.setAttribute('aria-live','polite'); anchor.parentNode.insertBefore(bar,anchor.nextSibling);
var css=document.createElement('style'); css.textContent=
'.onl{display:flex; flex-wrap:wrap; align-items:center; gap:8px 10px; margin:-6px 0 18px; padding:10px 14px; border:1px solid var(--line); border-radius:14px; background:color-mix(in srgb,var(--panel,#10131b) 88%,transparent); font-size:14px; color:var(--dim,#8a93a6);}'+
'.onl:empty{display:none;} .onl .on-dot{width:9px; height:9px; border-radius:50%; background:#3fe0a0; box-shadow:0 0 8px #3fe0a0;}'+
'.onl > b{color:var(--text,#eef0f5);} .onl .on-c{display:inline-flex; gap:5px; padding:3px 10px; border:1px solid var(--line); border-radius:999px; font-size:13px;} .onl .on-c b{color:var(--text,#eef0f5);}'+
'.onl .on-f{display:inline-flex; flex-wrap:wrap; align-items:center; gap:6px;} .onl .on-p{display:inline-flex; gap:5px; align-items:center; padding:3px 10px; border-radius:999px; background:rgba(63,224,160,.12); border:1px solid rgba(63,224,160,.35); color:var(--text,#eef0f5); font-size:13px;} .onl .on-p small{color:var(--dim,#8a93a6); font-size:11.5px;}';
document.head.appendChild(css);
function L(s){ try{ return (window.SI18N&&SI18N.T)?SI18N.T(s):s; }catch(e){ return s; } }
function esc(s){ return String(s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
function token(){ try{ var s=JSON.parse(localStorage.getItem(SKEY)||'null'); if(s&&s.access_token&&(!s.expires_at||s.expires_at*1000>Date.now())) return s.access_token; }catch(e){} return null; }
function rpc(name, tok){ return fetch(URL_+'/rest/v1/rpc/'+name,{method:'POST',headers:{'apikey':KEY,'Authorization':'Bearer '+(tok||KEY),'Content-Type':'application/json'},body:'{}'}).then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); }); }
function names(ids){ if(!ids.length) return Promise.resolve({}); return fetch(URL_+'/rest/v1/profiles?select=id,display_name&id=in.('+ids.map(encodeURIComponent).join(',')+')',{headers:{'apikey':KEY,'Authorization':'Bearer '+(token()||KEY)}}).then(function(r){ return r.ok?r.json():[]; }).then(function(rows){ var o={}; rows.forEach(function(x){ o[x.id]=x.display_name; }); return o; }).catch(function(){ return {}; }); }
var busy=false;
function refresh(){
  if(busy||document.visibilityState==='hidden') return; busy=true;
  var tok=token();
  rpc('ff_online').then(function(rows){
    var c={}; (rows||[]).forEach(function(x){ c[x.place]=x.people; });
    var html='<span class="on-dot"></span><b>'+esc(L('지금 '+(c.all||0)+'명 접속 중'))+'</b>';
    ORDER.concat(Object.keys(c).filter(function(k){ return k!=='all'&&ORDER.indexOf(k)<0; })).forEach(function(g){ if(c[g]&&g!=='all') html+='<span class="on-c"><span>'+esc(L(PLACE[g]||g))+'</span> <b>'+c[g]+'</b></span>'; });
    if(!tok){ bar.innerHTML=html; return; }
    return rpc('ff_online_friends',tok).then(function(f){ f=f||[]; if(!f.length){ bar.innerHTML=html; return; }
      return names(f.slice(0,8).map(function(x){ return x.user_id; })).then(function(nm){
        html+='<span class="on-f"><span>'+esc(L('친구'))+'</span>'+f.slice(0,8).map(function(x){ return '<span class="on-p">'+esc(nm[x.user_id]||'???')+'<small>'+esc(L(PLACE[x.place]||x.place))+'</small></span>'; }).join('')+'</span>';
        bar.innerHTML=html; }); },function(){ bar.innerHTML=html; });
  }).catch(function(){ bar.innerHTML=''; }).then(function(){ busy=false; });
}
refresh(); setInterval(refresh,20000);
document.addEventListener('visibilitychange',refresh);
})();
