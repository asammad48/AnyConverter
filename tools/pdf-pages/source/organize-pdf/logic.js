class Component extends DCLogic {
  T = DCI.T;
  LOC = DCI.LOC;
  TOOL = 'organize-pdf';
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


  mount(){ this.libs(); }
  unmount(){ this._dead=1; this._cx=1; }
  libs(){ return new Promise(res=>{ const ok=()=>window.PDFLib&&window.pdfjsLib; const go=()=>{ if(!window.pdfjsLib.GlobalWorkerOptions.workerSrc) window.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js'; res(); }; if(ok()) return go(); const t=setInterval(()=>{ if(ok()){ clearInterval(t); go(); } },80); }); }
  xInit(x){ return Object.assign({ files:[], th:{}, stage:'empty', prog:0, plabel:'', err:'', dz:false, res:null, loading:false }, x||{}); }
  kb(b){ return b>=1048576 ? this.fmt(b/1048576,b>=10485760?1:2)+' MB' : Math.max(1,Math.round(b/1024))+' KB'; }
  base(n){ return String(n||'document').replace(/\.pdf$/i,'').replace(/[\\/:*?"<>|]+/g,'').trim().replace(/\s+/g,'-')||'document'; }
  range1(n){ const a=[]; for(let i=1;i<=n;i++) a.push(i); return a; }
  toR(arr){ const r=[]; let i=0; while(i<arr.length){ let j=i; while(j+1<arr.length&&arr[j+1]===arr[j]+1) j++; r.push(i===j?String(arr[i]):arr[i]+'-'+arr[j]); i=j+1; } return r.join(', '); }
  parseList(t,n){ t=String(t||'').trim(); if(!t) return this.range1(n); const set={}; for(const part of t.split(/[,;]+/).map(x=>x.replace(/\s+/g,'')).filter(Boolean)){ const m=part.match(/^(\d+)(?:[-–](\d+))?$/); if(!m) return null; let a=+m[1], b=m[2]?+m[2]:a; if(a>b){ const x=a; a=b; b=x; } if(a<1||b>n) return null; for(let i=a;i<=b;i++) set[i]=1; } return Object.keys(set).map(Number).sort((a,b)=>a-b); }
  tick(){ return new Promise(r=>setTimeout(r,0)); }
  async pdims(doc){ const d=[]; for(let i=1;i<=doc.numPages;i++){ const v=(await doc.getPage(i)).getViewport({ scale:1 }); d.push([v.width,v.height]); } return d; }
  prot(rot,w,h){ return { tf:'rotate('+rot+'deg)'+(rot%180?' scale('+Math.min(1,(w/h)).toFixed(3)+')':''), ar:w+' / '+h }; }
  pnoop(){ return { ds:()=>{}, dov:()=>{}, dr:()=>{} }; }
  async addPdfs(list,sample){ const arr=Array.from(list||[]); if(!arr.length){ this.setState({ loading:false }); return; } this.setState({ err:'', loading:true }); await this.libs();
    for(const f of (this.MULTI?arr:arr.slice(0,1))){
      if(!sample && !/\.pdf$/i.test(f.name) && f.type!=='application/pdf'){ this.setState({ err:PX.bad((f.name.split('.').pop()||'?').toLowerCase()) }); continue; }
      let bytes, doc; try{ bytes=new Uint8Array(await f.arrayBuffer()); doc=await window.pdfjsLib.getDocument({ data:bytes.slice() }).promise; }catch(e){ this.setState({ err:e&&e.name==='PasswordException'?PX.locked(f.name):PX.broken(f.name) }); continue; }
      if(!this.MULTI) this._drop();
      const id='f'+(this._pv=(this._pv||0)+1)+'_'+Date.now(); (this._docs=this._docs||{})[id]=doc;
      const it={ id, name:f.name, size:bytes.length, bytes, n:doc.numPages, skip:[] };
      this.setState(s=>({ files:this.MULTI?s.files.concat([it]):[it], th:this.MULTI?s.th:{}, stage:'ready', res:null }));
      this.thumbs(id,doc); }
    this.setState({ loading:false }); if(this.onFiles) this.onFiles(); }
  _drop(){ (this.state.files||[]).forEach(f=>this._kill(f.id)); }
  _kill(id){ const d=this._docs&&this._docs[id]; if(d){ try{ d.destroy(); }catch(e){} delete this._docs[id]; } }
  async thumbs(id,doc){ for(let i=1;i<=Math.min(doc.numPages,300);i++){ if(this._dead||!this._docs[id]) return; try{ const c=await this.draw(doc,i,150,'w'); const b=await new Promise(r=>c.toBlob(r,'image/jpeg',.72)); c.width=1; const u=URL.createObjectURL(b); this.setState(s=>({ th:Object.assign({},s.th,{ [id+':'+i]:u }) })); }catch(e){ return; } } }
  async draw(doc,i,v,by){ const pg=await doc.getPage(i); const v1=pg.getViewport({ scale:1 }); const sc=by==='w'?v/v1.width:v/72; const vp=pg.getViewport({ scale:sc }); const c=document.createElement('canvas'); c.width=Math.max(1,Math.round(vp.width)); c.height=Math.max(1,Math.round(vp.height)); const x=c.getContext('2d'); x.fillStyle='#fff'; x.fillRect(0,0,c.width,c.height); await pg.render({ canvasContext:x, viewport:vp }).promise; c._pw=v1.width; c._ph=v1.height; return c; }
  async makeSample(o){ await this.libs(); const P=window.PDFLib, d=await P.PDFDocument.create(); const fb=await d.embedFont(P.StandardFonts.HelveticaBold), fr=await d.embedFont(P.StandardFonts.Helvetica); let img=null; const col=o.color||[0.71,0.25,0.17];
    if(o.photo){ const c=document.createElement('canvas'); c.width=1600; c.height=1000; const x=c.getContext('2d'); const g=x.createLinearGradient(0,0,1600,1000); g.addColorStop(0,'#e9a48f'); g.addColorStop(.55,'#c9b18a'); g.addColorStop(1,'#3b5ba5'); x.fillStyle=g; x.fillRect(0,0,1600,1000); x.fillStyle='rgba(31,26,23,.55)'; x.beginPath(); x.moveTo(0,700); for(let k=0;k<=10;k++) x.lineTo(160*k,620+70*Math.sin(k*1.3)); x.lineTo(1600,1000); x.lineTo(0,1000); x.fill(); const im=x.getImageData(0,0,1600,1000), a=im.data; for(let k=0;k<a.length;k+=4){ const r=(Math.random()-.5)*46; a[k]+=r; a[k+1]+=r; a[k+2]+=r; } x.putImageData(im,0,0); const b=await new Promise(r=>c.toBlob(r,'image/jpeg',.97)); img=await d.embedJpg(new Uint8Array(await b.arrayBuffer())); }
    for(let i=1;i<=o.pages;i++){ const p=d.addPage([595.28,841.89]); if(o.blank&&o.blank.indexOf(i)>-1) continue; if(o.land&&o.land.indexOf(i)>-1){ p.setRotation(P.degrees(90)); } p.drawRectangle({ x:0,y:p.getHeight()-80,width:p.getWidth(),height:80,color:P.rgb(col[0],col[1],col[2]) }); p.drawText(o.title,{ x:48,y:p.getHeight()-50,size:22,font:fb,color:P.rgb(1,1,1) }); p.drawText(PX.samplePage(i,o.pages),{ x:48,y:p.getHeight()-114,size:12,font:fr,color:P.rgb(.37,.34,.31) });
      let y=p.getHeight()-142; if(img){ p.drawImage(img,{ x:48,y:384,width:499.28,height:312 }); y=350; }
      for(let k=0;k<(img?12:24);k++) p.drawRectangle({ x:48,y:y-k*22,width:380+((i*37+k*53)%120),height:7,color:P.rgb(.88,.85,.81) });
      p.drawText(String(i),{ x:p.getWidth()/2-12,y:52,size:44,font:fb,color:P.rgb(col[0],col[1],col[2]) }); }
    d.setTitle(o.title); const bytes=await d.save(); return new File([bytes],o.name,{ type:'application/pdf' }); }
  async job(fn){ this._cx=0; this.setState({ stage:'working', prog:0, plabel:'', err:'' }); this.track('tool_calculate'); await this.tick();
    try{ const res=await fn((p,label)=>{ if(this._cx) throw new Error('cx'); this.setState({ prog:Math.max(0,Math.min(1,p)), plabel:label||this.state.plabel }); });
      res.items.forEach(it=>{ it.size=it.blob.size; if(/^image\//.test(it.blob.type)) it.url=URL.createObjectURL(it.blob); });
      this.setState({ stage:'done', res, prog:1 }); this.track('file_ready'); }
    catch(e){ console.warn(e); this.setState({ stage:'ready', prog:0, err:e&&e.message==='cx'?PX.cancelled:PX.fail }); } }
  saveAll(){ const r=this.state.res; if(!r) return; const it=r.items; if(it.length===1) return this.download(it[0].name,it[0].blob); const z=new window.JSZip(); it.forEach(i=>z.file(i.name,i.blob)); z.generateAsync({ type:'blob' }).then(b=>this.download(r.zip||'anyconverter.zip',b)); }
  resetAll(){ this._cx=1; this._drop(); this.setState(Object.assign({ files:[], th:{}, stage:'empty', res:null, err:'', prog:0, loading:false }, this.resetExtra?this.resetExtra():{})); }
  xVals(){ const s=this.state, f0=s.files[0], r=s.res; const items=r?r.items:[];
    return { isEmpty:!s.files.length, hasFiles:s.files.length>0, isReading:!!s.loading, hasErr:!!s.err, err:s.err,
      isReady:s.files.length>0&&s.stage==='ready', isWorking:s.stage==='working', isDone:s.stage==='done'&&!!r, notDone:s.stage!=='done',
      progW:Math.round(s.prog*100)+'%', progPct:Math.round(s.prog*100)+'%', workLabel:s.plabel,
      dzBd:s.dz?'#b5412b':'#d2c6b8', dzBg:s.dz?'#f6e6e0':'#fbf9f6',
      dzOver:(e)=>{ e.preventDefault(); if(!this.state.dz) this.setState({ dz:true }); }, dzLeave:()=>this.setState({ dz:false }),
      dzDrop:(e)=>{ e.preventDefault(); this.setState({ dz:false }); const f=e.dataTransfer&&e.dataTransfer.files; if(f&&f.length) this.addPdfs(Array.from(f)); },
      onFile:(e)=>{ const f=e.target.files; if(f&&f.length) this.addPdfs(Array.from(f)); e.target.value=''; },
      onSample:()=>{ this.setState({ loading:true, err:'' }); this.sample(); },
      docName:f0?f0.name:'', docMeta:f0?PX.pages(f0.n)+' · '+this.kb(f0.size):'', docBgi:f0&&s.th[f0.id+':1']?'url('+s.th[f0.id+':1']+')':'none',
      onReset:()=>this.resetAll(), onCancel:()=>{ this._cx=1; }, onChange:()=>this.setState({ stage:'ready', res:null }),
      resTitle:r?r.title:'', resMeta:r?r.meta:'', hasNote:!!(r&&r.note), resNote:r&&r.note?r.note:'', multiRes:items.length>1,
      resRows:items.map(it=>({ name:it.name, meta:it.meta||this.kb(it.size), bgi:it.url?'url('+it.url+')':'none', tag:it.url?'':'PDF', dl:()=>this.download(it.name,it.blob) })),
      dlMain:()=>this.saveAll(), dlLabel:items.length>1?PX.dlAll:PX.dl }; }


  init(){ return this.xInit({ ord:[], sel:'', hist:[], dims:[] }); }
  resetExtra(){ return { ord:[], sel:'', hist:[] }; }
  sample(){ this.makeSample({ name:L.sname, pages:6, title:L.stitle }).then(f=>this.addPdfs([f],true)); }
  async onFiles(){ const f=this.state.files[0]; if(!f) return; const dims=await this.pdims(this._docs[f.id]); this._k=0; this.setState({ dims, hist:[], sel:'', ord:this.range1(f.n).map(p=>({ k:'k'+(this._k++), p, rot:0, blank:false, copy:false })) }); }
  put(ord,sel){ this.setState(s=>({ hist:s.hist.concat([s.ord]).slice(-50), ord, sel:sel===undefined?s.sel:sel, stage:'ready', res:null })); }
  idx(){ return this.state.ord.findIndex(o=>o.k===this.state.sel); }
  mv(d){ const i=this.idx(), o=this.state.ord.slice(), j=i+d; if(i<0||j<0||j>=o.length) return; const t=o[i]; o[i]=o[j]; o[j]=t; this.put(o); }
  collate(rev){ const o=this.state.ord.slice(), h=Math.ceil(o.length/2), fr=o.slice(0,h), bk=o.slice(h); if(rev) bk.reverse(); const out=[]; for(let i=0;i<h;i++){ out.push(fr[i]); if(bk[i]) out.push(bk[i]); } this.put(out,''); }
  async save(){ const s=this.state, f=s.files[0], P=window.PDFLib, ord=s.ord.slice();
    await this.job(async(pr)=>{ const src=await P.PDFDocument.load(f.bytes,{ ignoreEncryption:true }), out=await P.PDFDocument.create(); const real=ord.filter(o=>!o.blank); const cp=await out.copyPages(src,real.map(o=>o.p-1)); let ci=0, last=src.getPage(0).getSize();
      for(let i=0;i<ord.length;i++){ if(i%10===0){ pr(i/ord.length,L.work(i+1,ord.length)); await this.tick(); } const o=ord[i];
        if(o.blank){ out.addPage([last.width,last.height]); continue; } const pg=cp[ci++]; last=pg.getSize(); if(o.rot) pg.setRotation(P.degrees(((pg.getRotation().angle+o.rot)%360+360)%360)); out.addPage(pg); }
      const bn=this.base(f.name); out.setTitle(bn); out.setProducer('AnyConverter'); const b=await out.save({ useObjectStreams:true });
      return { items:[{ name:bn+'-'+L.suffix+'.pdf', blob:new Blob([b],{ type:'application/pdf' }) }], title:bn+'-'+L.suffix+'.pdf', meta:L.resMeta(ord.length,this.kb(b.length)) }; }); }
  vals(){ const s=this.state, f=s.files[0], i=this.idx(), cur=s.ord[i];
    return Object.assign(this.xVals(),{
      grid:s.ord.map((o,j)=>{ const d=s.dims[o.p-1]||[595,842], on=o.k===s.sel, u=!o.blank&&f&&s.th[f.id+':'+o.p], r=this.prot(o.rot,d[0],d[1]); return { n:o.blank?'—':String(o.p), bgi:u?'url('+u+')':'none', tf:r.tf, ar:r.ar, op:1, bd:on?'#b5412b':'transparent', tag:o.blank?L.blankT:o.copy?L.copyT:'', tagBg:o.blank||o.copy?'#efe9e2':'transparent', tagFg:'#5f564f', mark:on?'✓':'', markBg:on?'#b5412b':'transparent', pressed:on?'true':'false', aria:o.blank?L.blankT:L.pageA(o.p),
        onClick:()=>this.setState({ sel:on?'':o.k }), ds:(e)=>{ this._drag=o.k; try{ e.dataTransfer.effectAllowed='move'; e.dataTransfer.setData('text/plain',o.k); }catch(x){} }, dov:(e)=>e.preventDefault(),
        dr:(e)=>{ e.preventDefault(); const from=s.ord.findIndex(x=>x.k===this._drag); if(from<0||from===j) return; const a=s.ord.slice(), m=a.splice(from,1)[0]; a.splice(j,0,m); this.put(a,m.k); } }; }),
      hasSel:!!cur, noSel:!cur, selLabel:cur?(cur.blank?L.blankT:L.sel(cur.p)):'', count:L.count(s.ord.length), canUndo:s.hist.length>0, undoOp:s.hist.length?1:.4,
      doL:()=>this.mv(-1), doR:()=>this.mv(1), doRot:()=>{ const o=s.ord.map(x=>x.k===s.sel?Object.assign({},x,{ rot:(x.rot+90)%360 }):x); this.put(o); },
      doDup:()=>{ const o=s.ord.slice(); o.splice(i+1,0,Object.assign({},cur,{ k:'k'+(this._k++), copy:true })); this.put(o); },
      doBlank:()=>{ const o=s.ord.slice(); o.splice(i+1,0,{ k:'k'+(this._k++), p:cur.p, rot:0, blank:true }); this.put(o); },
      doDel:()=>{ if(s.ord.length<2) return; this.put(s.ord.filter(x=>x.k!==s.sel),''); },
      doUndo:()=>{ if(!s.hist.length) return; this.setState({ ord:s.hist[s.hist.length-1], hist:s.hist.slice(0,-1), sel:'', stage:'ready', res:null }); },
      doRev:()=>this.put(s.ord.slice().reverse()), doReset:()=>this.onFiles(), doScanA:()=>this.collate(true), doScanB:()=>this.collate(false), onRun:()=>this.save() }); }

}
