# ORMS Lab Homepage — 배포 가이드 (관리자용)

단일 페이지 정적 사이트. GitHub Pages가 Jekyll로 자동 빌드하고, 연구실 구성원은 `/admin`(Decap CMS)에서 코드 없이 컨텐츠를 수정합니다.

## 구조

```
index.html        # 단일 페이지 (모든 섹션)
_config.yml       # Jekyll 설정
_data/settings.yml# 연구실 이름·연락처·모집 문구
_research/        # 연구 토픽 (카드 1개 = 파일 1개)
_members/         # 구성원
_publications/    # 논문·특허
_projects/        # 연구과제
_news/ _gallery/ _courses/  # Board 탭 컨텐츠
admin/            # Decap CMS (구성원용 관리 화면)
assets/           # CSS/JS/이미지, uploads(CMS 업로드 폴더)
preview.html      # 로컬 미리보기(배포 제외됨). 브라우저로 열면 됨
```

## 1. GitHub Pages 배포

1. GitHub Organization(예: `orms-lab-cnu`)을 만들고 `orms-lab-cnu.github.io` 이름의 repo 생성
2. 이 폴더 전체를 push (main 브랜치)
3. repo Settings → Pages → Source: `Deploy from a branch`, branch `main`, 폴더 `/ (root)`
4. 1~2분 후 `https://orms-lab-cnu.github.io` 접속 확인

> GitHub Pages가 Jekyll을 직접 빌드하므로 Actions 설정·로컬 Ruby 설치가 필요 없습니다.

## 2. CMS 로그인용 OAuth 프록시 (1회, 약 10분)

Decap CMS의 GitHub 로그인에는 작은 중계 서버가 필요합니다. Cloudflare Workers 무료 플랜으로 해결:

1. https://github.com/sveltia/sveltia-cms-auth 접속 → README의 "Deploy to Cloudflare Workers" 버튼 클릭 (Decap CMS와 호환)
2. GitHub에서 OAuth App 생성: Settings → Developer settings → OAuth Apps → New
   - Homepage URL: `https://orms-lab-cnu.github.io`
   - Callback URL: `https://<worker이름>.<계정>.workers.dev/callback`
3. Worker 환경변수에 `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` 등록 (필요시 `ALLOWED_DOMAINS`에 사이트 도메인)
4. `admin/config.yml`에서 두 곳 수정:
   - `repo:` → 실제 repo 이름 (예: `orms-lab-cnu/orms-lab-cnu.github.io`)
   - `base_url:` → Worker 주소 (예: `https://sveltia-cms-auth.xxx.workers.dev`)

## 3. 구성원 초대

1. 구성원이 GitHub 계정 생성
2. repo Settings → Collaborators → 구성원을 **Write** 권한으로 초대
3. 구성원은 `https://사이트주소/admin` 접속 → "Login with GitHub" → 바로 편집 가능
4. `GUIDE_MEMBERS.md`를 구성원에게 전달

## 4. 초기 컨텐츠 교체 체크리스트

- [ ] `_publications/`, `_projects/`의 **(sample)** 표시 항목을 실제 목록으로 교체
- [ ] `_members/sample-undergrad.md` 삭제, 실제 구성원 추가
- [ ] `_data/settings.yml`의 이메일·주소·전화 확인 (현재 이메일은 추정값)
- [ ] `_courses/` 실제 강의로 교체
- [ ] 필요시 `assets/images/`의 사진 교체

## 로컬 미리보기

Ruby가 있으면 `gem install jekyll && jekyll serve`.
없으면 `node _tools_render.js . preview.html`(요구: `npm i liquidjs js-yaml marked`) 후 `preview.html`을 브라우저로 열기.
