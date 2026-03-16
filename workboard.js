(function(){
var FB={apiKey:"AIzaSyA0uD4AQ1Kjpz2opz5YtDT6CNyzQtqxA-0",authDomain:"workspace-031726.firebaseapp.com",databaseURL:"https://workspace-031726-default-rtdb.firebaseio.com",projectId:"workspace-031726",storageBucket:"workspace-031726.firebasestorage.app",messagingSenderId:"149203020312",appId:"1:149203020312:web:bb64bff680b3cc76af316d"};
var app=firebase.initializeApp(FB,'wb');
var db=firebase.database(app);
var CL=["#7F77DD","#378ADD","#1D9E75","#EF9F27","#D4537E","#E24B4A","#639922","#BA7517"];
var TM=[
  {id:"u1",name:"Thomas",color:"#7F77DD",tc:"#3C3489",i:"TH"},
  {id:"u2",name:"Till Michael",color:"#EF9F27",tc:"#633806",i:"TM"},
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

var boards=[],cu=null,abid=null,view="board";
var fil={pr:[],st:[],s:""};
var col={},nh=[],seen=new Set(),pt=null;
var uB=null,uN=null;
var tmM,tmG,tmI,bmM,gmM,gmG;
var sO=TM[0].id,sBC=CL[0],sGC=CL[2];

function uid(){ return Math.random().toString(36).slice(2,10); }
function g(id){ return document.getElementById(id); }
function getB(){ return boards.filter(function(b){ return b.id===abid; })[0] || boards[0] || null; }
function getAll(){
  var r=[];
  for(var i=0;i<boards.length;i++){
    for(var j=0;j<boards[i].groups.length;j++){
      for(var k=0;k<boards[i].groups[j].items.length;k++){
        r.push(boards[i].groups[j].items[k]);
      }
    }
  }
  return r;
}
function find(id){
  var all=getAll();
  for(var i=0;i<all.length;i++){ if(all[i].id===id) return all[i]; }
  return null;
}
function match(i){
  if(fil.pr.length && fil.pr.indexOf(i.priority)===-1) return false;
  if(fil.st.length && fil.st.indexOf(i.status)===-1) return false;
  if(fil.s && i.name.toLowerCase().indexOf(fil.s.toLowerCase())===-1) return false;
  return true;
}
function av(uid2,s){
  s=s||26;
  var u=null;
  for(var i=0;i<TM.length;i++){ if(TM[i].id===uid2){ u=TM[i]; break; } }
  if(!u) return '<div class="av" style="width:'+s+'px;height:'+s+'px;background:#eee;border-radius:50%"></div>';
  return '<div class="av" title="'+u.name+'" style="width:'+s+'px;height:'+s+'px;background:'+u.color+';color:'+u.tc+';font-size:'+(s<24?9:11)+'px">'+u.i+'</div>';
}
function fbSave(){ db.ref('workboard/boards').set(boards); }
function openM(id){ g(id).classList.add('open'); }
function closeM(id){ g(id).classList.remove('open'); }
function rAll(){ rSB(); rC(); }

function mapBoards(fn){
  var r=[];
  for(var i=0;i<boards.length;i++){ r.push(fn(boards[i])); }
  return r;
}
function mapGroups(b,fn){
  var r=[];
  for(var i=0;i<b.groups.length;i++){ r.push(fn(b.groups[i])); }
  return r;
}
function mapItems(g2,fn){
  var r=[];
  for(var i=0;i<g2.items.length;i++){ r.push(fn(g2.items[i])); }
  return r;
}
function filterItems(g2,fn){
  var r=[];
  for(var i=0;i<g2.items.length;i++){ if(fn(g2.items[i])) r.push(g2.items[i]); }
  return r;
}

function buildHTML(){
  var w=g('wb-wrap');
  if(!w) return;
  w.innerHTML=
    '<div id="wb-loading"><div class="wb-sp"></div><span style="font-size:13px;color:#aaa">Loading WorkBoard...</span></div>'+
    '<div id="wb-login" style="display:none">'+
      '<div style="background:#fff;border-radius:16px;border:1px solid #e0e0e0;padding:36px 40px;width:400px;max-width:92vw">'+
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">'+
          '<div style="width:10px;height:10px;border-radius:50%;background:#7F77DD"></div>'+
          '<span style="font-size:20px;font-weight:500">WorkBoard</span>'+
        '</div>'+
        '<p style="font-size:13px;color:#888;margin-bottom:20px">Choose your account</p>'+
        '<div id="wb-llist"></div>'+
      '</div>'+
    '</div>'+
    '<div id="wb-app" style="display:none">'+
      '<div id="wb-sb">'+
        '<div style="padding:14px;font-size:16px;font-weight:500;display:flex;align-items:center;gap:8px;border-bottom:1px solid #eee">'+
          '<div style="width:10px;height:10px;border-radius:50%;background:#7F77DD"></div>WorkBoard'+
        '</div>'+
        '<div id="wb-sbu" style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:8px;background:#f5f5f5;margin:10px 10px 6px"></div>'+
        '<div id="wb-mts" style="display:none;padding:10px 12px;border-bottom:1px solid #eee">'+
          '<div style="font-size:11px;color:#aaa;padding:0 0 6px;text-transform:uppercase">My tasks (<span id="wb-mtc">0</span>)</div>'+
          '<div id="wb-mtl"></div>'+
        '</div>'+
        '<div style="font-size:11px;color:#aaa;padding:10px 10px 4px;text-transform:uppercase">Boards</div>'+
        '<div id="wb-bl"></div>'+
        '<div class="sb-item" id="wb-nbb" style="color:#aaa"><span style="font-size:16px">+</span> New board</div>'+
        '<div style="border-top:1px solid #eee;padding:10px 14px;font-size:11px;color:#aaa;margin-top:auto" id="wb-ttl">0 total tasks</div>'+
      '</div>'+
      '<div id="wb-main">'+
        '<div id="wb-topbar">'+
          '<button class="btn" style="padding:5px 8px;font-size:16px" id="wb-tsb">&#9776;</button>'+
          '<div id="wb-bcd" style="width:12px;height:12px;border-radius:3px;flex-shrink:0"></div>'+
          '<h1 id="wb-bt">Board</h1>'+
          '<div style="position:relative" id="wb-bell-btn">'+
            '<button class="btn" style="padding:5px 10px" id="wb-bellt">&#128276;</button>'+
            '<div id="wb-bdot"></div>'+
          '</div>'+
          '<button class="btn" id="wb-ebb">Edit</button>'+
          '<button class="btn btnp" id="wb-atb">+ Add task</button>'+
        '</div>'+
        '<div id="wb-toolbar">'+
          '<button class="vbtn active" id="wb-vb">Table</button>'+
          '<button class="vbtn" id="wb-vk">Kanban</button>'+
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
    '<div id="wb-notif-popup">'+
      '<div style="height:6px;background:linear-gradient(90deg,#1D9E75,#5DCAA5)"></div>'+
      '<div style="padding:16px 18px 18px">'+
        '<div style="display:flex;align-items:flex-start;gap:14px">'+
          '<div style="width:44px;height:44px;border-radius:50%;background:#E1F5EE;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:20px">&#10003;</div>'+
          '<div style="flex:1">'+
            '<div style="font-size:15px;font-weight:600;margin-bottom:4px">Task completed!</div>'+
            '<div style="font-size:13px;color:#444;line-height:1.6" id="wb-nm"></div>'+
          '</div>'+
          '<button onclick="wbHP()" style="background:none;border:none;font-size:18px;cursor:pointer;color:#bbb">&#215;</button>'+
        '</div>'+
        '<div style="margin-top:14px;height:3px;border-radius:2px;background:#f0f0f0;overflow:hidden">'+
          '<div id="wb-npb" style="height:100%;background:#1D9E75;border-radius:2px"></div>'+
        '</div>'+
      '</div>'+
    '</div>'+
    '<div id="wb-np">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #eee">'+
        '<span style="font-size:14px;font-weight:500">Notifications</span>'+
        '<button id="wb-npc" style="background:none;border:none;font-size:12px;color:#aaa;cursor:pointer">Clear all</button>'+
      '</div>'+
      '<div id="wb-npl" style="max-height:300px;overflow-y:auto"></div>'+
    '</div>'+
    mkModal('wb-tm','wb-tmt','New task',
      '<div class="wb-field"><label>Task name</label><input type="text" id="wb-tn" placeholder="What needs to be done?"/></div>'+
      '<div class="wb-field"><label>Assign to</label><div class="alist" id="wb-al"></div></div>'+
      '<div class="fg">'+
        '<div class="wb-field"><label>Status</label><select id="wb-ts"></select></div>'+
        '<div class="wb-field"><label>Priority</label><select id="wb-tp"></select></div>'+
        '<div class="wb-field"><label>Due date</label><input type="date" id="wb-td"/></div>'+
      '</div>'+
      '<div class="wb-field"><label>Notes</label><textarea id="wb-tnotes" placeholder="Add notes..."></textarea></div>',
      '<button class="btn btnd" id="wb-tdb" style="display:none">Delete</button>',
      '<button class="btn" id="wb-tcb">Cancel</button><button class="btn btnp" id="wb-tsb2">Save</button>')+
    mkModal('wb-bm','wb-bmt','New board',
      '<div class="wb-field"><label>Board name</label><input type="text" id="wb-bn" placeholder="Board name"/></div>'+
      '<div class="wb-field"><label>Color</label><div class="cg" id="wb-bcp"></div></div>',
      '<button class="btn btnd" id="wb-bdb" style="display:none">Delete board</button>',
      '<button class="btn" id="wb-bcb">Cancel</button><button class="btn btnp" id="wb-bsb">Save</button>')+
    mkModal('wb-gm','wb-gmt','New group',
      '<div class="wb-field"><label>Group name</label><input type="text" id="wb-gn" placeholder="Group name"/></div>'+
      '<div class="wb-field"><label>Color</label><div class="cg" id="wb-gcp"></div></div>',
      '<button class="btn btnd" id="wb-gdb" style="display:none">Delete group</button>',
      '<button class="btn" id="wb-gcb">Cancel</button><button class="btn btnp" id="wb-gsb">Save</button>');
}

function mkModal(id,tid,title,body,left,right){
  return '<div class="wb-mo" id="'+id+'">'+
    '<div class="wb-mb">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">'+
        '<span style="font-size:15px;font-weight:500" id="'+tid+'">'+title+'</span>'+
        '<button id="'+id+'c" style="background:none;border:none;font-size:22px;cursor:pointer;color:#999">&#215;</button>'+
      '</div>'+
      body+
      '<div style="display:flex;justify-content:space-between;margin-top:20px">'+
        '<div>'+left+'</div>'+
        '<div style="display:flex;gap:8px">'+right+'</div>'+
      '</div>'+
    '</div>'+
  '</div>';
}

function rLogin(){
  var html='';
  for(var i=0;i<TM.length;i++){
    var u=TM[i];
    html+='<div style="display:flex;align-items:center;gap:14px;padding:11px 14px;border-radius:10px;border:1px solid #e8e8e8;cursor:pointer;margin-bottom:8px;" onmouseover="this.style.background=\'#f8f7ff\'" onmouseout="this.style.background=\'#fff\'" onclick="wbLG(\''+u.id+'\')">'+av(u.id,36)+'<span style="font-size:14px;font-weight:500">'+u.name+'</span></div>';
  }
  g('wb-llist').innerHTML=html;
}

window.wbLG=function(id){
  for(var i=0;i<TM.length;i++){ if(TM[i].id===id){ cu=TM[i]; break; } }
  g('wb-login').style.display='none';
  g('wb-app').style.display='flex';
  var ref=db.ref('workboard/boards');
  ref.on('value',function(snap){
    var v=snap.val();
    if(!v){ boards=[]; }
    else if(Array.isArray(v)){ boards=v; }
    else { boards=Object.keys(v).map(function(k){ return v[k]; }); }
    if(!abid && boards.length) abid=boards[0].id;
    rAll();
  });
  uB=function(){ ref.off('value'); };
  var nref=db.ref('workboard/notifs/'+cu.id);
  nref.on('child_added',function(snap){
    var n=snap.val();
    n.key=snap.key;
    if(!seen.has(n.key)){
      seen.add(n.key);
      nh.unshift({taskName:n.taskName,assigneeId:n.assigneeId,ts:n.ts,key:n.key,read:false});
      showP(n);
      updBell();
    }
  });
  uN=function(){ nref.off('child_added'); };
  wire();
};

window.wbLO=function(){
  if(uB) uB();
  if(uN) uN();
  cu=null;
  g('wb-app').style.display='none';
  g('wb-login').style.display='flex';
};

function wire(){
  g('wb-tsb').onclick=function(){ g('wb-sb').classList.toggle('closed'); };
  g('wb-nbb').onclick=oAB;
  g('wb-ebb').onclick=oEB;
  g('wb-atb').onclick=function(){
    var b=getB();
    if(b) oAT(b.groups.length ? b.groups[0].id : null);
  };
  g('wb-vb').onclick=function(){ setV('board'); };
  g('wb-vk').onclick=function(){ setV('kanban'); };
  g('wb-flt').onclick=function(){ g('wb-fp').classList.toggle('hidden'); };
  g('wb-flc').onclick=clrF;
  g('wb-si').oninput=function(){ fil.s=this.value; uFil(); rC(); };
  g('wb-bellt').onclick=tNP;
  g('wb-npc').onclick=function(){ nh=[]; updBell(); rNP(); g('wb-np').classList.remove('open'); };
  g('wb-tsb2').onclick=svT;
  g('wb-tcb').onclick=function(){ closeM('wb-tm'); };
  g('wb-tmc').onclick=function(){ closeM('wb-tm'); };
  g('wb-tdb').onclick=dlT;
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
    var p=g('wb-np'), b=g('wb-bell-btn');
    if(p && p.classList.contains('open') && !p.contains(e.target) && !b.contains(e.target)){
      p.classList.remove('open');
    }
  });
  rFChips();
}

function rSB(){
  var b=getB(), u=cu;
  g('wb-sbu').innerHTML=av(u.id,32)+'<span style="font-size:13px;font-weight:500;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+u.name+'</span><button onclick="wbLO()" style="background:none;border:none;font-size:14px;cursor:pointer;color:#aaa">&#8644;</button>';
  var mt=[];
  for(var i=0;i<boards.length;i++){
    for(var j=0;j<boards[i].groups.length;j++){
      for(var k=0;k<boards[i].groups[j].items.length;k++){
        var item=boards[i].groups[j].items[k];
        if(item.ownerId===u.id && item.status!=='done') mt.push(item);
      }
    }
  }
  g('wb-mts').style.display=mt.length?'block':'none';
  g('wb-mtc').textContent=mt.length;
  var mtHtml='';
  for(var i=0;i<Math.min(mt.length,5);i++){
    var t=mt[i];
    mtHtml+='<div style="display:flex;align-items:center;gap:8px;padding:5px 4px;font-size:12px;border-radius:6px;cursor:pointer" onclick="wbET(\''+t.id+'\')"><div class="pdot pd-'+t.priority+'"></div><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">'+t.name+'</span><button class="qdone" onclick="event.stopPropagation();wbQD(\''+t.id+'\')">&#10003;</button></div>';
  }
  g('wb-mtl').innerHTML=mtHtml;
  var blHtml='';
  for(var i=0;i<boards.length;i++){
    var bd=boards[i];
    var cnt=0;
    for(var j=0;j<bd.groups.length;j++) cnt+=bd.groups[j].items.length;
    blHtml+='<div class="sb-item'+(abid===bd.id?' active':'')+'" onclick="wbSB(\''+bd.id+'\')"><div style="width:10px;height:10px;border-radius:3px;flex-shrink:0;background:'+bd.color+'"></div><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">'+bd.name+'</span><span style="font-size:11px;color:#aaa;margin-left:auto">'+cnt+'</span></div>';
  }
  g('wb-bl').innerHTML=blHtml;
  var total=0;
  for(var i=0;i<boards.length;i++) for(var j=0;j<boards[i].groups.length;j++) total+=boards[i].groups[j].items.length;
  g('wb-ttl').textContent=total+' total tasks';
  if(b){ g('wb-bt').textContent=b.name; g('wb-bcd').style.background=b.color; }
}

function rC(){
  var b=getB(), c=g('wb-content');
  if(!b){
    c.innerHTML='<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 20px;gap:14px"><div style="font-size:40px">&#128203;</div><div style="font-size:16px;font-weight:500">No boards yet</div><button class="btn btnp" onclick="oAB()">+ Create board</button></div>';
    return;
  }
  if(view==='kanban'){ rKan(b,c); return; }
  rTbl(b,c);
}

function rTbl(board,c){
  var hF=fil.pr.length||fil.st.length||fil.s, h='';
  for(var gi=0;gi<board.groups.length;gi++){
    var gr=board.groups[gi];
    var disp=[];
    for(var ii=0;ii<gr.items.length;ii++){
      if(!hF || match(gr.items[ii])) disp.push(gr.items[ii]);
    }
    if(hF && !disp.length) continue;
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
        var ov=item.due && new Date(item.due)<td && item.status!=='done';
        var s=ST[0];
        for(var si=0;si<ST.length;si++){ if(ST[si].v===item.status){ s=ST[si]; break; } }
        var p=PR[1];
        for(var pi=0;pi<PR.length;pi++){ if(PR[pi].v===item.priority){ p=PR[pi]; break; } }
        var ds=item.due ? new Date(item.due).toLocaleDateString('en',{month:'short',day:'numeric'}) : '&mdash;';
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

function rKan(board,c){
  var h='<div class="kan-wrap">';
  for(var si=0;si<ST.length;si++){
    var sc=ST[si];
    var tasks=[];
    for(var gi=0;gi<board.groups.length;gi++){
      for(var ii=0;ii<board.groups[gi].items.length;ii++){
        var it=board.groups[gi].items[ii];
        if(it.status===sc.v) tasks.push({item:it,gc:board.groups[gi].color});
      }
    }
    h+='<div class="kan-col"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><div style="width:10px;height:10px;border-radius:50%;background:'+sc.d+'"></div><span style="font-size:13px;font-weight:500">'+sc.l+'</span><span style="font-size:12px;color:#aaa;margin-left:auto">'+tasks.length+'</span></div>';
    for(var ti=0;ti<tasks.length;ti++){
      var t=tasks[ti].item, gc=tasks[ti].gc;
      var im=t.ownerId===cu.id && t.status!=='done';
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

window.wbSB=function(id){ abid=id; rSB(); rC(); };
function setV(v){
  view=v;
  g('wb-vb').classList.toggle('active',v==='board');
  g('wb-vk').classList.toggle('active',v==='kanban');
  rC();
}
window.wbTC=function(gid){ col[gid]=!col[gid]; rC(); };
function clrF(){ fil={pr:[],st:[],s:''}; g('wb-si').value=''; uFil(); rC(); }
window.wbTF=function(k,v){
  var a=fil[k], idx=a.indexOf(v);
  if(idx>-1) a.splice(idx,1); else a.push(v);
  uFil(); rC();
};

function rFChips(){
  var h='';
  for(var i=0;i<PR.length;i++) h+='<div class="fchip" id="fcp-'+PR[i].v+'" onclick="wbTF(\'pr\',\''+PR[i].v+'\')">'+PR[i].l+'</div>';
  g('wb-fpp').innerHTML=h;
  h='';
  for(var i=0;i<ST.length;i++) h+='<div class="fchip" id="fcs-'+ST[i].v+'" onclick="wbTF(\'st\',\''+ST[i].v+'\')">'+ST[i].l+'</div>';
  g('wb-fps').innerHTML=h;
}

function uFil(){
  for(var i=0;i<PR.length;i++){
    var e=g('fcp-'+PR[i].v); if(!e) continue;
    var a=fil.pr.indexOf(PR[i].v)>-1;
    e.style.background=a?PR[i].c:'#fff';
    e.style.color=a?'#fff':'#888';
    e.style.borderColor=a?PR[i].c:'#eee';
  }
  var sm={todo:{bg:'#F1EFE8',c:'#5F5E5A'},wip:{bg:'#EEEDFE',c:'#3C3489'},review:{bg:'#FAEEDA',c:'#854F0B'},done:{bg:'#E1F5EE',c:'#0F6E56'},stuck:{bg:'#FCEBEB',c:'#A32D2D'}};
  for(var i=0;i<ST.length;i++){
    var e=g('fcs-'+ST[i].v); if(!e) continue;
    var a=fil.st.indexOf(ST[i].v)>-1;
    e.style.background=a?sm[ST[i].v].bg:'#fff';
    e.style.color=a?sm[ST[i].v].c:'#888';
    e.style.borderColor=a?sm[ST[i].v].c:'#eee';
  }
  var hF=fil.pr.length||fil.st.length||fil.s;
  g('wb-flt').textContent=hF?'Filters ('+(fil.pr.length+fil.st.length+(fil.s?1:0))+')':'Filter';
  g('wb-flt').className='btn fchip'+(hF?' on':'');
  g('wb-flc').style.display=hF?'inline-flex':'none';
}

function pSS(v){ var h=''; for(var i=0;i<ST.length;i++) h+='<option value="'+ST[i].v+'"'+(ST[i].v===v?' selected':'')+'>'+ST[i].l+'</option>'; g('wb-ts').innerHTML=h; }
function pPS(v){ var h=''; for(var i=0;i<PR.length;i++) h+='<option value="'+PR[i].v+'"'+(PR[i].v===v?' selected':'')+'>'+PR[i].l+'</option>'; g('wb-tp').innerHTML=h; }
function rAL(){
  var h='';
  for(var i=0;i<TM.length;i++){
    var u=TM[i];
    h+='<div class="aitem'+(u.id===sO?' sel':'')+'" style="--c:'+u.color+'" onclick="wbSO(\''+u.id+'\')">'+av(u.id,28)+'<span style="font-size:13px;font-weight:'+(u.id===sO?500:400)+'">'+u.name+'</span>'+(u.id===sO?'<span style="margin-left:auto;font-size:12px;color:'+u.color+'">&#10003;</span>':'')+'</div>';
  }
  g('wb-al').innerHTML=h;
}
window.wbSO=function(id){ sO=id; rAL(); };

function oAT(gid){
  tmM='add'; tmG=gid; tmI=null; sO=TM[0].id;
  g('wb-tmt').textContent='New task';
  g('wb-tn').value=''; g('wb-td').value=''; g('wb-tnotes').value='';
  pSS('todo'); pPS('med'); rAL();
  g('wb-tdb').style.display='none';
  openM('wb-tm');
}
window.wbET=function(itemId){
  var i=find(itemId); if(!i) return;
  tmM='edit'; tmI=i; tmG=null; sO=i.ownerId||TM[0].id;
  g('wb-tmt').textContent='Edit task';
  g('wb-tn').value=i.name; g('wb-td').value=i.due||''; g('wb-tnotes').value=i.notes||'';
  pSS(i.status); pPS(i.priority); rAL();
  g('wb-tdb').style.display='inline-flex';
  openM('wb-tm');
};

function svT(){
  var name=g('wb-tn').value.trim(); if(!name) return;
  var st=g('wb-ts').value, pr=g('wb-tp').value, due=g('wb-td').value, notes=g('wb-tnotes').value;
  if(tmM==='add'){
    var newItem={id:uid(),name:name,status:st,priority:pr,ownerId:sO,assignedBy:cu.id,due:due,notes:notes};
    var nb=[];
    for(var i=0;i<boards.length;i++){
      if(boards[i].id===getB().id){
        var ngs=[];
        for(var j=0;j<boards[i].groups.length;j++){
          if(boards[i].groups[j].id===tmG){
            var ng={id:boards[i].groups[j].id,name:boards[i].groups[j].name,color:boards[i].groups[j].color,items:[newItem].concat(boards[i].groups[j].items)};
            ngs.push(ng);
          } else { ngs.push(boards[i].groups[j]); }
        }
        nb.push({id:boards[i].id,name:boards[i].name,color:boards[i].color,groups:ngs});
      } else { nb.push(boards[i]); }
    }
    boards=nb;
  } else {
    var prev=tmI;
    var upd={id:prev.id,name:name,status:st,priority:pr,ownerId:sO,assignedBy:prev.assignedBy,due:due,notes:notes};
    var nb=[];
    for(var i=0;i<boards.length;i++){
      var ngs=[];
      for(var j=0;j<boards[i].groups.length;j++){
        var ni=[];
        for(var k=0;k<boards[i].groups[j].items.length;k++){
          ni.push(boards[i].groups[j].items[k].id===prev.id ? upd : boards[i].groups[j].items[k]);
        }
        ngs.push({id:boards[i].groups[j].id,name:boards[i].groups[j].name,color:boards[i].groups[j].color,items:ni});
      }
      nb.push({id:boards[i].id,name:boards[i].name,color:boards[i].color,groups:ngs});
    }
    boards=nb;
    if(prev.status!=='done' && st==='done') pshN(upd,cu.id);
  }
  fbSave(); closeM('wb-tm'); rAll();
}

function dlT(){
  if(!tmI) return;
  var nb=[];
  for(var i=0;i<boards.length;i++){
    var ngs=[];
    for(var j=0;j<boards[i].groups.length;j++){
      var ni=[];
      for(var k=0;k<boards[i].groups[j].items.length;k++){
        if(boards[i].groups[j].items[k].id!==tmI.id) ni.push(boards[i].groups[j].items[k]);
      }
      ngs.push({id:boards[i].groups[j].id,name:boards[i].groups[j].name,color:boards[i].groups[j].color,items:ni});
    }
    nb.push({id:boards[i].id,name:boards[i].name,color:boards[i].color,groups:ngs});
  }
  boards=nb;
  fbSave(); closeM('wb-tm'); rAll();
}

window.wbQD=function(itemId){
  var item=find(itemId); if(!item||item.ownerId!==cu.id) return;
  var nb=[];
  for(var i=0;i<boards.length;i++){
    var ngs=[];
    for(var j=0;j<boards[i].groups.length;j++){
      var ni=[];
      for(var k=0;k<boards[i].groups[j].items.length;k++){
        var it=boards[i].groups[j].items[k];
        ni.push(it.id===itemId ? {id:it.id,name:it.name,status:'done',priority:it.priority,ownerId:it.ownerId,assignedBy:it.assignedBy,due:it.due,notes:it.notes} : it);
      }
      ngs.push({id:boards[i].groups[j].id,name:boards[i].groups[j].name,color:boards[i].groups[j].color,items:ni});
    }
    nb.push({id:boards[i].id,name:boards[i].name,color:boards[i].color,groups:ngs});
  }
  boards=nb;
  var done=find(itemId);
  pshN(done,cu.id);
  fbSave(); rAll();
};

function pshN(task,doneBy){
  var t=task.assignedBy;
  if(!t||t===doneBy) return;
  db.ref('workboard/notifs/'+t).push({id:uid(),taskName:task.name,assigneeId:doneBy,taskId:task.id,ts:Date.now()});
}

function oAB(){
  bmM='add'; sBC=CL[0];
  g('wb-bmt').textContent='New board';
  g('wb-bn').value='';
  g('wb-bdb').style.display='none';
  rCP('wb-bcp','sBC',sBC);
  openM('wb-bm');
}
function oEB(){
  var b=getB(); if(!b) return;
  bmM='edit'; sBC=b.color;
  g('wb-bmt').textContent='Edit board';
  g('wb-bn').value=b.name;
  g('wb-bdb').style.display='inline-flex';
  rCP('wb-bcp','sBC',sBC);
  openM('wb-bm');
}
function svB(){
  var name=g('wb-bn').value.trim(); if(!name) return;
  if(bmM==='add'){
    var nb={id:uid(),name:name,color:sBC,groups:[]};
    boards.push(nb); abid=nb.id;
  } else {
    for(var i=0;i<boards.length;i++){
      if(boards[i].id===getB().id){ boards[i].name=name; boards[i].color=sBC; break; }
    }
  }
  fbSave(); closeM('wb-bm'); rAll();
}
function dlB(){
  var bid=getB().id;
  var nb=[];
  for(var i=0;i<boards.length;i++){ if(boards[i].id!==bid) nb.push(boards[i]); }
  boards=nb;
  abid=boards.length?boards[0].id:null;
  fbSave(); closeM('wb-bm'); rAll();
}

function oAG(){
  gmM='add'; gmG=null; sGC=CL[2];
  g('wb-gmt').textContent='New group';
  g('wb-gn').value='';
  g('wb-gdb').style.display='none';
  rCP('wb-gcp','sGC',sGC);
  openM('wb-gm');
}
window.wbEG=function(gid){
  var b=getB(), gr=null;
  for(var i=0;i<b.groups.length;i++){ if(b.groups[i].id===gid){ gr=b.groups[i]; break; } }
  if(!gr) return;
  gmM='edit'; gmG=gid; sGC=gr.color;
  g('wb-gmt').textContent='Edit group';
  g('wb-gn').value=gr.name;
  g('wb-gdb').style.display='inline-flex';
  rCP('wb-gcp','sGC',sGC);
  openM('wb-gm');
};
function svG(){
  var name=g('wb-gn').value.trim(); if(!name) return;
  var bid=getB().id;
  if(gmM==='add'){
    var ng={id:uid(),name:name,color:sGC,items:[]};
    for(var i=0;i<boards.length;i++){
      if(boards[i].id===bid){ boards[i].groups.push(ng); break; }
    }
  } else {
    for(var i=0;i<boards.length;i++){
      if(boards[i].id===bid){
        for(var j=0;j<boards[i].groups.length;j++){
          if(boards[i].groups[j].id===gmG){ boards[i].groups[j].name=name; boards[i].groups[j].color=sGC; break; }
        }
        break;
      }
    }
  }
  fbSave(); closeM('wb-gm'); rAll();
}
function dlG(){
  var bid=getB().id;
  for(var i=0;i<boards.length;i++){
    if(boards[i].id===bid){
      var ng=[];
      for(var j=0;j<boards[i].groups.length;j++){ if(boards[i].groups[j].id!==gmG) ng.push(boards[i].groups[j]); }
      boards[i].groups=ng; break;
    }
  }
  fbSave(); closeM('wb-gm'); rAll();
}

function rCP(cid,vn,sel){
  var h='';
  for(var i=0;i<CL.length;i++){
    h+='<div class="cs'+(CL[i]===sel?' sel':'')+'" style="background:'+CL[i]+'" onclick="wbPC(\''+cid+'\',\''+vn+'\',\''+CL[i]+'\')"></div>';
  }
  g(cid).innerHTML=h;
  if(vn==='sBC') sBC=sel;
  if(vn==='sGC') sGC=sel;
}
window.wbPC=function(cid,vn,c){
  if(vn==='sBC') sBC=c;
  if(vn==='sGC') sGC=c;
  var swatches=document.querySelectorAll('#'+cid+' .cs');
  for(var i=0;i<swatches.length;i++){
    swatches[i].classList.toggle('sel', swatches[i].style.background===c || swatches[i].style.backgroundColor===c);
  }
};

function showP(notif){
  var a=null;
  for(var i=0;i<TM.length;i++){ if(TM[i].id===notif.assigneeId){ a=TM[i]; break; } }
  g('wb-nm').innerHTML='<span style="font-weight:600;color:'+(a?a.color:'#333')+'">'+(a?a.name:'Someone')+'</span> marked <strong>"'+notif.taskName+'"</strong> as done.';
  var pop=g('wb-notif-popup'), bar=g('wb-npb');
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
    var n=nh[i], a=null;
    for(var j=0;j<TM.length;j++){ if(TM[j].id===n.assigneeId){ a=TM[j]; break; } }
    h+='<div style="padding:12px 16px;border-bottom:1px solid #f5f5f5;display:flex;gap:12px;align-items:flex-start;background:'+(n.read?'#fff':'#f8f8ff')+'">'+
      '<div style="width:32px;height:32px;border-radius:50%;background:#E1F5EE;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">&#10003;</div>'+
      '<div style="flex:1"><div style="font-size:12px;color:#444;line-height:1.6"><strong style="color:'+(a?a.color:'#333')+'">'+(a?a.name:'Someone')+'</strong> completed <strong>"'+n.taskName+'"</strong></div>'+
      '<div style="font-size:11px;color:#aaa;margin-top:3px">'+new Date(n.ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+'</div></div>'+
      (!n.read?'<div style="width:8px;height:8px;border-radius:50%;background:#7F77DD;margin-top:4px;flex-shrink:0"></div>':'')+
    '</div>';
  }
  l.innerHTML=h;
}

// Start
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',function(){ buildHTML(); g('wb-loading').style.display='none'; g('wb-login').style.display='flex'; rLogin(); });
} else {
  buildHTML(); g('wb-loading').style.display='none'; g('wb-login').style.display='flex'; rLogin();
}

})();
