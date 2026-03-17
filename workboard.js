(function(){
/* ══════════════════════════════════════════════
   WorkBoard — Firebase Edition
   Firebase config, team, statuses, priorities
══════════════════════════════════════════════ */
var FB={apiKey:"AIzaSyA0uD4AQ1Kjpz2opz5YtDT6CNyzQtqxA-0",authDomain:"workspace-031726.firebaseapp.com",databaseURL:"https://workspace-031726-default-rtdb.firebaseio.com",projectId:"workspace-031726",storageBucket:"workspace-031726.firebasestorage.app",messagingSenderId:"149203020312",appId:"1:149203020312:web:bb64bff680b3cc76af316d"};
var app=firebase.initializeApp(FB,'wb');
var db=firebase.database(app);

var CL=["#38444E","#F7931E","#EF5601","#1D9E75","#D4537E","#378ADD","#639922","#BA7517"];

var DEFAULT_PASSWORDS={u1:"thomas123",u2:"till123",u9:"michael123",u3:"liz123",u4:"johanna123",u5:"marial123",u6:"taylor123",u7:"jomar123",u8:"justine123"};
var PASSWORDS={};

var TM=[
  {id:"u1",name:"Thomas",  color:"#38444E",tc:"#fff",i:"TH"},
  {id:"u2",name:"Till",    color:"#F7931E",tc:"#fff",i:"TL"},
  {id:"u9",name:"Michael", color:"#9B59B6",tc:"#fff",i:"MC"},
  {id:"u3",name:"Liz",     color:"#1D9E75",tc:"#fff",i:"LZ"},
  {id:"u4",name:"Johanna", color:"#D4537E",tc:"#fff",i:"JO"},
  {id:"u5",name:"Marial",  color:"#378ADD",tc:"#fff",i:"MA"},
  {id:"u6",name:"Taylor",  color:"#EF5601",tc:"#fff",i:"TA"},
  {id:"u7",name:"Jomar",   color:"#639922",tc:"#fff",i:"JM"},
  {id:"u8",name:"Justine", color:"#BA7517",tc:"#fff",i:"JU"}
];

var ST=[
  {v:"todo",  l:"To do",       p:"p-todo",  d:"#9CA3AF"},
  {v:"wip",   l:"In progress", p:"p-wip",   d:"#1D9E75"},
  {v:"review",l:"In review",   p:"p-review",d:"#F7931E"},
  {v:"done",  l:"Done",        p:"p-done",  d:"#1D7A4E"},
  {v:"stuck", l:"Stuck",       p:"p-stuck", d:"#C0392B"}
];

var PR=[
  {v:"high",l:"High",  c:"#C0392B"},
  {v:"med", l:"Medium",c:"#D4820A"},
  {v:"low", l:"Low",   c:"#4A8A1A"}
];

var BRANDS={
  combase:{
    name:"COMBASE",
    logo:"https://beta.combase.de/wp-content/uploads/2026/01/COMBASE-Logo.png",
    colors:[{name:"Dark Navy Blue",hex:"#38444E",cmyk:"C28, M13, Y0, K69",rgb:"R56, G68, B78"}],
    fonts:[
      {name:"Avenir Next LT Pro",role:"Primary / UI & Body",weights:"Light, Regular, Bold, Bold Italic, Light Italic, Italic",designers:"Adrian Frutiger, Akira Kobayashi",url:"https://learn.microsoft.com/en-us/typography/font-list/avenirnextltpro"},
      {name:"Sofia Condensed",role:"Headings / Display",weights:"Regular, Medium, Bold, ExtraBold",designers:"Mostardesign",url:"https://fonts.adobe.com/fonts/sofia-condensed"},
      {name:"Nexa",role:"Supporting / Accent",weights:"Light, Regular, Bold, Heavy, ExtraLight, Black",designers:"Fontfabric",url:"https://fonts.adobe.com/fonts/nexa"}
    ],
    assets:[]
  },
  korona:{
    name:"KORONA POS",
    logo:"https://www.koronapos.com/wp-content/uploads/2021/03/korona-pos-logo.png",
    colors:[
      {name:"Red Orange",hex:"#EF5601",cmyk:"C0, M64, Y100, K6",rgb:"R239, G86, B1"},
      {name:"Orange",hex:"#F7931E",cmyk:"C0, M40, Y88, K3",rgb:"R247, G147, B30"},
      {name:"Dark Navy Blue",hex:"#38444E",cmyk:"C28, M13, Y0, K69",rgb:"R56, G68, B78"}
    ],
    fonts:[
      {name:"Avenir Next LT Pro",role:"Primary / UI & Body",weights:"Light, Regular, Bold, Bold Italic, Light Italic, Italic",designers:"Adrian Frutiger, Akira Kobayashi",url:"https://learn.microsoft.com/en-us/typography/font-list/avenirnextltpro"},
      {name:"Sofia Condensed",role:"Headings / Display",weights:"Regular, Medium, Bold, ExtraBold",designers:"Mostardesign",url:"https://fonts.adobe.com/fonts/sofia-condensed"},
      {name:"Nexa",role:"Supporting / Accent",weights:"Light, Regular, Bold, Heavy, ExtraLight, Black",designers:"Fontfabric",url:"https://fonts.adobe.com/fonts/nexa"}
    ],
    assets:[]
  }
};

/* ── State ── */
var boards=[],trash=[],cu=null,abid=null,view="board",activeTab="boards";
var fil={pr:[],st:[],s:""};
var col={},nh=[],seen=new Set(),pt=null;
var uB=null,uN=null,uT=null;
var tmM,tmG,tmI,bmM,gmM,gmG;
var sO,sBC=CL[0],sGC=CL[2];
var loginUser=null;
var briefFilesStaging=[],commentFilesStaging=[];

/* ── Helpers ── */
function uid(){ return Math.random().toString(36).slice(2,10); }
function g(id){ return document.getElementById(id); }
function getB(){ for(var i=0;i<boards.length;i++) if(boards[i].id===abid) return boards[i]; return boards[0]||null; }
function getAll(){ var r=[]; for(var i=0;i<boards.length;i++) for(var j=0;j<boards[i].groups.length;j++) for(var k=0;k<boards[i].groups[j].items.length;k++) r.push(boards[i].groups[j].items[k]); return r; }
function find(id){ var a=getAll(); for(var i=0;i<a.length;i++) if(a[i].id===id) return a[i]; return null; }
function match(i){ if(fil.pr.length&&fil.pr.indexOf(i.priority)===-1) return false; if(fil.st.length&&fil.st.indexOf(i.status)===-1) return false; if(fil.s&&i.name.toLowerCase().indexOf(fil.s.toLowerCase())===-1) return false; return true; }
function av(uid2,s){ s=s||26; var u=null; for(var i=0;i<TM.length;i++) if(TM[i].id===uid2){u=TM[i];break;} if(!u) return '<div style="width:'+s+'px;height:'+s+'px;background:#eee;border-radius:50%;flex-shrink:0"></div>'; return '<div class="av" title="'+u.name+'" style="width:'+s+'px;height:'+s+'px;background:'+u.color+';color:'+u.tc+';font-size:'+(s<24?9:11)+'px;flex-shrink:0">'+u.i+'</div>'; }
function fbSave(){ db.ref('workboard/boards').set(boards); }
function fbSaveTrash(){ db.ref('workboard/trash').set(trash); }
function openM(id){ g(id).classList.add('open'); }
function closeM(id){ g(id).classList.remove('open'); }
function rAll(){ rSB(); rC(); }

/* ── Session & Notif storage ── */
function loadSeenNotifs(uid2){ try{ var s=localStorage.getItem('wb_seen_'+uid2); if(s){ var a=JSON.parse(s); for(var i=0;i<a.length;i++) seen.add(a[i]); } }catch(e){} }
function saveSeenNotif(uid2,key){ seen.add(key); try{ localStorage.setItem('wb_seen_'+uid2,JSON.stringify(Array.from(seen))); }catch(e){} }
function saveClearedNotifs(uid2){ try{ localStorage.setItem('wb_seen_'+uid2,JSON.stringify(Array.from(seen))); }catch(e){} }
function saveSession(uid2){ try{ localStorage.setItem('wb_session',uid2); }catch(e){} }
function loadSession(){ try{ return localStorage.getItem('wb_session'); }catch(e){ return null; } }
function clearSession(){ try{ localStorage.removeItem('wb_session'); }catch(e){} }

/* ── Sanitize boards from Firebase ── */
function sanitizeBoards(raw){
  var out=[];
  for(var i=0;i<raw.length;i++){
    if(!raw[i]) continue;
    var b=raw[i];
    var grps=b.groups||[];
    if(!Array.isArray(grps)){ var tmp=[]; var gk=Object.keys(grps); for(var x=0;x<gk.length;x++) tmp.push(grps[gk[x]]); grps=tmp; }
    var cleanG=[];
    for(var j=0;j<grps.length;j++){
      if(!grps[j]) continue;
      var gr=grps[j];
      var items=gr.items||[];
      if(!Array.isArray(items)){ var tmp2=[]; var ik=Object.keys(items); for(var y=0;y<ik.length;y++) tmp2.push(items[ik[y]]); items=tmp2; }
      cleanG.push({id:gr.id||uid(),name:gr.name||'Group',color:gr.color||'#38444E',items:items});
    }
    out.push({id:b.id||uid(),name:b.name||'Board',color:b.color||'#F7931E',groups:cleanG});
  }
  return out;
}

/* ── File helpers ── */
function isImg(name){ return /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(name); }
function fileIcon(name){ if(/\.pdf$/i.test(name)) return '&#128196;'; if(/\.(doc|docx)$/i.test(name)) return '&#128196;'; if(/\.(xls|xlsx)$/i.test(name)) return '&#128200;'; if(/\.(zip|rar|7z)$/i.test(name)) return '&#128230;'; if(/\.(mp4|mov|avi)$/i.test(name)) return '&#127916;'; return '&#128196;'; }
function renderFilePreview(files,cid,removeFn){
  var c=g(cid); if(!c) return;
  if(!files.length){ c.innerHTML=''; return; }
  var h='';
  for(var i=0;i<files.length;i++){
    var f=files[i];
    if(isImg(f.name)){
      h+='<div style="position:relative;display:inline-block"><img src="'+f.data+'" style="width:64px;height:64px;object-fit:cover;border-radius:6px;border:1px solid #E2E5E8"/><button onclick="'+removeFn+'('+i+')" style="position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;background:#B03020;color:#fff;border:none;font-size:11px;cursor:pointer;line-height:1;font-family:inherit">&#215;</button><div style="font-size:9px;color:#6B7A84;text-align:center;max-width:64px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:2px">'+f.name+'</div></div>';
    } else {
      h+='<div style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border:1px solid #E2E5E8;border-radius:6px;background:#F7F8FA;font-size:12px;color:#3D4F5C"><span>'+fileIcon(f.name)+'</span><span style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+f.name+'</span><button onclick="'+removeFn+'('+i+')" style="background:none;border:none;color:#9CA3AF;cursor:pointer;font-size:14px;padding:0;line-height:1;font-family:inherit">&#215;</button></div>';
    }
  }
  c.innerHTML=h;
}
function renderSavedFiles(files){
  if(!files||!files.length) return '';
  var h='<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">';
  for(var i=0;i<files.length;i++){
    var f=files[i];
    if(isImg(f.name)){
      h+='<a href="'+f.data+'" download="'+f.name+'" target="_blank" style="display:inline-block;text-decoration:none"><img src="'+f.data+'" style="width:64px;height:64px;object-fit:cover;border-radius:6px;border:1px solid #E2E5E8" title="'+f.name+'"/><div style="font-size:9px;color:#6B7A84;text-align:center;max-width:64px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:2px">'+f.name+'</div></a>';
    } else {
      h+='<a href="'+f.data+'" download="'+f.name+'" style="display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border:1px solid #E2E5E8;border-radius:6px;background:#F7F8FA;font-size:12px;color:#3D4F5C;text-decoration:none"><span>'+fileIcon(f.name)+'</span><span style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+f.name+'</span><span style="font-size:10px;color:#9CA3AF">&#11015;</span></a>';
    }
  }
  return h+'</div>';
}
window.wbAddBriefFiles=function(input){
  var files=input.files; if(!files||!files.length) return;
  var toRead=files.length,done=0;
  for(var i=0;i<files.length;i++){(function(file){ var r=new FileReader(); r.onload=function(e){ briefFilesStaging.push({name:file.name,data:e.target.result}); done++; if(done===toRead) renderFilePreview(briefFilesStaging,'wb-brief-preview','wbRemoveBriefFile'); }; r.readAsDataURL(file); })(files[i]);}
  input.value='';
};
window.wbRemoveBriefFile=function(idx){ briefFilesStaging.splice(idx,1); renderFilePreview(briefFilesStaging,'wb-brief-preview','wbRemoveBriefFile'); };
window.wbAddCommentFiles=function(input){
  var files=input.files; if(!files||!files.length) return;
  var toRead=files.length,done=0;
  for(var i=0;i<files.length;i++){(function(file){ var r=new FileReader(); r.onload=function(e){ commentFilesStaging.push({name:file.name,data:e.target.result}); done++; if(done===toRead) renderFilePreview(commentFilesStaging,'wb-comment-file-preview','wbRemoveCommentFile'); }; r.readAsDataURL(file); })(files[i]);}
  input.value='';
};
window.wbRemoveCommentFile=function(idx){ commentFilesStaging.splice(idx,1); renderFilePreview(commentFilesStaging,'wb-comment-file-preview','wbRemoveCommentFile'); };
window.wbSubmitComment=function(){
  var text=g('wb-comment-text').value.trim();
  if(!text&&!commentFilesStaging.length) return;
  if(!tmI) return;
  var comment={id:uid(),userId:cu.id,text:text,files:commentFilesStaging.slice(),ts:Date.now()};
  for(var i=0;i<boards.length;i++)
    for(var j=0;j<boards[i].groups.length;j++)
      for(var k=0;k<boards[i].groups[j].items.length;k++)
        if(boards[i].groups[j].items[k].id===tmI.id){
          if(!boards[i].groups[j].items[k].comments) boards[i].groups[j].items[k].comments=[];
          boards[i].groups[j].items[k].comments.push(comment);
          tmI=boards[i].groups[j].items[k];
          break;
        }
  pshN(tmI,cu.id,tmI.status,'','comment');
  commentFilesStaging=[];
  g('wb-comment-text').value='';
  renderFilePreview([],'wb-comment-file-preview','wbRemoveCommentFile');
  fbSave();
  renderComments(tmI.comments||[]);
};
function renderComments(comments){
  var c=g('wb-comments-list'); if(!c) return;
  if(!comments||!comments.length){ c.innerHTML='<div style="font-size:12px;color:#9CA3AF;padding:4px 0">No comments yet.</div>'; return; }
  var h='';
  for(var i=0;i<comments.length;i++){
    var cm=comments[i],u=null;
    for(var j=0;j<TM.length;j++) if(TM[j].id===cm.userId){u=TM[j];break;}
    var time=new Date(cm.ts).toLocaleDateString('en',{month:'short',day:'numeric'})+' '+new Date(cm.ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    h+='<div style="display:flex;gap:10px;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #F2F3F5">'+
      av(u?u.id:'',28)+
      '<div style="flex:1;min-width:0">'+
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span style="font-size:13px;font-weight:700;color:#1A2228">'+(u?u.name:'Unknown')+'</span><span style="font-size:11px;color:#9CA3AF">'+time+'</span></div>'+
        (cm.text?'<div style="font-size:13px;color:#3D4F5C;line-height:1.6;margin-bottom:4px">'+cm.text+'</div>':'')+
        renderSavedFiles(cm.files||[])+
      '</div>'+
    '</div>';
  }
  c.innerHTML=h;
}

/* ── Toast system ── */
window.wbHP=function(){};
function showToast(opts){
  var container=g('wb-toast-container'); if(!container) return;
  var id='t'+uid();
  var color=opts.color||'#F7931E';
  var el=document.createElement('div');
  el.className='wb-toast'; el.id=id;
  el.innerHTML=
    '<div class="wb-toast-accent" style="background:'+color+'"></div>'+
    '<div class="wb-toast-body">'+
      '<div class="wb-toast-icon" style="background:'+color+'18;border:1.5px solid '+color+'33">'+(opts.icon||'')+'</div>'+
      '<div class="wb-toast-content">'+
        '<div class="wb-toast-title">'+opts.title+'</div>'+
        '<div class="wb-toast-msg">'+opts.msg+'</div>'+
        '<div class="wb-toast-time">'+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+'</div>'+
      '</div>'+
      '<button class="wb-toast-close" onclick="wbDismissToast(\''+id+'\')">&#215;</button>'+
    '</div>'+
    '<div class="wb-toast-progress"><div class="wb-toast-progress-bar" style="background:'+color+'"></div></div>';
  container.appendChild(el);
  setTimeout(function(){ wbDismissToast(id); },6000);
}
window.wbDismissToast=function(id){
  var el=g(id); if(!el) return;
  el.classList.add('removing');
  setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); },260);
};

function getStatusMeta(statusVal){
  var label=statusVal||'done', color='#1D7A4E';
  for(var i=0;i<ST.length;i++) if(ST[i].v===statusVal){ label=ST[i].l; color=ST[i].d; break; }
  return {label:label,color:color};
}

function showP(notif){
  var a=null; for(var i=0;i<TM.length;i++) if(TM[i].id===notif.assigneeId){a=TM[i];break;}
  var who='<strong style="color:'+(a?a.color:'#38444E')+'">'+(a?a.name:'Someone')+'</strong>';
  var type=notif.type||'status';
  var sm=getStatusMeta(notif.newStatus);
  var title,msg,color,icon;
  if(type==='assigned'){
    color='#F7931E';
    title='Task assigned to you';
    msg=who+' assigned you <strong>"'+notif.taskName+'"</strong>';
    icon='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="'+color+'" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  } else if(type==='comment'){
    color='#378ADD';
    title='New comment';
    msg=who+' commented on <strong>"'+notif.taskName+'"</strong>';
    icon='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="'+color+'" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  } else {
    color=sm.color;
    title='Status updated';
    msg=who+' changed <strong>"'+notif.taskName+'"</strong> to <strong style="color:'+sm.color+'">'+sm.label+'</strong>';
    icon='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="'+color+'" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  }
  showToast({title:title,msg:msg,color:color,icon:icon});
  fireSysNotif(notif,type,sm,a);
}

function fireSysNotif(notif,type,sm,a){
  if(!('Notification' in window)||Notification.permission!=='granted') return;
  var body='';
  if(type==='assigned') body=(a?a.name:'Someone')+' assigned you "'+notif.taskName+'"';
  else if(type==='comment') body=(a?a.name:'Someone')+' commented on "'+notif.taskName+'"';
  else body=(a?a.name:'Someone')+' changed "'+notif.taskName+'" to '+(sm?sm.label:'done');
  try{
    var sn=new Notification('WorkBoard',{body:body,tag:notif.key,requireInteraction:false});
    sn.onclick=function(){ window.focus(); sn.close(); };
  }catch(e){}
}

function pshN(task,doneById,newStatus,oldStatus,type){
  type=type||'status';
  function push(targetId){
    if(!targetId||targetId===doneById) return;
    db.ref('workboard/notifs/'+targetId).push({id:uid(),taskName:task.name,assigneeId:doneById,toUserId:targetId,taskId:task.id,newStatus:newStatus||'done',oldStatus:oldStatus||'',type:type,ts:Date.now()});
  }
  push(task.assignedBy);
  push(task.ownerId);
}

/* ══════════════════════════════════════════════
   HTML BUILD
══════════════════════════════════════════════ */
function buildHTML(){
  var w=g('wb-wrap'); if(!w) return;
  w.innerHTML=
  '<div id="wb-loading"><div class="wb-sp"></div><span style="font-size:13px;color:#6B7A84">Loading WorkBoard...</span></div>'+
  '<div id="wb-login" style="display:none">'+
    '<div class="wb-login-card">'+
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">'+
        '<div style="width:30px;height:30px;border-radius:8px;background:#F7931E;display:flex;align-items:center;justify-content:center;flex-shrink:0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg></div>'+
        '<span style="font-size:18px;font-weight:700;color:#38444E">WorkBoard</span>'+
      '</div>'+
      '<p style="font-size:13px;color:#6B7A84;margin-bottom:20px">Sign in to your account</p>'+
      '<div id="wb-llist"></div>'+
    '</div>'+
  '</div>'+
  '<div id="wb-pw-screen" style="display:none;position:fixed;inset:0;background:rgba(26,34,40,.55);z-index:300000;align-items:center;justify-content:center">'+
    '<div style="background:#fff;border-radius:16px;padding:32px;width:340px;max-width:92vw;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.2)">'+
      '<div id="wb-pw-av" style="margin:0 auto 12px;display:flex;justify-content:center"></div>'+
      '<div id="wb-pw-name" style="font-size:16px;font-weight:700;margin-bottom:4px;color:#1A2228"></div>'+
      '<p style="font-size:13px;color:#6B7A84;margin-bottom:18px">Enter your password</p>'+
      '<input type="password" id="wb-pw-input" placeholder="Password" style="width:100%;padding:10px 14px;border-radius:8px;border:1px solid #E2E5E8;font-size:14px;font-family:inherit;margin-bottom:8px;text-align:center;outline:none"/>'+
      '<div id="wb-pw-err" style="color:#B03020;font-size:12px;min-height:18px;margin-bottom:10px"></div>'+
      '<div style="display:flex;gap:8px">'+
        '<button onclick="wbPWCancel()" style="flex:1;padding:10px;border-radius:8px;border:1px solid #E2E5E8;background:#fff;font-size:13px;cursor:pointer;font-family:inherit;color:#1A2228">Back</button>'+
        '<button onclick="wbPWSubmit()" style="flex:1;padding:10px;border-radius:8px;border:none;background:#F7931E;color:#fff;font-size:13px;cursor:pointer;font-weight:600;font-family:inherit">Sign in</button>'+
      '</div>'+
    '</div>'+
  '</div>'+
  '<div id="wb-app" style="display:none">'+
    '<div id="wb-sb">'+
      '<div style="padding:0 16px;height:56px;font-size:15px;font-weight:700;display:flex;align-items:center;gap:10px;border-bottom:1px solid #E2E5E8;color:#38444E">'+
        '<div style="width:28px;height:28px;border-radius:8px;background:#F7931E;display:flex;align-items:center;justify-content:center;flex-shrink:0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg></div>WorkBoard'+
      '</div>'+
      '<div id="wb-sbu" style="display:flex;align-items:center;gap:10px;padding:10px 12px;margin:10px 10px 4px;border-radius:10px;background:#F7F8FA;border:1px solid #E2E5E8"></div>'+
      '<div id="wb-mts" style="display:none;padding:10px 12px;border-bottom:1px solid #E2E5E8">'+
        '<div style="font-size:10px;font-weight:700;letter-spacing:.08em;color:#6B7A84;text-transform:uppercase;padding-bottom:6px">My tasks (<span id="wb-mtc">0</span>)</div>'+
        '<div id="wb-mtl"></div>'+
      '</div>'+
      '<div style="font-size:10px;font-weight:700;letter-spacing:.08em;color:#6B7A84;text-transform:uppercase;padding:14px 16px 6px">Navigation</div>'+
      '<div class="sb-item" id="sbn-boards" onclick="setTab(\'boards\')"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> Tasks</div>'+
      '<div class="sb-item" id="sbn-brand" onclick="setTab(\'brand\')"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></svg> Brand Kit</div>'+
      '<div class="sb-item" id="sbn-trash" onclick="setTab(\'trash\')"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg> Trash</div>'+
      '<div style="font-size:10px;font-weight:700;letter-spacing:.08em;color:#6B7A84;text-transform:uppercase;padding:14px 16px 6px">Task Boards</div>'+
      '<div id="wb-bl"></div>'+
      '<div class="sb-item" id="wb-nbb" style="color:#9CA3AF"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> New task board</div>'+
      '<div style="border-top:1px solid #E2E5E8;padding:10px 16px;font-size:11px;color:#9CA3AF;margin-top:auto" id="wb-ttl">0 total tasks</div>'+
    '</div>'+
    '<div id="wb-main">'+
      '<div id="wb-topbar">'+
        '<button class="btn" style="padding:5px 8px" id="wb-tsb"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>'+
        '<div id="wb-bcd" style="width:12px;height:12px;border-radius:3px;flex-shrink:0;display:none"></div>'+
        '<h1 id="wb-bt">Tasks</h1>'+
        '<div style="position:relative" id="wb-bell-btn"><button class="btn" style="padding:5px 10px" id="wb-bellt"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></button><div id="wb-bdot"></div></div>'+
        '<button class="btn" id="wb-ebb" style="display:none">Edit</button>'+
        '<button class="btn btnp" id="wb-atb" style="display:none">+ Add task</button>'+
      '</div>'+
      '<div id="wb-toolbar" style="display:none">'+
        '<button class="vbtn active" id="wb-vb">Table</button>'+
        '<button class="vbtn" id="wb-vk">Visual Board</button>'+
        '<div style="width:1px;height:20px;background:#E2E5E8;margin:0 4px"></div>'+
        '<button class="btn fchip" id="wb-flt">Filter</button>'+
        '<button class="btn btnd" id="wb-flc" style="display:none;font-size:12px">Clear</button>'+
        '<div style="flex:1"></div>'+
        '<input type="text" id="wb-si" placeholder="Search..."/>'+
      '</div>'+
      '<div id="wb-fp" class="hidden">'+
        '<div><div style="font-size:10px;font-weight:700;color:#6B7A84;margin-bottom:6px;text-transform:uppercase;letter-spacing:.06em">Priority</div><div style="display:flex;gap:6px;flex-wrap:wrap" id="wb-fpp"></div></div>'+
        '<div><div style="font-size:10px;font-weight:700;color:#6B7A84;margin-bottom:6px;text-transform:uppercase;letter-spacing:.06em">Status</div><div style="display:flex;gap:6px;flex-wrap:wrap" id="wb-fps"></div></div>'+
      '</div>'+
      '<div id="wb-content"></div>'+
    '</div>'+
  '</div>'+
  '<div id="wb-toast-container"></div>'+
  '<div id="wb-notif-popup" style="display:none"></div>'+
  '<div id="wb-np">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #E2E5E8"><span style="font-size:14px;font-weight:700;color:#1A2228">Notifications</span><button id="wb-npc" style="background:none;border:none;font-size:12px;color:#9CA3AF;cursor:pointer;font-family:inherit">Clear all</button></div>'+
    '<div id="wb-npl" style="max-height:340px;overflow-y:auto"></div>'+
  '</div>'+
  mkModal('wb-tm','wb-tmt','New task',
    '<div class="wb-field"><label>Task name</label><input type="text" id="wb-tn" placeholder="What needs to be done?"/></div>'+
    '<div class="wb-field"><label>Assign to</label><div class="alist" id="wb-al"></div></div>'+
    '<div class="fg"><div class="wb-field"><label>Status</label><select id="wb-ts"></select></div><div class="wb-field"><label>Priority</label><select id="wb-tp"></select></div><div class="wb-field"><label>Due date</label><input type="date" id="wb-td"/></div></div>'+
    '<div class="wb-field"><label>Notes / Brief</label><textarea id="wb-tnotes" placeholder="Add notes or brief..."></textarea></div>'+
    '<div class="wb-field" id="wb-brief-files-field">'+
      '<label>Brief / Request Files <span style="font-size:11px;color:#9CA3AF;font-weight:400">(creator only)</span></label>'+
      '<div id="wb-brief-preview" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px"></div>'+
      '<label id="wb-brief-upload-btn" style="display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:8px;border:1px solid #E2E5E8;background:#F2F3F5;color:#38444E;font-size:12px;cursor:pointer;font-family:inherit;font-weight:500">+ Attach file<input type="file" id="wb-brief-file-input" multiple style="display:none" onchange="wbAddBriefFiles(this)"/></label>'+
    '</div>'+
    '<div class="wb-field" id="wb-comments-field" style="display:none">'+
      '<label>Comments & Work Files</label>'+
      '<div id="wb-comments-list" style="margin-bottom:10px"></div>'+
      '<div id="wb-comment-input-area" style="border:1px solid #E2E5E8;border-radius:8px;padding:10px;background:#F7F8FA">'+
        '<textarea id="wb-comment-text" placeholder="Add a comment..." style="width:100%;border:none;background:transparent;font-size:13px;font-family:inherit;outline:none;resize:none;min-height:50px;color:#1A2228"></textarea>'+
        '<div id="wb-comment-file-preview" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px"></div>'+
        '<div style="display:flex;align-items:center;justify-content:space-between">'+
          '<label style="display:inline-flex;align-items:center;gap:5px;padding:5px 10px;border-radius:6px;border:1px solid #E2E5E8;background:#fff;color:#6B7A84;font-size:12px;cursor:pointer;font-family:inherit">&#128206; Attach<input type="file" id="wb-comment-file-input" multiple style="display:none" onchange="wbAddCommentFiles(this)"/></label>'+
          '<button onclick="wbSubmitComment()" style="padding:6px 16px;border-radius:8px;border:none;background:#F7931E;color:#fff;font-size:12px;cursor:pointer;font-weight:600;font-family:inherit">Post</button>'+
        '</div>'+
      '</div>'+
    '</div>',
    '<button class="btn btnd" id="wb-tdb" style="display:none"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg> Trash</button>',
    '<button class="btn" id="wb-tcb">Cancel</button><button class="btn btnp" id="wb-tsb2">Save</button>')+
  mkModal('wb-bm','wb-bmt','New task board',
    '<div class="wb-field"><label>Board name</label><input type="text" id="wb-bn" placeholder="Board name"/></div><div class="wb-field"><label>Color</label><div class="cg" id="wb-bcp"></div></div>',
    '<button class="btn btnd" id="wb-bdb" style="display:none">Delete board</button>',
    '<button class="btn" id="wb-bcb">Cancel</button><button class="btn btnp" id="wb-bsb">Save</button>')+
  mkModal('wb-gm','wb-gmt','New group',
    '<div class="wb-field"><label>Group name</label><input type="text" id="wb-gn" placeholder="Group name"/></div><div class="wb-field"><label>Color</label><div class="cg" id="wb-gcp"></div></div>',
    '<button class="btn btnd" id="wb-gdb" style="display:none">Delete group</button>',
    '<button class="btn" id="wb-gcb">Cancel</button><button class="btn btnp" id="wb-gsb">Save</button>')+
  '<div id="wb-cpw-modal" style="display:none;position:fixed;inset:0;background:rgba(26,34,40,.55);z-index:300000;align-items:center;justify-content:center">'+
    '<div style="background:#fff;border-radius:16px;padding:32px;width:360px;max-width:92vw;box-shadow:0 20px 60px rgba(0,0,0,.2)">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px"><span style="font-size:15px;font-weight:700;color:#1A2228">Change Password</span><button onclick="wbCloseCPW()" style="background:none;border:none;font-size:22px;cursor:pointer;color:#9CA3AF">&#215;</button></div>'+
      '<div class="wb-field"><label>Current password</label><input type="password" id="wb-cpw-cur" placeholder="Enter current password"/></div>'+
      '<div class="wb-field"><label>New password</label><input type="password" id="wb-cpw-new" placeholder="At least 6 characters"/></div>'+
      '<div class="wb-field"><label>Confirm new password</label><input type="password" id="wb-cpw-cfm" placeholder="Repeat new password"/></div>'+
      '<div id="wb-cpw-err" style="color:#B03020;font-size:12px;min-height:18px;margin-bottom:8px"></div>'+
      '<div id="wb-cpw-ok" style="color:#1D7A4E;font-size:12px;min-height:18px;margin-bottom:8px"></div>'+
      '<div style="display:flex;gap:8px"><button onclick="wbCloseCPW()" style="flex:1;padding:10px;border-radius:8px;border:1px solid #E2E5E8;background:#fff;font-size:13px;cursor:pointer;font-family:inherit;color:#1A2228">Cancel</button><button onclick="wbSubmitCPW()" style="flex:1;padding:10px;border-radius:8px;border:none;background:#F7931E;color:#fff;font-size:13px;cursor:pointer;font-weight:600;font-family:inherit">Save password</button></div>'+
    '</div>'+
  '</div>';
}

function mkModal(id,tid,title,body,left,right){
  return '<div class="wb-mo" id="'+id+'"><div class="wb-mb">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px"><span style="font-size:15px;font-weight:700;color:#1A2228" id="'+tid+'">'+title+'</span><button id="'+id+'c" style="background:none;border:none;font-size:22px;cursor:pointer;color:#9CA3AF">&#215;</button></div>'+
    body+
    '<div style="display:flex;justify-content:space-between;margin-top:20px"><div>'+left+'</div><div style="display:flex;gap:8px">'+right+'</div></div>'+
  '</div></div>';
}

/* ── Login ── */
function rLogin(){
  var h='';
  for(var i=0;i<TM.length;i++){
    var u=TM[i];
    h+='<div class="wb-login-item" onclick="wbSelectUser(\''+u.id+'\')">'+av(u.id,36)+'<span style="font-size:14px;font-weight:500">'+u.name+'</span></div>';
  }
  g('wb-llist').innerHTML=h;
}

window.wbSelectUser=function(id){
  loginUser=null;
  for(var i=0;i<TM.length;i++) if(TM[i].id===id){ loginUser=TM[i]; break; }
  if(!loginUser) return;
  g('wb-pw-av').innerHTML=av(loginUser.id,48);
  g('wb-pw-name').textContent=loginUser.name;
  g('wb-pw-input').value='';
  g('wb-pw-err').textContent='';
  g('wb-pw-screen').style.display='flex';
  setTimeout(function(){ g('wb-pw-input').focus(); },100);
};
window.wbPWCancel=function(){ g('wb-pw-screen').style.display='none'; loginUser=null; };
window.wbPWSubmit=function(){
  if(!loginUser) return;
  var entered=g('wb-pw-input').value;
  var correct=PASSWORDS[loginUser.id]||DEFAULT_PASSWORDS[loginUser.id];
  if(entered===correct){ g('wb-pw-screen').style.display='none'; doLogin(loginUser.id); }
  else { g('wb-pw-err').textContent='Incorrect password. Try again.'; g('wb-pw-input').value=''; g('wb-pw-input').focus(); }
};
document.addEventListener('keydown',function(e){ if(e.key==='Enter'&&g('wb-pw-screen')&&g('wb-pw-screen').style.display==='flex') wbPWSubmit(); });

function doLogin(id){
  cu=null;
  for(var i=0;i<TM.length;i++) if(TM[i].id===id){ cu=TM[i]; break; }
  if(!cu) return;
  sO=cu.id;
  saveSession(cu.id);
  loadSeenNotifs(cu.id);
  g('wb-login').style.display='none';
  g('wb-app').style.display='flex';
  if('Notification' in window&&Notification.permission==='default') Notification.requestPermission();
  db.ref('workboard/passwords').once('value',function(snap){ PASSWORDS=snap.val()||{}; });
  var ref=db.ref('workboard/boards');
  ref.on('value',function(snap){
    var v=snap.val(),raw=[];
    if(!v){ raw=[]; } else if(Array.isArray(v)){ raw=v; } else { var k=Object.keys(v); for(var i=0;i<k.length;i++) raw.push(v[k[i]]); }
    boards=sanitizeBoards(raw);
    if(!abid&&boards.length) abid=boards[0].id;
    rAll();
  });
  uB=function(){ ref.off('value'); };
  var tref=db.ref('workboard/trash');
  tref.on('value',function(snap){
    var v=snap.val();
    if(!v){ trash=[]; return; }
    if(Array.isArray(v)){ trash=v; } else { trash=[]; var k=Object.keys(v); for(var i=0;i<k.length;i++) if(v[k[i]]) trash.push(v[k[i]]); }
    var now=Date.now(),kept=[],changed=false;
    for(var i=0;i<trash.length;i++){ if(trash[i]&&(now-trash[i].deletedAt)<30*24*60*60*1000) kept.push(trash[i]); else changed=true; }
    if(changed){ trash=kept; fbSaveTrash(); }
    if(activeTab==='trash') rC();
  });
  uT=function(){ tref.off('value'); };
  var nref=db.ref('workboard/notifs/'+cu.id);
  nref.on('child_added',function(snap){
    var n=snap.val(); n.key=snap.key;
    if(n.toUserId&&n.toUserId!==cu.id) return;
    if(!seen.has(n.key)){
      saveSeenNotif(cu.id,n.key);
      var sm=getStatusMeta(n.newStatus);
      nh.unshift({taskName:n.taskName,assigneeId:n.assigneeId,message:n.message||'',newStatus:n.newStatus||'done',type:n.type||'status',ts:n.ts,key:n.key,read:false});
      showP(n);
      updBell();
    }
  });
  uN=function(){ nref.off('child_added'); };
  loadBrandAssets();
  wire();
}

window.wbLO=function(){
  if(uB) uB(); if(uN) uN(); if(uT) uT();
  cu=null; boards=[]; trash=[]; seen=new Set(); nh=[];
  clearSession();
  g('wb-app').style.display='none';
  g('wb-login').style.display='flex';
  rLogin();
};

/* ── Wire buttons ── */
function wire(){
  g('wb-tsb').onclick=function(){ g('wb-sb').classList.toggle('closed'); };
  g('wb-nbb').onclick=window.oAB;
  g('wb-ebb').onclick=oEB;
  g('wb-atb').onclick=function(){ var b=getB(); if(b) window.oAT(b.groups.length?b.groups[0].id:null); };
  g('wb-vb').onclick=function(){ setView('board'); };
  g('wb-vk').onclick=function(){ setView('kanban'); };
  g('wb-flt').onclick=function(){ g('wb-fp').classList.toggle('hidden'); };
  g('wb-flc').onclick=clrF;
  g('wb-si').oninput=function(){ fil.s=this.value; uFil(); rC(); };
  g('wb-bellt').onclick=tNP;
  g('wb-npc').onclick=function(){ for(var i=0;i<nh.length;i++) seen.add(nh[i].key); saveClearedNotifs(cu.id); nh=[]; updBell(); rNP(); g('wb-np').classList.remove('open'); };
  g('wb-tsb2').onclick=svT;
  g('wb-tcb').onclick=function(){ closeM('wb-tm'); };
  g('wb-tmc').onclick=function(){ closeM('wb-tm'); };
  g('wb-tdb').onclick=moveToTrash;
  g('wb-bsb').onclick=svB;
  g('wb-bcb').onclick=function(){ closeM('wb-bm'); };
  g('wb-bmc').onclick=function(){ closeM('wb-bm'); };
  g('wb-bdb').onclick=dlB;
  g('wb-gsb').onclick=svG;
  g('wb-gcb').onclick=function(){ closeM('wb-gm'); };
  g('wb-gmc').onclick=function(){ closeM('wb-gm'); };
  g('wb-gdb').onclick=dlG;
  var modals=document.querySelectorAll('.wb-mo');
  for(var i=0;i<modals.length;i++) modals[i].addEventListener('click',function(e){ if(e.target===this) this.classList.remove('open'); });
  document.addEventListener('click',function(e){ var p=g('wb-np'),b=g('wb-bell-btn'); if(p&&p.classList.contains('open')&&!p.contains(e.target)&&!b.contains(e.target)) p.classList.remove('open'); });
  rFChips();
  setTab('boards');
}

/* ── Tabs ── */
window.setTab=function(tab){
  activeTab=tab;
  ['boards','brand','trash'].forEach(function(t){ var el=g('sbn-'+t); if(el) el.classList.toggle('active',t===tab); });
  var isB=tab==='boards';
  g('wb-ebb').style.display=isB?'':'none';
  g('wb-atb').style.display=isB?'':'none';
  g('wb-toolbar').style.display=isB?'flex':'none';
  g('wb-fp').classList.add('hidden');
  if(tab==='brand') g('wb-bt').textContent='Brand Kit';
  else if(tab==='trash') g('wb-bt').textContent='Trash';
  else if(getB()) g('wb-bt').textContent=getB().name;
  else g('wb-bt').textContent='Tasks';
  if(isB&&getB()){ g('wb-bcd').style.display='block'; g('wb-bcd').style.background=getB().color; } else g('wb-bcd').style.display='none';
  rC();
};

/* ── Render ── */
function rSB(){
  var u=cu;
  g('wb-sbu').innerHTML=av(u.id,32)+
    '<span style="font-size:13px;font-weight:600;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#1A2228">'+u.name+'</span>'+
    '<button onclick="wbOpenChangePW()" title="Change password" style="background:none;border:none;cursor:pointer;color:#9CA3AF;padding:2px 4px;display:flex;align-items:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></button>'+
    '<button onclick="wbLO()" title="Sign out" style="background:none;border:none;cursor:pointer;color:#9CA3AF;padding:2px 4px;display:flex;align-items:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></button>';
  var mt=[];
  for(var i=0;i<boards.length;i++) for(var j=0;j<boards[i].groups.length;j++) for(var k=0;k<boards[i].groups[j].items.length;k++){ var it=boards[i].groups[j].items[k]; if(it.ownerId===u.id&&it.status!=='done') mt.push(it); }
  g('wb-mts').style.display=mt.length?'block':'none';
  g('wb-mtc').textContent=mt.length;
  var mh='';
  for(var i=0;i<Math.min(mt.length,5);i++){ var t=mt[i]; mh+='<div style="display:flex;align-items:center;gap:8px;padding:5px 4px;font-size:12px;border-radius:6px;cursor:pointer;color:#1A2228" onclick="wbET(\''+t.id+'\')"><div class="pdot pd-'+t.priority+'"></div><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">'+t.name+'</span><button class="qdone" onclick="event.stopPropagation();wbQD(\''+t.id+'\')">&#10003;</button></div>'; }
  g('wb-mtl').innerHTML=mh;
  var bh='';
  for(var i=0;i<boards.length;i++){ var bd=boards[i],cnt=0; for(var j=0;j<bd.groups.length;j++) cnt+=bd.groups[j].items.length; bh+='<div class="sb-item'+(abid===bd.id&&activeTab==='boards'?' active':'')+'" onclick="wbSB(\''+bd.id+'\')"><div style="width:10px;height:10px;border-radius:3px;flex-shrink:0;background:'+bd.color+'"></div><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">'+bd.name+'</span><span style="font-size:11px;margin-left:auto">'+cnt+'</span></div>'; }
  g('wb-bl').innerHTML=bh;
  var total=0; for(var i=0;i<boards.length;i++) for(var j=0;j<boards[i].groups.length;j++) total+=boards[i].groups[j].items.length;
  g('wb-ttl').textContent=total+' total tasks';
}

function rC(){
  var c=g('wb-content');
  if(activeTab==='brand'){ rBrand(c); return; }
  if(activeTab==='trash'){ rTrash(c); return; }
  var b=getB();
  if(g('wb-bt')&&activeTab==='boards') g('wb-bt').textContent=b?b.name:'Tasks';
  if(g('wb-bcd')){ g('wb-bcd').style.display=b?'block':'none'; if(b) g('wb-bcd').style.background=b.color; }
  if(!b){ c.innerHTML='<div class="wb-empty"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C8CDD1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg><div style="font-size:16px;font-weight:600;color:#1A2228">No task boards yet</div><div style="font-size:13px;color:#6B7A84">Create your first board to get started</div><button class="btn btnp" onclick="oAB()">+ Create task board</button></div>'; return; }
  if(view==='kanban'){ rKan(b,c); return; }
  rTbl(b,c);
}

function rTbl(board,c){
  var hF=fil.pr.length||fil.st.length||fil.s,h='';
  for(var gi=0;gi<board.groups.length;gi++){
    var gr=board.groups[gi],disp=[];
    for(var ii=0;ii<gr.items.length;ii++) if(!hF||match(gr.items[ii])) disp.push(gr.items[ii]);
    if(hF&&!disp.length) continue;
    var isc=col[gr.id];
    h+='<div style="margin-bottom:24px"><div style="display:flex;align-items:center;gap:8px;padding:4px 6px;margin-bottom:8px"><div style="width:6px;height:22px;border-radius:3px;cursor:pointer;flex-shrink:0;background:'+gr.color+'" onclick="wbTC(\''+gr.id+'\')"></div><span style="font-size:14px;font-weight:700;color:#1A2228">'+gr.name+'</span><span style="font-size:12px;color:#9CA3AF;margin-left:2px;font-weight:500">'+disp.length+'</span><div style="margin-left:auto;display:flex;gap:6px"><button class="btn" style="padding:3px 10px;font-size:12px" onclick="oAT(\''+gr.id+'\')">+ Task</button><button class="btn" style="padding:3px 8px;font-size:12px" onclick="wbEG(\''+gr.id+'\')">&#8943;</button></div></div>';
    if(!isc){
      h+='<div style="background:#fff;border:1px solid #E2E5E8;border-radius:10px;overflow:hidden;margin-bottom:4px"><div class="bhead"><span>Task</span><span>Status</span><span></span><span>Priority</span><span>Due</span><span></span></div>';
      for(var ii=0;ii<disp.length;ii++){
        var item=disp[ii],im=item.ownerId===cu.id;
        var td=new Date(); td.setHours(0,0,0,0);
        var ov=item.due&&new Date(item.due)<td&&item.status!=='done';
        var s=ST[0]; for(var si=0;si<ST.length;si++) if(ST[si].v===item.status){s=ST[si];break;}
        var p=PR[1]; for(var pi=0;pi<PR.length;pi++) if(PR[pi].v===item.priority){p=PR[pi];break;}
        var ds=item.due?new Date(item.due).toLocaleDateString('en',{month:'short',day:'numeric'}):'&mdash;';
        var isDone=item.status==='done';
        var hasFiles=(item.briefFiles&&item.briefFiles.length)||(item.comments&&item.comments.length);
        h+='<div class="brow" onclick="wbET(\''+item.id+'\')">'+
          '<div style="display:flex;align-items:center;gap:8px;overflow:hidden">'+
            '<div style="width:14px;height:14px;border-radius:4px;border:1.5px solid '+(isDone?'#1D7A4E':'#C8CDD1')+';flex-shrink:0;display:flex;align-items:center;justify-content:center;background:'+(isDone?'#1D7A4E':'transparent')+'">'+
              (isDone?'<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>':'')+
            '</div>'+
            '<span style="font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:'+(isDone?'#9CA3AF':'#1A2228')+(isDone?';text-decoration:line-through':'')+'">'+item.name+'</span>'+
            (im&&!isDone?'<span style="font-size:10px;color:#F7931E;font-weight:700;flex-shrink:0;background:#FFF0DC;padding:1px 6px;border-radius:10px">you</span>':'')+
            (hasFiles?'<span style="font-size:10px;color:#9CA3AF;flex-shrink:0">&#128206;</span>':'')+
          '</div>'+
          '<div><span class="pill '+s.p+'">'+s.l+'</span></div>'+
          '<div>'+av(item.ownerId,24)+'</div>'+
          '<div style="display:flex;align-items:center;gap:6px"><div class="pdot pd-'+item.priority+'"></div><span style="font-size:12px;color:#6B7A84">'+p.l+'</span></div>'+
          '<div style="font-size:12px;color:'+(ov?'#B03020':'#6B7A84')+'">'+ds+'</div>'+
          '<div>'+(im&&!isDone?'<button class="qdone" onclick="event.stopPropagation();wbQD(\''+item.id+'\')">&#10003;</button>':' ')+'</div>'+
        '</div>';
      }
      if(!hF) h+='<div style="padding:8px 14px;font-size:12px;color:#9CA3AF;cursor:pointer;border-top:1px solid #F2F3F5" onmouseover="this.style.background=\'#F7F8FA\'" onmouseout="this.style.background=\'\'" onclick="oAT(\''+gr.id+'\')">+ Add task</div>';
      h+='</div>';
    }
    h+='</div>';
  }
  if(!hF) h+='<button class="btn" style="font-size:13px;margin-top:4px" onclick="oAG()">+ Add group</button>';
  c.innerHTML=h;
}

function rKan(board,c){
  var h='<div class="kan-wrap">';
  for(var si=0;si<ST.length;si++){
    var sc=ST[si],tasks=[];
    for(var gi=0;gi<board.groups.length;gi++) for(var ii=0;ii<board.groups[gi].items.length;ii++){ var it=board.groups[gi].items[ii]; if(it.status===sc.v) tasks.push({item:it,gc:board.groups[gi].color}); }
    h+='<div class="kan-col"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><div style="width:10px;height:10px;border-radius:50%;background:'+sc.d+';flex-shrink:0"></div><span style="font-size:13px;font-weight:700;color:#38444E">'+sc.l+'</span><span style="font-size:12px;color:#9CA3AF;margin-left:auto;font-weight:500">'+tasks.length+'</span></div>';
    for(var ti=0;ti<tasks.length;ti++){
      var t=tasks[ti].item,gc=tasks[ti].gc,im=t.ownerId===cu.id&&t.status!=='done';
      h+='<div class="kan-card'+(im?' mine':'')+'" style="border-left:3px solid '+gc+'" onclick="wbET(\''+t.id+'\')">'+
        '<div style="font-size:13px;font-weight:600;margin-bottom:8px;line-height:1.4;color:#1A2228">'+t.name+'</div>'+
        '<div style="display:flex;align-items:center;gap:6px"><div class="pdot pd-'+t.priority+'"></div>'+(t.due?'<span style="font-size:11px;color:#6B7A84">'+t.due+'</span>':'')+'<div style="margin-left:auto">'+av(t.ownerId,22)+'</div></div>'+
        (im?'<div style="margin-top:8px;font-size:11px;color:#F7931E;font-weight:700">&#9679; Assigned to you</div>':'')+
      '</div>';
    }
    h+='</div>';
  }
  c.innerHTML=h+'</div>';
}

/* ── Nav ── */
window.wbSB=function(id){ abid=id; activeTab='boards'; setTab('boards'); rSB(); };
function setView(v){ view=v; g('wb-vb').classList.toggle('active',v==='board'); g('wb-vk').classList.toggle('active',v==='kanban'); rC(); }
window.wbTC=function(gid){ col[gid]=!col[gid]; rC(); };
function clrF(){ fil={pr:[],st:[],s:''}; g('wb-si').value=''; uFil(); rC(); }
window.wbTF=function(k,v){ var a=fil[k],idx=a.indexOf(v); if(idx>-1) a.splice(idx,1); else a.push(v); uFil(); rC(); };
function rFChips(){
  var h=''; for(var i=0;i<PR.length;i++) h+='<div class="fchip" id="fcp-'+PR[i].v+'" onclick="wbTF(\'pr\',\''+PR[i].v+'\')">'+PR[i].l+'</div>'; g('wb-fpp').innerHTML=h;
  h=''; for(var i=0;i<ST.length;i++) h+='<div class="fchip" id="fcs-'+ST[i].v+'" onclick="wbTF(\'st\',\''+ST[i].v+'\')">'+ST[i].l+'</div>'; g('wb-fps').innerHTML=h;
}
function uFil(){
  for(var i=0;i<PR.length;i++){ var e=g('fcp-'+PR[i].v); if(!e) continue; var a=fil.pr.indexOf(PR[i].v)>-1; e.style.background=a?'#F7931E':'#fff'; e.style.color=a?'#fff':'#6B7A84'; e.style.borderColor=a?'#F7931E':'#E2E5E8'; }
  var sm2={todo:{bg:'#EDECEA',c:'#4A4845'},wip:{bg:'#D6F5E8',c:'#0A5C3E'},review:{bg:'#FFF0DC',c:'#7A4500'},done:{bg:'#D6F5E8',c:'#1D7A4E'},stuck:{bg:'#FAD9D9',c:'#7A1A1A'}};
  for(var i=0;i<ST.length;i++){ var e=g('fcs-'+ST[i].v); if(!e) continue; var a=fil.st.indexOf(ST[i].v)>-1; e.style.background=a?'#F7931E':'#fff'; e.style.color=a?'#fff':'#6B7A84'; e.style.borderColor=a?'#F7931E':'#E2E5E8'; }
  var hF=fil.pr.length||fil.st.length||fil.s;
  g('wb-flt').textContent=hF?'Filters ('+(fil.pr.length+fil.st.length+(fil.s?1:0))+')':'Filter';
  g('wb-flt').className='btn fchip'+(hF?' on':'');
  g('wb-flc').style.display=hF?'inline-flex':'none';
}

/* ── Task modal ── */
function pSS(v,disabled){ var h=''; for(var i=0;i<ST.length;i++) h+='<option value="'+ST[i].v+'"'+(ST[i].v===v?' selected':'')+'>'+ST[i].l+'</option>'; var sel=g('wb-ts'); sel.innerHTML=h; sel.disabled=!!disabled; sel.style.opacity=disabled?'.5':'1'; }
function pPS(v){ var h=''; for(var i=0;i<PR.length;i++) h+='<option value="'+PR[i].v+'"'+(PR[i].v===v?' selected':'')+'>'+PR[i].l+'</option>'; g('wb-tp').innerHTML=h; }
function rAL(lock){
  var h='';
  for(var i=0;i<TM.length;i++){
    var u=TM[i];
    if(lock) h+='<div class="aitem'+(u.id===sO?' sel':'')+'" style="--c:'+u.color+';opacity:'+(u.id===sO?1:.4)+';cursor:default">'+av(u.id,28)+'<span style="font-size:13px;font-weight:'+(u.id===sO?600:400)+';color:#1A2228">'+u.name+'</span>'+(u.id===sO?'<span style="margin-left:auto;font-size:13px;color:'+u.color+'">&#10003;</span>':'')+'</div>';
    else h+='<div class="aitem'+(u.id===sO?' sel':'')+'" style="--c:'+u.color+'" onclick="wbSO(\''+u.id+'\')">'+av(u.id,28)+'<span style="font-size:13px;font-weight:'+(u.id===sO?600:400)+';color:#1A2228">'+u.name+'</span>'+(u.id===sO?'<span style="margin-left:auto;font-size:13px;color:'+u.color+'">&#10003;</span>':'')+'</div>';
  }
  g('wb-al').innerHTML=h;
}
window.wbSO=function(id){ sO=id; rAL(false); };

window.oAT=function oAT(gid){
  tmM='add'; tmG=gid; tmI=null; sO=cu.id;
  briefFilesStaging=[]; commentFilesStaging=[];
  g('wb-tmt').textContent='New task';
  g('wb-tn').value=''; g('wb-td').value=''; g('wb-tnotes').value='';
  pSS('todo',false); pPS('med'); rAL(false);
  g('wb-tdb').style.display='none';
  g('wb-tn').disabled=false; g('wb-tp').disabled=false; g('wb-td').disabled=false; g('wb-tnotes').disabled=false;
  g('wb-tn').style.opacity='1'; g('wb-tp').style.opacity='1'; g('wb-td').style.opacity='1'; g('wb-tnotes').style.opacity='1';
  g('wb-tsb2').style.display='inline-flex';
  g('wb-brief-files-field').style.display='';
  g('wb-brief-upload-btn').style.display='inline-flex';
  renderFilePreview([],'wb-brief-preview','wbRemoveBriefFile');
  g('wb-comments-field').style.display='none';
  openM('wb-tm');
};

window.wbET=function(itemId){
  var item=find(itemId); if(!item) return;
  tmM='edit'; tmI=item; tmG=null; sO=item.ownerId||cu.id;
  briefFilesStaging=[]; commentFilesStaging=[];
  g('wb-tmt').textContent=item.name;
  g('wb-tn').value=item.name; g('wb-td').value=item.due||''; g('wb-tnotes').value=item.notes||'';
  pPS(item.priority);
  var isAssigned=item.ownerId===cu.id, isCreator=item.assignedBy===cu.id;
  pSS(item.status,!isAssigned);
  g('wb-tn').disabled=!isCreator; g('wb-tn').style.opacity=isCreator?'1':'.6';
  g('wb-tp').disabled=!isCreator; g('wb-tp').style.opacity=isCreator?'1':'.6';
  g('wb-td').disabled=!isCreator; g('wb-td').style.opacity=isCreator?'1':'.6';
  g('wb-tnotes').disabled=!isCreator; g('wb-tnotes').style.opacity=isCreator?'1':'.6';
  rAL(!isCreator);
  g('wb-tdb').style.display=isCreator?'inline-flex':'none';
  g('wb-tsb2').style.display=(isAssigned||isCreator)?'inline-flex':'none';
  // Brief files
  g('wb-brief-files-field').style.display='';
  g('wb-brief-upload-btn').style.display=isCreator?'inline-flex':'none';
  var bp=g('wb-brief-preview');
  if(bp) bp.innerHTML=(item.briefFiles&&item.briefFiles.length)?renderSavedFiles(item.briefFiles):'<span style="font-size:12px;color:#9CA3AF">No brief files attached.</span>';
  // Comments
  g('wb-comments-field').style.display='';
  var ca=g('wb-comment-input-area');
  if(ca) ca.style.display=(isAssigned||isCreator)?'':'none';
  renderComments(item.comments||[]);
  openM('wb-tm');
};

function svT(){
  var name=g('wb-tn').value.trim(); if(!name) return;
  var st=g('wb-ts').value,pr=g('wb-tp').value,due=g('wb-td').value,notes=g('wb-tnotes').value;
  if(tmM==='add'){
    var newItem={id:uid(),name:name,status:st,priority:pr,ownerId:sO,assignedBy:cu.id,due:due,notes:notes,briefFiles:briefFilesStaging.slice(),comments:[]};
    for(var i=0;i<boards.length;i++) if(boards[i].id===getB().id) for(var j=0;j<boards[i].groups.length;j++) if(boards[i].groups[j].id===tmG){ boards[i].groups[j].items.unshift(newItem); break; }
    if(sO!==cu.id) pshN(newItem,cu.id,'','','assigned');
  } else {
    var prev=tmI,isAssigned=prev.ownerId===cu.id,isCreator=prev.assignedBy===cu.id;
    for(var i=0;i<boards.length;i++) for(var j=0;j<boards[i].groups.length;j++) for(var k=0;k<boards[i].groups[j].items.length;k++){
      var it=boards[i].groups[j].items[k];
      if(it.id===prev.id){
        if(isCreator){ it.name=name; it.priority=pr; it.ownerId=sO; it.due=due; it.notes=notes; if(briefFilesStaging.length){ if(!it.briefFiles) it.briefFiles=[]; for(var x=0;x<briefFilesStaging.length;x++) it.briefFiles.push(briefFilesStaging[x]); } }
        if(isAssigned&&it.status!==prev.status){ it.status=st; pshN(it,cu.id,st,prev.status,'status'); } else if(isAssigned) it.status=st;
        break;
      }
    }
  }
  briefFilesStaging=[];
  fbSave(); closeM('wb-tm'); rAll();
}

function moveToTrash(){
  if(!tmI) return;
  var boardId=null,item=null;
  for(var i=0;i<boards.length;i++) for(var j=0;j<boards[i].groups.length;j++) for(var k=0;k<boards[i].groups[j].items.length;k++) if(boards[i].groups[j].items[k].id===tmI.id){ boardId=boards[i].id; item=boards[i].groups[j].items[k]; break; }
  if(!item) return;
  trash.push(Object.assign({},item,{deletedAt:Date.now(),boardId:boardId}));
  for(var i=0;i<boards.length;i++) for(var j=0;j<boards[i].groups.length;j++){ var ni=[]; for(var k=0;k<boards[i].groups[j].items.length;k++) if(boards[i].groups[j].items[k].id!==tmI.id) ni.push(boards[i].groups[j].items[k]); boards[i].groups[j].items=ni; }
  fbSave(); fbSaveTrash(); closeM('wb-tm'); rAll();
}

window.wbQD=function(itemId){
  var item=find(itemId); if(!item||item.ownerId!==cu.id) return;
  var oldStatus=item.status;
  for(var i=0;i<boards.length;i++) for(var j=0;j<boards[i].groups.length;j++) for(var k=0;k<boards[i].groups[j].items.length;k++) if(boards[i].groups[j].items[k].id===itemId){ boards[i].groups[j].items[k].status='done'; pshN(boards[i].groups[j].items[k],cu.id,'done',oldStatus,'status'); break; }
  fbSave(); rAll();
};

/* ── Board ── */
window.oAB=function oAB(){ bmM='add'; sBC=CL[0]; g('wb-bmt').textContent='New task board'; g('wb-bn').value=''; g('wb-bdb').style.display='none'; rCP('wb-bcp','sBC',sBC); openM('wb-bm'); };
function oEB(){ var b=getB(); if(!b) return; bmM='edit'; sBC=b.color; g('wb-bmt').textContent='Edit task board'; g('wb-bn').value=b.name; g('wb-bdb').style.display='inline-flex'; rCP('wb-bcp','sBC',sBC); openM('wb-bm'); }
function svB(){ var name=g('wb-bn').value.trim(); if(!name) return; if(bmM==='add'){ var nb={id:uid(),name:name,color:sBC,groups:[]}; boards.push(nb); abid=nb.id; } else { for(var i=0;i<boards.length;i++) if(boards[i].id===getB().id){ boards[i].name=name; boards[i].color=sBC; break; } } fbSave(); closeM('wb-bm'); rAll(); }
function dlB(){ var bid=getB().id,nb=[]; for(var i=0;i<boards.length;i++) if(boards[i].id!==bid) nb.push(boards[i]); boards=nb; abid=boards.length?boards[0].id:null; fbSave(); closeM('wb-bm'); rAll(); }

/* ── Group ── */
window.oAG=function oAG(){ gmM='add'; gmG=null; sGC=CL[2]; g('wb-gmt').textContent='New group'; g('wb-gn').value=''; g('wb-gdb').style.display='none'; rCP('wb-gcp','sGC',sGC); openM('wb-gm'); };
window.wbEG=function(gid){ var b=getB(),gr=null; for(var i=0;i<b.groups.length;i++) if(b.groups[i].id===gid){ gr=b.groups[i]; break; } if(!gr) return; gmM='edit'; gmG=gid; sGC=gr.color; g('wb-gmt').textContent='Edit group'; g('wb-gn').value=gr.name; g('wb-gdb').style.display='inline-flex'; rCP('wb-gcp','sGC',sGC); openM('wb-gm'); };
function svG(){ var name=g('wb-gn').value.trim(); if(!name) return; var bid=getB().id; if(gmM==='add'){ var ng={id:uid(),name:name,color:sGC,items:[]}; for(var i=0;i<boards.length;i++) if(boards[i].id===bid){ boards[i].groups.push(ng); break; } } else { for(var i=0;i<boards.length;i++) if(boards[i].id===bid) for(var j=0;j<boards[i].groups.length;j++) if(boards[i].groups[j].id===gmG){ boards[i].groups[j].name=name; boards[i].groups[j].color=sGC; break; } } fbSave(); closeM('wb-gm'); rAll(); }
function dlG(){ var bid=getB().id; for(var i=0;i<boards.length;i++) if(boards[i].id===bid){ var ng=[]; for(var j=0;j<boards[i].groups.length;j++) if(boards[i].groups[j].id!==gmG) ng.push(boards[i].groups[j]); boards[i].groups=ng; break; } fbSave(); closeM('wb-gm'); rAll(); }

/* ── Color picker ── */
function rCP(cid,vn,sel){ var h=''; for(var i=0;i<CL.length;i++) h+='<div class="cs'+(CL[i]===sel?' sel':'')+'" style="background:'+CL[i]+'" onclick="wbPC(\''+cid+'\',\''+vn+'\',\''+CL[i]+'\')"></div>'; g(cid).innerHTML=h; if(vn==='sBC') sBC=sel; if(vn==='sGC') sGC=sel; }
window.wbPC=function(cid,vn,c){ if(vn==='sBC') sBC=c; if(vn==='sGC') sGC=c; var sw=document.querySelectorAll('#'+cid+' .cs'); for(var i=0;i<sw.length;i++) sw[i].classList.toggle('sel',sw[i].style.background===c||sw[i].style.backgroundColor===c); };

/* ── Notification bell ── */
function tNP(){ g('wb-np').classList.toggle('open'); if(g('wb-np').classList.contains('open')){ for(var i=0;i<nh.length;i++) nh[i].read=true; updBell(); rNP(); } }
function updBell(){ var u=0; for(var i=0;i<nh.length;i++) if(!nh[i].read) u++; g('wb-bdot').style.display=u?'block':'none'; }
function rNP(){
  var l=g('wb-npl');
  if(!nh.length){ l.innerHTML='<div style="padding:28px 16px;text-align:center;color:#9CA3AF;font-size:13px">No notifications yet</div>'; return; }
  var h='';
  for(var i=0;i<nh.length;i++){
    var n=nh[i],a=null; for(var j=0;j<TM.length;j++) if(TM[j].id===n.assigneeId){a=TM[j];break;}
    var sm=getStatusMeta(n.newStatus);
    var type=n.type||'status';
    var iconColor=type==='assigned'?'#F7931E':type==='comment'?'#378ADD':sm.color;
    var iconSvg=type==='comment'?'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>':type==='assigned'?'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>':'<polyline points="20 6 9 17 4 12"/>';
    var msgHtml='';
    if(type==='assigned') msgHtml='<strong style="color:'+(a?a.color:'#38444E')+'">'+(a?a.name:'Someone')+'</strong> assigned you <strong>"'+n.taskName+'"</strong>';
    else if(type==='comment') msgHtml='<strong style="color:'+(a?a.color:'#38444E')+'">'+(a?a.name:'Someone')+'</strong> commented on <strong>"'+n.taskName+'"</strong>';
    else msgHtml='<strong style="color:'+(a?a.color:'#38444E')+'">'+(a?a.name:'Someone')+'</strong> changed <strong>"'+n.taskName+'"</strong> to <strong style="color:'+sm.color+'">'+sm.label+'</strong>';
    var time=new Date(n.ts).toLocaleDateString('en',{month:'short',day:'numeric'})+' '+new Date(n.ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    h+='<div style="padding:12px 16px;border-bottom:1px solid #F2F3F5;display:flex;gap:12px;align-items:flex-start;background:'+(n.read?'#fff':'#FFFBF5')+'">'+
      '<div style="width:34px;height:34px;border-radius:50%;background:'+iconColor+'18;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1.5px solid '+iconColor+'33">'+
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="'+iconColor+'" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">'+iconSvg+'</svg>'+
      '</div>'+
      '<div style="flex:1"><div style="font-size:12px;color:#3D4F5C;line-height:1.6">'+msgHtml+'</div><div style="font-size:11px;color:#9CA3AF;margin-top:3px">'+time+'</div></div>'+
      (!n.read?'<div style="width:8px;height:8px;border-radius:50%;background:#F7931E;margin-top:6px;flex-shrink:0"></div>':'')+
    '</div>';
  }
  l.innerHTML=h;
}

/* ── Brand Kit ── */
function rBrand(c){
  var ab=window._activeBrand||'combase',bk=BRANDS[ab];
  var tabs='<div style="display:flex;gap:8px;margin-bottom:24px">';
  var bkeys=Object.keys(BRANDS);
  for(var i=0;i<bkeys.length;i++){ var bk2=BRANDS[bkeys[i]],isA=bkeys[i]===ab; tabs+='<button onclick="wbBrandTab(\''+bkeys[i]+'\')" style="padding:8px 20px;border-radius:8px;border:'+(isA?'none':'1px solid #E2E5E8')+';background:'+(isA?'#F7931E':'#fff')+';color:'+(isA?'#fff':'#6B7A84')+';font-size:13px;font-weight:'+(isA?700:500)+';cursor:pointer;font-family:inherit">'+bk2.name+'</button>'; }
  tabs+='</div>';
  var ls=bk.logoData||bk.logo;
  var logoSec='<div style="background:#fff;border:1px solid #E2E5E8;border-radius:12px;padding:24px;margin-bottom:20px"><div style="font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.08em;margin-bottom:16px">Logo</div><div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap"><div id="wb-logo-preview-'+ab+'" style="background:#F7F8FA;border:1px solid #E2E5E8;border-radius:10px;padding:24px 32px;display:flex;align-items:center;justify-content:center;min-width:200px;min-height:80px">'+(ls?'<img src="'+ls+'" style="max-height:60px;max-width:200px;object-fit:contain"/>':'<span style="font-size:12px;color:#9CA3AF">No logo uploaded</span>')+'</div><div style="display:flex;flex-direction:column;gap:8px"><label style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;border:1px solid #E2E5E8;background:#F2F3F5;color:#38444E;font-size:13px;cursor:pointer;font-family:inherit;font-weight:500">&#11015; Upload Logo<input type="file" accept="image/*" style="display:none" onchange="wbUploadLogo(this,\''+ab+'\')"/></label>'+(ls?'<a href="'+ls+'" download target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;border:1px solid #E2E5E8;background:#fff;color:#1A2228;font-size:13px;text-decoration:none;font-family:inherit">&#11015; Download Logo</a>':'')+'</div></div></div>';
  var colorSec='<div style="background:#fff;border:1px solid #E2E5E8;border-radius:12px;padding:24px;margin-bottom:20px"><div style="font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.08em;margin-bottom:16px">Color Palette</div><div style="display:flex;flex-wrap:wrap;gap:16px">';
  for(var i=0;i<bk.colors.length;i++){
    var clr=bk.colors[i],lum=parseInt(clr.hex.replace('#',''),16),isDark=(((lum>>16)&0xff)*299+((lum>>8)&0xff)*587+(lum&0xff)*114)/1000<128;
    colorSec+='<div style="width:160px"><div onclick="wbCopyColor(\''+clr.hex+'\')" title="Click to copy" style="width:160px;height:80px;border-radius:8px;background:'+clr.hex+';border:1px solid rgba(0,0,0,.08);cursor:pointer;display:flex;align-items:flex-end;padding:8px;transition:transform .1s" onmouseover="this.style.transform=\'scale(1.03)\'" onmouseout="this.style.transform=\'scale(1)\'"><span style="font-size:11px;font-weight:700;color:'+(isDark?'rgba(255,255,255,.85)':'rgba(0,0,0,.55)')+'">'+clr.hex+'</span></div><div style="margin-top:8px"><div style="font-size:13px;font-weight:700;color:#1A2228">'+clr.name+'</div>'+(clr.cmyk?'<div style="font-size:11px;color:#6B7A84;margin-top:2px">'+clr.cmyk+'</div>':'')+(clr.rgb?'<div style="font-size:11px;color:#9CA3AF">'+clr.rgb+'</div>':'')+'</div></div>';
  }
  colorSec+='</div></div>';
  var fontSec='<div style="background:#fff;border:1px solid #E2E5E8;border-radius:12px;padding:24px;margin-bottom:20px"><div style="font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.08em;margin-bottom:16px">Typography</div><div style="display:flex;flex-direction:column;gap:12px">';
  for(var i=0;i<bk.fonts.length;i++){ var f=bk.fonts[i]; fontSec+='<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border:1px solid #E2E5E8;border-radius:10px;flex-wrap:wrap;gap:12px"><div><div style="font-size:20px;font-weight:700;margin-bottom:6px;color:#1A2228">'+f.name+'</div><div style="font-size:12px;color:#38444E;margin-bottom:2px"><strong>Role:</strong> '+f.role+'</div><div style="font-size:12px;color:#6B7A84;margin-bottom:2px"><strong>Weights:</strong> '+f.weights+'</div>'+(f.designers?'<div style="font-size:12px;color:#9CA3AF"><strong>By:</strong> '+f.designers+'</div>':'')+'</div><a href="'+f.url+'" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;border:1px solid #E2E5E8;background:#fff;color:#1A2228;font-size:12px;text-decoration:none;font-family:inherit;white-space:nowrap;font-weight:500">&#128279; View Font</a></div>'; }
  fontSec+='</div></div>';
  var sa=bk.uploadedAssets||[];
  var assetSec='<div style="background:#fff;border:1px solid #E2E5E8;border-radius:12px;padding:24px;margin-bottom:20px"><div style="font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.08em;margin-bottom:16px">Assets</div><div id="wb-assets-list-'+ab+'" style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:14px">';
  if(!sa.length) assetSec+='<div style="font-size:13px;color:#9CA3AF;padding:4px 0">No assets uploaded yet</div>';
  for(var i=0;i<sa.length;i++){ var a=sa[i]; assetSec+='<div style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px;border:1px solid #E2E5E8;border-radius:10px;background:#F7F8FA;width:120px"><img src="'+a.data+'" style="max-width:90px;max-height:60px;object-fit:contain;border-radius:4px"/><span style="font-size:11px;color:#3D4F5C;text-align:center;word-break:break-word;max-width:100px;font-weight:500">'+a.name+'</span><div style="display:flex;gap:4px"><a href="'+a.data+'" download="'+a.name+'" style="font-size:11px;color:#F7931E;text-decoration:none;padding:2px 8px;border:1px solid #F7931E;border-radius:4px;font-weight:600">&#11015;</a><button onclick="wbDeleteAsset(\''+ab+'\','+i+')" style="font-size:11px;color:#B03020;background:none;border:1px solid #e0b0aa;border-radius:4px;padding:2px 6px;cursor:pointer;font-family:inherit">&#215;</button></div></div>'; }
  assetSec+='</div><label style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;border:1px solid #E2E5E8;background:#F2F3F5;color:#38444E;font-size:13px;cursor:pointer;font-family:inherit;font-weight:500">+ Upload Asset<input type="file" accept="image/*,application/pdf,.svg,.eps,.ai,.zip" multiple style="display:none" onchange="wbUploadAsset(this,\''+ab+'\')"/></label></div>';
  c.innerHTML='<div style="padding:4px 0">'+tabs+logoSec+colorSec+fontSec+assetSec+'</div>';
  if(!g('wb-color-toast')){ var t=document.createElement('div'); t.id='wb-color-toast'; t.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(80px);transition:transform .3s;background:#38444E;color:#fff;padding:8px 18px;border-radius:20px;font-size:13px;z-index:500000;pointer-events:none;font-weight:500'; document.body.appendChild(t); }
}
window.wbBrandTab=function(key){ window._activeBrand=key; rC(); };
window.wbCopyColor=function(hex){ if(navigator.clipboard) navigator.clipboard.writeText(hex); var t=g('wb-color-toast'); if(t){ t.textContent='Copied '+hex; t.style.transform='translateX(-50%) translateY(0)'; clearTimeout(window._colorToastTimer); window._colorToastTimer=setTimeout(function(){ t.style.transform='translateX(-50%) translateY(80px)'; },2000); } };
window.wbUploadLogo=function(input,brandKey){ var file=input.files[0]; if(!file) return; var reader=new FileReader(); reader.onload=function(e){ var data=e.target.result; db.ref('workboard/brandAssets/'+brandKey+'/logo').set(data,function(){ BRANDS[brandKey].logoData=data; var prev=g('wb-logo-preview-'+brandKey); if(prev) prev.innerHTML='<img src="'+data+'" style="max-height:60px;max-width:200px;object-fit:contain"/>'; wbBrandToast('Logo uploaded!'); rC(); }); }; reader.readAsDataURL(file); };
window.wbUploadAsset=function(input,brandKey){ var files=input.files; if(!files||!files.length) return; var bk=BRANDS[brandKey]; if(!bk.uploadedAssets) bk.uploadedAssets=[]; var toRead=files.length,done=0; for(var i=0;i<files.length;i++){(function(file){ var r=new FileReader(); r.onload=function(e){ bk.uploadedAssets.push({name:file.name,data:e.target.result}); done++; if(done===toRead) db.ref('workboard/brandAssets/'+brandKey+'/assets').set(bk.uploadedAssets,function(){ wbBrandToast(toRead+' asset'+(toRead>1?'s':'')+' uploaded!'); rC(); }); }; r.readAsDataURL(file); })(files[i]);} };
window.wbDeleteAsset=function(brandKey,index){ var bk=BRANDS[brandKey]; if(!bk.uploadedAssets) return; bk.uploadedAssets.splice(index,1); db.ref('workboard/brandAssets/'+brandKey+'/assets').set(bk.uploadedAssets,function(){ wbBrandToast('Asset deleted.'); rC(); }); };
function wbBrandToast(msg){ var t=g('wb-color-toast'); if(t){ t.textContent=msg; t.style.transform='translateX(-50%) translateY(0)'; clearTimeout(window._colorToastTimer); window._colorToastTimer=setTimeout(function(){ t.style.transform='translateX(-50%) translateY(80px)'; },2500); } }
function loadBrandAssets(){ db.ref('workboard/brandAssets').once('value',function(snap){ var v=snap.val(); if(!v) return; var keys=Object.keys(BRANDS); for(var i=0;i<keys.length;i++){ var k=keys[i]; if(v[k]){ if(v[k].logo) BRANDS[k].logoData=v[k].logo; if(v[k].assets) BRANDS[k].uploadedAssets=v[k].assets; } } if(activeTab==='brand') rC(); }); }

/* ── Trash ── */
function rTrash(c){
  if(!trash.length){ c.innerHTML='<div class="wb-empty"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C8CDD1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg><div style="font-size:16px;font-weight:600;color:#1A2228">Trash is empty</div><div style="font-size:13px;color:#6B7A84">Deleted tasks appear here for 30 days</div></div>'; return; }
  var h='<div style="padding:4px 0"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px"><span style="font-size:13px;color:#6B7A84">'+trash.length+' item'+(trash.length!==1?'s':'')+' &nbsp;·&nbsp; Auto-deleted after 30 days</span><button onclick="wbEmptyTrash()" class="btn btnd" style="font-size:12px">Empty trash</button></div><div style="background:#fff;border:1px solid #E2E5E8;border-radius:10px;overflow:hidden">';
  for(var i=0;i<trash.length;i++){
    var it=trash[i]; if(!it) continue;
    var daysLeft=Math.ceil((30*24*60*60*1000-(Date.now()-it.deletedAt))/(24*60*60*1000));
    var s=ST[0]; for(var j=0;j<ST.length;j++) if(ST[j].v===it.status){s=ST[j];break;}
    h+='<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #F2F3F5"><div style="flex:1;min-width:0"><div style="font-size:13px;color:#9CA3AF;text-decoration:line-through;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+it.name+'</div><div style="font-size:11px;color:#C8CDD1;margin-top:2px">'+daysLeft+' day'+(daysLeft!==1?'s':'')+' left</div></div><span class="pill '+s.p+'">'+s.l+'</span><button onclick="wbRestore(\''+it.id+'\')" class="btn" style="font-size:12px;padding:4px 12px">Restore</button><button onclick="wbPermDelete(\''+it.id+'\')" class="btn btnd" style="font-size:12px;padding:4px 10px">&#215;</button></div>';
  }
  h+='</div></div>';
  c.innerHTML=h;
}
window.wbEmptyTrash=function(){ if(!confirm('Permanently delete all items in trash?')) return; trash=[]; fbSaveTrash(); rC(); };
window.wbRestore=function(itemId){ var item=null; for(var i=0;i<trash.length;i++) if(trash[i]&&trash[i].id===itemId){ item=trash[i]; break; } if(!item) return; var b=null; for(var i=0;i<boards.length;i++) if(boards[i].id===item.boardId){ b=boards[i]; break; } if(!b&&boards.length) b=boards[0]; if(!b||!b.groups.length) return; b.groups[0].items.unshift({id:item.id,name:item.name,status:item.status,priority:item.priority,ownerId:item.ownerId,assignedBy:item.assignedBy,due:item.due,notes:item.notes}); var nt=[]; for(var i=0;i<trash.length;i++) if(trash[i]&&trash[i].id!==itemId) nt.push(trash[i]); trash=nt; fbSave(); fbSaveTrash(); rAll(); };
window.wbPermDelete=function(itemId){ var nt=[]; for(var i=0;i<trash.length;i++) if(trash[i]&&trash[i].id!==itemId) nt.push(trash[i]); trash=nt; fbSaveTrash(); rC(); };

/* ── Change password ── */
window.wbOpenChangePW=function(){ g('wb-cpw-cur').value=''; g('wb-cpw-new').value=''; g('wb-cpw-cfm').value=''; g('wb-cpw-err').textContent=''; g('wb-cpw-ok').textContent=''; g('wb-cpw-modal').style.display='flex'; setTimeout(function(){ g('wb-cpw-cur').focus(); },100); };
window.wbCloseCPW=function(){ g('wb-cpw-modal').style.display='none'; };
window.wbSubmitCPW=function(){ var cur=g('wb-cpw-cur').value,nw=g('wb-cpw-new').value,cfm=g('wb-cpw-cfm').value; g('wb-cpw-err').textContent=''; g('wb-cpw-ok').textContent=''; var correct=PASSWORDS[cu.id]||DEFAULT_PASSWORDS[cu.id]; if(cur!==correct){ g('wb-cpw-err').textContent='Current password is incorrect.'; return; } if(nw.length<6){ g('wb-cpw-err').textContent='New password must be at least 6 characters.'; return; } if(nw!==cfm){ g('wb-cpw-err').textContent='Passwords do not match.'; return; } db.ref('workboard/passwords/'+cu.id).set(nw,function(err){ if(err){ g('wb-cpw-err').textContent='Failed to save. Please try again.'; } else { PASSWORDS[cu.id]=nw; g('wb-cpw-ok').textContent='Password changed successfully!'; g('wb-cpw-cur').value=''; g('wb-cpw-new').value=''; g('wb-cpw-cfm').value=''; setTimeout(wbCloseCPW,1800); } }); };

/* ── Start ── */
function start(){
  buildHTML();
  g('wb-loading').style.display='none';
  var s=loadSession();
  if(s){ doLogin(s); } else { g('wb-login').style.display='flex'; rLogin(); }
}
if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',start); } else { start(); }
})();
