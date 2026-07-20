# ORMS Lab Homepage — 관리자 가이드

**현재 상태: https://ormslab.github.io 배포 완료.**
main 브랜치에 push(커밋)하면 1~2분 뒤 자동으로 사이트에 반영됩니다. 별도의 서버·빌드 설정은 필요 없습니다.

남은 설정은 **CMS 로그인 연결** 하나뿐입니다(아래 2번). 연결 전에도 컨텐츠 수정은 가능합니다(아래 1번).

---

## 1. 컨텐츠 수정 방법

### 방법 A — CMS 연결 전 (지금 바로 가능)

GitHub 웹에서 파일을 직접 수정합니다.

1. https://github.com/ormslab/ormslab.github.io 접속 (Write 권한 계정으로 로그인)
2. 수정할 파일 클릭 → 오른쪽 위 연필(✏️) 아이콘 → 내용 수정
3. 오른쪽 위 **Commit changes...** → 초록색 **Commit changes** 클릭
4. 1~2분 뒤 사이트 새로고침

어떤 파일이 무엇인지:

| 폴더/파일 | 내용 | 형식 예시 |
|---|---|---|
| `_news/` | 소식 (파일 1개 = 글 1개) | `2026-07-20-website-open.md` 참고 |
| `_gallery/` | 사진첩 | `conference-2025.md` 참고 |
| `_members/` | 구성원 | `kim-jun-hyeok.md` 참고 |
| `_publications/` | 논문/특허 | `2022-cabin-suspension.md` 참고 |
| `_projects/` | 연구과제 | `upland-crop-project.md` 참고 |
| `_courses/` | 강의 | |
| `_research/` | 연구 분야 카드 5개 | |
| `_data/settings.yml` | 연락처·주소·모집 문구 | |

새 글 추가는 기존 파일을 열어 형식을 복사 → 폴더에서 **Add file → Create new file**로 새 파일 생성.
사진 추가는 `assets/uploads` 폴더에서 **Add file → Upload files**로 업로드 후, 글에서 `/assets/uploads/파일명`으로 참조.

### 방법 B — CMS 연결 후 (구성원용, 권장)

`https://ormslab.github.io/admin` 접속 → GitHub 로그인 → 폼으로 작성. 구성원 안내는 `GUIDE_MEMBERS.md` 참고.

---

## 2. CMS 로그인 연결 (최초 1회, 관리자)

CMS(관리 화면)가 GitHub 로그인하려면 작은 중계 서버(OAuth 프록시)가 필요합니다. Cloudflare Workers 무료 플랜을 사용합니다. **순서가 중요합니다 — Worker를 먼저 만들어야 그 주소로 OAuth App을 등록할 수 있습니다.**

### 2-1. Cloudflare Worker 배포 (먼저!)

1. https://dash.cloudflare.com 에서 Cloudflare 무료 계정 생성/로그인
2. https://github.com/sveltia/sveltia-cms-auth 접속 → README의 **Deploy to Cloudflare Workers** 버튼 클릭
3. 안내에 따라 진행 (GitHub 계정 연결을 요구하면 승인 — 본인 계정에 복제본 repo가 생기는 것이 정상입니다)
4. 배포가 끝나면 Cloudflare 대시보드 → **Workers & Pages** → `sveltia-cms-auth` 클릭
5. 화면에 표시되는 Worker 주소를 복사해 두세요. 형식: `https://sveltia-cms-auth.<본인서브도메인>.workers.dev`

### 2-2. GitHub OAuth App 등록

1. https://github.com/settings/applications/new 접속 (⚠️ organization이 아닌 **본인 계정**의 Developer settings여도 됩니다)
2. 입력값:
   - **Application name**: `ORMS Lab CMS` (아무거나)
   - **Homepage URL**: `https://ormslab.github.io` (아무거나 가능)
   - **Authorization callback URL**: `2-1에서 복사한 Worker 주소/callback`
     예: `https://sveltia-cms-auth.honggildong.workers.dev/callback`
3. **Register application** 클릭
4. 표시된 **Client ID** 복사 → **Generate a new client secret** 클릭 → **Client Secret**도 복사 (이 화면을 벗어나면 다시 볼 수 없으니 지금 복사)

### 2-3. Worker에 환경변수 입력

1. Cloudflare 대시보드 → **Workers & Pages** → `sveltia-cms-auth` → **Settings** 탭 → **Variables and Secrets**
2. 다음 변수를 추가:
   - `GITHUB_CLIENT_ID` = 2-2의 Client ID (Type: Text)
   - `GITHUB_CLIENT_SECRET` = 2-2의 Client Secret (Type: **Secret** 선택 — 암호화 저장)
   - `ALLOWED_DOMAINS` = `ormslab.github.io` (선택이지만 보안상 권장)
3. **Deploy**(또는 Save and deploy) 클릭

> Cloudflare 대시보드 UI는 종종 바뀝니다. "Variables" 메뉴가 안 보이면 Settings 탭 안에서 Environment Variables / Variables and Secrets 항목을 찾으세요.

### 2-4. 사이트 설정에 Worker 주소 입력

1. GitHub에서 `admin/config.yml` 파일 열기 → ✏️ 수정
2. `base_url:` 줄의 값을 2-1의 Worker 주소로 교체:
   ```yaml
   backend:
     name: github
     repo: ormslab/ormslab.github.io
     branch: main
     base_url: https://sveltia-cms-auth.honggildong.workers.dev   # ← 본인 Worker 주소
   ```
3. Commit → 1~2분 뒤 `https://ormslab.github.io/admin`에서 **Sign in with GitHub** 버튼으로 로그인 확인

### 문제 해결

- **로그인 버튼을 눌러도 반응 없음/에러**: callback URL 끝에 `/callback`이 있는지, `base_url`에 오타가 없는지(끝에 `/` 없이) 확인
- **"Not allowed" 에러**: `ALLOWED_DOMAINS` 값이 `ormslab.github.io`와 정확히 일치하는지 확인
- **로그인은 되는데 저장 실패**: 해당 구성원이 repo Collaborator(Write)로 초대됐는지 확인

---

## 3. 구성원 초대

1. 구성원이 GitHub 계정 생성 (무료)
2. repo → **Settings** → **Collaborators and teams** → **Add people** → 구성원 아이디 입력 → Role: **Write**
3. 구성원이 이메일/알림으로 초대 수락
4. 이후 `https://ormslab.github.io/admin`에서 GitHub 로그인으로 편집 가능 → `GUIDE_MEMBERS.md` 전달

---

## 4. 초기 컨텐츠 교체 체크리스트

- [ ] `_publications/`, `_projects/`의 **(sample)** 항목을 실제 목록으로 교체
- [ ] `_members/sample-undergrad.md`, `_members/sample-alumni.md` 삭제 또는 실제 인물로 교체
- [ ] `_data/settings.yml`의 이메일 확인 (현재 값은 추정치)
- [ ] `_courses/` 실제 강의로 교체

## 참고

- 관리 화면은 **Sveltia CMS**(Decap CMS 호환 후속작)를 사용합니다. 설정 파일은 `admin/config.yml` 하나입니다.
- `preview.html`, `_tools_render.js`, README류 파일은 빌드에서 제외되며 사이트에 노출되지 않습니다.
- 사이트 구조: `index.html` 단일 페이지 + `_폴더`들의 마크다운 데이터. 디자인 수정은 `assets/css/style.css`.
