/* ── Reset ── */
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;background:#F2F3F5;color:#1A2228;min-height:100vh}
button{font-family:inherit;cursor:pointer}
input,select,textarea{font-family:inherit}

/* ── Brand tokens ── */
:root{
  --orange:#F7931E;
  --orange-dk:#d97c10;
  --navy:#38444E;
  --navy-dark:#2A343C;
  --white:#FFFFFF;
  --surface:#F7F8FA;
  --border:#E2E5E8;
  --text:#1A2228;
  --text-mid:#3D4F5C;
  --text-muted:#6B7A84;
  --green:#1D9E75;
  --green-lt:#D6F5E8;
  --green-dk:#1D7A4E;
  --red:#B03020;
  --red-lt:#FDECEA;
}

/* ── Layout ── */
#wb-wrap{width:100%;height:100vh;overflow:hidden;display:flex;flex-direction:column}
#wb-app{display:flex;height:100vh;overflow:hidden;width:100%}
#wb-sb{width:240px;min-width:240px;background:var(--white);border-right:1px solid var(--border);display:flex;flex-direction:column;transition:width .2s;overflow:hidden;flex-shrink:0}
#wb-sb.closed{width:0;min-width:0}
#wb-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
.sb-user{display:flex;align-items:center;gap:10px;padding:10px 12px;margin:10px 10px 4px;border-radius:10px;background:var(--surface);border:1px solid var(--border)}
.sb-item{padding:8px 12px;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:9px;color:var(--text-mid);margin:1px 8px;transition:background .1s,color .1s;font-weight:500}
.sb-item:hover{background:#F2F3F5;color:var(--navy)}
.sb-item.active{background:var(--orange);color:#fff}
.sb-item.active svg{stroke:#fff}
.sb-item.active span{color:#fff!important}
.sb-footer{border-top:1px solid var(--border);padding:10px 16px;font-size:11px;color:var(--text-muted);margin-top:auto}

/* ── Topbar / Toolbar ── */
#wb-topbar{height:56px;background:var(--white);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 20px;gap:10px;flex-shrink:0}
#wb-topbar h1{font-size:15px;font-weight:700;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text)}
#wb-toolbar{height:46px;background:var(--white);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 20px;gap:6px;flex-shrink:0}

/* ── Content ── */
#wb-content{flex:1;overflow-y:auto;padding:20px 24px;background:var(--surface)}
#wb-fp{background:var(--white);border-bottom:1px solid var(--border);padding:12px 20px;display:flex;gap:20px;flex-wrap:wrap;flex-shrink:0}
#wb-fp.hidden{display:none}

/* ── Buttons ── */
.btn{padding:7px 16px;border-radius:8px;border:1px solid var(--border);background:var(--white);color:var(--text);font-size:13px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;flex-shrink:0;transition:background .1s,border-color .1s}
.btn:hover{background:#F2F3F5;border-color:#c5ccd2}
.btnp{background:var(--orange);border-color:var(--orange);color:#fff}
.btnp:hover{background:var(--orange-dk);border-color:var(--orange-dk)}
.btnd{color:var(--red);border-color:#e0b0aa;background:#fff}
.btnd:hover{background:var(--red-lt);border-color:#c08070}
.vbtn{padding:6px 14px;border-radius:8px;border:none;background:transparent;font-size:13px;color:var(--text-muted);cursor:pointer;font-weight:500;transition:background .1s,color .1s}
.vbtn.active{background:var(--orange);color:#fff;font-weight:600}
.fchip{padding:5px 12px;border-radius:20px;font-size:12px;font-weight:500;cursor:pointer;border:1px solid var(--border);color:var(--text-muted);background:var(--white);transition:all .1s}
.fchip.on{background:var(--orange);border-color:var(--orange);color:#fff}
.qdone{background:var(--green-lt);border:1px solid #a8dece;border-radius:6px;color:var(--green-dk);font-size:11px;padding:3px 7px;cursor:pointer;font-weight:600}

/* ── Table ── */
.bhead{display:grid;grid-template-columns:1fr 130px 36px 110px 90px 36px;padding:0 14px;height:34px;background:var(--surface);border-bottom:1px solid var(--border);align-items:center;gap:8px}
.bhead span{font-size:10px;color:var(--text-muted);font-weight:700;text-transform:uppercase;letter-spacing:.06em}
.brow{display:grid;grid-template-columns:1fr 130px 36px 110px 90px 36px;padding:0 14px;height:46px;border-bottom:1px solid var(--border);align-items:center;gap:8px;cursor:pointer;transition:background .1s}
.brow:hover{background:#F7F8FA}
.brow:last-child{border-bottom:none}

/* ── Status pills ── */
.pill{font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;white-space:nowrap;display:inline-block}
.p-todo{background:#EDECEA;color:#4A4845}
.p-wip{background:#D6F5E8;color:#0A5C3E}
.p-review{background:#FFF0DC;color:#7A4500}
.p-done{background:#D6F5E8;color:#1D7A4E}
.p-stuck{background:#FAD9D9;color:#7A1A1A}

/* ── Priority dots ── */
.pdot{width:10px;height:10px;border-radius:50%;flex-shrink:0;display:inline-block}
.pd-high{background:#C0392B}
.pd-med{background:#D4820A}
.pd-low{background:#4A8A1A}

/* ── Avatar ── */
.av{border-radius:50%;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}

/* ── Kanban ── */
.kan-wrap{display:flex;gap:16px;overflow-x:auto;padding:4px 0 16px}
.kan-col{min-width:224px;flex:0 0 224px}
.kan-card{background:var(--white);border-radius:10px;padding:12px 14px;cursor:pointer;margin-bottom:8px;border:1px solid var(--border);transition:box-shadow .15s,transform .1s}
.kan-card:hover{box-shadow:0 3px 12px rgba(56,68,78,.1);transform:translateY(-1px)}
.kan-card.mine{border-left:3px solid var(--orange)!important}

/* ── Modal ── */
.wb-mo{display:none;position:fixed;inset:0;background:rgba(26,34,40,.55);z-index:100000;align-items:center;justify-content:center;padding:20px}
.wb-mo.open{display:flex}
.wb-mb{background:var(--white);border-radius:14px;width:520px;max-width:100%;padding:28px;max-height:90vh;overflow-y:auto;color:var(--text);box-shadow:0 20px 60px rgba(26,34,40,.2)}
.wb-field{margin-bottom:16px}
.wb-field label{font-size:12px;color:var(--navy);display:block;margin-bottom:5px;font-weight:600;letter-spacing:.02em}
.wb-field input,.wb-field select,.wb-field textarea{width:100%;padding:9px 12px;border-radius:8px;border:1px solid var(--border);background:var(--white);color:var(--text);font-size:13px;font-family:inherit;outline:none;transition:border-color .15s}
.wb-field input:focus,.wb-field select:focus,.wb-field textarea:focus{border-color:var(--orange);box-shadow:0 0 0 3px rgba(247,147,30,.12)}
.wb-field textarea{resize:vertical;min-height:70px}
.fg{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.alist{display:flex;flex-direction:column;gap:4px;max-height:200px;overflow-y:auto;border:1px solid var(--border);border-radius:8px;padding:6px}
.aitem{display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:7px;cursor:pointer;border:1.5px solid transparent;transition:background .1s}
.aitem:hover{background:#F2F3F5}
.aitem.sel{border-color:var(--c);background:#F2F3F5}
.cg{display:flex;gap:8px;flex-wrap:wrap;padding:4px 0}
.cs{width:28px;height:28px;border-radius:6px;cursor:pointer;border:2.5px solid transparent;transition:transform .1s}
.cs:hover{transform:scale(1.12)}
.cs.sel{border-color:var(--navy)}

/* ── Loading / Login ── */
#wb-loading{display:flex;align-items:center;justify-content:center;min-height:100vh;flex-direction:column;gap:12px;background:var(--surface)}
.wb-sp{width:36px;height:36px;border:3px solid var(--border);border-top-color:var(--orange);border-radius:50%;animation:wb-spin .7s linear infinite}
@keyframes wb-spin{to{transform:rotate(360deg)}}
#wb-login{display:flex;align-items:center;justify-content:center;min-height:100vh;background:var(--surface);padding:20px}
.wb-login-card{background:var(--white);border-radius:16px;border:1px solid var(--border);padding:36px 40px;width:420px;max-width:92vw;box-shadow:0 4px 24px rgba(56,68,78,.08)}
.wb-login-item{display:flex;align-items:center;gap:14px;padding:11px 14px;border-radius:10px;border:1px solid var(--border);cursor:pointer;margin-bottom:8px;transition:background .1s,border-color .1s;color:var(--text)}
.wb-login-item:hover{background:#F2F3F5;border-color:#c5ccd2}

/* ── Bell / Notif panel ── */
#wb-bell-btn{position:relative;flex-shrink:0}
#wb-bdot{position:absolute;top:4px;right:4px;width:8px;height:8px;border-radius:50%;background:var(--orange);border:1.5px solid #fff;display:none}
#wb-np{display:none;position:fixed;top:60px;right:16px;width:320px;background:var(--white);border:1px solid var(--border);border-radius:12px;box-shadow:0 8px 32px rgba(26,34,40,.12);z-index:150000;overflow:hidden}
#wb-np.open{display:block}
#wb-notif-popup{display:none}

/* ── Search ── */
#wb-si{padding:6px 12px;border-radius:8px;border:1px solid var(--border);font-size:12px;width:160px;font-family:inherit;outline:none;background:var(--surface);color:var(--text);transition:border-color .15s}
#wb-si:focus{border-color:var(--orange);background:var(--white)}
#wb-si::placeholder{color:var(--text-muted)}

/* ── Empty state ── */
.wb-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 20px;gap:14px;text-align:center;color:var(--text)}
.wb-empty svg{stroke:#C8CDD1}

/* ── TOAST NOTIFICATIONS ── */
#wb-toast-container{position:fixed;bottom:24px;right:24px;z-index:999999;display:flex;flex-direction:column;gap:10px;pointer-events:none;max-width:340px}
.wb-toast{background:#fff;border-radius:12px;box-shadow:0 4px 24px rgba(26,34,40,.18),0 0 0 1px rgba(26,34,40,.07);overflow:hidden;pointer-events:auto;animation:wb-toast-in .35s cubic-bezier(.34,1.56,.64,1) forwards;min-width:300px;max-width:340px}
.wb-toast.removing{animation:wb-toast-out .25s ease forwards}
.wb-toast-accent{height:4px;width:100%}
.wb-toast-body{padding:12px 14px 10px;display:flex;gap:12px;align-items:flex-start}
.wb-toast-icon{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.wb-toast-content{flex:1;min-width:0}
.wb-toast-title{font-size:13px;font-weight:700;color:#1A2228;margin-bottom:3px}
.wb-toast-msg{font-size:12px;color:#3D4F5C;line-height:1.5}
.wb-toast-time{font-size:11px;color:#9CA3AF;margin-top:4px}
.wb-toast-close{background:none;border:none;font-size:18px;cursor:pointer;color:#9CA3AF;padding:0;line-height:1;flex-shrink:0;margin-top:1px;font-family:inherit}
.wb-toast-close:hover{color:#38444E}
.wb-toast-progress{height:3px;background:#F2F3F5;overflow:hidden}
.wb-toast-progress-bar{height:100%;animation:wb-shrink 6s linear forwards}
@keyframes wb-toast-in{from{opacity:0;transform:translateY(24px) scale(.94)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes wb-toast-out{from{opacity:1;transform:translateY(0) scale(1)}to{opacity:0;transform:translateY(10px) scale(.95)}}
@keyframes wb-shrink{from{width:100%}to{width:0%}}

/* ── Scrollbar ── */
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}
::-webkit-scrollbar-thumb:hover{background:#b0b8c0}

/* ── Bell animation ── */
@keyframes wb-bell-ring{
  0%  {transform:rotate(0)}
  10% {transform:rotate(14deg)}
  20% {transform:rotate(-12deg)}
  30% {transform:rotate(10deg)}
  40% {transform:rotate(-8deg)}
  50% {transform:rotate(6deg)}
  60% {transform:rotate(-4deg)}
  70% {transform:rotate(2deg)}
  80% {transform:rotate(0)}
  100%{transform:rotate(0)}
}
#wb-bellt.ringing{
  animation:wb-bell-ring .7s ease forwards;
  transform-origin:top center;
}
#wb-bellt.ringing svg{stroke:#F7931E}

/* ── Password screen ── */
#wb-pw-screen{background:rgba(26,34,40,.55)!important}


/* ── Layout ── */
#wb-wrap{width:100%;height:100vh;overflow:hidden;display:flex;flex-direction:column}
#wb-app{display:flex;height:100vh;overflow:hidden;width:100%}

/* ── Sidebar ── */
#wb-sb{width:240px;min-width:240px;background:var(--white);border-right:1px solid var(--border);display:flex;flex-direction:column;transition:width .2s;overflow:hidden;flex-shrink:0}
#wb-sb.closed{width:0;min-width:0}
#wb-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}

/* Sidebar user */
.sb-user{display:flex;align-items:center;gap:10px;padding:10px 12px;margin:10px 10px 4px;border-radius:10px;background:var(--surface);border:1px solid var(--border)}

/* Sidebar items */
.sb-item{padding:8px 12px;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:9px;color:var(--text-mid);margin:1px 8px;transition:background .1s,color .1s;font-weight:500}
.sb-item:hover{background:#F2F3F5;color:var(--navy)}
.sb-item.active{background:var(--orange);color:#fff}
.sb-item.active svg{stroke:#fff}
.sb-item.active span{color:#fff!important}

/* Sidebar footer */
.sb-footer{border-top:1px solid var(--border);padding:10px 16px;font-size:11px;color:var(--text-muted);margin-top:auto}

/* ── Topbar ── */
#wb-topbar{height:56px;background:var(--white);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 20px;gap:10px;flex-shrink:0}
#wb-topbar h1{font-size:15px;font-weight:700;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text)}

/* ── Toolbar ── */
#wb-toolbar{height:46px;background:var(--white);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 20px;gap:6px;flex-shrink:0}

/* ── Content ── */
#wb-content{flex:1;overflow-y:auto;padding:20px 24px;background:var(--surface)}
#wb-fp{background:var(--white);border-bottom:1px solid var(--border);padding:12px 20px;display:flex;gap:20px;flex-wrap:wrap;flex-shrink:0}
#wb-fp.hidden{display:none}

/* ── Buttons ── */
.btn{padding:7px 16px;border-radius:8px;border:1px solid var(--border);background:var(--white);color:var(--text);font-size:13px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;flex-shrink:0;transition:background .1s,border-color .1s}
.btn:hover{background:#F2F3F5;border-color:#c5ccd2}
.btnp{background:var(--orange);border-color:var(--orange);color:#fff}
.btnp:hover{background:var(--orange-dk);border-color:var(--orange-dk)}
.btnd{color:var(--red);border-color:#e0b0aa;background:#fff}
.btnd:hover{background:var(--red-lt);border-color:#c08070}
.vbtn{padding:6px 14px;border-radius:8px;border:none;background:transparent;font-size:13px;color:var(--text-muted);cursor:pointer;font-weight:500;transition:background .1s,color .1s}
.vbtn.active{background:var(--orange);color:#fff;font-weight:600}
.fchip{padding:5px 12px;border-radius:20px;font-size:12px;font-weight:500;cursor:pointer;border:1px solid var(--border);color:var(--text-muted);background:var(--white);transition:all .1s}
.fchip.on{background:var(--orange);border-color:var(--orange);color:#fff}
.qdone{background:var(--green-lt);border:1px solid #a8dece;border-radius:6px;color:var(--green-dk);font-size:11px;padding:3px 7px;cursor:pointer;font-weight:600}

/* ── Table ── */
.bhead{display:grid;grid-template-columns:1fr 130px 36px 110px 90px 36px;padding:0 14px;height:34px;background:var(--surface);border-bottom:1px solid var(--border);align-items:center;gap:8px}
.bhead span{font-size:10px;color:var(--text-muted);font-weight:700;text-transform:uppercase;letter-spacing:.06em}
.brow{display:grid;grid-template-columns:1fr 130px 36px 110px 90px 36px;padding:0 14px;height:46px;border-bottom:1px solid var(--border);align-items:center;gap:8px;cursor:pointer;transition:background .1s}
.brow:hover{background:#F7F8FA}
.brow:last-child{border-bottom:none}

/* ── Status pills ── */
.pill{font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;white-space:nowrap;display:inline-block}
.p-todo{background:#EDECEA;color:#4A4845}
.p-wip{background:#D6F5E8;color:#0A5C3E}
.p-review{background:#FFF0DC;color:#7A4500}
.p-done{background:#D6F5E8;color:#1D7A4E}
.p-stuck{background:#FAD9D9;color:#7A1A1A}

/* ── Priority dots ── */
.pdot{width:10px;height:10px;border-radius:50%;flex-shrink:0;display:inline-block}
.pd-high{background:#C0392B}
.pd-med{background:#D4820A}
.pd-low{background:#4A8A1A}

/* ── Avatar ── */
.av{border-radius:50%;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}

/* ── Kanban ── */
.kan-wrap{display:flex;gap:16px;overflow-x:auto;padding:4px 0 16px}
.kan-col{min-width:224px;flex:0 0 224px}
.kan-card{background:var(--white);border-radius:10px;padding:12px 14px;cursor:pointer;margin-bottom:8px;border:1px solid var(--border);transition:box-shadow .15s,transform .1s}
.kan-card:hover{box-shadow:0 3px 12px rgba(56,68,78,.1);transform:translateY(-1px)}
.kan-card.mine{border-left:3px solid var(--orange)!important}

/* ── Modal ── */
.wb-mo{display:none;position:fixed;inset:0;background:rgba(26,34,40,.55);z-index:100000;align-items:center;justify-content:center;padding:20px}
.wb-mo.open{display:flex}
.wb-mb{background:var(--white);border-radius:14px;width:520px;max-width:100%;padding:28px;max-height:90vh;overflow-y:auto;color:var(--text);box-shadow:0 20px 60px rgba(26,34,40,.2)}
.wb-field{margin-bottom:16px}
.wb-field label{font-size:12px;color:var(--navy);display:block;margin-bottom:5px;font-weight:600;letter-spacing:.02em}
.wb-field input,.wb-field select,.wb-field textarea{width:100%;padding:9px 12px;border-radius:8px;border:1px solid var(--border);background:var(--white);color:var(--text);font-size:13px;font-family:inherit;outline:none;transition:border-color .15s}
.wb-field input:focus,.wb-field select:focus,.wb-field textarea:focus{border-color:var(--orange);box-shadow:0 0 0 3px rgba(247,147,30,.12)}
.wb-field textarea{resize:vertical;min-height:70px}
.fg{display:grid;grid-template-columns:1fr 1fr;gap:12px}

/* ── Assignee list ── */
.alist{display:flex;flex-direction:column;gap:4px;max-height:200px;overflow-y:auto;border:1px solid var(--border);border-radius:8px;padding:6px}
.aitem{display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:7px;cursor:pointer;border:1.5px solid transparent;transition:background .1s}
.aitem:hover{background:#F2F3F5}
.aitem.sel{border-color:var(--c);background:#F2F3F5}

/* ── Color picker ── */
.cg{display:flex;gap:8px;flex-wrap:wrap;padding:4px 0}
.cs{width:28px;height:28px;border-radius:6px;cursor:pointer;border:2.5px solid transparent;transition:transform .1s}
.cs:hover{transform:scale(1.12)}
.cs.sel{border-color:var(--navy)}

/* ── Loading ── */
#wb-loading{display:flex;align-items:center;justify-content:center;min-height:100vh;flex-direction:column;gap:12px;background:var(--surface)}
.wb-sp{width:36px;height:36px;border:3px solid var(--border);border-top-color:var(--orange);border-radius:50%;animation:wb-spin .7s linear infinite}
@keyframes wb-spin{to{transform:rotate(360deg)}}

/* ── Login ── */
#wb-login{display:flex;align-items:center;justify-content:center;min-height:100vh;background:var(--surface);padding:20px}
.wb-login-card{background:var(--white);border-radius:16px;border:1px solid var(--border);padding:36px 40px;width:420px;max-width:92vw;box-shadow:0 4px 24px rgba(56,68,78,.08)}
.wb-login-item{display:flex;align-items:center;gap:14px;padding:11px 14px;border-radius:10px;border:1px solid var(--border);cursor:pointer;margin-bottom:8px;transition:background .1s,border-color .1s;color:var(--text)}
.wb-login-item:hover{background:#F2F3F5;border-color:#c5ccd2}

/* ── Bell panel ── */
#wb-bell-btn{position:relative;flex-shrink:0}
#wb-bdot{position:absolute;top:4px;right:4px;width:8px;height:8px;border-radius:50%;background:var(--orange);border:1.5px solid #fff;display:none}
#wb-np{display:none;position:fixed;top:60px;right:16px;width:320px;background:var(--white);border:1px solid var(--border);border-radius:12px;box-shadow:0 8px 32px rgba(26,34,40,.12);z-index:150000;overflow:hidden}
#wb-np.open{display:block}

/* ── Search ── */
#wb-si{padding:6px 12px;border-radius:8px;border:1px solid var(--border);font-size:12px;width:160px;font-family:inherit;outline:none;background:var(--surface);color:var(--text);transition:border-color .15s}
#wb-si:focus{border-color:var(--orange);background:var(--white)}
#wb-si::placeholder{color:var(--text-muted)}

/* ── Empty state ── */
.wb-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 20px;gap:14px;text-align:center;color:var(--text)}
.wb-empty svg{stroke:#C8CDD1}

/* ── Toast notifications ── */
#wb-toast-container{position:fixed;bottom:24px;right:24px;z-index:400000;display:flex;flex-direction:column;gap:10px;pointer-events:none;max-width:340px}
.wb-toast{background:#fff;border-radius:12px;box-shadow:0 4px 24px rgba(26,34,40,.15),0 0 0 1px rgba(26,34,40,.06);overflow:hidden;pointer-events:auto;animation:wb-toast-in .3s cubic-bezier(.34,1.56,.64,1) forwards;min-width:300px;max-width:340px}
.wb-toast.removing{animation:wb-toast-out .25s ease forwards}
.wb-toast-accent{height:4px;width:100%}
.wb-toast-body{padding:12px 14px 10px;display:flex;gap:12px;align-items:flex-start}
.wb-toast-icon{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.wb-toast-content{flex:1;min-width:0}
.wb-toast-title{font-size:13px;font-weight:700;color:#1A2228;margin-bottom:3px}
.wb-toast-msg{font-size:12px;color:#3D4F5C;line-height:1.5}
.wb-toast-time{font-size:11px;color:#9CA3AF;margin-top:4px}
.wb-toast-close{background:none;border:none;font-size:16px;cursor:pointer;color:#9CA3AF;padding:0;line-height:1;flex-shrink:0;margin-top:1px}
.wb-toast-close:hover{color:#38444E}
.wb-toast-progress{height:3px;background:#F2F3F5;overflow:hidden}
.wb-toast-progress-bar{height:100%;animation:wb-shrink 6s linear forwards}
@keyframes wb-toast-in{from{opacity:0;transform:translateY(20px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes wb-toast-out{from{opacity:1;transform:translateY(0) scale(1)}to{opacity:0;transform:translateY(10px) scale(.95)}}
@keyframes wb-shrink{from{width:100%}to{width:0%}}

/* ── Scrollbar ── */
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}
::-webkit-scrollbar-thumb:hover{background:#b0b8c0}

/* ── Password screen ── */
#wb-pw-screen{background:rgba(26,34,40,.55)!important}
