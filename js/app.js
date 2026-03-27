// =============================================
// app.js — 부산러너 메인 앱 로직
// courses.js가 먼저 로드되어야 함
// =============================================

// ── 다국어 ───────────────────────────────────────────────────────────
const T={ko:{
appName:'부산러너',subtitle:'부산을 달리는 러너들의 커뮤니티',enterNick:'닉네임을 입력하세요',nickPH:'예: 해운대러너🏃',start:'시작하기 →',
total:'전체 코스',noSig:'신호없는',result:'검색 결과',noSigOnly:'신호없는 코스만 보기',noSigDesc:'끊김 없이 달릴 수 있는 코스',
diff:'난이도',dist:'거리',vibe:'분위기',sort:'정렬',all:'전체',easy:'쉬움',med:'보통',hard:'어려움',
short:'~5km',mid:'5~10km',long:'10km+',scenic:'경치',quiet:'조용',beach:'해변',trail:'트레일',urban:'도심',night:'야경',
rec:'추천순',byRate:'평점순',byLike:'좋아요순',byDist:'거리순',
noResult:'조건에 맞는 코스가 없어요',adjust:'필터를 조정해보세요!',
back:'← 뒤로',noSigBadge:'🚫 신호없는 코스',diffL:'난이도',distL:'거리',elevL:'고도차',surfL:'노면',
like:'좋아요',rating:'평점',ppl:'명',cmtTitle:'💬 댓글',cmtPH:'이 코스 어떠셨나요?',submit:'등록',
firstCmt:'첫 댓글을 남겨보세요!',more:'개 더 보기',
tabHome:'코스',tabRec:'추천코스',tabRun:'러닝',tabGroup:'같이달려요',tabMy:'MY',
startRun:'러닝 시작',pause:'일시정지',resume:'이어달리기',stop:'종료',
distKm:'거리(km)',time:'시간',pace:'페이스',selCourse:'코스를 선택하세요',
grTitle:'같이 달려요 🤝',createGr:'모임 만들기',join:'참가',leave:'취소',
members:'명 참가',maxM:'정원',runDate:'날짜',paceL:'페이스',grTitleIn:'모임 제목',
grDesc:'설명',create:'만들기',cancel:'취소',
recTitle:'추천코스 📝',writeRec:'코스 등록',recName:'코스 이름',recDesc:'코스 설명',
recDist:'거리(km)',recElev:'고도차(m)',recSurf:'노면',recDiff:'난이도',recTags:'태그',
recMapGuide:'지도를 탭하여 출발점을 지정하세요',recLatLng:'위치 좌표',
recSortNew:'최신순',recSortPop:'인기순',noRec:'아직 추천코스가 없어요',firstRec:'첫 번째 코스를 등록해보세요!',
comingSoon:'Coming Soon',runRecord:'내 러닝 기록',expandArea:'지역 확장',
footer:'달리는 당신이 아름답습니다',ver:'부산러너 v1.0',langSw:'English',
dupErr:'이미 사용 중인 닉네임이에요 다른 이름을 입력해 주세요',dupChecking:'확인 중...',
nickLabel:'러너 이름',nickPH2:'나만의 러너 이름을 입력하세요',startBtn2:'입장하기 →',
},en:{
appName:'Busan Runner',subtitle:'Running community for Busan runners',enterNick:'Enter your nickname',nickPH:'e.g. RunnerKim🏃',start:'Get Started →',
total:'All Courses',noSig:'Signal-free',result:'Results',noSigOnly:'Signal-free only',noSigDesc:'No traffic lights',
diff:'Difficulty',dist:'Distance',vibe:'Vibe',sort:'Sort',all:'All',easy:'Easy',med:'Medium',hard:'Hard',
short:'~5km',mid:'5~10km',long:'10km+',scenic:'Scenic',quiet:'Quiet',beach:'Beach',trail:'Trail',urban:'Urban',night:'Night',
rec:'Recommended',byRate:'Top Rated',byLike:'Most Liked',byDist:'Distance',
noResult:'No matching courses',adjust:'Try adjusting filters!',
back:'← Back',noSigBadge:'🚫 Signal-free',diffL:'Difficulty',distL:'Distance',elevL:'Elevation',surfL:'Surface',
like:'Like',rating:'Rating',ppl:'ppl',cmtTitle:'💬 Comments',cmtPH:'How was this course?',submit:'Post',
firstCmt:'Be the first to comment!',more:' more',
tabHome:'Courses',tabRec:'Picks',tabRun:'Run',tabGroup:'Group',tabMy:'MY',
startRun:'Start Run',pause:'Pause',resume:'Resume',stop:'Finish',
distKm:'Dist(km)',time:'Time',pace:'Pace',selCourse:'Select a course',
grTitle:'Group Run 🤝',createGr:'Create Group',join:'Join',leave:'Leave',
members:' joined',maxM:'Max',runDate:'Date',paceL:'Pace',grTitleIn:'Title',
grDesc:'Description',create:'Create',cancel:'Cancel',
recTitle:'Picks 📝',writeRec:'Add Course',recName:'Course name',recDesc:'Description',
recDist:'Distance(km)',recElev:'Elevation(m)',recSurf:'Surface',recDiff:'Difficulty',recTags:'Tags',
recMapGuide:'Tap map to set start point',recLatLng:'Coordinates',
recSortNew:'Newest',recSortPop:'Popular',noRec:'No picks yet',firstRec:'Be the first to share!',
comingSoon:'Coming Soon',runRecord:'My Records',expandArea:'More Areas',
footer:'You are beautiful when you run',ver:'Busan Runner v1.0',langSw:'한국어',
dupErr:'This name is already taken. Try another!',dupChecking:'Checking...',
nickLabel:'Runner Name',nickPH2:'Enter your unique runner name',startBtn2:'Enter →',
}};

// ── 상태 ─────────────────────────────────────────────────────────────
let S={
  lang:'ko',tab:'home',nickname:'',userId:null,loaded:false,
  courses:[],likes:{},ratings:{},comments:{},
  recCourses:[],recLikes:{},recComments:{},
  groupRuns:[],myRecords:[],
  filters:{signal:'noSignal',difficulty:'all',distance:'all',vibe:'all'},
  sortBy:'rec',selectedCourse:null,selectedType:null,
  showAllCmt:false,
  gpsState:'idle',gpsWatch:null,gpsCoords:[],gpsDist:0,gpsElapsed:0,gpsTimer:null,
  modal:null,
  recSort:'new',
  recFormLat:35.15,recFormLng:129.06,
};

// ── 유틸 ─────────────────────────────────────────────────────────────
const $=id=>document.getElementById(id);
const gl=(k,d)=>{try{return JSON.parse(localStorage.getItem('br_'+k))||d}catch{return d}};
const sl=(k,v)=>{try{localStorage.setItem('br_'+k,JSON.stringify(v))}catch{}};
const uid=()=>Math.random().toString(36).slice(2,9);
function timeAgo(ts){const d=Date.now()-ts,m=Math.floor(d/6e4);if(m<1)return S.lang==='ko'?'방금':'now';if(m<60)return m+(S.lang==='ko'?'분 전':'m');const h=Math.floor(m/60);if(h<24)return h+(S.lang==='ko'?'시간 전':'h');const dy=Math.floor(h/24);return dy+(S.lang==='ko'?'일 전':'d')}
function fmtTime(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function fmtPace(d,s){if(!d)return'--:--';const p=s/d;return Math.floor(p/60)+"'"+String(Math.floor(p%60)).padStart(2,'0')+'"'}
function calcDist(a,b){const R=6371e3,r=Math.PI/180,dL=(b.lat-a.lat)*r,dG=(b.lng-a.lng)*r;const x=Math.sin(dL/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dG/2)**2;return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))}
function t(k){return T[S.lang][k]||k}
function cn(c){return S.lang==='ko'?(c.name_ko||c.name):(c.name_en||c.name_ko||c.name)}
function ca(c){return S.lang==='ko'?(c.area_ko||c.area||''):(c.area_en||c.area_ko||c.area||'')}
function cd(c){return S.lang==='ko'?(c.description_ko||c.desc||''):(c.description_en||c.description_ko||c.desc||'')}
function cs(c){return S.lang==='ko'?(c.surface_ko||c.surface||''):(c.surface_en||c.surface_ko||c.surface||'')}
const DM={easy:{ko:'쉬움',en:'Easy',c:'#10b981'},medium:{ko:'보통',en:'Medium',c:'#f59e0b'},hard:{ko:'어려움',en:'Hard',c:'#ef4444'}};
function cdf(c){const d=DM[c.difficulty]||DM.easy;return S.lang==='ko'?d.ko:d.en}
function cdc(c){return(DM[c.difficulty]||DM.easy).c}
const TM={no_signal:{ko:'신호없는',en:'Signal-free'},scenic:{ko:'경치좋은',en:'Scenic'},quiet:{ko:'조용한',en:'Quiet'},beach:{ko:'해변',en:'Beach'},trail:{ko:'트레일',en:'Trail'},urban:{ko:'도심',en:'Urban'},night:{ko:'야경',en:'Night'},nature:{ko:'자연',en:'Nature'}};
function tl(tag){const m=TM[tag];return m?(S.lang==='ko'?m.ko:m.en):tag}

// ── 좋아요/평점/댓글 헬퍼 ────────────────────────────────────────────
function gLk(id){return Object.keys(S.likes).filter(k=>k.startsWith(id+':')).length}
function iLk(id){return!!(S.userId&&S.likes[id+':'+S.userId])}
function gAv(id){const e=Object.entries(S.ratings).filter(([k])=>k.startsWith(id+':'));if(!e.length)return 0;return e.reduce((s,[,v])=>s+v,0)/e.length}
function gRc(id){return Object.entries(S.ratings).filter(([k])=>k.startsWith(id+':')).length}
function gMr(id){return(S.userId&&S.ratings[id+':'+S.userId])||0}
function gCm(id){return(S.comments[id]||[]).sort((a,b)=>b.ts-a.ts)}
function rLk(id){return Object.keys(S.recLikes).filter(k=>k.startsWith(id+':')).length}
function riLk(id){return!!(S.userId&&S.recLikes[id+':'+S.userId])}
function rCm(id){return(S.recComments[id]||[]).sort((a,b)=>b.ts-a.ts)}

// ── API ───────────────────────────────────────────────────────────────
async function api(action,params={}){try{const r=await fetch('/.netlify/functions/api',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...params})});if(!r.ok)return null;return await r.json()}catch{return null}}

// ── Supabase 동기화 ───────────────────────────────────────────────────
async function syncFromServer(){
  const courses=await api('getCourses');
  if(courses&&Array.isArray(courses)&&courses.length){S.courses=courses}
  const recs=await api('getRecCourses');
  if(recs&&Array.isArray(recs)){S.recCourses=recs.map(r=>({id:r.id,name:r.name,name_ko:r.name,name_en:r.name,area:r.area||'',area_ko:r.area||'',area_en:r.area||'',desc:r.description||'',description_ko:r.description||'',description_en:r.description||'',distance:r.distance,elevation:r.elevation||0,difficulty:r.difficulty||'easy',surface:r.surface||'',surface_ko:r.surface||'',surface_en:r.surface||'',tags:r.tags||[],no_signal:r.no_signal||false,emoji:r.emoji||'📍',color:r.color||'#059669',lat:r.lat,lng:r.lng,route_coords:r.route_coords||[],author:r.author_nickname||'',ts:new Date(r.created_at).getTime()}))}
  const likes=await api('getLikes');
  if(likes&&Array.isArray(likes)){S.likes={};likes.forEach(l=>{S.likes[l.course_id+':'+l.user_id]=true})}
  const rlikes=await api('getRecLikes');
  if(rlikes&&Array.isArray(rlikes)){S.recLikes={};rlikes.forEach(l=>{S.recLikes[l.rec_course_id+':'+l.user_id]=true})}
  const ratings=await api('getRatings');
  if(ratings&&Array.isArray(ratings)){S.ratings={};ratings.forEach(r=>{S.ratings[r.course_id+':'+r.user_id]=r.score})}
  const comments=await api('getComments');
  if(comments&&Array.isArray(comments)){S.comments={};comments.forEach(c=>{if(!S.comments[c.course_id])S.comments[c.course_id]=[];S.comments[c.course_id].push({id:c.id,user:c.nickname,text:c.body,ts:new Date(c.created_at).getTime()})})}
  const rcmts=await api('getRecComments');
  if(rcmts&&Array.isArray(rcmts)){S.recComments={};rcmts.forEach(c=>{if(!S.recComments[c.rec_course_id])S.recComments[c.rec_course_id]=[];S.recComments[c.rec_course_id].push({id:c.id,user:c.nickname,text:c.body,ts:new Date(c.created_at).getTime()})})}
  const groups=await api('getGroupRuns');
  if(groups&&Array.isArray(groups)){S.groupRuns=groups.map(g=>({id:g.id,course_id:g.course_id,title:g.title_ko||g.title_en||'',description:g.description_ko||'',run_date:g.run_date,max_members:g.max_members||10,pace:g.pace||'',host_nickname:g.host_nickname,members:(g.group_run_members||[]).map(m=>({nickname:m.nickname,user_id:m.user_id})),host_id:g.host_id}))}
  if(S.userId){const records=await api('getMyRecords',{user_id:S.userId});if(records&&Array.isArray(records)){S.myRecords=records.map(r=>({course_id:r.course_id,distance:r.distance,duration:r.duration,avg_pace:r.avg_pace,ts:new Date(r.created_at).getTime()}))}}
}

// ── 필터/정렬 ─────────────────────────────────────────────────────────
function getFiltered(){
  const src=S.courses.length?S.courses:FC;
  let list=[...src];
  if(S.filters.signal==='noSignal')list=list.filter(c=>c.no_signal);
  if(S.filters.difficulty!=='all')list=list.filter(c=>c.difficulty===S.filters.difficulty);
  if(S.filters.distance==='short')list=list.filter(c=>c.distance<=5);
  else if(S.filters.distance==='mid')list=list.filter(c=>c.distance>5&&c.distance<=10);
  else if(S.filters.distance==='long')list=list.filter(c=>c.distance>10);
  if(S.filters.vibe!=='all')list=list.filter(c=>(c.tags||[]).includes(S.filters.vibe));
  if(S.sortBy==='byRate')list.sort((a,b)=>gAv(b.id)-gAv(a.id));
  else if(S.sortBy==='byLike')list.sort((a,b)=>gLk(b.id)-gLk(a.id));
  else if(S.sortBy==='byDist')list.sort((a,b)=>a.distance-b.distance);
  return list;
}

// =============================================
// 렌더 함수
// =============================================
function render(){
  const a=$('app');
  if(!S.nickname){a.innerHTML=rLogin();bLogin();return}
  let h='';
  if(S.modal==='detail'&&S.selectedCourse) h=rDetail();
  else if(S.modal==='writeRec') h=rWriteRec();
  else if(S.modal==='createGroup') h=rCreateGroup();
  else if(S.tab==='rec') h=rRecTab();
  else if(S.tab==='run') h=rRunTab();
  else if(S.tab==='group') h=rGroupTab();
  else if(S.tab==='my') h=rMyTab();
  else h=rHome();
  h+=rTabBar();
  a.innerHTML=h;
  bind();
  // 지도 초기화 (렌더 후)
  if(S.modal==='detail'&&S.selectedCourse){
    setTimeout(()=>initDetailMap(S.selectedCourse),100);
  }
  if(S.modal==='writeRec'){
    setTimeout(()=>{
      initRecFormMap(S.recFormLat,S.recFormLng,(lat,lng)=>{
        S.recFormLat=lat;S.recFormLng=lng;
        const el=$('recLatLngVal');
        if(el)el.textContent=`${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      });
    },100);
  }
  // 홈/추천 탭: 카드 미니맵 초기화
  if(!S.modal){
    const src=S.tab==='home'?(S.courses.length?S.courses:FC):S.recCourses;
    setTimeout(()=>{
      src.forEach((c,i)=>{
        setTimeout(()=>initCardMap('cardmap_'+c.id,c),i*80);
      });
    },200);
  }
}

// ── 로그인 화면 ───────────────────────────────────────────────────────
function rLogin(){
  return`<div class="splash-wrap">
  <div class="splash-bg"><div class="splash-wave"></div><div class="splash-wave splash-wave2"></div><div class="splash-city"></div></div>
  <div class="splash-content">
    <div class="splash-top"><button id="langBtn" class="splash-lang">${t('langSw')}</button></div>
    <div class="splash-hero">
      <div class="splash-logo-wrap">
        <svg class="splash-logo-svg" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" fill="white" fill-opacity="0.12" stroke="white" stroke-width="1.5" stroke-opacity="0.3"/>
          <text x="40" y="52" text-anchor="middle" font-size="36" fill="white">🏃</text>
        </svg>
      </div>
      <h1 class="splash-title">부산러너</h1>
      <p class="splash-sub">BUSAN RUNNER</p>
      <div class="splash-tagline">${t('subtitle')}</div>
    </div>
    <div class="splash-stats">
      <div class="splash-stat-item"><span class="splash-stat-n">12</span><span class="splash-stat-l">코스</span></div>
      <div class="splash-stat-div"></div>
      <div class="splash-stat-item"><span class="splash-stat-n">GPS</span><span class="splash-stat-l">트래킹</span></div>
      <div class="splash-stat-div"></div>
      <div class="splash-stat-item"><span class="splash-stat-n">FREE</span><span class="splash-stat-l">무료</span></div>
    </div>
    <div class="splash-form">
      <div class="splash-form-label">${t('nickLabel')}</div>
      <div class="splash-input-wrap">
        <input id="nickIn" maxlength="12" placeholder="${t('nickPH2')}" class="splash-input" autocomplete="off" spellcheck="false">
        <div id="nickStatus" class="splash-nick-status"></div>
      </div>
      <div id="nickMsg" class="splash-nick-msg"></div>
      <button id="startBtn" class="splash-start-btn" disabled>${t('startBtn2')}</button>
    </div>
    <div class="splash-footer">달리는 부산을 느껴보세요 🌊</div>
  </div>
</div>`}

function bLogin(){
  const lb=$('langBtn');if(lb)lb.onclick=()=>{S.lang=S.lang==='ko'?'en':'ko';render()};
  const ni=$('nickIn'),startBtn=$('startBtn'),msg=$('nickMsg'),status=$('nickStatus');
  let checkTimer=null;
  function setStatus(type,text){
    if(msg)msg.textContent=text||'';
    if(status){status.className='splash-nick-status';if(type==='ok')status.innerHTML='✓';else if(type==='err')status.innerHTML='✗';else if(type==='checking')status.innerHTML='…';else status.innerHTML='';if(type)status.classList.add('sns-'+type);}
    if(startBtn)startBtn.disabled=type!=='ok';
  }
  async function checkNick(v){if(!v||v.length<2){setStatus('','');return}const res=await api('checkNickname',{nickname:v});if(res&&res.exists)setStatus('err',t('dupErr'));else setStatus('ok','');}
  if(ni){
    ni.oninput=()=>{clearTimeout(checkTimer);const v=ni.value.trim();if(!v||v.length<2){setStatus('','');return}setStatus('checking',t('dupChecking'));checkTimer=setTimeout(()=>checkNick(v),500)};
    ni.onkeydown=e=>{if(e.key==='Enter'&&startBtn&&!startBtn.disabled)startBtn.click()};
  }
  const go=async()=>{
    const v=ni?.value.trim();if(!v||v.length<2)return;if(startBtn)startBtn.disabled=true;
    const res=await api('createProfile',{nickname:v,lang:S.lang});
    if(res&&res.error==='duplicate'){setStatus('err',t('dupErr'));if(startBtn)startBtn.disabled=false;return;}
    const profile=res?.profile;if(profile){S.userId=profile.id;sl('userId',profile.id);}
    S.nickname=v;sl('nick',v);
    await syncFromServer();render();
  };
  if(startBtn)startBtn.onclick=go;
}

// ── 코스 카드 (카카오 미니맵 버전) ────────────────────────────────────
function rCourseCard(c,type,i){
  const isOff=type==='official';
  const lk=isOff?gLk(c.id):rLk(c.id);
  const av=isOff?gAv(c.id):0;
  const cm=isOff?gCm(c.id):rCm(c.id);
  const color=c.color||'#059669';
  const diffLabel=cdf(c);
  const diffColor=cdc(c);
  const visibleTags=(c.tags||[]).filter(tg=>tg!=='no_signal').slice(0,3);
  const delay=(i||0)*.06;
  const mapId='cardmap_'+c.id;

  return`
  <div data-open="${type}:${c.id}" class="course-card" style="animation-delay:${delay}s">
    <div class="cc-hero">
      <img class="cc-hero-img" src="${getCoursePhoto(c.id)}" alt="${cn(c)}" loading="lazy"
        onerror="this.style.display='none';this.parentNode.style.background='linear-gradient(135deg,${color}cc,${color}66)'">
      <div class="cc-hero-overlay"></div>
      <div class="cc-hero-top">
        ${c.no_signal?`<span class="cc-badge cc-badge-nosig">🚫 ${t('noSig')}</span>`:''}
        <span class="cc-badge" style="background:${diffColor}22;color:${diffColor};border:1px solid ${diffColor}44">${diffLabel}</span>
        ${!isOff?`<span class="cc-badge cc-badge-user">👤 ${c.author||''}</span>`:''}
      </div>
      <div class="cc-hero-bottom">
        <span class="cc-stat-pill">📍 ${ca(c)}</span>
        <span class="cc-stat-pill">▲${c.elevation||0}m</span>
      </div>
    </div>
    <div class="cc-body">
      <div class="cc-title-row">
        <div style="flex:1;min-width:0">
          <div class="cc-name">${cn(c)}</div>
          <div class="cc-surface">${cs(c)}</div>
        </div>
        <div class="cc-dist">${c.distance}<span>km</span></div>
      </div>
      <div class="cc-desc">${cd(c)}</div>
      ${visibleTags.length?`<div class="cc-tags">${visibleTags.map(tg=>`<span class="cc-tag" style="color:${color};background:${color}12;border:1px solid ${color}22">#${tl(tg)}</span>`).join('')}</div>`:''}

      <!-- ✅ 카카오 지도 미니맵 -->
      <div class="cc-route-map" id="${mapId}">
        <div class="map-loading">🗺️ 지도 로딩 중…</div>
      </div>

      <div class="cc-footer">
        <div class="cc-reactions">
          ${isOff&&av?`<span class="cc-react"><span style="color:#f59e0b">⭐</span> ${av.toFixed(1)} <span class="cc-react-sub">(${gRc(c.id)})</span></span>`:''}
          <span class="cc-react">❤️ ${lk}</span>
          <span class="cc-react">💬 ${cm.length}</span>
        </div>
        <span class="cc-view-btn" style="color:${color};background:${color}12;border:1px solid ${color}30">${S.lang==='ko'?'자세히 →':'View →'}</span>
      </div>
    </div>
  </div>`
}

// ── 홈 탭 ─────────────────────────────────────────────────────────────
function rHome(){
  const fc=getFiltered();
  const sigOn=S.filters.signal==='noSignal';
  return`<div style="padding-bottom:80px">
  <div style="background:linear-gradient(135deg,var(--g1),var(--g2));padding:28px 20px 24px;border-radius:0 0 32px 32px;color:#fff;position:relative;overflow:hidden">
    <div style="position:absolute;top:-20px;right:-20px;font-size:120px;opacity:.08;transform:rotate(-15deg)">🏃</div>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;position:relative;z-index:1">
      <div><h1 style="font-size:24px;font-weight:900;letter-spacing:-1px">${t('appName')} 🏃</h1><p style="font-size:12px;opacity:.9;margin-top:4px">${t('subtitle')}</p></div>
      <div style="display:flex;gap:6px">
        <button id="langT" style="background:rgba(255,255,255,.2);border-radius:10px;padding:4px 10px;font-size:11px;font-weight:600;color:#fff">${t('langSw')}</button>
        <div style="background:rgba(255,255,255,.2);border-radius:10px;padding:4px 10px;font-size:11px;font-weight:600">${S.nickname}</div>
      </div>
    </div>
    <div style="display:flex;gap:10px;margin-top:16px">
      ${[{n:(S.courses.length||FC.length),l:t('total')},{n:(S.courses.length?S.courses:FC).filter(c=>c.no_signal).length,l:t('noSig')},{n:fc.length,l:t('result')}].map(s=>`<div style="flex:1;background:rgba(255,255,255,.15);border-radius:14px;padding:10px 8px;text-align:center"><div style="font-size:20px;font-weight:800">${s.n}</div><div style="font-size:10px;opacity:.85;margin-top:2px">${s.l}</div></div>`).join('')}
    </div>
  </div>

  <div style="padding:16px 16px 0">
    <!-- 신호없는 코스 토글 -->
    <div data-action="toggleSig" style="background:#fff;border-radius:16px;padding:12px 14px;margin-bottom:12px;box-shadow:0 2px 12px rgba(0,0,0,.06);display:flex;align-items:center;justify-content:space-between">
      <div>
        <div style="font-size:13px;font-weight:700;color:#111">${t('noSigOnly')}</div>
        <div style="font-size:11px;color:var(--sub);margin-top:2px">${t('noSigDesc')}</div>
      </div>
      <div class="toggle-track" style="background:${sigOn?'var(--g1)':'#d1d5db'}">
        <div class="toggle-thumb" style="left:${sigOn?'20px':'2px'}"></div>
      </div>
    </div>

    <!-- 필터 -->
    <div style="background:#fff;border-radius:16px;padding:12px 14px;margin-bottom:12px;box-shadow:0 2px 12px rgba(0,0,0,.06)">
      ${[
        {k:'difficulty',l:t('diff'),opts:[['all',t('all')],['easy',t('easy')],['medium',t('med')],['hard',t('hard')]]},
        {k:'distance',l:t('dist'),opts:[['all',t('all')],['short',t('short')],['mid',t('mid')],['long',t('long')]]},
        {k:'vibe',l:t('vibe'),opts:[['all',t('all')],['scenic',t('scenic')],['quiet',t('quiet')],['beach',t('beach')],['trail',t('trail')],['urban',t('urban')],['night',t('night')]]},
      ].map(f=>`
        <div style="margin-bottom:8px">
          <div style="font-size:11px;font-weight:600;color:var(--sub);margin-bottom:5px">${f.l}</div>
          <div style="display:flex;gap:5px;flex-wrap:wrap">
            ${f.opts.map(([v,l])=>`<button data-filter="${f.k}:${v}" class="chip${S.filters[f.k]===v?' on':''}">${l}</button>`).join('')}
          </div>
        </div>
      `).join('')}
      <div style="margin-top:8px;padding-top:8px;border-top:1px solid #f3f4f6">
        <div style="font-size:11px;font-weight:600;color:var(--sub);margin-bottom:5px">${t('sort')}</div>
        <div style="display:flex;gap:5px;flex-wrap:wrap">
          ${[['rec',t('rec')],['byRate',t('byRate')],['byLike',t('byLike')],['byDist',t('byDist')]].map(([v,l])=>`<button data-sort="${v}" class="chip${S.sortBy===v?' on':''}">${l}</button>`).join('')}
        </div>
      </div>
    </div>
  </div>

  <!-- 코스 목록 -->
  <div style="padding:0 16px">
    ${fc.length
      ? fc.map((c,i)=>rCourseCard(c,'official',i)).join('')
      : `<div style="text-align:center;padding:40px;color:var(--sub)"><div style="font-size:32px;margin-bottom:8px">🔍</div><div style="font-size:14px;font-weight:600">${t('noResult')}</div><div style="font-size:12px;margin-top:4px">${t('adjust')}</div></div>`
    }
  </div>
</div>`}

// ── 상세 화면 ─────────────────────────────────────────────────────────
function rDetail(){
  const c=S.selectedCourse;
  const isOff=S.selectedType==='official';
  if(!c)return'';
  const color=c.color||'#059669';
  const lk=isOff?gLk(c.id):rLk(c.id);
  const liked=isOff?iLk(c.id):riLk(c.id);
  const av=isOff?gAv(c.id):0;
  const myR=isOff?gMr(c.id):0;
  const cm=isOff?gCm(c.id):rCm(c.id);
  const visibleCm=S.showAllCmt?cm:cm.slice(0,3);

  return`<div class="modal-overlay" data-action="closeModal">
  <div class="modal-content" onclick="event.stopPropagation()">
    <!-- 헤더 -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <button data-action="closeModal" style="background:none;font-size:20px;color:var(--sub)">←</button>
      <div style="font-size:14px;font-weight:700;color:#111">${cn(c)}</div>
      <div style="width:32px"></div>
    </div>

    <!-- ✅ 카카오 지도 (경로 표시) -->
    <div id="detailMap" style="width:100%;height:240px;border-radius:16px;overflow:hidden;background:#e8f5e9;border:1px solid #d1fae5;margin-bottom:16px">
      <div style="display:flex;align-items:center;justify-content:center;height:100%;color:#9ca3af;font-size:12px">🗺️ 지도 로딩 중…</div>
    </div>

    <!-- 코스 정보 -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
      ${[
        [t('distL'),c.distance+'km'],
        [t('elevL'),'▲'+c.elevation+'m'],
        [t('diffL'),cdf(c)],
        [t('surfL'),cs(c)],
      ].map(([l,v])=>`<div style="background:#f9fafb;border-radius:12px;padding:10px 12px"><div style="font-size:10px;color:var(--sub);font-weight:600">${l}</div><div style="font-size:14px;font-weight:800;margin-top:2px;color:#111">${v}</div></div>`).join('')}
    </div>

    <!-- 설명 -->
    <p style="font-size:13px;color:var(--txt);line-height:1.6;margin-bottom:14px">${cd(c)}</p>

    <!-- 태그 -->
    ${(c.tags||[]).length?`<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">${(c.tags||[]).map(tg=>`<span style="padding:4px 10px;border-radius:10px;font-size:11px;font-weight:700;color:${color};background:${color}15;border:1px solid ${color}25">#${tl(tg)}</span>`).join('')}</div>`:''}

    <!-- 좋아요 & 별점 -->
    <div style="display:flex;gap:10px;margin-bottom:16px">
      <button data-action="toggleLike" style="flex:1;padding:12px;border-radius:14px;background:${liked?color+'20':'#f3f4f6'};color:${liked?color:'var(--sub)'};font-size:13px;font-weight:700;border:2px solid ${liked?color:'transparent'};transition:all .2s">
        ${liked?'❤️':'🤍'} ${t('like')} ${lk}
      </button>
      ${isOff?`<div style="flex:1;background:#f3f4f6;border-radius:14px;padding:10px;text-align:center">
        <div style="font-size:10px;color:var(--sub);font-weight:600;margin-bottom:4px">${t('rating')}</div>
        <div style="display:flex;justify-content:center;gap:3px">
          ${[1,2,3,4,5].map(n=>`<button data-rate="${n}" style="font-size:20px;opacity:${myR>=n?1:.25};transition:opacity .1s">${myR>=n?'⭐':'☆'}</button>`).join('')}
        </div>
        ${av?`<div style="font-size:11px;color:var(--sub);margin-top:2px">${av.toFixed(1)} (${gRc(c.id)}${t('ppl')})</div>`:''}
      </div>`:''}
    </div>

    <!-- 댓글 -->
    <div style="margin-bottom:16px">
      <div style="font-size:14px;font-weight:800;margin-bottom:10px">${t('cmtTitle')}</div>
      <div style="display:flex;gap:8px;margin-bottom:10px">
        <input id="cmtIn" class="inp" style="flex:1;margin-top:0" placeholder="${t('cmtPH')}">
        <button data-action="submitCmt" style="padding:0 16px;background:${color};color:#fff;border-radius:12px;font-size:12px;font-weight:700;white-space:nowrap">${t('submit')}</button>
      </div>
      ${cm.length===0?`<div style="text-align:center;padding:20px;color:var(--dim);font-size:12px">${t('firstCmt')}</div>`:
        visibleCm.map(m=>`<div style="display:flex;gap:8px;margin-bottom:10px;align-items:flex-start">
          <div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,${color},${color}99);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;flex-shrink:0">${m.user[0]||'?'}</div>
          <div style="flex:1;background:#f9fafb;border-radius:12px;padding:8px 10px">
            <div style="font-size:11px;font-weight:700;color:#111">${m.user} <span style="color:var(--dim);font-weight:400">${timeAgo(m.ts)}</span></div>
            <div style="font-size:12px;color:var(--txt);margin-top:2px">${m.text}</div>
          </div>
        </div>`).join('')
      }
      ${cm.length>3&&!S.showAllCmt?`<button data-action="showMoreCmt" style="width:100%;padding:8px;background:#f3f4f6;border-radius:10px;font-size:12px;font-weight:600;color:var(--sub)">+${cm.length-3}${t('more')}</button>`:''}
    </div>
  </div>
</div>`}

// ── 추천코스 탭 ───────────────────────────────────────────────────────
function rRecTab(){
  const list=S.recSort==='new'?[...S.recCourses].sort((a,b)=>b.ts-a.ts):[...S.recCourses].sort((a,b)=>rLk(b.id)-rLk(a.id));
  return`<div style="padding-bottom:80px">
  <div style="background:linear-gradient(135deg,var(--g1),var(--g2));padding:28px 20px 20px;border-radius:0 0 32px 32px;color:#fff">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <h1 style="font-size:20px;font-weight:900">${t('recTitle')}</h1>
      <button data-action="openWriteRec" style="background:rgba(255,255,255,.2);color:#fff;border-radius:12px;padding:7px 14px;font-size:12px;font-weight:700">+ ${t('writeRec')}</button>
    </div>
    <div style="display:flex;gap:6px;margin-top:12px">
      <button data-recsort="new" class="chip${S.recSort==='new'?' on':''}" style="${S.recSort==='new'?'background:rgba(255,255,255,.95);color:var(--g1)':'background:rgba(255,255,255,.15);color:#fff'}">${t('recSortNew')}</button>
      <button data-recsort="pop" class="chip${S.recSort==='pop'?' on':''}" style="${S.recSort==='pop'?'background:rgba(255,255,255,.95);color:var(--g1)':'background:rgba(255,255,255,.15);color:#fff'}">${t('recSortPop')}</button>
    </div>
  </div>
  <div style="padding:16px">
    ${list.length?list.map((c,i)=>rCourseCard(c,'rec',i)).join(''):
    `<div style="text-align:center;padding:60px 20px;color:var(--sub)">
      <div style="font-size:40px;margin-bottom:12px">📝</div>
      <div style="font-size:15px;font-weight:700">${t('noRec')}</div>
      <div style="font-size:12px;margin-top:6px">${t('firstRec')}</div>
      <button data-action="openWriteRec" style="margin-top:16px;padding:10px 24px;background:var(--g1);color:#fff;border-radius:14px;font-size:13px;font-weight:700">+ ${t('writeRec')}</button>
    </div>`}
  </div>
</div>`}

// ── 러닝 탭 ───────────────────────────────────────────────────────────
function rRunTab(){
  const src=S.courses.length?S.courses:FC;
  const selC=S.gpsState!=='idle'&&S.selectedCourse?S.selectedCourse:null;
  return`<div style="padding-bottom:80px">
  <div style="background:linear-gradient(135deg,var(--g1),var(--g2));padding:28px 20px 20px;border-radius:0 0 32px 32px;color:#fff">
    <h1 style="font-size:20px;font-weight:900">🏃 러닝 트래킹</h1>
    <p style="font-size:12px;opacity:.8;margin-top:4px">GPS로 실시간 러닝 기록</p>
  </div>
  <div style="padding:16px">
    ${S.gpsState==='idle'?`
      <div class="card">
        <div style="font-size:13px;font-weight:700;margin-bottom:10px">${t('selCourse')}</div>
        <select id="courseSelect" class="inp" style="margin-top:0">
          <option value="">— 선택 —</option>
          ${src.map(c=>`<option value="${c.id}">${cn(c)} (${c.distance}km)</option>`).join('')}
        </select>
        <button data-action="startRun" style="width:100%;margin-top:12px;padding:14px;background:var(--g1);color:#fff;border-radius:14px;font-size:15px;font-weight:800">🏃 ${t('startRun')}</button>
      </div>
    `:`
      <div class="card" style="text-align:center">
        ${selC?`<div style="font-size:12px;font-weight:600;color:var(--g1);margin-bottom:8px">📍 ${cn(selC)}</div>`:''}
        <div style="display:flex;justify-content:space-around;margin:12px 0">
          <div class="gps-stat"><div class="val">${(S.gpsDist/1000).toFixed(2)}</div><div class="lbl">${t('distKm')}</div></div>
          <div class="gps-stat"><div class="val">${fmtTime(S.gpsElapsed)}</div><div class="lbl">${t('time')}</div></div>
          <div class="gps-stat"><div class="val">${fmtPace(S.gpsDist/1000,S.gpsElapsed)}</div><div class="lbl">${t('pace')}</div></div>
        </div>
        <div style="display:flex;gap:8px;margin-top:12px">
          ${S.gpsState==='running'?`<button data-action="pauseRun" style="flex:1;padding:12px;background:#f59e0b20;color:#f59e0b;border-radius:12px;font-size:13px;font-weight:700">⏸ ${t('pause')}</button>`:`<button data-action="resumeRun" style="flex:1;padding:12px;background:${`var(--g1)`}20;color:var(--g1);border-radius:12px;font-size:13px;font-weight:700">▶ ${t('resume')}</button>`}
          <button data-action="stopRun" style="flex:1;padding:12px;background:#ef444420;color:#ef4444;border-radius:12px;font-size:13px;font-weight:700">⏹ ${t('stop')}</button>
        </div>
      </div>
    `}
  </div>
</div>`}

// ── 같이달려요 탭 ─────────────────────────────────────────────────────
function rGroupTab(){
  return`<div style="padding-bottom:80px">
  <div style="background:linear-gradient(135deg,var(--g1),var(--g2));padding:28px 20px 20px;border-radius:0 0 32px 32px;color:#fff">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <h1 style="font-size:20px;font-weight:900">${t('grTitle')}</h1>
      <button data-action="openCreateGroup" style="background:rgba(255,255,255,.2);color:#fff;border-radius:12px;padding:7px 14px;font-size:12px;font-weight:700">+ ${t('createGr')}</button>
    </div>
  </div>
  <div style="padding:16px">
    ${S.groupRuns.length===0?`<div style="text-align:center;padding:60px 20px;color:var(--sub)"><div style="font-size:40px;margin-bottom:12px">🤝</div><div style="font-size:15px;font-weight:700">모임이 없어요</div><div style="font-size:12px;margin-top:6px">첫 모임을 만들어보세요!</div></div>`:
    S.groupRuns.map(g=>{
      const joined=g.members.some(m=>m.user_id===S.userId);
      const isHost=g.host_id===S.userId;
      const course=(S.courses.length?S.courses:FC).find(c=>c.id===g.course_id);
      return`<div class="card">
        <div style="font-size:15px;font-weight:800;margin-bottom:4px">${g.title}</div>
        ${course?`<div style="font-size:11px;color:var(--g1);font-weight:600;margin-bottom:6px">📍 ${cn(course)}</div>`:''}
        ${g.description?`<p style="font-size:12px;color:var(--sub);margin-bottom:8px">${g.description}</p>`:''}
        <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">
          ${g.run_date?`<span style="font-size:11px;background:#f3f4f6;border-radius:8px;padding:3px 8px;font-weight:600">📅 ${g.run_date}</span>`:''}
          ${g.pace?`<span style="font-size:11px;background:#f3f4f6;border-radius:8px;padding:3px 8px;font-weight:600">⚡ ${g.pace}</span>`:''}
          <span style="font-size:11px;background:#dcfce7;border-radius:8px;padding:3px 8px;font-weight:600;color:#059669">👥 ${g.members.length}/${g.max_members}${t('ppl')}</span>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:11px;color:var(--sub)">주최: ${g.host_nickname}</span>
          ${!isHost?`<button data-action="${joined?'leaveGroup':'joinGroup'}" data-gid="${g.id}" style="padding:7px 16px;border-radius:10px;font-size:12px;font-weight:700;background:${joined?'#fee2e2':'var(--g1)'};color:${joined?'#ef4444':'#fff'}">${joined?t('leave'):t('join')}</button>`:'<span style="font-size:11px;color:var(--g1);font-weight:600">주최자</span>'}
        </div>
      </div>`}).join('')}
  </div>
</div>`}

// ── MY 탭 ─────────────────────────────────────────────────────────────
function rMyTab(){
  return`<div style="padding-bottom:80px">
  <div style="background:linear-gradient(135deg,var(--g1),var(--g2));padding:28px 20px 20px;border-radius:0 0 32px 32px;color:#fff">
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#fff">${S.nickname[0]||'?'}</div>
      <div><div style="font-size:18px;font-weight:900">${S.nickname}</div><div style="font-size:11px;opacity:.8;margin-top:2px">부산러너 멤버</div></div>
    </div>
  </div>
  <div style="padding:16px">
    <div class="card">
      <div style="font-size:14px;font-weight:800;margin-bottom:12px">🏆 ${t('runRecord')}</div>
      ${S.myRecords.length===0?`<div style="text-align:center;padding:20px;color:var(--dim);font-size:13px">아직 러닝 기록이 없어요</div>`:
      S.myRecords.map(r=>{const c=(S.courses.length?S.courses:FC).find(x=>x.id===r.course_id);return`<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #f3f4f6">
        <div style="width:36px;height:36px;border-radius:10px;background:var(--g1)20;display:flex;align-items:center;justify-content:center;font-size:14px">🏃</div>
        <div style="flex:1"><div style="font-size:12px;font-weight:700">${c?cn(c):'코스'}</div><div style="font-size:11px;color:var(--sub)">${new Date(r.ts).toLocaleDateString('ko')}</div></div>
        <div style="text-align:right"><div style="font-size:13px;font-weight:800">${r.distance.toFixed(2)}km</div><div style="font-size:11px;color:var(--sub)">${fmtTime(r.duration)}</div></div>
      </div>`}).join('')}
    </div>
    <button data-action="logout" style="width:100%;padding:14px;background:#fee2e2;color:#ef4444;border-radius:14px;font-size:13px;font-weight:700;margin-top:8px">로그아웃</button>
  </div>
</div>`}

// ── 추천코스 등록 폼 ──────────────────────────────────────────────────
function rWriteRec(){
  return`<div class="modal-overlay" data-action="closeModal">
  <div class="modal-content" onclick="event.stopPropagation()">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <button data-action="closeModal" style="background:none;font-size:20px;color:var(--sub)">←</button>
      <div style="font-size:14px;font-weight:700">코스 등록</div>
      <div style="width:32px"></div>
    </div>
    <div style="margin-bottom:12px"><label class="lbl">${t('recName')}</label><input id="recNameIn" class="inp" placeholder="${t('recName')}"></div>
    <div style="margin-bottom:12px"><label class="lbl">${t('recDesc')}</label><textarea id="recDescIn" class="inp" rows="2" style="resize:none"></textarea></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
      <div><label class="lbl">${t('recDist')}</label><input id="recDistIn" class="inp" type="number" step="0.1" min="0.5"></div>
      <div><label class="lbl">${t('recElev')}</label><input id="recElevIn" class="inp" type="number" step="1" min="0"></div>
    </div>
    <div style="margin-bottom:12px">
      <label class="lbl">${t('recMapGuide')}</label>
      <div id="recMap" style="width:100%;height:200px;border-radius:12px;overflow:hidden;background:#e8f5e9;margin-top:4px"></div>
      <div id="recLatLngVal" style="font-size:11px;color:var(--sub);margin-top:4px;text-align:center">${S.recFormLat.toFixed(5)}, ${S.recFormLng.toFixed(5)}</div>
    </div>
    <button data-action="submitRec" style="width:100%;padding:14px;background:var(--g1);color:#fff;border-radius:14px;font-size:14px;font-weight:800">${t('create')}</button>
  </div>
</div>`}

// ── 모임 생성 폼 ──────────────────────────────────────────────────────
function rCreateGroup(){
  const src=S.courses.length?S.courses:FC;
  return`<div class="modal-overlay" data-action="closeModal">
  <div class="modal-content" onclick="event.stopPropagation()">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <button data-action="closeModal" style="background:none;font-size:20px;color:var(--sub)">←</button>
      <div style="font-size:14px;font-weight:700">${t('createGr')}</div>
      <div style="width:32px"></div>
    </div>
    <div style="margin-bottom:12px"><label class="lbl">${t('grTitleIn')}</label><input id="grTitleIn" class="inp" placeholder="예: 해운대 새벽 러닝 모임"></div>
    <div style="margin-bottom:12px"><label class="lbl">${t('grDesc')}</label><textarea id="grDescIn" class="inp" rows="2" style="resize:none" placeholder="모임 설명을 입력하세요"></textarea></div>
    <div style="margin-bottom:12px"><label class="lbl">코스 선택</label>
      <select id="grCourseIn" class="inp" style="margin-top:4px">
        <option value="">— 코스 선택 —</option>
        ${src.map(c=>`<option value="${c.id}">${cn(c)}</option>`).join('')}
      </select>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
      <div><label class="lbl">${t('runDate')}</label><input id="grDateIn" class="inp" type="date"></div>
      <div><label class="lbl">${t('maxM')}</label><input id="grMaxIn" class="inp" type="number" value="10" min="2" max="50"></div>
    </div>
    <div style="margin-bottom:16px"><label class="lbl">${t('paceL')}</label><input id="grPaceIn" class="inp" placeholder="예: 6:00/km"></div>
    <button data-action="submitGroup" style="width:100%;padding:14px;background:var(--g1);color:#fff;border-radius:14px;font-size:14px;font-weight:800">${t('create')}</button>
  </div>
</div>`}

// ── 탭바 ─────────────────────────────────────────────────────────────
function rTabBar(){
  const tabs=[
    {k:'home',icon:'🗺️',l:t('tabHome')},
    {k:'rec',icon:'📝',l:t('tabRec')},
    {k:'run',icon:'🏃',l:t('tabRun')},
    {k:'group',icon:'🤝',l:t('tabGroup')},
    {k:'my',icon:'👤',l:t('tabMy')},
  ];
  return`<div class="tab-bar">${tabs.map(tb=>`<button class="${S.tab===tb.k&&!S.modal?'active':''}" data-tab="${tb.k}">
    <span style="font-size:22px;line-height:1">${tb.icon}</span>
    <span>${tb.l}</span>
  </button>`).join('')}</div>`}

// ── 이벤트 바인딩 ─────────────────────────────────────────────────────
function bind(){
  // 언어 토글
  const lt=$('langT');if(lt)lt.onclick=()=>{S.lang=S.lang==='ko'?'en':'ko';render()};

  // 탭 전환
  document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{S.tab=b.dataset.tab;S.modal=null;S.selectedCourse=null;render()});

  // 코스 카드 열기
  document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{
    const [type,id]=b.dataset.open.split(':');
    const src=type==='official'?(S.courses.length?S.courses:FC):S.recCourses;
    const c=src.find(x=>x.id===id);
    if(c){S.selectedCourse=c;S.selectedType=type;S.modal='detail';S.showAllCmt=false;render()}
  });

  // 필터 칩
  document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{
    const [k,v]=b.dataset.filter.split(':');
    S.filters[k]=v;render();
  });
  // 정렬
  document.querySelectorAll('[data-sort]').forEach(b=>b.onclick=()=>{S.sortBy=b.dataset.sort;render()});
  // 신호없는 토글
  document.querySelectorAll('[data-action="toggleSig"]').forEach(b=>b.onclick=()=>{S.filters.signal=S.filters.signal==='noSignal'?'all':'noSignal';render()});

  // 추천코스 정렬
  document.querySelectorAll('[data-recsort]').forEach(b=>b.onclick=()=>{S.recSort=b.dataset.recsort;render()});

  // 모달 열기/닫기
  document.querySelectorAll('[data-action="closeModal"]').forEach(b=>b.onclick=()=>{S.modal=null;S.selectedCourse=null;render()});
  document.querySelectorAll('[data-action="openWriteRec"]').forEach(b=>b.onclick=()=>{S.modal='writeRec';render()});
  document.querySelectorAll('[data-action="openCreateGroup"]').forEach(b=>b.onclick=()=>{S.modal='createGroup';render()});

  // 좋아요
  const likeBtn=document.querySelector('[data-action="toggleLike"]');
  if(likeBtn)likeBtn.onclick=async()=>{
    if(!S.userId||!S.selectedCourse)return;
    const c=S.selectedCourse,isOff=S.selectedType==='official';
    const key=c.id+':'+S.userId;
    const action=isOff?(iLk(c.id)?'unlike':'like'):(riLk(c.id)?'unreclike':'reclike');
    if(isOff){if(iLk(c.id))delete S.likes[key];else S.likes[key]=true;}
    else{if(riLk(c.id))delete S.recLikes[key];else S.recLikes[key]=true;}
    render();
    await api(action,{course_id:c.id,rec_course_id:c.id,user_id:S.userId});
  };

  // 별점
  document.querySelectorAll('[data-rate]').forEach(b=>b.onclick=async()=>{
    if(!S.userId||!S.selectedCourse)return;
    const n=parseInt(b.dataset.rate),c=S.selectedCourse;
    S.ratings[c.id+':'+S.userId]=n;render();
    await api('rate',{course_id:c.id,user_id:S.userId,score:n});
  });

  // 댓글
  const submitCmt=document.querySelector('[data-action="submitCmt"]');
  if(submitCmt)submitCmt.onclick=async()=>{
    const el=$('cmtIn');if(!el||!el.value.trim())return;
    const text=el.value.trim(),c=S.selectedCourse,isOff=S.selectedType==='official';
    const cmt={id:uid(),user:S.nickname,text,ts:Date.now()};
    if(isOff){if(!S.comments[c.id])S.comments[c.id]=[];S.comments[c.id].push(cmt);}
    else{if(!S.recComments[c.id])S.recComments[c.id]=[];S.recComments[c.id].push(cmt);}
    render();
    await api(isOff?'comment':'reccomment',{course_id:c.id,rec_course_id:c.id,user_id:S.userId,nickname:S.nickname,body:text});
  };
  const showMore=document.querySelector('[data-action="showMoreCmt"]');
  if(showMore)showMore.onclick=()=>{S.showAllCmt=true;render()};

  // 러닝
  const startRun=document.querySelector('[data-action="startRun"]');
  if(startRun)startRun.onclick=()=>{
    const sel=$('courseSelect');
    const cid=sel?.value;
    if(cid){const c=(S.courses.length?S.courses:FC).find(x=>x.id===cid);S.selectedCourse=c;}
    S.gpsState='running';S.gpsCoords=[];S.gpsDist=0;S.gpsElapsed=0;
    S.gpsTimer=setInterval(()=>{S.gpsElapsed++;const el=document.querySelector('.gps-stat .val');},1000);
    if(navigator.geolocation){S.gpsWatch=navigator.geolocation.watchPosition(pos=>{const p={lat:pos.coords.latitude,lng:pos.coords.longitude};if(S.gpsCoords.length)S.gpsDist+=calcDist(S.gpsCoords[S.gpsCoords.length-1],p);S.gpsCoords.push(p);},null,{enableHighAccuracy:true,maximumAge:1000});}
    render();
  };
  const pauseRun=document.querySelector('[data-action="pauseRun"]');
  if(pauseRun)pauseRun.onclick=()=>{S.gpsState='paused';clearInterval(S.gpsTimer);if(S.gpsWatch)navigator.geolocation.clearWatch(S.gpsWatch);render()};
  const resumeRun=document.querySelector('[data-action="resumeRun"]');
  if(resumeRun)resumeRun.onclick=()=>{
    S.gpsState='running';
    S.gpsTimer=setInterval(()=>{S.gpsElapsed++;},1000);
    if(navigator.geolocation){S.gpsWatch=navigator.geolocation.watchPosition(pos=>{const p={lat:pos.coords.latitude,lng:pos.coords.longitude};if(S.gpsCoords.length)S.gpsDist+=calcDist(S.gpsCoords[S.gpsCoords.length-1],p);S.gpsCoords.push(p);},null,{enableHighAccuracy:true,maximumAge:1000});}
    render();
  };
  const stopRun=document.querySelector('[data-action="stopRun"]');
  if(stopRun)stopRun.onclick=async()=>{
    clearInterval(S.gpsTimer);if(S.gpsWatch)navigator.geolocation.clearWatch(S.gpsWatch);
    if(S.gpsDist>100&&S.userId){
      await api('saveRecord',{user_id:S.userId,course_id:S.selectedCourse?.id||null,distance:S.gpsDist/1000,duration:S.gpsElapsed,avg_pace:fmtPace(S.gpsDist/1000,S.gpsElapsed)});
      await syncFromServer();
    }
    S.gpsState='idle';S.gpsCoords=[];S.gpsDist=0;S.gpsElapsed=0;S.gpsTimer=null;S.gpsWatch=null;render();
  };

  // 그룹 참가/취소
  document.querySelectorAll('[data-action="joinGroup"]').forEach(b=>b.onclick=async()=>{
    const gid=b.dataset.gid;const g=S.groupRuns.find(x=>x.id===gid);
    if(!g||!S.userId)return;
    g.members.push({nickname:S.nickname,user_id:S.userId});render();
    await api('joinGroup',{group_id:gid,user_id:S.userId,nickname:S.nickname});
  });
  document.querySelectorAll('[data-action="leaveGroup"]').forEach(b=>b.onclick=async()=>{
    const gid=b.dataset.gid;const g=S.groupRuns.find(x=>x.id===gid);
    if(!g||!S.userId)return;
    g.members=g.members.filter(m=>m.user_id!==S.userId);render();
    await api('leaveGroup',{group_id:gid,user_id:S.userId});
  });

  // 추천코스 등록
  const submitRec=document.querySelector('[data-action="submitRec"]');
  if(submitRec)submitRec.onclick=async()=>{
    const name=$('recNameIn')?.value.trim();
    const desc=$('recDescIn')?.value.trim();
    const dist=parseFloat($('recDistIn')?.value)||0;
    const elev=parseInt($('recElevIn')?.value)||0;
    if(!name||!dist)return alert('코스 이름과 거리를 입력하세요');
    const res=await api('createRecCourse',{name,description:desc,distance:dist,elevation:elev,lat:S.recFormLat,lng:S.recFormLng,author_nickname:S.nickname,user_id:S.userId});
    if(res){await syncFromServer();S.modal=null;S.tab='rec';render();}
  };

  // 모임 생성
  const submitGroup=document.querySelector('[data-action="submitGroup"]');
  if(submitGroup)submitGroup.onclick=async()=>{
    const title=$('grTitleIn')?.value.trim();
    const desc=$('grDescIn')?.value.trim();
    const courseId=$('grCourseIn')?.value;
    const date=$('grDateIn')?.value;
    const max=parseInt($('grMaxIn')?.value)||10;
    const pace=$('grPaceIn')?.value.trim();
    if(!title)return alert('모임 제목을 입력하세요');
    const res=await api('createGroupRun',{title_ko:title,description_ko:desc,course_id:courseId,run_date:date,max_members:max,pace,host_nickname:S.nickname,host_id:S.userId});
    if(res){await syncFromServer();S.modal=null;S.tab='group';render();}
  };

  // 로그아웃
  const logoutBtn=document.querySelector('[data-action="logout"]');
  if(logoutBtn)logoutBtn.onclick=()=>{
    if(!confirm('로그아웃 하시겠어요?'))return;
    S.nickname='';S.userId=null;localStorage.removeItem('br_nick');localStorage.removeItem('br_userId');render();
  };
}

// ── 초기화 ────────────────────────────────────────────────────────────
(async()=>{
  // 보안
  document.addEventListener('contextmenu',e=>e.preventDefault());
  document.addEventListener('dragstart',e=>e.preventDefault());
  document.addEventListener('keydown',e=>{if(e.key==='F12'||(e.ctrlKey&&e.shiftKey&&['I','J','C'].includes(e.key))||(e.ctrlKey&&e.key==='u'))e.preventDefault()});

  // 저장된 세션 복원
  S.nickname=gl('nick','')||'';
  S.userId=gl('userId',null);
  S.lang=gl('lang','ko')||'ko';

  if(S.nickname){
    render(); // 먼저 로딩 상태로 보여주기
    await syncFromServer();
  }
  render();
})();
