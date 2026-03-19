# 부산 러닝 앱 - 배포 가이드 📱

## 전체 순서
1. GitHub 저장소 만들기
2. 파일 올리기
3. Supabase 설정
4. 카카오맵 API 발급
5. Netlify 배포
6. 환경변수 설정
7. 완료!

---

## 1단계: GitHub 저장소 만들기

1. https://github.com 접속 → 로그인
2. 오른쪽 상단 **+** 버튼 → **New repository** 클릭
3. 아래처럼 입력:
   - Repository name: **busan-running**
   - Description: 부산 러닝 앱
   - **Public** 선택 (Netlify 무료 배포를 위해)
   - ✅ Add a README file → **체크 해제** (우리가 이미 만들었으므로)
4. **Create repository** 클릭

---

## 2단계: 파일 올리기 (웹에서 드래그앤드롭)

### 방법 A: 웹에서 바로 올리기 (가장 쉬움)

1. 생성된 저장소 페이지에서 **uploading an existing file** 링크 클릭
   (또는 **Add file** → **Upload files**)
2. 아래 파일들을 한꺼번에 드래그해서 올리기:

```
올려야 할 파일 목록:
├── index.html          ← 메인 앱
├── netlify.toml         ← Netlify 설정
├── README.md            ← 설명서
├── supabase-setup.sql   ← DB 설정용 (참고용)
├── .gitignore           ← Git 설정
└── .env.example         ← 환경변수 예시
```

3. **Commit changes** 클릭

### ⚠️ 중요: netlify/functions 폴더는 따로 올려야 합니다!

4. 저장소 메인 페이지로 돌아가기
5. **Add file** → **Create new file** 클릭
6. 파일 이름에: **netlify/functions/api.js** 입력
   (슬래시를 입력하면 자동으로 폴더가 생성됩니다)
7. api.js 파일 내용을 복사해서 붙여넣기
8. **Commit changes** 클릭

### 방법 B: 컴퓨터에서 Git으로 올리기 (Git 설치 필요)

컴퓨터에 Git이 설치되어 있다면:

```bash
# 1. 다운받은 파일들이 있는 폴더로 이동
cd busan-running

# 2. Git 초기화
git init
git add .
git commit -m "부산 러닝 앱 초기 커밋"

# 3. GitHub 저장소 연결 (본인 GitHub 사용자명으로 변경)
git remote add origin https://github.com/본인사용자명/busan-running.git
git branch -M main
git push -u origin main
```

---

## 3단계: Supabase 설정

1. https://supabase.com 접속 → 로그인 (GitHub 계정으로 가능)
2. **New Project** 클릭
   - Name: **busan-running**
   - Database Password: 비밀번호 입력 (기억해두세요)
   - Region: **Northeast Asia (Seoul)** 선택
   - **Create new project** 클릭
3. 프로젝트 생성 완료 후 (1-2분 소요)
4. 왼쪽 메뉴에서 **SQL Editor** 클릭
5. **New query** 클릭
6. **supabase-setup.sql** 파일 내용 전체를 복사해서 붙여넣기
7. **Run** 버튼 클릭 (초록색)
8. "Success. No rows returned" 메시지 확인

### Supabase 키 복사 (나중에 Netlify에서 사용)

9. 왼쪽 메뉴 **Settings** (톱니바퀴) → **API** 클릭
10. 아래 2개를 메모장에 복사해두세요:
    - **Project URL**: `https://xxxxxxxx.supabase.co`
    - **service_role** 키 (⚠️ secret 키 - 절대 공개 금지!)
      → "Reveal" 클릭해서 복사

---

## 4단계: 카카오맵 API 발급

1. https://developers.kakao.com 접속 → 카카오 계정 로그인
2. 상단 **내 애플리케이션** 클릭
3. **애플리케이션 추가하기** 클릭
   - 앱 이름: **부산러닝**
   - 사업자명: 본인 이름
   - **저장** 클릭
4. 생성된 앱 클릭
5. **앱 키** 메뉴에서 **JavaScript 키** 복사 (메모장에 저장)
6. 왼쪽 메뉴 **플랫폼** 클릭
7. **Web 플랫폼 등록** 클릭
8. 사이트 도메인에 입력:
   - `https://busan-running.netlify.app`
   (나중에 Netlify 주소가 다르면 그때 수정)
9. **저장** 클릭

### index.html에서 API 키 교체

10. GitHub 저장소로 돌아가기
11. **index.html** 파일 클릭 → 연필 아이콘 (Edit) 클릭
12. `YOUR_KAKAO_JS_KEY` 를 검색해서 발급받은 JavaScript 키로 교체
13. **Commit changes** 클릭

---

## 5단계: Netlify 배포

1. https://app.netlify.com 접속 → 로그인 (GitHub 계정 추천)
2. **Add new site** → **Import an existing project** 클릭
3. **Deploy with GitHub** 클릭
4. GitHub 계정 연결 허용
5. **busan-running** 저장소 선택
6. 설정 화면:
   - Branch to deploy: **main**
   - Build command: (비워두기)
   - Publish directory: **.** (점 하나)
7. **Deploy site** 클릭

### 배포 완료!
- Netlify가 자동으로 URL을 생성합니다
- 예: `https://amazing-jennings-abc123.netlify.app`

### 사이트 이름 변경 (선택)

8. **Site settings** → **Change site name**
9. `busan-running` 으로 변경
10. → `https://busan-running.netlify.app` 으로 접속 가능!

---

## 6단계: 환경변수 설정 (중요!)

1. Netlify 대시보드 → 해당 사이트 클릭
2. **Site configuration** → **Environment variables** 클릭
3. **Add a variable** 클릭하고 아래 2개 추가:

| Key | Value |
|-----|-------|
| `SUPABASE_URL` | `https://xxxxxxxx.supabase.co` (3단계에서 복사한 것) |
| `SUPABASE_SERVICE_KEY` | `eyJhbGci...` (3단계에서 복사한 service_role 키) |

4. 저장 후 **Deploys** → **Trigger deploy** → **Deploy site** 클릭
   (환경변수 적용을 위해 재배포)

---

## 7단계: 확인!

1. 사이트 URL 접속
2. 닉네임 입력 → 시작
3. 코스 목록, 지도, 추천코스 등록, 같이달려요 확인
4. 다른 기기(폰)에서도 접속해서 데이터 공유 확인

---

## 🔧 문제 해결

### 지도가 안 보여요
→ 카카오맵 API 키가 정확한지 확인
→ 카카오 플랫폼에 Netlify 도메인이 등록되었는지 확인

### 데이터가 공유 안 돼요
→ Netlify 환경변수 설정 확인
→ Supabase SQL이 정상 실행되었는지 확인
→ 브라우저 콘솔(F12)에서 에러 확인

### 사이트가 안 열려요
→ Netlify 배포 로그에서 에러 확인
→ netlify.toml 파일이 정상인지 확인

---

## 📁 최종 파일 구조 (GitHub에 올라가야 할 것)

```
busan-running/
├── index.html              ← 메인 앱
├── netlify.toml             ← Netlify 설정
├── netlify/
│   └── functions/
│       └── api.js           ← Supabase 프록시 (보안)
├── README.md                ← 이 문서
├── supabase-setup.sql       ← DB 설정 SQL
├── .env.example             ← 환경변수 예시
└── .gitignore
```
