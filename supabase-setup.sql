-- ========================================
-- 부산 러닝 앱 - Supabase 테이블 생성 SQL
-- Supabase 대시보드 > SQL Editor에서 실행
-- ========================================

-- 1. 유저 프로필
create table profiles (
  id uuid primary key default gen_random_uuid(),
  nickname text not null unique,
  lang text default 'ko',
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "profiles_read" on profiles for select using (true);
create policy "profiles_insert" on profiles for insert with check (true);

-- 2. 코스
create table courses (
  id text primary key,
  name_ko text not null,
  name_en text not null,
  area_ko text, area_en text,
  distance real, difficulty text,
  tags text[], no_signal boolean default false,
  description_ko text, description_en text,
  elevation int, surface_ko text, surface_en text,
  emoji text, color text,
  lat real, lng real,
  route_coords jsonb, -- [{lat,lng},{lat,lng}...]
  created_at timestamptz default now()
);
alter table courses enable row level security;
create policy "courses_read" on courses for select using (true);

-- 3. 좋아요
create table likes (
  id uuid primary key default gen_random_uuid(),
  course_id text references courses(id),
  user_id uuid references profiles(id),
  created_at timestamptz default now(),
  unique(course_id, user_id)
);
alter table likes enable row level security;
create policy "likes_read" on likes for select using (true);
create policy "likes_insert" on likes for insert with check (true);
create policy "likes_delete" on likes for delete using (true);

-- 4. 별점
create table ratings (
  id uuid primary key default gen_random_uuid(),
  course_id text references courses(id),
  user_id uuid references profiles(id),
  score int check (score >= 1 and score <= 5),
  created_at timestamptz default now(),
  unique(course_id, user_id)
);
alter table ratings enable row level security;
create policy "ratings_read" on ratings for select using (true);
create policy "ratings_upsert" on ratings for insert with check (true);
create policy "ratings_update" on ratings for update using (true);

-- 5. 댓글
create table comments (
  id uuid primary key default gen_random_uuid(),
  course_id text references courses(id),
  user_id uuid references profiles(id),
  nickname text,
  body text not null,
  created_at timestamptz default now()
);
alter table comments enable row level security;
create policy "comments_read" on comments for select using (true);
create policy "comments_insert" on comments for insert with check (true);

-- 6. 같이 달려요 (그룹러닝)
create table group_runs (
  id uuid primary key default gen_random_uuid(),
  course_id text references courses(id),
  host_id uuid references profiles(id),
  host_nickname text,
  title_ko text, title_en text,
  description_ko text, description_en text,
  run_date timestamptz not null,
  max_members int default 10,
  pace text, -- ex: "5:30~6:00"
  status text default 'open', -- open, closed, done
  created_at timestamptz default now()
);
alter table group_runs enable row level security;
create policy "gr_read" on group_runs for select using (true);
create policy "gr_insert" on group_runs for insert with check (true);
create policy "gr_update" on group_runs for update using (true);

-- 7. 그룹러닝 참가자
create table group_run_members (
  id uuid primary key default gen_random_uuid(),
  group_run_id uuid references group_runs(id) on delete cascade,
  user_id uuid references profiles(id),
  nickname text,
  joined_at timestamptz default now(),
  unique(group_run_id, user_id)
);
alter table group_run_members enable row level security;
create policy "grm_read" on group_run_members for select using (true);
create policy "grm_insert" on group_run_members for insert with check (true);
create policy "grm_delete" on group_run_members for delete using (true);

-- 8. 추천코스 (사용자 등록)
create table rec_courses (
  id text primary key,
  name text not null,
  description text,
  area text,
  distance real,
  difficulty text default 'easy',
  elevation int default 0,
  surface text,
  tags text[],
  no_signal boolean default false,
  emoji text default '📍',
  color text default '#059669',
  lat real, lng real,
  route_coords jsonb,
  author_id uuid references profiles(id),
  author_nickname text,
  created_at timestamptz default now()
);
alter table rec_courses enable row level security;
create policy "rec_read" on rec_courses for select using (true);
create policy "rec_insert" on rec_courses for insert with check (true);

-- 9. 추천코스 좋아요
create table rec_likes (
  id uuid primary key default gen_random_uuid(),
  rec_course_id text references rec_courses(id),
  user_id uuid references profiles(id),
  created_at timestamptz default now(),
  unique(rec_course_id, user_id)
);
alter table rec_likes enable row level security;
create policy "rlk_read" on rec_likes for select using (true);
create policy "rlk_insert" on rec_likes for insert with check (true);
create policy "rlk_delete" on rec_likes for delete using (true);

-- 10. 추천코스 댓글
create table rec_comments (
  id uuid primary key default gen_random_uuid(),
  rec_course_id text references rec_courses(id),
  user_id uuid references profiles(id),
  nickname text,
  body text not null,
  created_at timestamptz default now()
);
alter table rec_comments enable row level security;
create policy "rcm_read" on rec_comments for select using (true);
create policy "rcm_insert" on rec_comments for insert with check (true);

-- 11. GPS 러닝 기록
create table run_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  course_id text references courses(id),
  distance real, duration int, -- seconds
  avg_pace text, -- "5:30"
  route jsonb, -- [{lat,lng,ts}...]
  created_at timestamptz default now()
);
alter table run_records enable row level security;
create policy "rr_read" on run_records for select using (true);
create policy "rr_insert" on run_records for insert with check (true);

-- ========================================
-- 코스 초기 데이터 삽입
-- ========================================
insert into courses (id,name_ko,name_en,area_ko,area_en,distance,difficulty,tags,no_signal,description_ko,description_en,elevation,surface_ko,surface_en,emoji,color,lat,lng,route_coords) values
('c01','해운대 문탠로드','Moontan Road','해운대','Haeundae',3.2,'easy',array['no_signal','scenic','beach'],true,'달맞이고개~송정 해안 산책로. 차도 완전 분리, 신호 제로!','Scenic coastal trail from Dalmaji Hill to Songjeong. Fully separated from traffic.',45,'포장도로','Paved','🌊','#0ea5e9',35.1633,129.1856,'[{"lat":35.1633,"lng":129.1856},{"lat":35.1590,"lng":129.1920},{"lat":35.1570,"lng":129.1980},{"lat":35.1588,"lng":129.2040}]'),
('c02','낙동강 하구 둑길','Nakdong River Trail','사하/강서','Saha/Gangseo',12.0,'medium',array['no_signal','quiet','nature'],true,'낙동강 하구둑~을숙도. 철새도래지를 지나는 평탄한 비신호 코스.','Flat trail along Nakdong estuary. Bird sanctuary, zero traffic lights.',5,'자전거도로','Bike path','🦅','#10b981',35.0670,128.9430,'[{"lat":35.0670,"lng":128.9430},{"lat":35.0720,"lng":128.9500},{"lat":35.0810,"lng":128.9550},{"lat":35.0900,"lng":128.9480}]'),
('c03','이기대 해안 산책로','Igidae Coastal Trail','남구','Nam-gu',5.5,'hard',array['no_signal','scenic','trail'],true,'오륙도~이기대 해안 절벽 트레일. 뷰가 압도적.','Dramatic cliffside trail from Oryukdo to Igidae. Breathtaking views.',180,'비포장+데크','Unpaved+Deck','⛰️','#f59e0b',35.1058,129.1228,'[{"lat":35.1058,"lng":129.1228},{"lat":35.1030,"lng":129.1180},{"lat":35.1010,"lng":129.1120},{"lat":35.0980,"lng":129.1070}]'),
('c04','온천천 시민공원 코스','Oncheoncheon Park Course','동래/연제','Dongnae/Yeonje',7.0,'easy',array['no_signal','quiet','urban'],true,'온천천~부산시민공원. 도심 속 신호 없는 평지, 야간 조명 완비.','Stream-side path to Busan Citizens Park. Flat, lit, no signals.',10,'우레탄트랙','Urethane track','🏃','#8b5cf6',35.1870,129.0630,'[{"lat":35.1870,"lng":129.0630},{"lat":35.1820,"lng":129.0600},{"lat":35.1760,"lng":129.0580},{"lat":35.1710,"lng":129.0560}]'),
('c05','광안리~민락 수변공원','Gwangalli Beach Run','수영','Suyeong',4.0,'easy',array['scenic','beach','night'],false,'광안대교 야경을 보며 달리는 코스. 저녁 러닝 추천!','Run with Gwangan Bridge night views. Best at sunset.',3,'포장도로','Paved','🌉','#ec4899',35.1531,129.1187,'[{"lat":35.1531,"lng":129.1187},{"lat":35.1520,"lng":129.1230},{"lat":35.1510,"lng":129.1290},{"lat":35.1530,"lng":129.1340}]'),
('c06','갈맷길 1코스 (태종대)','Galmaetgil Course 1 (Taejongdae)','영도','Yeongdo',8.5,'hard',array['no_signal','scenic','trail'],true,'태종대 순환~영도 해안. 차량 통제, 절벽+등대 뷰 장관.','Taejongdae loop trail. Vehicle-free, lighthouse & cliff views.',250,'포장+비포장','Mixed','🏝️','#14b8a6',35.0520,129.0840,'[{"lat":35.0520,"lng":129.0840},{"lat":35.0490,"lng":129.0800},{"lat":35.0460,"lng":129.0760},{"lat":35.0500,"lng":129.0720}]'),
('c07','수영강 리버사이드','Suyeong River Riverside','수영/해운대','Suyeong/Haeundae',6.0,'easy',array['no_signal','quiet','urban'],true,'수영강변~센텀시티. 완전 평지, 신호 없음. 출퇴근 러닝 딱!','Riverside path to Centum City. Flat, signal-free commuter run.',5,'자전거도로','Bike path','🌿','#06b6d4',35.1690,129.1300,'[{"lat":35.1690,"lng":129.1300},{"lat":35.1720,"lng":129.1350},{"lat":35.1750,"lng":129.1400},{"lat":35.1770,"lng":129.1450}]'),
('c08','장산 숲길 트레일','Jangsan Forest Trail','해운대','Haeundae',9.0,'hard',array['no_signal','quiet','trail'],true,'장산 둘레길. 숲속 트레일, 도심 소음 차단. 성취감 최고.','Jangsan mountain loop. Deep forest trail running.',350,'비포장 산길','Mountain path','🌲','#65a30d',35.1850,129.1680,'[{"lat":35.1850,"lng":129.1680},{"lat":35.1880,"lng":129.1720},{"lat":35.1910,"lng":129.1750},{"lat":35.1870,"lng":129.1790}]'),
('c09','다대포 해변~몰운대','Dadaepo Beach to Morundae','사하','Saha',5.0,'medium',array['no_signal','scenic','beach'],true,'다대포 낙조분수~몰운대. 일몰 황금빛 바다 힐링 코스.','Dadaepo fountain to Morundae. Golden sunset healing run.',60,'포장+데크','Paved+Deck','🌅','#f97316',35.0470,128.9660,'[{"lat":35.0470,"lng":128.9660},{"lat":35.0450,"lng":128.9620},{"lat":35.0430,"lng":128.9570},{"lat":35.0460,"lng":128.9520}]'),
('c10','센텀시티 APEC나루공원','Centum APEC Naru Park','해운대','Haeundae',2.5,'easy',array['quiet','urban','night'],false,'수영만 요트경기장 주변. 야경 아름답고 접근성 좋은 가벼운 코스.','Marina park loop. Beautiful night views, easy access.',2,'우레탄트랙','Urethane track','✨','#a855f7',35.1695,129.1365,'[{"lat":35.1695,"lng":129.1365},{"lat":35.1710,"lng":129.1380},{"lat":35.1700,"lng":129.1400},{"lat":35.1685,"lng":129.1385}]'),
('c11','범어사~금정산성 트레일','Beomeosa to Geumjeongsanseong','금정','Geumjeong',11.0,'hard',array['no_signal','scenic','trail'],true,'범어사~금정산성 북문. 부산 최고봉 경유 가능. 진정한 트레일 코스.','Temple to fortress trail. Busan''s highest peak accessible.',520,'비포장 산길','Mountain path','🏯','#dc2626',35.2840,129.0680,'[{"lat":35.2840,"lng":129.0680},{"lat":35.2870,"lng":129.0650},{"lat":35.2910,"lng":129.0620},{"lat":35.2950,"lng":129.0600}]'),
('c12','송도 해안 스카이워크','Songdo Skywalk Coast','서구','Seo-gu',3.8,'medium',array['scenic','beach'],false,'송도~암남공원 데크길. 바다 위를 달리는 기분!','Songdo beach deck trail. Run above the sea!',30,'데크+포장','Deck+Paved','🌁','#6366f1',35.0750,129.0190,'[{"lat":35.0750,"lng":129.0190},{"lat":35.0730,"lng":129.0160},{"lat":35.0700,"lng":129.0140},{"lat":35.0680,"lng":129.0120}]');
