class Component extends DCLogic {
  T = DCI.T;
  LOC = DCI.LOC;
  TOOL = 'pdf-to-word';
  state = Object.assign({ view:'desktop', toast:'', seo:false, narrow:typeof window!=='undefined'&&window.innerWidth<760 }, this.init ? this.init() : {});

  componentDidMount(){ this.track('tool_view'); if(this.fromShare){ try{ const r=new URLSearchParams(location.search).get('r'); if(r) this.fromShare(JSON.parse(decodeURIComponent(escape(atob(r))))); }catch(e){} } this._rs=()=>{ const n=window.innerWidth<760; if(n!==this.state.narrow) this.setState({ narrow:n }); }; window.addEventListener('resize',this._rs); this._rs(); try{ const v=localStorage.getItem('acproto:view'); if(v && v!==this.state.view) this.setState({view:v}); }catch(e){} if(this.mount) this.mount(); }
  componentWillUnmount(){ clearTimeout(this._tt); window.removeEventListener('resize',this._rs); if(this.unmount) this.unmount(); }
  setView(v){ this.setState({view:v}); try{ localStorage.setItem('acproto:view',v); }catch(e){} }
  toast(msg){ this.setState({toast:msg}); clearTimeout(this._tt); this._tt=setTimeout(()=>this.setState({toast:''}),1800); }
  fallbackCopy(t){ const ta=document.createElement('textarea'); ta.value=t; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); }catch(e){} ta.remove(); }
  copy(text,msg){ const done=()=>this.toast(msg||this.T.copied); try{ navigator.clipboard.writeText(text).then(done,()=>{ this.fallbackCopy(text); done(); }); }catch(e){ this.fallbackCopy(text); done(); } }
  download(name,data,mime){ const b=data instanceof Blob?data:new Blob([data],{type:mime||'text/plain'}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),2000); this.toast(this.T.downloaded+': '+name); }
  opts(list,cur,set,labels){ return list.map((v,i)=>{ const on=Array.isArray(cur)?cur.indexOf(v)>-1:v===cur; return { label:labels?labels[i]:String(v), value:v, on, onClick:()=>set(v), bg:on?'#b5412b':'#fff', fg:on?'#fff':'#1f1a17', bd:on?'#b5412b':'#d9cfc3', tbd:on?'#b5412b':'transparent', soft:on?'#f6e6e0':'#fff', softFg:on?'#8f2f1d':'#1f1a17' }; }); }
  sw(on){ return { track:on?'#b5412b':'#d9cfc3', knob:on?'19px':'3px' }; }
  num(v){ const n=parseFloat(String(v).replace(',','.')); return isFinite(n)?n:0; }
  fmt(n,d,loc){ return new Intl.NumberFormat(loc||this.LOC,{minimumFractionDigits:d==null?2:d,maximumFractionDigits:d==null?2:d}).format(n); }
  on(key){ return (e)=>{ if(!this._ts){ this._ts=1; this.track('tool_input_started'); } this.setState({[key]:e && e.target ? (e.target.type==='checkbox'?e.target.checked:e.target.value) : e}); }; }
  track(ev,p){ try{ (window.dataLayer=window.dataLayer||[]).push(Object.assign({ event:ev, tool_id:this.TOOL, language:this.LOC.slice(0,2) },p||{})); }catch(e){} }
  renderVals(){ const nr=!!this.state.narrow; const m=nr||this.state.view==='mobile';
    const base={ isMobile:m, isDesktop:!m, notNarrow:!nr, outerPad:nr?'0 0 0':'14px 16px 64px', frameMax:nr?'100%':m?'390px':'1280px', frameRadius:nr?'0px':m?'32px':'14px', frameShadow:nr?'none':m?'0 0 0 10px #1f1a17, 0 24px 60px rgba(0,0,0,.28)':'0 0 0 1px #e6ded4, 0 20px 60px rgba(31,26,23,.12)', padX:m?'16px':'40px', h1Size:m?'30px':'46px', frameTop:nr?'0px':m?'12px':'0px', heroPad:m?'20px 16px 18px':'36px 40px 30px', gridCols:m?'1fr':'minmax(0,1fr) 300px', stepCols:m?'1fr':'repeat(3,minmax(0,1fr))', featCols:m?'1fr':'repeat(2,minmax(0,1fr))', relCols:m?'1fr':'repeat(3,minmax(0,1fr))',
      viewSeg:this.opts(['desktop','mobile'],this.state.view,v=>this.setView(v),['Desktop','Mobile']),
      seoOpen:!!this.state.seo, toggleSeo:()=>this.setState({seo:!this.state.seo}),
      toastOn:!!this.state.toast, toastMsg:this.state.toast, onFaq:()=>this.track('faq_expanded'), onRel:()=>this.track('related_tool_clicked'), onLang:()=>this.track('language_switched') };
    return Object.assign(base, this.vals?this.vals(m):{}); }


  pdfInit(extra){ return Object.assign({ doc:null, stage:'empty', prog:0, dz:false, err:'', result:null }, extra||{}); }
  mkPages(n){ const out=[]; for(let i=1;i<=n;i++){ const blank=i===6&&n>=8; const dup=i===4&&n>=8; const seed=dup?3:i; const lines=blank?[]:[0,1,2,3,4,5].map(k=>(40+((seed*37+k*23)%55))+'%'); out.push({n:i,blank,dup,lines}); } return out; }
  loadSample(name,pages,kb){ this.setState({ err:'', stage:'reading' }); setTimeout(()=>{ this.setState({ doc:{ name:name||'sample-8-pages.pdf', pages:pages||8, size:kb?kb*1024:122880 }, stage:'config' }); if(this.onDoc) this.onDoc(); }, 450); }
  readFile(file){ if(!file) return; if(!/\.pdf$/i.test(file.name) && file.type!=='application/pdf'){ const ext=(file.name.split('.').pop()||'').toLowerCase(); this.setState({ err:this.pdfErr?this.pdfErr(ext):'This file is a .'+ext+'. Choose a PDF.' }); return; }
    this.setState({ err:'', stage:'reading' }); const r=new FileReader(); r.onload=()=>{ const t=r.result||''; const m=t.match(/\/Type\s*\/Page(?!s)/g); const pages=Math.max(1,Math.min(m?m.length:1,60)); this.setState({ doc:{ name:file.name, pages, size:file.size }, stage:'config' }); if(this.onDoc) this.onDoc(); }; r.readAsBinaryString(file.slice(0, Math.min(file.size, 30*1024*1024))); }
  kb(b){ return b>1048576 ? this.fmt(b/1048576,1)+' MB' : Math.max(1,Math.round(b/1024))+' KB'; }
  run(ms, done){ this.setState({ stage:'working', prog:0 }); const t0=Date.now(); clearInterval(this._pi); this._pi=setInterval(()=>{ const p=Math.min(1,(Date.now()-t0)/ms); this.setState({ prog:p }); if(p>=1){ clearInterval(this._pi); this.setState({ stage:'done', result:done() }); } }, 60); }
  cancel(){ clearInterval(this._pi); this.setState({ stage:'config', prog:0 }); }
  reset(){ clearInterval(this._pi); this.setState(Object.assign({ doc:null, stage:'empty', prog:0, err:'', result:null }, this.resetExtra?this.resetExtra():{})); }
  pdfVals(){ const s=this.state; return {
    isEmpty:s.stage==='empty'||s.stage==='reading', isReading:s.stage==='reading', isConfig:s.stage==='config', isWorking:s.stage==='working', isDone:s.stage==='done', hasDoc:!!s.doc, hasErr:!!s.err, err:s.err,
    docName:s.doc?s.doc.name:'', docMeta:s.doc?(s.doc.pages+' '+(this.PAGES||'pages')+' · '+this.kb(s.doc.size)):'', progW:Math.round(s.prog*100)+'%', progPct:Math.round(s.prog*100)+'%',
    dzBd:s.dz?'#b5412b':'#d2c6b8', dzBg:s.dz?'#f6e6e0':'#fbf9f6',
    dzOver:(e)=>{ e.preventDefault(); if(!this.state.dz) this.setState({dz:true}); }, dzLeave:()=>this.setState({dz:false}), dzDrop:(e)=>{ e.preventDefault(); this.setState({dz:false}); const f=e.dataTransfer&&e.dataTransfer.files; if(f&&f.length) this.readFiles?this.readFiles(f):this.readFile(f[0]); },
    onFile:(e)=>{ const f=e.target.files; if(f&&f.length) this.readFiles?this.readFiles(f):this.readFile(f[0]); e.target.value=''; },
    onCancel:()=>this.cancel(), onReset:()=>this.reset(), onChange:()=>this.setState({stage:'config',result:null}) }; }


  init(){ return this.pdfInit({ mode:'flow', ocr:false, rng:'', ol:0 }); }
  parseRange(t,n){ t=String(t||'').trim(); if(!t) return { ok:true, list:null }; const out=[]; for(const part of t.split(/[,;\s]+/).filter(Boolean)){ const m=part.match(/^(\d+)(?:[-–](\d+))?$/); if(!m) return { ok:false }; const a=+m[1], b=m[2]?+m[2]:a; if(a<1||b>n||a>b) return { ok:false }; for(let i=a;i<=b;i++) if(out.indexOf(i)<0) out.push(i); } return { ok:true, list:out }; }
  pdfErr(e){ return L.bad(e); }
  vals(){ const s=this.state, d=s.doc; this.PAGES=L.pages; const tot=d?d.pages:0; const pr=this.parseRange(s.rng,tot); const n=pr.ok&&pr.list?pr.list.length:tot;
    return Object.assign(this.pdfVals(),{ onSample:()=>this.loadSample('annual-report.pdf',8,412),
      modeSeg:this.opts(['flow','exact'],s.mode,v=>this.setState({ mode:v }),L.modes), modeHint:L.hints[s.mode==='flow'?0:1], rng:s.rng, onRng:this.on('rng'), rngHint:L.rangeHint(tot), rngBad:!pr.ok, canRun:pr.ok, ocrOn:s.ocr, langOpts:L.langs.map((x,i)=>({ v:String(i), label:x })), olV:String(s.ol), onOl:(e)=>this.setState({ ol:+e.target.value }), ocrSw:this.sw(s.ocr), togOcr:()=>this.setState({ ocr:!s.ocr }),
      onRun:()=>this.run(s.ocr?3200:1800,()=>({ name:d.name.replace(/\.pdf$/i,'')+'.docx', meta:L.meta(n) })),
      workLabel:L.work(Math.max(1,Math.ceil(s.prog*n)),n), resTitle:s.result?s.result.name:'', resMeta:s.result?s.result.meta:'',
      onDownload:()=>this.download(s.result.name.replace(/\.docx$/,'.doc'),'<html><body><h1>'+d.name+'</h1><p>'+L.sim+'</p></body></html>','application/msword') }); }

}
