// =============================================
// courses.js — 코스 데이터 + 지도 관련 유틸
// =============================================

// ── 공식 코스 데이터 ──────────────────────────────────────────────────
const FC=[
{id:'c01',name_ko:'해운대 문탠로드',name_en:'Moontan Road',area_ko:'해운대',area_en:'Haeundae',distance:3.2,difficulty:'easy',tags:['no_signal','scenic','beach'],no_signal:true,description_ko:'달맞이고개~송정 해안 산책로. 차도 완전 분리, 신호 제로!',description_en:'Coastal trail from Dalmaji to Songjeong. Zero traffic lights!',elevation:45,surface_ko:'포장도로',surface_en:'Paved',emoji:'🌊',color:'#0ea5e9',lat:35.1633,lng:129.1856,route_coords:[{lat:35.1633,lng:129.1856},{lat:35.161,lng:129.189},{lat:35.159,lng:129.194},{lat:35.158,lng:129.198},{lat:35.157,lng:129.201},{lat:35.1588,lng:129.204}]},
{id:'c02',name_ko:'낙동강 하구 둑길',name_en:'Nakdong River Trail',area_ko:'사하/강서',area_en:'Saha/Gangseo',distance:12,difficulty:'medium',tags:['no_signal','quiet','nature'],no_signal:true,description_ko:'낙동강 하구둑~을숙도. 철새도래지, 완전 비신호.',description_en:'Flat trail along Nakdong estuary. Bird sanctuary.',elevation:5,surface_ko:'자전거도로',surface_en:'Bike path',emoji:'🦅',color:'#10b981',lat:35.067,lng:128.943,route_coords:[{lat:35.067,lng:128.943},{lat:35.070,lng:128.947},{lat:35.072,lng:128.950},{lat:35.076,lng:128.952},{lat:35.081,lng:128.955},{lat:35.086,lng:128.952},{lat:35.09,lng:128.948}]},
{id:'c03',name_ko:'이기대 해안 산책로',name_en:'Igidae Coastal Trail',area_ko:'남구',area_en:'Nam-gu',distance:5.5,difficulty:'hard',tags:['no_signal','scenic','trail'],no_signal:true,description_ko:'오륙도~이기대 절벽 트레일. 뷰가 압도적.',description_en:'Cliffside trail from Oryukdo to Igidae.',elevation:180,surface_ko:'비포장+데크',surface_en:'Unpaved+Deck',emoji:'⛰️',color:'#f59e0b',lat:35.1058,lng:129.1228,route_coords:[{lat:35.1058,lng:129.1228},{lat:35.104,lng:129.120},{lat:35.103,lng:129.118},{lat:35.102,lng:129.115},{lat:35.101,lng:129.112},{lat:35.099,lng:129.109},{lat:35.098,lng:129.107}]},
{id:'c04',name_ko:'온천천 시민공원',name_en:'Oncheoncheon Park',area_ko:'동래/연제',area_en:'Dongnae',distance:7,difficulty:'easy',tags:['no_signal','quiet','urban'],no_signal:true,description_ko:'온천천~시민공원. 도심 속 신호없는 평지, 야간 조명.',description_en:'Stream-side to Citizens Park. Flat, lit, no signals.',elevation:10,surface_ko:'우레탄트랙',surface_en:'Urethane',emoji:'🏃',color:'#8b5cf6',lat:35.187,lng:129.063,route_coords:[{lat:35.187,lng:129.063},{lat:35.185,lng:129.062},{lat:35.182,lng:129.060},{lat:35.179,lng:129.059},{lat:35.176,lng:129.058},{lat:35.173,lng:129.057},{lat:35.171,lng:129.056}]},
{id:'c05',name_ko:'광안리~민락수변공원',name_en:'Gwangalli Beach Run',area_ko:'수영',area_en:'Suyeong',distance:4,difficulty:'easy',tags:['scenic','beach','night'],no_signal:false,description_ko:'광안대교 야경 러닝. 저녁 추천!',description_en:'Run with Gwangan Bridge night views.',elevation:3,surface_ko:'포장도로',surface_en:'Paved',emoji:'🌉',color:'#ec4899',lat:35.1531,lng:129.1187,route_coords:[{lat:35.1531,lng:129.1187},{lat:35.152,lng:129.121},{lat:35.152,lng:129.124},{lat:35.151,lng:129.128},{lat:35.152,lng:129.131},{lat:35.153,lng:129.134}]},
{id:'c06',name_ko:'갈맷길 1코스(태종대)',name_en:'Taejongdae Trail',area_ko:'영도',area_en:'Yeongdo',distance:8.5,difficulty:'hard',tags:['no_signal','scenic','trail'],no_signal:true,description_ko:'태종대 순환. 차량통제, 절벽+등대 뷰.',description_en:'Taejongdae loop. Vehicle-free, cliff & lighthouse.',elevation:250,surface_ko:'포장+비포장',surface_en:'Mixed',emoji:'🏝️',color:'#14b8a6',lat:35.052,lng:129.084,route_coords:[{lat:35.052,lng:129.084},{lat:35.050,lng:129.082},{lat:35.049,lng:129.080},{lat:35.047,lng:129.077},{lat:35.046,lng:129.076},{lat:35.047,lng:129.073},{lat:35.05,lng:129.072}]},
{id:'c07',name_ko:'수영강 리버사이드',name_en:'Suyeong Riverside',area_ko:'수영/해운대',area_en:'Suyeong',distance:6,difficulty:'easy',tags:['no_signal','quiet','urban'],no_signal:true,description_ko:'수영강변~센텀. 평지, 신호없음.',description_en:'Riverside to Centum. Flat, signal-free.',elevation:5,surface_ko:'자전거도로',surface_en:'Bike path',emoji:'🌿',color:'#06b6d4',lat:35.169,lng:129.13,route_coords:[{lat:35.169,lng:129.130},{lat:35.171,lng:129.133},{lat:35.172,lng:129.136},{lat:35.174,lng:129.139},{lat:35.175,lng:129.141},{lat:35.176,lng:129.143},{lat:35.177,lng:129.145}]},
{id:'c08',name_ko:'장산 숲길 트레일',name_en:'Jangsan Forest Trail',area_ko:'해운대',area_en:'Haeundae',distance:9,difficulty:'hard',tags:['no_signal','quiet','trail'],no_signal:true,description_ko:'장산 둘레길. 숲속 트레일, 성취감 최고.',description_en:'Jangsan mountain loop. Deep forest trail.',elevation:350,surface_ko:'비포장 산길',surface_en:'Mountain path',emoji:'🌲',color:'#65a30d',lat:35.185,lng:129.168,route_coords:[{lat:35.185,lng:129.168},{lat:35.187,lng:129.170},{lat:35.188,lng:129.172},{lat:35.190,lng:129.174},{lat:35.191,lng:129.175},{lat:35.189,lng:129.177},{lat:35.187,lng:129.179}]},
{id:'c09',name_ko:'다대포~몰운대',name_en:'Dadaepo to Morundae',area_ko:'사하',area_en:'Saha',distance:5,difficulty:'medium',tags:['no_signal','scenic','beach'],no_signal:true,description_ko:'낙조분수~몰운대. 일몰 황금빛 힐링.',description_en:'Sunset fountain to Morundae. Golden healing.',elevation:60,surface_ko:'포장+데크',surface_en:'Paved+Deck',emoji:'🌅',color:'#f97316',lat:35.047,lng:128.966,route_coords:[{lat:35.047,lng:128.966},{lat:35.046,lng:128.963},{lat:35.045,lng:128.960},{lat:35.044,lng:128.957},{lat:35.043,lng:128.955},{lat:35.044,lng:128.952},{lat:35.046,lng:128.952}]},
{id:'c10',name_ko:'APEC나루공원',name_en:'APEC Naru Park',area_ko:'해운대',area_en:'Haeundae',distance:2.5,difficulty:'easy',tags:['quiet','urban','night'],no_signal:false,description_ko:'요트경기장 주변. 야경, 접근성 좋은 가벼운 코스.',description_en:'Marina park loop. Night views, easy.',elevation:2,surface_ko:'우레탄트랙',surface_en:'Urethane',emoji:'✨',color:'#a855f7',lat:35.1695,lng:129.1365,route_coords:[{lat:35.1695,lng:129.1365},{lat:35.1705,lng:129.138},{lat:35.171,lng:129.139},{lat:35.170,lng:129.140},{lat:35.1688,lng:129.139},{lat:35.1685,lng:129.1385}]},
{id:'c11',name_ko:'범어사~금정산성',name_en:'Beomeosa Fortress Trail',area_ko:'금정',area_en:'Geumjeong',distance:11,difficulty:'hard',tags:['no_signal','scenic','trail'],no_signal:true,description_ko:'범어사~금정산성. 부산 최고봉 경유.',description_en:'Temple to fortress. Busan peak accessible.',elevation:520,surface_ko:'비포장 산길',surface_en:'Mountain path',emoji:'🏯',color:'#dc2626',lat:35.284,lng:129.068,route_coords:[{lat:35.284,lng:129.068},{lat:35.286,lng:129.066},{lat:35.288,lng:129.064},{lat:35.290,lng:129.063},{lat:35.292,lng:129.061},{lat:35.294,lng:129.060},{lat:35.295,lng:129.060}]},
{id:'c12',name_ko:'송도 스카이워크',name_en:'Songdo Skywalk',area_ko:'서구',area_en:'Seo-gu',distance:3.8,difficulty:'medium',tags:['scenic','beach'],no_signal:false,description_ko:'송도~암남공원 데크. 바다 위 달리는 기분!',description_en:'Songdo deck trail. Run above the sea!',elevation:30,surface_ko:'데크+포장',surface_en:'Deck+Paved',emoji:'🌁',color:'#6366f1',lat:35.075,lng:129.019,route_coords:[{lat:35.075,lng:129.019},{lat:35.074,lng:129.017},{lat:35.073,lng:129.016},{lat:35.071,lng:129.015},{lat:35.070,lng:129.014},{lat:35.069,lng:129.013},{lat:35.068,lng:129.012}]}
];

// ── Unsplash 코스 사진 ────────────────────────────────────────────────
const COURSE_PHOTOS={
  c01:'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&h=140&fit=crop&auto=format&q=80',
  c02:'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&h=140&fit=crop&auto=format&q=80',
  c03:'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=140&fit=crop&auto=format&q=80',
  c04:'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=140&fit=crop&auto=format&q=80',
  c05:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=140&fit=crop&auto=format&q=80',
  c06:'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&h=140&fit=crop&auto=format&q=80',
  c07:'https://images.unsplash.com/photo-1468372954638-ed3d01ae9b08?w=400&h=140&fit=crop&auto=format&q=80',
  c08:'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=140&fit=crop&auto=format&q=80',
  c09:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=140&fit=crop&auto=format&q=80',
  c10:'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=140&fit=crop&auto=format&q=80',
  c11:'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=140&fit=crop&auto=format&q=80',
  c12:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=140&fit=crop&auto=format&q=80',
};
function getCoursePhoto(id){return COURSE_PHOTOS[id]||'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=140&fit=crop&auto=format&q=80'}

// ── 카드용 카카오 미니맵 초기화 ──────────────────────────────────────
// 카드의 .cc-kakao-map 컨테이너에 카카오 지도 + 경로선을 그린다
function initCardMap(containerId, course) {
  const el = document.getElementById(containerId);
  if (!el || !window.kakao || !kakao.maps) return;

  const coords = course.route_coords;
  if (!coords || coords.length < 2) return;

  // 중심 좌표 계산 (경로 중간점)
  const midIdx = Math.floor(coords.length / 2);
  const center = new kakao.maps.LatLng(coords[midIdx].lat, coords[midIdx].lng);

  // 좌표 범위로 적절한 줌 레벨 계산
  const lats = coords.map(p=>p.lat), lngs = coords.map(p=>p.lng);
  const latRange = Math.max(...lats) - Math.min(...lats);
  const lngRange = Math.max(...lngs) - Math.min(...lngs);
  const maxRange = Math.max(latRange, lngRange);
  let level = 4;
  if (maxRange > 0.1) level = 7;
  else if (maxRange > 0.05) level = 6;
  else if (maxRange > 0.02) level = 5;
  else if (maxRange > 0.01) level = 4;
  else level = 3;

  const map = new kakao.maps.Map(el, {
    center,
    level,
    draggable: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    keyboardShortcuts: false,
  });

  // 경로 좌표 배열
  const path = coords.map(p => new kakao.maps.LatLng(p.lat, p.lng));

  // 글로우 효과 (두꺼운 반투명 선)
  new kakao.maps.Polyline({
    map,
    path,
    strokeWeight: 10,
    strokeColor: course.color || '#059669',
    strokeOpacity: 0.2,
    strokeStyle: 'solid',
  });

  // 메인 경로선 (진한 선)
  new kakao.maps.Polyline({
    map,
    path,
    strokeWeight: 5,
    strokeColor: course.color || '#059669',
    strokeOpacity: 0.95,
    strokeStyle: 'solid',
  });

  // 출발 마커 (초록 원)
  const startOverlay = new kakao.maps.CustomOverlay({
    map,
    position: path[0],
    content: `<div style="width:14px;height:14px;border-radius:50%;background:${course.color||'#059669'};border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35);margin:-7px 0 0 -7px"></div>`,
    zIndex: 3,
  });

  // 도착 마커 (흰색 테두리 + 색상 내부)
  const endOverlay = new kakao.maps.CustomOverlay({
    map,
    position: path[path.length - 1],
    content: `<div style="width:16px;height:16px;border-radius:50%;background:#fff;border:3px solid ${course.color||'#059669'};box-shadow:0 2px 8px rgba(0,0,0,.4);margin:-8px 0 0 -8px;display:flex;align-items:center;justify-content:center"><div style="width:7px;height:7px;border-radius:50%;background:${course.color||'#059669'}"></div></div>`,
    zIndex: 4,
  });

  // 경로 범위에 맞게 지도 자동 조정
  const bounds = new kakao.maps.LatLngBounds();
  path.forEach(p => bounds.extend(p));
  map.setBounds(bounds, 30); // 30px 여백
}

// ── 상세 화면 카카오 지도 초기화 ─────────────────────────────────────
function initDetailMap(course) {
  const el = document.getElementById('detailMap');
  if (!el || !window.kakao || !kakao.maps) return;

  const coords = course.route_coords;
  if (!coords || coords.length < 2) {
    el.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#9ca3af;font-size:13px">경로 정보 없음</div>';
    return;
  }

  const midIdx = Math.floor(coords.length / 2);
  const center = new kakao.maps.LatLng(coords[midIdx].lat, coords[midIdx].lng);

  const map = new kakao.maps.Map(el, {
    center,
    level: 4,
    draggable: true,
    scrollwheel: false,
  });

  const path = coords.map(p => new kakao.maps.LatLng(p.lat, p.lng));

  // 그림자 효과 (바깥쪽 넓은 반투명)
  new kakao.maps.Polyline({
    map, path,
    strokeWeight: 16,
    strokeColor: course.color || '#059669',
    strokeOpacity: 0.12,
    strokeStyle: 'solid',
  });

  // 중간 글로우
  new kakao.maps.Polyline({
    map, path,
    strokeWeight: 9,
    strokeColor: course.color || '#059669',
    strokeOpacity: 0.3,
    strokeStyle: 'solid',
  });

  // 메인 경로선 (굵고 진하게)
  new kakao.maps.Polyline({
    map, path,
    strokeWeight: 5,
    strokeColor: course.color || '#059669',
    strokeOpacity: 1.0,
    strokeStyle: 'solid',
  });

  // 출발점 커스텀 마커
  new kakao.maps.CustomOverlay({
    map,
    position: path[0],
    content: `<div style="
      background:${course.color||'#059669'};color:#fff;
      padding:4px 10px;border-radius:20px;font-size:11px;font-weight:800;
      box-shadow:0 3px 10px rgba(0,0,0,.3);
      white-space:nowrap;transform:translate(-50%,-140%);
      border:2px solid rgba(255,255,255,.8)
    ">🏃 출발</div>`,
    zIndex: 5,
  });

  // 도착점 커스텀 마커
  new kakao.maps.CustomOverlay({
    map,
    position: path[path.length - 1],
    content: `<div style="
      background:#fff;color:${course.color||'#059669'};
      padding:4px 10px;border-radius:20px;font-size:11px;font-weight:800;
      box-shadow:0 3px 10px rgba(0,0,0,.3);
      white-space:nowrap;transform:translate(-50%,-140%);
      border:2px solid ${course.color||'#059669'}
    ">🏁 도착</div>`,
    zIndex: 5,
  });

  // 중간 웨이포인트 (3개 이상일 때)
  if (coords.length > 3) {
    const midPts = coords.slice(1, -1);
    midPts.forEach((p, i) => {
      if (coords.length <= 6 || i % 2 === 0) {
        new kakao.maps.CustomOverlay({
          map,
          position: new kakao.maps.LatLng(p.lat, p.lng),
          content: `<div style="width:10px;height:10px;border-radius:50%;background:${course.color||'#059669'};border:2.5px solid #fff;box-shadow:0 2px 5px rgba(0,0,0,.3);margin:-5px 0 0 -5px;opacity:.7"></div>`,
          zIndex: 3,
        });
      }
    });
  }

  // 경로 자동 맞춤
  const bounds = new kakao.maps.LatLngBounds();
  path.forEach(p => bounds.extend(p));
  map.setBounds(bounds, 50);
}

// ── 추천코스 등록 폼용 지도 ──────────────────────────────────────────
function initRecFormMap(lat, lng, onMove) {
  const el = document.getElementById('recMap');
  if (!el || !window.kakao || !kakao.maps) return null;

  const center = new kakao.maps.LatLng(lat || 35.15, lng || 129.06);
  const map = new kakao.maps.Map(el, { center, level: 5 });

  const marker = new kakao.maps.Marker({ map, position: center });

  kakao.maps.event.addListener(map, 'click', (e) => {
    const pos = e.latLng;
    marker.setPosition(pos);
    if (onMove) onMove(pos.getLat(), pos.getLng());
  });

  return map;
}

// ── 추천코스 목록 미니맵 초기화 ──────────────────────────────────────
function initRecListMaps(recCourses) {
  recCourses.forEach((c, i) => {
    setTimeout(() => initCardMap('recmap_' + c.id, c), i * 60);
  });
}
