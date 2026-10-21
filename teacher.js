/* 교육 사이트 선생님 도구 공용 파일: 인증 확인, 인증 배지, 결과 CSV 저장. 계정 로그인은 허브(ff-auth)와 같은 세션을 읽어요. */
(function(){
  var SB_URL='https://kebsbuvuutilitwlvxzv.supabase.co', SB_KEY='sb_publishable_4Egu0zm3p6cxWGvP_-GlIw_mlCpO1Nf';
  var LIB='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js';
  var cli=null, libP=null, vcache={}, meP=null;
  function lib(){
    if(window.supabase&&window.supabase.createClient) return Promise.resolve();
    if(libP) return libP;
    libP=new Promise(function(res,rej){ var s=document.createElement('script'); s.src=LIB; s.onload=res; s.onerror=function(){ libP=null; rej(new Error('lib')); }; document.head.appendChild(s); });
    return libP;
  }
  function client(){
    if(cli) return Promise.resolve(cli);
    return lib().then(function(){ cli=cli||window.supabase.createClient(SB_URL,SB_KEY); return cli; });
  }
  /* 내가 로그인했고 인증된 선생님인지: {uid, teacher} (실패하면 teacher:false) */
  function me(){
    if(meP) return meP;
    meP=client().then(function(c){
      return c.auth.getSession().then(function(r){
        var s=r.data&&r.data.session; if(!s) return {uid:null,teacher:false};
        return c.rpc('ff_teacher_me').then(function(m){ return {uid:s.user.id, teacher:!m.error&&m.data!==null&&m.data!==undefined}; });
      });
    }).catch(function(){ return {uid:null,teacher:false}; });
    return meP;
  }
  /* 다른 사람(uid)이 인증된 선생님인지 서버에서 확인 (방 사람들 이름 옆 배지용) */
  function verify(uid){
    if(!uid||typeof uid!=='string'||uid.length>40) return Promise.resolve(false);
    if(vcache[uid]!==undefined) return Promise.resolve(vcache[uid]);
    return client().then(function(c){
      return c.from('ff_teachers').select('user_id').eq('user_id',uid).limit(1).then(function(r){ return (vcache[uid]=!r.error&&!!(r.data&&r.data.length)); });
    }).catch(function(){ return false; });
  }
  /* 표를 CSV로 저장 (엑셀에서 한글이 안 깨지게 BOM을 붙여요). rows: 배열의 배열 */
  function csv(name,rows){
    var t=rows.map(function(r){ return r.map(function(v){ v=String(v==null?'':v); if(/^[=+\-@]/.test(v)) v="'"+v; return /[",\n\r]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v; }).join(','); }).join('\r\n');
    var b=new Blob(['﻿'+t],{type:'text/csv;charset=utf-8'}), a=document.createElement('a');
    a.href=URL.createObjectURL(b); a.download=name; document.body.appendChild(a); a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },1000);
  }
  function stamp(){ var d=new Date(), p=function(n){ return (n<10?'0':'')+n; }; return d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+'-'+p(d.getHours())+p(d.getMinutes()); }
  window.EduTeacher={me:me, verify:verify, csv:csv, stamp:stamp, BADGE:'✅ 선생님'};
})();
