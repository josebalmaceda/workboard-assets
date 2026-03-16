(function(){
var FB={apiKey:"AIzaSyA0uD4AQ1Kjpz2opz5YtDT6CNyzQtqxA-0",authDomain:"workspace-031726.firebaseapp.com",databaseURL:"https://workspace-031726-default-rtdb.firebaseio.com",projectId:"workspace-031726",storageBucket:"workspace-031726.firebasestorage.app",messagingSenderId:"149203020312",appId:"1:149203020312:web:bb64bff680b3cc76af316d"};
var app=firebase.initializeApp(FB,'wb');
var db=firebase.database(app);
var CL=["#7F77DD","#378ADD","#1D9E75","#EF9F27","#D4537E","#E24B4A","#639922","#BA7517"];

// Default passwords — users can change via profile menu
var DEFAULT_PASSWORDS={u1:"thomas123",u2:"till123",u9:"michael123",u3:"liz123",u4:"johanna123",u5:"marial123",u6:"taylor123",u7:"jomar123",u8:"justine123"};
var PASSWORDS={};

var TM=[
  {id:"u1",name:"Thomas",color:"#7F77DD",tc:"#3C3489",i:"TH"},
  {id:"u2",name:"Till",color:"#EF9F27",tc:"#633806",i:"TL"},
  {id:"u9",name:"Michael",color:"#9B59B6",tc:"#5B2C6F",i:"MC"},
  {id:"u3",name:"Liz",color:"#1D9E75",tc:"#085041",i:"LZ"},
  {id:"u4",name:"Johanna",color:"#D4537E",tc:"#712B13",i:"JO"},
  {id:"u5",name:"Marial",color:"#378ADD",tc:"#0C447C",i:"MA"},
  {id:"u6",name:"Taylor",color:"#E24B4A",tc:"#791F1F",i:"TA"},
  {id:"u7",name:"Jomar",color:"#639922",tc:"#27500A",i:"JM"},
  {id:"u8",name:"Justine",color:"#BA7517",tc:"#412402",i:"JU"}
];
var ST=[
  {v:"todo",l:"To do",p:"p-todo",d:"#5F5E5A"},
  {v:"wip",l:"In progress",p:"p-wip",d:"#3C3489"},
  {v:"review",l:"In review",p:"p-review",d:"#854F0B"},
  {v:"done",l:"Done",p:"p-done",d:"#0F6E56"},
  {v:"stuck",l:"Stuck",p:"p-stuck",d:"#A32D2D"}
];
var PR=[
  {v:"high",l:"High",c:"#E24B4A"},
  {v:"med",l:"Medium",c:"#EF9F27"},
  {v:"low",l:"Low",c:"#639922"}
];

var BRANDS={
  combase:{
    name:"COMBASE",
    logo:"https://beta.combase.de/wp-content/uploads/2026/01/COMBASE-Logo.png",
    colors:[
      {name:"Dark Navy Blue",hex:"#38444E",cmyk:"C28, M13, Y0, K69",rgb:"R56, G68, B78"}
    ],
    fonts:[
      {name:"Inter",role:"Primary / UI",weights:"Regular 400, Medium 500, SemiBold 600, Bold 700",url:"https://fonts.google.com/specimen/Inter"},
      {name:"Plus Jakarta Sans",role:"Headings",weights:"SemiBold 600, Bold 700, ExtraBold 800",url:"https://fonts.google.com/specimen/Plus+Jakarta+Sans"}
    ],
    assets:[
      {name:"COMBASE Logo PNG",url:"https://beta.combase.de/wp-content/uploads/2026/01/COMBASE-Logo.png"}
    ]
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
      {name:"Roboto",role:"Primary / UI",weights:"Regular 400, Medium 500, Bold 700",url:"https://fonts.google.com/specimen/Roboto"},
      {name:"Roboto Condensed",role:"Headings / Display",weights:"Bold 700, ExtraBold 800",url:"https://fonts.google.com/specimen/Roboto+Condensed"}
    ],
    assets:[
      {name:"KORONA POS Logo PNG",url:"https://www.koronapos.com/wp-content/uploads/2021/03/korona-pos-logo.png"}
    ]
  }
};

var boards=[],trash=[],cu=null,abid=null,view="board",activeTab="boards";
var fil={pr:[],st:[],s:""};
var col={},nh=[],seen=new Set(),pt=null;
var uB=null,uN=null,uT=null;
var tmM,tmG,tmI,bmM,gmM,gmG;
var sO,sBC=CL[0],sGC=CL[2];
var loginUser=null;

// Persist seen notifications across refreshes per user
function loadSeenNotifs(userId){
  try{
    var s=localStorage.getItem('wb_seen_'+userId);
    if(s){ var arr=JSON.parse(s); for(var i=0;i<arr.length;i++) seen.add(arr[i]); }
  }catch(e){}
}
function saveSeenNotif(userId,key){
  seen.add(key);
  try{ var arr=Array.from(seen); localStorage.setItem('wb_seen_'+userId,JSON.stringify(arr)); }catch(e){}
}
function saveClearedNotifs(userId){
  // Save current seen set (which now includes all nh keys) so they never reappear
  try{ var arr=Array.from(seen); localStorage.setItem('wb_seen_'+userId,JSON.stringify(arr)); }catch(e){}
}
// Session persistence
function saveSession(userId){ try{ localStorage.setItem('wb_session',userId); }catch(e){} }
function loadSession(){ try{ return localStorage.getItem('wb_session'); }catch(e){ return null; } }
function clearSession(){ try{ localStorage.removeItem('wb_session'); }catch(e){} }

function uid(){ return Math.random().toString(36).slice(2,10); }
function g(id){ return document.getElementById(id); }
function getB(){ return boards.filter(function(b){ return b.id===abid; })[0]||boards[0]||null; }
function getAll(){
  var r=[];
  for(var i=0;i<boards.length;i++)
    for(var j=0;j<boards[i].groups.length;j++)
      for(var k=0;k<boards[i].groups[j].items.length;k++)
        r.push(boards[i].groups[j].items[k]);
  return r;
}
function find(id){ var all=getAll(); for(var i=0;i<all.length;i++) if(all[i].id===id) return all[i]; return null; }
function match(i){
  if(fil.pr.length&&fil.pr.indexOf(i.priority)===-1) return false;
  if(fil.st.length&&fil.st.indexOf(i.status)===-1) return false;
  if(fil.s&&i.name.toLowerCase().indexOf(fil.s.toLowerCase())===-1) return false;
  return true;
}
function av(uid2,s){
  s=s||26;
  var u=null; for(var i=0;i<TM.length;i++) if(TM[i].id===uid2){u=TM[i];break;}
  if(!u) return '<div class="av" style="width:'+s+'px;height:'+s+'px;background:#eee;border-radius:50%"></div>';
  return '<div class="av" title="'+u.name+'" style="width:'+s+'px;height:'+s+'px;background:'+u.color+';color:'+u.tc+';font-size:'+(s<24?9:11)+'px">'+u.i+'</div>';
}
function fbSave(){ db.ref('workboard/boards').set(boards); }
function fbSaveTrash(){ db.ref('workboard/trash').set(trash); }
function openM(id){ g(id).classList.add('open'); }
function closeM(id){ g(id).classList.remove('open'); }
function rAll(){ rSB(); rC(); }

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
      cleanG.push({id:gr.id||uid(),name:gr.name||'Group',color:gr.color||'#7F77DD',items:items});
    }
    out.push({id:b.id||uid(),name:b.name||'Board',color:b.color||'#7F77DD',groups:cleanG});
  }
  return out;
}

// ── HTML BUILD ────────────────────────────────────────────────
function buildHTML(){
  var w=g('wb-wrap'); if(!w) return;
  w.innerHTML=
  '<div id="wb-loading"><div class="wb-sp"></div><span style="font-size:13px;color:#aaa">Loading WorkBoard...</span></div>'+
  // LOGIN
  '<div id="wb-login" style="display:none">'+
    '<div class="wb-login-card">'+
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">'+
        '<div style="width:30px;height:30px;border-radius:8px;background:#F7931E;display:flex;align-items:center;justify-content:center">'+
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>'+
        '</div>'+
        '<span style="font-size:18px;font-weight:700;color:#38444E">WorkBoard</span>'+
      '</div>'+
      '<p style="font-size:13px;color:#6B7A84;margin-bottom:20px">Sign in to your account</p>'+
      '<div id="wb-llist"></div>'+
    '</div>'+
  '</div>'+
  // PASSWORD MODAL
  '<div id="wb-pw-screen" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:300000;align-items:center;justify-content:center">'+
    '<div style="background:#fff;border-radius:16px;padding:32px;width:340px;max-width:92vw;text-align:center">'+
      '<div id="wb-pw-av" style="margin:0 auto 12px"></div>'+
      '<div id="wb-pw-name" style="font-size:16px;font-weight:600;margin-bottom:4px"></div>'+
      '<p style="font-size:13px;color:#888;margin-bottom:18px">Enter your password</p>'+
      '<input type="password" id="wb-pw-input" placeholder="Password" style="width:100%;padding:10px 14px;border-radius:8px;border:1px solid #ccc;font-size:14px;font-family:inherit;margin-bottom:8px;text-align:center"/>'+
      '<div id="wb-pw-err" style="color:#E24B4A;font-size:12px;min-height:18px;margin-bottom:10px"></div>'+
      '<div style="display:flex;gap:8px">'+
        '<button onclick="wbPWCancel()" style="flex:1;padding:10px;border-radius:8px;border:1px solid #ddd;background:#fff;font-size:13px;cursor:pointer;font-family:inherit">Back</button>'+
        '<button onclick="wbPWSubmit()" style="flex:1;padding:10px;border-radius:8px;border:none;background:#F7931E;color:#fff;font-size:13px;cursor:pointer;font-weight:500;font-family:inherit">Sign in</button>'+
      '</div>'+
    '</div>'+
  '</div>'+
  // APP
  '<div id="wb-app" style="display:none">'+
    '<div id="wb-sb">'+
    '<div style="padding:0 16px;height:56px;font-size:15px;font-weight:700;display:flex;align-items:center;gap:10px;border-bottom:1px solid #E2E5E8;color:#38444E">'+
        '<div style="width:28px;height:28px;border-radius:8px;background:#F7931E;display:flex;align-items:center;justify-content:center;flex-shrink:0">'+
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>'+
        '</div>WorkBoard'+
      '</div>'+
      '<div id="wb-sbu" style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:8px;background:#f5f5f5;margin:10px 10px 6px"></div>'+
      '<div id="wb-mts" style="display:none;padding:10px 12px;border-bottom:1px solid #eee">'+
        '<div style="font-size:11px;color:#aaa;padding:0 0 6px;text-transform:uppercase">My tasks (<span id="wb-mtc">0</span>)</div>'+
        '<div id="wb-mtl"></div>'+
      '</div>'+
      '<div style="font-size:11px;color:#aaa;padding:10px 10px 4px;text-transform:uppercase">Navigation</div>'+
      '<div class="sb-item" id="sbn-boards" onclick="setTab(\'boards\')"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> Tasks</div>'+
      '<div class="sb-item" id="sbn-brand" onclick="setTab(\'brand\')"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M6.17 18a6 6 0 0 1 11.66 0"/></svg> Brand Kit</div>'+
      '<div class="sb-item" id="sbn-trash" onclick="setTab(\'trash\')"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg> Trash</div>'+
      '<div style="font-size:11px;color:#aaa;padding:10px 10px 4px;text-transform:uppercase;margin-top:4px">Task Boards</div>'+
      '<div id="wb-bl"></div>'+
      '<div class="sb-item" id="wb-nbb" style="color:#aaa"><span style="font-size:16px">+</span> New task board</div>'+
      '<div style="border-top:1px solid #eee;padding:10px 14px;font-size:11px;color:#aaa;margin-top:auto" id="wb-ttl">0 total tasks</div>'+
    '</div>'+
    '<div id="wb-main">'+
      '<div id="wb-topbar">'+
        '<button class="btn" style="padding:5px 8px;font-size:16px" id="wb-tsb">&#9776;</button>'+
        '<div id="wb-bcd" style="width:12px;height:12px;border-radius:3px;flex-shrink:0"></div>'+
        '<h1 id="wb-bt">Board</h1>'+
        '<div style="position:relative" id="wb-bell-btn"><button class="btn" style="padding:5px 10px" id="wb-bellt"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></button><div id="wb-bdot"></div></div>'+
        '<button class="btn" id="wb-ebb" style="display:none">Edit</button>'+
        '<button class="btn btnp" id="wb-atb" style="display:none">+ Add task</button>'+
      '</div>'+
      '<div id="wb-toolbar" style="display:none">'+
        '<button class="vbtn active" id="wb-vb">Table</button>'+
        '<button class="vbtn" id="wb-vk">Visual Board</button>'+
        '<div style="width:1px;height:20px;background:#eee;margin:0 4px"></div>'+
        '<button class="btn fchip" id="wb-flt">Filter</button>'+
        '<button class="btn btnd" id="wb-flc" style="display:none;font-size:12px">Clear</button>'+
        '<div style="flex:1"></div>'+
        '<input type="text" id="wb-si" placeholder="Search..." style="padding:5px 10px;border-radius:8px;border:1px solid #ddd;font-size:12px;width:150px;font-family:inherit"/>'+
      '</div>'+
      '<div id="wb-fp" class="hidden">'+
        '<div><div style="font-size:11px;color:#aaa;margin-bottom:6px;text-transform:uppercase">Priority</div><div style="display:flex;gap:6px;flex-wrap:wrap" id="wb-fpp"></div></div>'+
        '<div><div style="font-size:11px;color:#aaa;margin-bottom:6px;text-transform:uppercase">Status</div><div style="display:flex;gap:6px;flex-wrap:wrap" id="wb-fps"></div></div>'+
      '</div>'+
      '<div id="wb-content"></div>'+
    '</div>'+
  '</div>'+
  // NOTIF POPUP
  '<div id="wb-notif-popup">'+
    '<div style="height:6px;background:linear-gradient(90deg,#1D9E75,#5DCAA5)"></div>'+
    '<div style="padding:16px 18px 18px">'+
      '<div style="display:flex;align-items:flex-start;gap:14px">'+
        '<div style="width:44px;height:44px;border-radius:50%;background:#E1F5EE;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:20px">&#10003;</div>'+
        '<div style="flex:1"><div style="font-size:15px;font-weight:600;margin-bottom:4px">Task completed!</div><div style="font-size:13px;color:#444;line-height:1.6" id="wb-nm"></div></div>'+
        '<button onclick="wbHP()" style="background:none;border:none;font-size:18px;cursor:pointer;color:#bbb">&#215;</button>'+
      '</div>'+
      '<div style="margin-top:14px;height:3px;border-radius:2px;background:#f0f0f0;overflow:hidden"><div id="wb-npb" style="height:100%;background:#1D9E75;border-radius:2px"></div></div>'+
    '</div>'+
  '</div>'+
  // BELL PANEL
  '<div id="wb-np">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #eee"><span style="font-size:14px;font-weight:500">Notifications</span><button id="wb-npc" style="background:none;border:none;font-size:12px;color:#aaa;cursor:pointer">Clear all</button></div>'+
    '<div id="wb-npl" style="max-height:300px;overflow-y:auto"></div>'+
  '</div>'+
  // CHANGE PASSWORD MODAL
  '<div id="wb-cpw-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:300000;align-items:center;justify-content:center">'+
    '<div style="background:#fff;border-radius:16px;padding:32px;width:360px;max-width:92vw">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">'+
        '<span style="font-size:15px;font-weight:600">Change Password</span>'+
        '<button onclick="wbCloseCPW()" style="background:none;border:none;font-size:22px;cursor:pointer;color:#999">&#215;</button>'+
      '</div>'+
      '<div class="wb-field"><label>Current password</label><input type="password" id="wb-cpw-cur" placeholder="Enter current password"/></div>'+
      '<div class="wb-field"><label>New password</label><input type="password" id="wb-cpw-new" placeholder="At least 6 characters"/></div>'+
      '<div class="wb-field"><label>Confirm new password</label><input type="password" id="wb-cpw-cfm" placeholder="Repeat new password"/></div>'+
      '<div id="wb-cpw-err" style="color:#E24B4A;font-size:12px;min-height:18px;margin-bottom:12px"></div>'+
      '<div id="wb-cpw-ok" style="color:#1D9E75;font-size:12px;min-height:18px;margin-bottom:12px"></div>'+
      '<div style="display:flex;gap:8px">'+
        '<button onclick="wbCloseCPW()" style="flex:1;padding:10px;border-radius:8px;border:1px solid #ddd;background:#fff;font-size:13px;cursor:pointer;font-family:inherit">Cancel</button>'+
        '<button onclick="wbSubmitCPW()" style="flex:1;padding:10px;border-radius:8px;border:none;background:#F7931E;color:#fff;font-size:13px;cursor:pointer;font-weight:500;font-family:inherit">Save password</button>'+
      '</div>'+
    '</div>'+
  '</div>'+
  // TASK MODAL
  mkModal('wb-tm','wb-tmt','New task',
    '<div class="wb-field"><label>Task name</label><input type="text" id="wb-tn" placeholder="What needs to be done?"/></div>'+
    '<div class="wb-field"><label>Assign to</label><div class="alist" id="wb-al"></div></div>'+
    '<div class="fg">'+
      '<div class="wb-field"><label>Status</label><select id="wb-ts"></select></div>'+
      '<div class="wb-field"><label>Priority</label><select id="wb-tp"></select></div>'+
      '<div class="wb-field"><label>Due date</label><input type="date" id="wb-td"/></div>'+
    '</div>'+
    '<div class="wb-field"><label>Notes</label><textarea id="wb-tnotes" placeholder="Add notes..."></textarea></div>',
    '<button class="btn btnd" id="wb-tdb" style="display:none"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg> Trash</button>',
    '<button class="btn" id="wb-tcb">Cancel</button><button class="btn btnp" id="wb-tsb2">Save</button>')+
  // BOARD MODAL
  mkModal('wb-bm','wb-bmt','New board',
    '<div class="wb-field"><label>Board name</label><input type="text" id="wb-bn" placeholder="Board name"/></div>'+
    '<div class="wb-field"><label>Color</label><div class="cg" id="wb-bcp"></div></div>',
    '<button class="btn btnd" id="wb-bdb" style="display:none">Delete board</button>',
    '<button class="btn" id="wb-bcb">Cancel</button><button class="btn btnp" id="wb-bsb">Save</button>')+
  // GROUP MODAL
  mkModal('wb-gm','wb-gmt','New group',
    '<div class="wb-field"><label>Group name</label><input type="text" id="wb-gn" placeholder="Group name"/></div>'+
    '<div class="wb-field"><label>Color</label><div class="cg" id="wb-gcp"></div></div>',
    '<button class="btn btnd" id="wb-gdb" style="display:none">Delete group</button>',
    '<button class="btn" id="wb-gcb">Cancel</button><button class="btn btnp" id="wb-gsb">Save</button>');
}

function mkModal(id,tid,title,body,left,right){
  return '<div class="wb-mo" id="'+id+'"><div class="wb-mb">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">'+
    '<span style="font-size:15px;font-weight:500" id="'+tid+'">'+title+'</span>'+
    '<button id="'+id+'c" style="background:none;border:none;font-size:22px;cursor:pointer;color:#999">&#215;</button></div>'+
    body+
    '<div style="display:flex;justify-content:space-between;margin-top:20px"><div>'+left+'</div><div style="display:flex;gap:8px">'+right+'</div></div>'+
  '</div></div>';
}

// ── LOGIN ─────────────────────────────────────────────────────
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
  // Show password screen
  g('wb-pw-av').innerHTML=av(loginUser.id,48);
  g('wb-pw-name').textContent=loginUser.name;
  g('wb-pw-input').value='';
  g('wb-pw-err').textContent='';
  g('wb-pw-screen').style.display='flex';
  setTimeout(function(){ g('wb-pw-input').focus(); },100);
};

window.wbPWCancel=function(){
  g('wb-pw-screen').style.display='none';
  loginUser=null;
};

window.wbPWSubmit=function(){
  if(!loginUser) return;
  var entered=g('wb-pw-input').value;
  var correct=PASSWORDS[loginUser.id]||DEFAULT_PASSWORDS[loginUser.id];
  if(entered===correct){
    g('wb-pw-screen').style.display='none';
    doLogin(loginUser.id);
  } else {
    g('wb-pw-err').textContent='Incorrect password. Try again.';
    g('wb-pw-input').value='';
    g('wb-pw-input').focus();
  }
};

// Allow Enter key on password input
document.addEventListener('keydown',function(e){
  if(e.key==='Enter' && g('wb-pw-screen') && g('wb-pw-screen').style.display==='flex'){
    wbPWSubmit();
  }
});

function doLogin(id){
  cu=null;
  for(var i=0;i<TM.length;i++) if(TM[i].id===id){ cu=TM[i]; break; }
  if(!cu) return;
  sO=cu.id;
  saveSession(cu.id);
  loadSeenNotifs(cu.id);
  g('wb-login').style.display='none';
  g('wb-app').style.display='flex';

  // Load all passwords from Firebase
  db.ref('workboard/passwords').once('value',function(snap){
    var v=snap.val()||{};
    PASSWORDS=v;
  });

  var ref=db.ref('workboard/boards');
  ref.on('value',function(snap){
    var v=snap.val();
    var raw=[];
    if(!v){ raw=[]; }
    else if(Array.isArray(v)){ raw=v; }
    else { var k=Object.keys(v); for(var i=0;i<k.length;i++) raw.push(v[k[i]]); }
    boards=sanitizeBoards(raw);
    if(!abid&&boards.length) abid=boards[0].id;
    rAll();
  });
  uB=function(){ ref.off('value'); };

  var tref=db.ref('workboard/trash');
  tref.on('value',function(snap){
    var v=snap.val();
    if(!v){ trash=[]; return; }
    if(Array.isArray(v)){ trash=v; }
    else { trash=[]; var k=Object.keys(v); for(var i=0;i<k.length;i++) if(v[k[i]]) trash.push(v[k[i]]); }
    // Auto-delete items older than 30 days
    var now=Date.now(), changed=false;
    var kept=[];
    for(var i=0;i<trash.length;i++){
      if(trash[i]&&(now-trash[i].deletedAt)<30*24*60*60*1000){ kept.push(trash[i]); }
      else { changed=true; }
    }
    if(changed){ trash=kept; fbSaveTrash(); }
    if(activeTab==='trash') rC();
  });
  uT=function(){ tref.off('value'); };

  var nref=db.ref('workboard/notifs/'+cu.id);
  nref.on('child_added',function(snap){
    var n=snap.val(); n.key=snap.key;
    if(!seen.has(n.key)){
      seen.add(n.key);
      nh.unshift({taskName:n.taskName,assigneeId:n.assigneeId,ts:n.ts,key:n.key,read:false});
      // Only show popup if page is visible and user is active
      if(!document.hidden) showP(n);
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

// ── WIRE BUTTONS ──────────────────────────────────────────────
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
  g('wb-npc').onclick=function(){
    // Mark all current notif keys as permanently seen in localStorage
    for(var i=0;i<nh.length;i++) seen.add(nh[i].key);
    saveClearedNotifs(cu.id);
    nh=[];
    updBell(); rNP();
    g('wb-np').classList.remove('open');
  };
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
  for(var i=0;i<modals.length;i++){
    modals[i].addEventListener('click',function(e){ if(e.target===this) this.classList.remove('open'); });
  }
  document.addEventListener('click',function(e){
    var p=g('wb-np'),b=g('wb-bell-btn');
    if(p&&p.classList.contains('open')&&!p.contains(e.target)&&!b.contains(e.target)) p.classList.remove('open');
  });
  rFChips();
  setTab('boards');
}

// ── TABS ──────────────────────────────────────────────────────
window.setTab=function(tab){
  activeTab=tab;
  var tabs=['boards','brand','trash'];
  for(var i=0;i<tabs.length;i++){
    var el=g('sbn-'+tabs[i]);
    if(el) el.classList.toggle('active',tabs[i]===tab);
  }
  // Show/hide board-specific UI
  var isBoardTab=tab==='boards';
  g('wb-ebb').style.display=isBoardTab?'':'none';
  g('wb-atb').style.display=isBoardTab?'':'none';
  g('wb-toolbar').style.display=isBoardTab?'flex':'none';
  g('wb-fp').classList.add('hidden');
  // Update topbar title
  if(tab==='brand') g('wb-bt').textContent='Brand Kit';
  else if(tab==='trash') g('wb-bt').textContent='Trash';
  else if(getB()) g('wb-bt').textContent=getB().name;
  else g('wb-bt').textContent='Tasks';
  rC();
};

// ── RENDER ────────────────────────────────────────────────────
function rSB(){
  var u=cu;
  g('wb-sbu').innerHTML=av(u.id,32)+
    '<span style="font-size:13px;font-weight:500;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+u.name+'</span>'+
    '<button onclick="wbOpenChangePW()" title="Change password" style="background:none;border:none;cursor:pointer;color:#aaa;padding:2px 4px;display:flex;align-items:center">'+
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'+
    '</button>'+
    '<button onclick="wbLO()" title="Sign out" style="background:none;border:none;cursor:pointer;color:#aaa;padding:2px 4px;display:flex;align-items:center">'+
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>'+
    '</button>';
  var mt=[];
  for(var i=0;i<boards.length;i++)
    for(var j=0;j<boards[i].groups.length;j++)
      for(var k=0;k<boards[i].groups[j].items.length;k++){
        var it=boards[i].groups[j].items[k];
        if(it.ownerId===u.id&&it.status!=='done') mt.push(it);
      }
  g('wb-mts').style.display=mt.length?'block':'none';
  g('wb-mtc').textContent=mt.length;
  var mh='';
  for(var i=0;i<Math.min(mt.length,5);i++){
    var t=mt[i];
    mh+='<div style="display:flex;align-items:center;gap:8px;padding:5px 4px;font-size:12px;border-radius:6px;cursor:pointer" onclick="wbET(\''+t.id+'\')"><div class="pdot pd-'+t.priority+'"></div><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">'+t.name+'</span><button class="qdone" onclick="event.stopPropagation();wbQD(\''+t.id+'\')">&#10003;</button></div>';
  }
  g('wb-mtl').innerHTML=mh;
  var bh='';
  for(var i=0;i<boards.length;i++){
    var bd=boards[i],cnt=0;
    for(var j=0;j<bd.groups.length;j++) cnt+=bd.groups[j].items.length;
    bh+='<div class="sb-item'+(abid===bd.id&&activeTab==='boards'?' active':'')+'" onclick="wbSB(\''+bd.id+'\')"><div style="width:10px;height:10px;border-radius:3px;flex-shrink:0;background:'+bd.color+'"></div><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">'+bd.name+'</span><span style="font-size:11px;color:#aaa;margin-left:auto">'+cnt+'</span></div>';
  }
  g('wb-bl').innerHTML=bh;
  var total=0;
  for(var i=0;i<boards.length;i++) for(var j=0;j<boards[i].groups.length;j++) total+=boards[i].groups[j].items.length;
  g('wb-ttl').textContent=total+' total tasks';
}

function rC(){
  var c=g('wb-content');
  if(activeTab==='brand'){ rBrand(c); return; }
  if(activeTab==='trash'){ rTrash(c); return; }
  var b=getB();
  if(g('wb-bt')) g('wb-bt').textContent=b?b.name:'Board';
  if(g('wb-bcd')) g('wb-bcd').style.background=b?b.color:'transparent';
  if(!b){
    c.innerHTML='<div class="wb-empty">'+
      '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>'+
      '<div style="font-size:16px;font-weight:500">No task boards yet</div>'+
      '<button class="btn btnp" onclick="oAB()">+ Create task board</button>'+
    '</div>';
    return;
  }
  if(view==='kanban'){ rKan(b,c); return; }
  rTbl(b,c);
}

// ── BRAND KIT ─────────────────────────────────────────────────
function rBrand(c){
  var activeBrand=window._activeBrand||'combase';
  var bk=BRANDS[activeBrand];
  var tabs='<div style="display:flex;gap:8px;margin-bottom:24px">';
  var bkeys=Object.keys(BRANDS);
  for(var i=0;i<bkeys.length;i++){
    var bk2=BRANDS[bkeys[i]];
    var isA=bkeys[i]===activeBrand;
    tabs+='<button onclick="wbBrandTab(\''+bkeys[i]+'\')" style="padding:8px 20px;border-radius:8px;border:'+(isA?'none':'1px solid #ddd')+';background:'+(isA?'#7F77DD':'#fff')+';color:'+(isA?'#fff':'#666')+';font-size:13px;font-weight:'+(isA?600:400)+';cursor:pointer;font-family:inherit">'+bk2.name+'</button>';
  }
  tabs+='</div>';

  // Logo
  var logoSec='<div style="background:#fff;border:1px solid #eee;border-radius:12px;padding:24px;margin-bottom:20px">'+
    '<div style="font-size:13px;font-weight:600;color:#aaa;text-transform:uppercase;letter-spacing:.06em;margin-bottom:16px">Logo</div>'+
    '<div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap">'+
      '<div id="wb-logo-preview-'+activeBrand+'" style="background:#f9f9f9;border:1px solid #eee;border-radius:10px;padding:24px 32px;display:flex;align-items:center;justify-content:center;min-width:200px;min-height:80px">'+
        (bk.logoData||bk.logo ? '<img src="'+(bk.logoData||bk.logo)+'" style="max-height:60px;max-width:200px;object-fit:contain" onerror="this.style.display=\'none\'"/>' : '<span style="font-size:12px;color:#aaa">No logo uploaded</span>')+
      '</div>'+
      '<div style="display:flex;flex-direction:column;gap:8px">'+
        '<label style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;border:1px solid #E2E5E8;background:#F2F3F5;color:#38444E;font-size:13px;cursor:pointer;font-family:inherit;font-weight:500">'+
          '&#11015; Upload Logo'+
          '<input type="file" accept="image/*" style="display:none" onchange="wbUploadLogo(this,\''+activeBrand+'\')"/>'+
        '</label>'+
        (bk.logo||bk.logoData ? '<a href="'+(bk.logoData||bk.logo)+'" download target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;border:1px solid #ddd;background:#fff;color:#111;font-size:13px;text-decoration:none;font-family:inherit">&#11015; Download Logo</a>' : '')+
      '</div>'+
    '</div>'+
  '</div>';

  // Colors
  var colorSec='<div style="background:#fff;border:1px solid #eee;border-radius:12px;padding:24px;margin-bottom:20px">'+
    '<div style="font-size:13px;font-weight:600;color:#aaa;text-transform:uppercase;letter-spacing:.06em;margin-bottom:16px">Color Palette</div>'+
    '<div style="display:flex;flex-wrap:wrap;gap:12px">';
  for(var i=0;i<bk.colors.length;i++){
    var clr=bk.colors[i];
    var lum=parseInt(clr.hex.replace('#',''),16);
    var isDark=(((lum>>16)&0xff)*299+((lum>>8)&0xff)*587+(lum&0xff)*114)/1000 < 128;
    colorSec+='<div style="width:160px">'+
      '<div onclick="wbCopyColor(\''+clr.hex+'\')" title="Click to copy hex" style="width:160px;height:80px;border-radius:8px;background:'+clr.hex+';border:1px solid rgba(0,0,0,.08);cursor:pointer;display:flex;align-items:flex-end;padding:8px;transition:transform .1s" onmouseover="this.style.transform=\'scale(1.03)\'" onmouseout="this.style.transform=\'scale(1)\'">'+
        '<span style="font-size:11px;font-weight:600;color:'+(isDark?'rgba(255,255,255,.85)':'rgba(0,0,0,.55)')+'">'+clr.hex+'</span>'+
      '</div>'+
      '<div style="margin-top:8px">'+
        '<div style="font-size:13px;font-weight:600;color:#222">'+clr.name+'</div>'+
        (clr.cmyk?'<div style="font-size:11px;color:#888;margin-top:2px">'+clr.cmyk+'</div>':'')+
        (clr.rgb?'<div style="font-size:11px;color:#aaa">'+clr.rgb+'</div>':'')+
      '</div>'+
    '</div>';
  }
  colorSec+='</div></div>';

  // Fonts
  var fontSec='<div style="background:#fff;border:1px solid #eee;border-radius:12px;padding:24px;margin-bottom:20px">'+
    '<div style="font-size:13px;font-weight:600;color:#aaa;text-transform:uppercase;letter-spacing:.06em;margin-bottom:16px">Typography</div>'+
    '<div style="display:flex;flex-direction:column;gap:12px">';
  for(var i=0;i<bk.fonts.length;i++){
    var f=bk.fonts[i];
    fontSec+='<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border:1px solid #eee;border-radius:10px;flex-wrap:wrap;gap:12px">'+
      '<div>'+
        '<div style="font-size:22px;font-weight:700;margin-bottom:6px">'+f.name+'</div>'+
        '<div style="font-size:12px;color:#555;margin-bottom:2px"><strong>Role:</strong> '+f.role+'</div>'+
        '<div style="font-size:12px;color:#888;margin-bottom:2px"><strong>Weights:</strong> '+f.weights+'</div>'+
        (f.designers?'<div style="font-size:12px;color:#aaa"><strong>By:</strong> '+f.designers+'</div>':'')+
      '</div>'+
      '<a href="'+f.url+'" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;border:1px solid #ddd;background:#fff;color:#111;font-size:12px;text-decoration:none;font-family:inherit;white-space:nowrap;flex-shrink:0">&#128279; View Font</a>'+
    '</div>';
  }
  fontSec+='</div></div>';

  // Assets
  var assetSec='<div style="background:#fff;border:1px solid #eee;border-radius:12px;padding:24px;margin-bottom:20px">'+
    '<div style="font-size:13px;font-weight:600;color:#aaa;text-transform:uppercase;letter-spacing:.06em;margin-bottom:16px">Assets</div>'+
    '<div id="wb-assets-list-'+activeBrand+'" style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:14px">';
  var storedAssets=bk.uploadedAssets||[];
  for(var i=0;i<storedAssets.length;i++){
    var a=storedAssets[i];
    assetSec+='<div style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px;border:1px solid #eee;border-radius:10px;background:#fafafa;width:120px">'+
      '<img src="'+a.data+'" style="max-width:90px;max-height:60px;object-fit:contain;border-radius:4px"/>'+
      '<span style="font-size:11px;color:#666;text-align:center;word-break:break-word;max-width:100px">'+a.name+'</span>'+
      '<div style="display:flex;gap:4px">'+
        '<a href="'+a.data+'" download="'+a.name+'" style="font-size:11px;color:#7F77DD;text-decoration:none;padding:2px 6px;border:1px solid #c5c0f5;border-radius:4px">&#11015;</a>'+
        '<button onclick="wbDeleteAsset(\''+activeBrand+'\','+i+')" style="font-size:11px;color:#A32D2D;background:none;border:1px solid #F09595;border-radius:4px;padding:2px 6px;cursor:pointer;font-family:inherit">&#215;</button>'+
      '</div>'+
    '</div>';
  }
  if(!storedAssets.length) assetSec+='<div style="font-size:13px;color:#aaa;padding:8px 0">No assets uploaded yet</div>';
  assetSec+='</div>'+
    '<label style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;border:1px solid #E2E5E8;background:#F2F3F5;color:#38444E;font-size:13px;cursor:pointer;font-family:inherit;font-weight:500">'+
      '+ Upload Asset'+
      '<input type="file" accept="image/*,application/pdf,.svg,.eps,.ai,.zip" multiple style="display:none" onchange="wbUploadAsset(this,\''+activeBrand+'\')"/>'+
    '</label>'+
  '</div>';

  c.innerHTML='<div style="padding:4px 0">'+tabs+logoSec+colorSec+fontSec+assetSec+'</div>';

  // Toast for color copy
  if(!g('wb-color-toast')){
    var t=document.createElement('div');
    t.id='wb-color-toast';
    t.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(80px);transition:transform .3s;background:#333;color:#fff;padding:8px 18px;border-radius:20px;font-size:13px;z-index:300000;pointer-events:none';
    document.body.appendChild(t);
  }
}

window.wbBrandTab=function(key){
  window._activeBrand=key;
  rC();
};

window.wbCopyColor=function(hex){
  if(navigator.clipboard){ navigator.clipboard.writeText(hex); }
  var t=g('wb-color-toast');
  if(t){
    t.textContent='Copied '+hex;
    t.style.transform='translateX(-50%) translateY(0)';
    clearTimeout(window._colorToastTimer);
    window._colorToastTimer=setTimeout(function(){ t.style.transform='translateX(-50%) translateY(80px)'; },2000);
  }
};

// ── TRASH ─────────────────────────────────────────────────────
function rTrash(c){
  if(!trash.length){
    c.innerHTML='<div class="wb-empty">'+
      '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>'+
      '<div style="font-size:16px;font-weight:500">Trash is empty</div>'+
      '<div style="font-size:13px;color:#888">Deleted tasks will appear here for 30 days</div>'+
    '</div>';
    return;
  }
  var h='<div style="padding:4px 0">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">'+
      '<span style="font-size:13px;color:#888">'+trash.length+' deleted item'+(trash.length!==1?'s':'')+' &nbsp;·&nbsp; Auto-deleted after 30 days</span>'+
      '<button onclick="wbEmptyTrash()" class="btn btnd" style="font-size:12px">Empty trash</button>'+
    '</div>'+
    '<div style="background:#fff;border:1px solid #eee;border-radius:10px;overflow:hidden">';
  for(var i=0;i<trash.length;i++){
    var it=trash[i]; if(!it) continue;
    var daysLeft=Math.ceil((30*24*60*60*1000-(Date.now()-it.deletedAt))/(24*60*60*1000));
    var st=ST[0]; for(var j=0;j<ST.length;j++) if(ST[j].v===it.status){ st=ST[j]; break; }
    h+='<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #f0f0f0">'+
      '<div style="flex:1;min-width:0">'+
        '<div style="font-size:13px;color:#888;text-decoration:line-through;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+it.name+'</div>'+
        '<div style="font-size:11px;color:#aaa;margin-top:2px">Deleted &nbsp;·&nbsp; '+daysLeft+' day'+(daysLeft!==1?'s':'')+' left</div>'+
      '</div>'+
      '<span class="pill '+st.p+'">'+st.l+'</span>'+
      '<button onclick="wbRestore(\''+it.id+'\')" class="btn" style="font-size:12px;padding:4px 12px">Restore</button>'+
      '<button onclick="wbPermDelete(\''+it.id+'\')" class="btn btnd" style="font-size:12px;padding:4px 10px">&#215;</button>'+
    '</div>';
  }
  h+='</div></div>';
  c.innerHTML=h;
}

window.wbEmptyTrash=function(){
  if(!confirm('Permanently delete all items in trash?')) return;
  trash=[];
  fbSaveTrash();
  rC();
};

window.wbRestore=function(itemId){
  var item=null;
  for(var i=0;i<trash.length;i++) if(trash[i]&&trash[i].id===itemId){ item=trash[i]; break; }
  if(!item) return;
  // Put back into first group of original board or first available board
  var b=null;
  for(var i=0;i<boards.length;i++) if(boards[i].id===item.boardId){ b=boards[i]; break; }
  if(!b&&boards.length) b=boards[0];
  if(!b){ alert('No board available to restore to.'); return; }
  if(!b.groups.length){ alert('No group available to restore to.'); return; }
  var restored={id:item.id,name:item.name,status:item.status,priority:item.priority,ownerId:item.ownerId,assignedBy:item.assignedBy,due:item.due,notes:item.notes};
  b.groups[0].items.unshift(restored);
  // Remove from trash
  var newTrash=[];
  for(var i=0;i<trash.length;i++) if(trash[i]&&trash[i].id!==itemId) newTrash.push(trash[i]);
  trash=newTrash;
  fbSave(); fbSaveTrash(); rAll();
};

window.wbPermDelete=function(itemId){
  var newTrash=[];
  for(var i=0;i<trash.length;i++) if(trash[i]&&trash[i].id!==itemId) newTrash.push(trash[i]);
  trash=newTrash;
  fbSaveTrash(); rC();
};

// ── TABLE VIEW ────────────────────────────────────────────────
function rTbl(board,c){
  var hF=fil.pr.length||fil.st.length||fil.s,h='';
  for(var gi=0;gi<board.groups.length;gi++){
    var gr=board.groups[gi];
    var disp=[];
    for(var ii=0;ii<gr.items.length;ii++) if(!hF||match(gr.items[ii])) disp.push(gr.items[ii]);
    if(hF&&!disp.length) continue;
    var isc=col[gr.id];
    h+='<div style="margin-bottom:20px">';
    h+='<div style="display:flex;align-items:center;gap:8px;padding:4px 6px;margin-bottom:6px">';
    h+='<div style="width:6px;height:22px;border-radius:3px;cursor:pointer;flex-shrink:0;background:'+gr.color+'" onclick="wbTC(\''+gr.id+'\')"></div>';
    h+='<span style="font-size:14px;font-weight:500">'+gr.name+'</span>';
    h+='<span style="font-size:12px;color:#aaa;margin-left:2px">'+disp.length+'</span>';
    h+='<div style="margin-left:auto;display:flex;gap:6px"><button class="btn" style="padding:3px 10px;font-size:12px" onclick="oAT(\''+gr.id+'\')">+ Task</button><button class="btn" style="padding:3px 8px;font-size:12px" onclick="wbEG(\''+gr.id+'\')">&#8943;</button></div>';
    h+='</div>';
    if(!isc){
      h+='<div style="background:#fff;border:1px solid #eee;border-radius:10px;overflow:hidden;margin-bottom:4px">';
      h+='<div class="bhead"><span>Task</span><span>Status</span><span></span><span>Priority</span><span>Due</span><span></span></div>';
      for(var ii=0;ii<disp.length;ii++){
        var item=disp[ii];
        var im=item.ownerId===cu.id;
        var td=new Date(); td.setHours(0,0,0,0);
        var ov=item.due&&new Date(item.due)<td&&item.status!=='done';
        var s=ST[0]; for(var si=0;si<ST.length;si++) if(ST[si].v===item.status){ s=ST[si]; break; }
        var p=PR[1]; for(var pi=0;pi<PR.length;pi++) if(PR[pi].v===item.priority){ p=PR[pi]; break; }
        var ds=item.due?new Date(item.due).toLocaleDateString('en',{month:'short',day:'numeric'}):'&mdash;';
        var isDone=item.status==='done';
        h+='<div class="brow" onclick="wbET(\''+item.id+'\')">'+
          '<div style="display:flex;align-items:center;gap:8px;overflow:hidden">'+
            '<div style="width:14px;height:14px;border-radius:3px;border:1px solid '+(isDone?'#1D9E75':'#ccc')+';flex-shrink:0;display:flex;align-items:center;justify-content:center;background:'+(isDone?'#1D9E75':'transparent')+';color:#fff;font-size:9px">'+(isDone?'&#10003;':'')+'</div>'+
            '<span style="font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap'+(isDone?';text-decoration:line-through;color:#aaa':'')+'">'+item.name+'</span>'+
            (im&&!isDone?'<span style="font-size:10px;color:#7F77DD;font-weight:500;flex-shrink:0">you</span>':'')+
          '</div>'+
          '<div><span class="pill '+s.p+'">'+s.l+'</span></div>'+
          '<div>'+av(item.ownerId,24)+'</div>'+
          '<div style="display:flex;align-items:center;gap:6px"><div class="pdot pd-'+item.priority+'"></div><span style="font-size:12px;color:#888">'+p.l+'</span></div>'+
          '<div style="font-size:12px;color:'+(ov?'#A32D2D':'#888')+'">'+ds+'</div>'+
          '<div>'+(im&&!isDone?'<button class="qdone" onclick="event.stopPropagation();wbQD(\''+item.id+'\')">&#10003;</button>':' ')+'</div>'+
        '</div>';
      }
      if(!hF) h+='<div style="padding:8px 12px;font-size:12px;color:#aaa;cursor:pointer;border-top:1px solid #f0f0f0" onclick="oAT(\''+gr.id+'\')">+ Add task</div>';
      h+='</div>';
    }
    h+='</div>';
  }
  if(!hF) h+='<button class="btn" style="font-size:13px;margin-top:4px" onclick="oAG()">+ Add group</button>';
  c.innerHTML=h;
}

// ── KANBAN VIEW ───────────────────────────────────────────────
function rKan(board,c){
  var h='<div class="kan-wrap">';
  for(var si=0;si<ST.length;si++){
    var sc=ST[si],tasks=[];
    for(var gi=0;gi<board.groups.length;gi++)
      for(var ii=0;ii<board.groups[gi].items.length;ii++){
        var it=board.groups[gi].items[ii];
        if(it.status===sc.v) tasks.push({item:it,gc:board.groups[gi].color});
      }
    h+='<div class="kan-col"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">'+
      '<div style="width:10px;height:10px;border-radius:50%;background:'+sc.d+';flex-shrink:0"></div>'+
      '<span style="font-size:13px;font-weight:600;color:#38444E">'+sc.l+'</span>'+
      '<span style="font-size:12px;color:#9CA3AF;margin-left:auto;font-weight:500">'+tasks.length+'</span></div>';
    for(var ti=0;ti<tasks.length;ti++){
      var t=tasks[ti].item,gc=tasks[ti].gc;
      var im=t.ownerId===cu.id&&t.status!=='done';
      h+='<div class="kan-card'+(im?' mine':'')+'" style="border-left:3px solid '+gc+'" onclick="wbET(\''+t.id+'\')">'+
        '<div style="font-size:13px;font-weight:500;margin-bottom:8px;line-height:1.4">'+t.name+'</div>'+
        '<div style="display:flex;align-items:center;gap:6px">'+
          '<div class="pdot pd-'+t.priority+'"></div>'+
          (t.due?'<span style="font-size:11px;color:#888">'+t.due+'</span>':'')+
          '<div style="margin-left:auto">'+av(t.ownerId,22)+'</div>'+
        '</div>'+
        (im?'<div style="margin-top:8px;font-size:11px;color:#7F77DD;font-weight:500">&#9679; Assigned to you</div>':'')+
      '</div>';
    }
    h+='</div>';
  }
  c.innerHTML=h+'</div>';
}

// ── NAV ───────────────────────────────────────────────────────
window.wbSB=function(id){ abid=id; activeTab='boards'; setTab('boards'); rSB(); };
function setView(v){
  view=v;
  g('wb-vb').classList.toggle('active',v==='board');
  g('wb-vk').classList.toggle('active',v==='kanban');
  rC();
}
window.wbTC=function(gid){ col[gid]=!col[gid]; rC(); };
function clrF(){ fil={pr:[],st:[],s:''}; g('wb-si').value=''; uFil(); rC(); }
window.wbTF=function(k,v){ var a=fil[k],idx=a.indexOf(v); if(idx>-1) a.splice(idx,1); else a.push(v); uFil(); rC(); };
function rFChips(){
  var h=''; for(var i=0;i<PR.length;i++) h+='<div class="fchip" id="fcp-'+PR[i].v+'" onclick="wbTF(\'pr\',\''+PR[i].v+'\')">'+PR[i].l+'</div>';
  g('wb-fpp').innerHTML=h;
  h=''; for(var i=0;i<ST.length;i++) h+='<div class="fchip" id="fcs-'+ST[i].v+'" onclick="wbTF(\'st\',\''+ST[i].v+'\')">'+ST[i].l+'</div>';
  g('wb-fps').innerHTML=h;
}
function uFil(){
  for(var i=0;i<PR.length;i++){
    var e=g('fcp-'+PR[i].v); if(!e) continue;
    var a=fil.pr.indexOf(PR[i].v)>-1;
    e.style.background=a?PR[i].c:'#fff'; e.style.color=a?'#fff':'#888'; e.style.borderColor=a?PR[i].c:'#eee';
  }
  var sm={
    todo:  {bg:'#EDECEA',c:'#4A4845'},
    wip:   {bg:'#D6F5E8',c:'#0A5C3E'},
    review:{bg:'#FFF0DC',c:'#7A4500'},
    done:  {bg:'#D6F5E8',c:'#1D7A4E'},
    stuck: {bg:'#FAD9D9',c:'#7A1A1A'}
  };
  for(var i=0;i<ST.length;i++){
    var e=g('fcs-'+ST[i].v); if(!e) continue;
    var a=fil.st.indexOf(ST[i].v)>-1;
    e.style.background=a?sm[ST[i].v].bg:'#fff'; e.style.color=a?sm[ST[i].v].c:'#888'; e.style.borderColor=a?sm[ST[i].v].c:'#eee';
  }
  var hF=fil.pr.length||fil.st.length||fil.s;
  g('wb-flt').textContent=hF?'Filters ('+(fil.pr.length+fil.st.length+(fil.s?1:0))+')':'Filter';
  g('wb-flt').className='btn fchip'+(hF?' on':'');
  g('wb-flc').style.display=hF?'inline-flex':'none';
}

// ── TASK MODAL ────────────────────────────────────────────────
function pSS(v,disabled){ var h=''; for(var i=0;i<ST.length;i++) h+='<option value="'+ST[i].v+'"'+(ST[i].v===v?' selected':'')+'>'+ST[i].l+'</option>'; var sel=g('wb-ts'); sel.innerHTML=h; sel.disabled=!!disabled; sel.style.opacity=disabled?'.5':'1'; }
function pPS(v){ var h=''; for(var i=0;i<PR.length;i++) h+='<option value="'+PR[i].v+'"'+(PR[i].v===v?' selected':'')+'>'+PR[i].l+'</option>'; g('wb-tp').innerHTML=h; }
function rAL(lockOwner){
  var h='';
  for(var i=0;i<TM.length;i++){
    var u=TM[i];
    // Only assignedBy user can reassign — if lockOwner is set, show list as read-only display
    if(lockOwner){
      h+='<div class="aitem'+(u.id===sO?' sel':'')+'" style="--c:'+u.color+';opacity:'+(u.id===sO?1:.45)+';cursor:default">'+av(u.id,28)+'<span style="font-size:13px;font-weight:'+(u.id===sO?500:400)+'">'+u.name+'</span>'+(u.id===sO?'<span style="margin-left:auto;font-size:12px;color:'+u.color+'">&#10003;</span>':'')+'</div>';
    } else {
      h+='<div class="aitem'+(u.id===sO?' sel':'')+'" style="--c:'+u.color+'" onclick="wbSO(\''+u.id+'\')">'+av(u.id,28)+'<span style="font-size:13px;font-weight:'+(u.id===sO?500:400)+'">'+u.name+'</span>'+(u.id===sO?'<span style="margin-left:auto;font-size:12px;color:'+u.color+'">&#10003;</span>':'')+'</div>';
    }
  }
  g('wb-al').innerHTML=h;
}
window.wbSO=function(id){ sO=id; rAL(false); };

window.oAT=function oAT(gid){
  tmM='add'; tmG=gid; tmI=null; sO=cu.id;
  g('wb-tmt').textContent='New task';
  g('wb-tn').value=''; g('wb-td').value=''; g('wb-tnotes').value='';
  pSS('todo',false); pPS('med'); rAL(false);
  g('wb-tdb').style.display='none';
  // Allow name edit
  g('wb-tn').disabled=false; g('wb-tp').disabled=false; g('wb-td').disabled=false; g('wb-tnotes').disabled=false;
  g('wb-tsb2').style.display='inline-flex';
  openM('wb-tm');
};

window.wbET=function(itemId){
  var item=find(itemId); if(!item) return;
  tmM='edit'; tmI=item; tmG=null; sO=item.ownerId||cu.id;
  g('wb-tmt').textContent='Edit task';
  g('wb-tn').value=item.name;
  g('wb-td').value=item.due||'';
  g('wb-tnotes').value=item.notes||'';
  pPS(item.priority);

  var isAssigned=item.ownerId===cu.id;
  var isCreator=item.assignedBy===cu.id;

  // Only assignee can change status
  pSS(item.status, !isAssigned);

  // Only creator can change name, priority, due, notes, reassign
  g('wb-tn').disabled=!isCreator;
  g('wb-tp').disabled=!isCreator;
  g('wb-td').disabled=!isCreator;
  g('wb-tnotes').disabled=!isCreator;
  g('wb-tn').style.opacity=isCreator?'1':'.6';
  g('wb-tp').style.opacity=isCreator?'1':'.6';

  // Show assignee list: editable only if creator
  rAL(!isCreator);

  // Show delete only for creator
  g('wb-tdb').style.display=isCreator?'inline-flex':'none';

  // Hide save if user has no permissions at all
  var canSave=isAssigned||isCreator;
  g('wb-tsb2').style.display=canSave?'inline-flex':'none';

  openM('wb-tm');
};

function svT(){
  var name=g('wb-tn').value.trim(); if(!name) return;
  var st=g('wb-ts').value,pr=g('wb-tp').value,due=g('wb-td').value,notes=g('wb-tnotes').value;
  if(tmM==='add'){
    var newItem={id:uid(),name:name,status:st,priority:pr,ownerId:sO,assignedBy:cu.id,due:due,notes:notes};
    for(var i=0;i<boards.length;i++){
      if(boards[i].id===getB().id){
        for(var j=0;j<boards[i].groups.length;j++){
          if(boards[i].groups[j].id===tmG){ boards[i].groups[j].items.unshift(newItem); break; }
        }
        break;
      }
    }
  } else {
    var prev=tmI;
    var isAssigned=prev.ownerId===cu.id;
    var isCreator=prev.assignedBy===cu.id;
    for(var i=0;i<boards.length;i++)
      for(var j=0;j<boards[i].groups.length;j++)
        for(var k=0;k<boards[i].groups[j].items.length;k++){
          if(boards[i].groups[j].items[k].id===prev.id){
            var it=boards[i].groups[j].items[k];
            if(isCreator){ it.name=name; it.priority=pr; it.ownerId=sO; it.due=due; it.notes=notes; }
            if(isAssigned){ it.status=st; }
            if(prev.status!=='done'&&it.status==='done') pshN(it,cu.id);
            break;
          }
        }
  }
  fbSave(); closeM('wb-tm'); rAll();
}

function moveToTrash(){
  if(!tmI) return;
  var item=null;
  // Find board id
  var boardId=null;
  for(var i=0;i<boards.length;i++)
    for(var j=0;j<boards[i].groups.length;j++)
      for(var k=0;k<boards[i].groups[j].items.length;k++)
        if(boards[i].groups[j].items[k].id===tmI.id){ boardId=boards[i].id; item=boards[i].groups[j].items[k]; break; }
  if(!item) return;
  // Add to trash with timestamp and boardId
  var trashItem=Object.assign({},item,{deletedAt:Date.now(),boardId:boardId});
  trash.push(trashItem);
  // Remove from board
  for(var i=0;i<boards.length;i++)
    for(var j=0;j<boards[i].groups.length;j++){
      var ni=[];
      for(var k=0;k<boards[i].groups[j].items.length;k++)
        if(boards[i].groups[j].items[k].id!==tmI.id) ni.push(boards[i].groups[j].items[k]);
      boards[i].groups[j].items=ni;
    }
  fbSave(); fbSaveTrash(); closeM('wb-tm'); rAll();
}

window.wbQD=function(itemId){
  var item=find(itemId); if(!item||item.ownerId!==cu.id) return;
  for(var i=0;i<boards.length;i++)
    for(var j=0;j<boards[i].groups.length;j++)
      for(var k=0;k<boards[i].groups[j].items.length;k++)
        if(boards[i].groups[j].items[k].id===itemId){
          boards[i].groups[j].items[k].status='done';
          pshN(boards[i].groups[j].items[k],cu.id);
          break;
        }
  fbSave(); rAll();
};

function pshN(task,doneById){
  // Notify creator (assignedBy) that assignee completed the task
  if(task.assignedBy && task.assignedBy!==doneById){
    db.ref('workboard/notifs/'+task.assignedBy).push({
      id:uid(),taskName:task.name,assigneeId:doneById,
      toUserId:task.assignedBy,taskId:task.id,ts:Date.now()
    });
  }
  // Notify assignee (ownerId) if someone else marked it done (e.g. creator quick-completed)
  if(task.ownerId && task.ownerId!==doneById){
    db.ref('workboard/notifs/'+task.ownerId).push({
      id:uid(),taskName:task.name,assigneeId:doneById,
      toUserId:task.ownerId,taskId:task.id,ts:Date.now()
    });
  }
}

// ── BOARD MODAL ───────────────────────────────────────────────
window.oAB=function oAB(){
  bmM='add'; sBC=CL[0];
  g('wb-bmt').textContent='New task board'; g('wb-bn').value='';
  g('wb-bdb').style.display='none';
  rCP('wb-bcp','sBC',sBC); openM('wb-bm');
};
function oEB(){
  var b=getB(); if(!b) return;
  bmM='edit'; sBC=b.color;
  g('wb-bmt').textContent='Edit task board'; g('wb-bn').value=b.name;
  g('wb-bdb').style.display='inline-flex';
  rCP('wb-bcp','sBC',sBC); openM('wb-bm');
}
function svB(){
  var name=g('wb-bn').value.trim(); if(!name) return;
  if(bmM==='add'){ var nb={id:uid(),name:name,color:sBC,groups:[]}; boards.push(nb); abid=nb.id; }
  else { for(var i=0;i<boards.length;i++) if(boards[i].id===getB().id){ boards[i].name=name; boards[i].color=sBC; break; } }
  fbSave(); closeM('wb-bm'); rAll();
}
function dlB(){
  var bid=getB().id,nb=[];
  for(var i=0;i<boards.length;i++) if(boards[i].id!==bid) nb.push(boards[i]);
  boards=nb; abid=boards.length?boards[0].id:null;
  fbSave(); closeM('wb-bm'); rAll();
}

// ── GROUP MODAL ───────────────────────────────────────────────
window.oAG=function oAG(){
  gmM='add'; gmG=null; sGC=CL[2];
  g('wb-gmt').textContent='New group'; g('wb-gn').value='';
  g('wb-gdb').style.display='none';
  rCP('wb-gcp','sGC',sGC); openM('wb-gm');
};
window.wbEG=function(gid){
  var b=getB(),gr=null;
  for(var i=0;i<b.groups.length;i++) if(b.groups[i].id===gid){ gr=b.groups[i]; break; }
  if(!gr) return;
  gmM='edit'; gmG=gid; sGC=gr.color;
  g('wb-gmt').textContent='Edit group'; g('wb-gn').value=gr.name;
  g('wb-gdb').style.display='inline-flex';
  rCP('wb-gcp','sGC',sGC); openM('wb-gm');
};
function svG(){
  var name=g('wb-gn').value.trim(); if(!name) return;
  var bid=getB().id;
  if(gmM==='add'){
    var ng={id:uid(),name:name,color:sGC,items:[]};
    for(var i=0;i<boards.length;i++) if(boards[i].id===bid){ boards[i].groups.push(ng); break; }
  } else {
    for(var i=0;i<boards.length;i++) if(boards[i].id===bid)
      for(var j=0;j<boards[i].groups.length;j++) if(boards[i].groups[j].id===gmG){ boards[i].groups[j].name=name; boards[i].groups[j].color=sGC; break; }
  }
  fbSave(); closeM('wb-gm'); rAll();
}
function dlG(){
  var bid=getB().id;
  for(var i=0;i<boards.length;i++) if(boards[i].id===bid){
    var ng=[];
    for(var j=0;j<boards[i].groups.length;j++) if(boards[i].groups[j].id!==gmG) ng.push(boards[i].groups[j]);
    boards[i].groups=ng; break;
  }
  fbSave(); closeM('wb-gm'); rAll();
}

// ── COLOR PICKER ──────────────────────────────────────────────
function rCP(cid,vn,sel){
  var h='';
  for(var i=0;i<CL.length;i++) h+='<div class="cs'+(CL[i]===sel?' sel':'')+'" style="background:'+CL[i]+'" onclick="wbPC(\''+cid+'\',\''+vn+'\',\''+CL[i]+'\')"></div>';
  g(cid).innerHTML=h;
  if(vn==='sBC') sBC=sel; if(vn==='sGC') sGC=sel;
}
window.wbPC=function(cid,vn,c){
  if(vn==='sBC') sBC=c; if(vn==='sGC') sGC=c;
  var sw=document.querySelectorAll('#'+cid+' .cs');
  for(var i=0;i<sw.length;i++) sw[i].classList.toggle('sel',sw[i].style.background===c||sw[i].style.backgroundColor===c);
};

// ── NOTIFICATIONS ─────────────────────────────────────────────
function showP(notif){
  var a=null; for(var i=0;i<TM.length;i++) if(TM[i].id===notif.assigneeId){ a=TM[i]; break; }
  g('wb-nm').innerHTML='<span style="font-weight:600;color:'+(a?a.color:'#333')+'">'+(a?a.name:'Someone')+'</span> marked <strong>"'+notif.taskName+'"</strong> as done.';
  var pop=g('wb-notif-popup'),bar=g('wb-npb');
  pop.classList.add('show');
  bar.style.animation='none'; bar.offsetHeight;
  bar.style.animation='wb-shrink 7s linear forwards';
  clearTimeout(pt); pt=setTimeout(wbHP,7000);
}
window.wbHP=function(){ g('wb-notif-popup').classList.remove('show'); };
function tNP(){
  g('wb-np').classList.toggle('open');
  if(g('wb-np').classList.contains('open')){
    for(var i=0;i<nh.length;i++) nh[i].read=true;
    updBell(); rNP();
  }
}
function updBell(){
  var u=0; for(var i=0;i<nh.length;i++) if(!nh[i].read) u++;
  g('wb-bdot').style.display=u?'block':'none';
}
function rNP(){
  var l=g('wb-npl');
  if(!nh.length){ l.innerHTML='<div style="padding:28px 16px;text-align:center;color:#aaa;font-size:13px">No notifications yet</div>'; return; }
  var h='';
  for(var i=0;i<nh.length;i++){
    var n=nh[i],a=null; for(var j=0;j<TM.length;j++) if(TM[j].id===n.assigneeId){ a=TM[j]; break; }
    h+='<div style="padding:12px 16px;border-bottom:1px solid #f5f5f5;display:flex;gap:12px;align-items:flex-start;background:'+(n.read?'#fff':'#f8f8ff')+'">'+
      '<div style="width:32px;height:32px;border-radius:50%;background:#E1F5EE;display:flex;align-items:center;justify-content:center;flex-shrink:0">'+
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'+
      '</div>'+
      '<div style="flex:1"><div style="font-size:12px;color:#444;line-height:1.6"><strong style="color:'+(a?a.color:'#333')+'">'+(a?a.name:'Someone')+'</strong> completed <strong>"'+n.taskName+'"</strong></div>'+
      '<div style="font-size:11px;color:#aaa;margin-top:3px">'+new Date(n.ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+'</div></div>'+
      (!n.read?'<div style="width:8px;height:8px;border-radius:50%;background:#7F77DD;margin-top:4px;flex-shrink:0"></div>':'')+
    '</div>';
  }
  l.innerHTML=h;
}

// ── BRAND UPLOADS ─────────────────────────────────────────────
window.wbUploadLogo=function(input,brandKey){
  var file=input.files[0]; if(!file) return;
  var reader=new FileReader();
  reader.onload=function(e){
    var data=e.target.result;
    // Save to Firebase
    db.ref('workboard/brandAssets/'+brandKey+'/logo').set(data,function(){
      BRANDS[brandKey].logoData=data;
      // Update preview without full re-render
      var prev=g('wb-logo-preview-'+brandKey);
      if(prev) prev.innerHTML='<img src="'+data+'" style="max-height:60px;max-width:200px;object-fit:contain"/>';
      // Show toast
      wbBrandToast('Logo uploaded!');
      // Re-render to update download button
      rC();
    });
  };
  reader.readAsDataURL(file);
};

window.wbUploadAsset=function(input,brandKey){
  var files=input.files; if(!files||!files.length) return;
  var bk=BRANDS[brandKey];
  if(!bk.uploadedAssets) bk.uploadedAssets=[];
  var toRead=files.length,done=0;
  for(var i=0;i<files.length;i++){
    (function(file){
      var reader=new FileReader();
      reader.onload=function(e){
        bk.uploadedAssets.push({name:file.name,data:e.target.result});
        done++;
        if(done===toRead){
          // Save to Firebase
          db.ref('workboard/brandAssets/'+brandKey+'/assets').set(bk.uploadedAssets,function(){
            wbBrandToast(toRead+' asset'+(toRead>1?'s':'')+' uploaded!');
            rC();
          });
        }
      };
      reader.readAsDataURL(file);
    })(files[i]);
  }
};

window.wbDeleteAsset=function(brandKey,index){
  var bk=BRANDS[brandKey];
  if(!bk.uploadedAssets) return;
  bk.uploadedAssets.splice(index,1);
  db.ref('workboard/brandAssets/'+brandKey+'/assets').set(bk.uploadedAssets,function(){
    wbBrandToast('Asset deleted.');
    rC();
  });
};

function wbBrandToast(msg){
  var t=g('wb-color-toast');
  if(t){
    t.textContent=msg;
    t.style.transform='translateX(-50%) translateY(0)';
    clearTimeout(window._colorToastTimer);
    window._colorToastTimer=setTimeout(function(){ t.style.transform='translateX(-50%) translateY(80px)'; },2500);
  }
}

// Load brand assets from Firebase
function loadBrandAssets(){
  db.ref('workboard/brandAssets').once('value',function(snap){
    var v=snap.val(); if(!v) return;
    var keys=Object.keys(BRANDS);
    for(var i=0;i<keys.length;i++){
      var k=keys[i];
      if(v[k]){
        if(v[k].logo) BRANDS[k].logoData=v[k].logo;
        if(v[k].assets) BRANDS[k].uploadedAssets=v[k].assets;
      }
    }
    if(activeTab==='brand') rC();
  });
}

// ── CHANGE PASSWORD ───────────────────────────────────────────
window.wbOpenChangePW=function(){
  g('wb-cpw-cur').value='';
  g('wb-cpw-new').value='';
  g('wb-cpw-cfm').value='';
  g('wb-cpw-err').textContent='';
  g('wb-cpw-ok').textContent='';
  g('wb-cpw-modal').style.display='flex';
  setTimeout(function(){ g('wb-cpw-cur').focus(); },100);
};
window.wbCloseCPW=function(){
  g('wb-cpw-modal').style.display='none';
};
window.wbSubmitCPW=function(){
  var cur=g('wb-cpw-cur').value;
  var nw=g('wb-cpw-new').value;
  var cfm=g('wb-cpw-cfm').value;
  g('wb-cpw-err').textContent='';
  g('wb-cpw-ok').textContent='';
  // Validate current password
  var correct=PASSWORDS[cu.id]||DEFAULT_PASSWORDS[cu.id];
  if(cur!==correct){ g('wb-cpw-err').textContent='Current password is incorrect.'; return; }
  if(nw.length<6){ g('wb-cpw-err').textContent='New password must be at least 6 characters.'; return; }
  if(nw!==cfm){ g('wb-cpw-err').textContent='Passwords do not match.'; return; }
  // Save to Firebase
  db.ref('workboard/passwords/'+cu.id).set(nw,function(err){
    if(err){
      g('wb-cpw-err').textContent='Failed to save. Please try again.';
    } else {
      PASSWORDS[cu.id]=nw;
      g('wb-cpw-ok').textContent='&#10003; Password changed successfully!';
      g('wb-cpw-cur').value='';
      g('wb-cpw-new').value='';
      g('wb-cpw-cfm').value='';
      setTimeout(wbCloseCPW,1800);
    }
  });
};

// ── START ─────────────────────────────────────────────────────
function start(){
  buildHTML();
  g('wb-loading').style.display='none';
  var savedSession=loadSession();
  if(savedSession){
    // Auto-login — skip password on refresh
    doLogin(savedSession);
  } else {
    g('wb-login').style.display='flex';
    rLogin();
  }
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',start);
} else {
  start();
}
})();
