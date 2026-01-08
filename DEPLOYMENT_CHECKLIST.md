# 배포 전 체크리스트 ✅

## ✅ 빌드 확인 완료

- ✅ TypeScript 타입 체크: **통과**
- ✅ ESLint 린터: **에러 없음**
- ✅ 프로덕션 빌드: **성공**
- ✅ 모든 라우트 생성: **정상**

## 빌드 결과

```
Route (app)
┌ ○ /                          (Static)
├ ○ /_not-found                (Static)
├ ○ /admin/login              (Static)
├ ○ /admin/upload             (Static)
├ ƒ /api/favorites            (Dynamic)
├ ƒ /api/outfits              (Dynamic)
├ ƒ /api/outfits/[id]         (Dynamic)
├ ○ /favorites                (Static)
├ ○ /gallery                  (Static)
├ ƒ /idols/[idolId]           (Dynamic)
├ ○ /idols/enhypen            (Static)
├ ƒ /idols/enhypen/[memberId] (Dynamic)
├ ○ /look                     (Static)
├ ƒ /look/[member]/[date]/[event] (Dynamic)
├ ƒ /members/[memberId]       (Dynamic)
└ ○ /search                   (Static)
```

## 배포 전 필수 작업

### 1. Supabase 설정 ⚠️

- [ ] Supabase 프로젝트 생성 완료
- [ ] 데이터베이스 스키마 실행 (`supabase/schema.sql`)
- [ ] Supabase URL 및 Anon Key 확인

### 2. 환경 변수 설정 ⚠️

#### Vercel 배포 시 필수 환경 변수:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**설정 방법:**
1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Environment Variables
3. 위 두 변수를 추가 (Production, Preview, Development 모두)

### 3. Git 설정 확인 ✅

- ✅ `.gitignore`에 `.env*.local` 포함됨
- ✅ `.gitignore`에 `.vercel` 포함됨
- ✅ 환경 변수 파일이 Git에 커밋되지 않음

### 4. 어드민 비밀번호 확인

- 기본 비밀번호: `1234`
- 변경하려면: `lib/auth.ts`의 `ADMIN_PASSWORD` 수정

## 배포 방법

### Vercel 배포 (권장)

1. **GitHub에 푸시**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Vercel에서 배포**
   - Vercel 대시보드 → Add New Project
   - GitHub 레포지토리 선택
   - 환경 변수 설정 (위 2번 참고)
   - Deploy 클릭

### Vercel CLI 배포

```bash
npm i -g vercel
vercel
```

## 배포 후 확인사항

- [ ] 홈페이지 로드 확인 (`/`)
- [ ] 어드민 로그인 페이지 접근 (`/admin/login`)
- [ ] 어드민 페이지 접근 및 로그인 테스트 (`/admin/upload`)
- [ ] 데이터 저장/조회 테스트
- [ ] 찜 기능 테스트
- [ ] 이미지 업로드 테스트

## 주의사항

1. **환경 변수**: 반드시 Vercel에 설정해야 합니다
2. **Supabase**: 데이터베이스 스키마가 실행되어 있어야 합니다
3. **비밀번호**: 프로덕션에서는 더 강력한 비밀번호 사용 권장

## 문제 해결

### 빌드 실패 시
- 환경 변수가 설정되지 않았을 수 있습니다
- Vercel 대시보드에서 환경 변수 확인

### 런타임 에러 시
- Supabase 연결 확인
- 브라우저 콘솔에서 네트워크 에러 확인
- Supabase 대시보드에서 테이블 생성 확인
