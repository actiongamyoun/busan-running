# 부산 러닝 앱 (Busan Running) 🏃

## 파일 구조
```
busan-running/
├── index.html              ← 메인 앱 (단일 HTML)
├── netlify.toml             ← Netlify 설정
├── netlify/functions/api.js ← Supabase 프록시 (API 키 보안)
├── supabase-setup.sql       ← DB 테이블 생성용 SQL
├── .env.example             ← 환경변수 예시
└── .gitignore
```

## 배포 순서

### 1단계: Supabase 설정
1. supabase.com 접속 → New Project 생성 (이름: busan-running)
2. 왼쪽 메뉴 SQL Editor 클릭
3. supabase-setup.sql 내용 전체 복붙 → Run 실행
4. Settings > API에서 아래 2개 복사:
   - Project URL (https://xxxxx.supabase.co)
   - service_role key (비공개키)

### 2단계: 카카오맵 API
1. developers.kakao.com 로그인
2. 내 애플리케이션 > 추가 > 앱이름: 부산러닝
3. 앱 키 > JavaScript 키 복사
4. 플랫폼 > Web > https://본인사이트.netlify.app 등록

### 3단계: index.html 수정
- YOUR_KAKAO_JS_KEY를 발급받은 JavaScript 키로 교체

### 4단계: Netlify 배포
1. GitHub에 이 폴더 전체 push
2. netlify.com > New site from Git > 저장소 선택
3. Site settings > Environment variables에 추가:
   - SUPABASE_URL = (1단계에서 복사한 URL)
   - SUPABASE_SERVICE_KEY = (1단계에서 복사한 key)
4. Deploy!

## 보안 구조
- 카카오맵 JS키: 도메인 제한으로 보호 (카카오 플랫폼 설정)
- Supabase 키: Netlify Functions 서버에서만 사용 (프론트 노출 안됨)
- RLS(Row Level Security): 모든 테이블 활성화
- 우클릭/개발자도구/드래그 방지 적용

## 기능
- ✅ 코스 목록 (12개, 신호없는 코스 중심)
- ✅ 필터 (신호없는/난이도/거리/분위기)
- ✅ 카카오맵 지도 + 경로 표시
- ✅ GPS 트래킹 (거리/시간/페이스)
- ✅ 좋아요/별점/댓글 커뮤니티
- ✅ 같이 달려요 (그룹러닝 모집)
- ✅ 한글/영어 전환
- ✅ 우클릭/소스보기 방지
- ✅ 오프라인 폴백 (localStorage)
