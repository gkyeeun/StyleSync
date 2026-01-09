# 배포 전 체크리스트 ✅

## ✅ 빌드 확인 완료 (최종 확인: 2024)

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
├ ƒ /api/events               (Dynamic) ⭐ 새로 추가됨
├ ƒ /api/outfits              (Dynamic)
├ ƒ /api/outfits/[id]         (Dynamic)
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

### 5. 최신 기능 확인 ✅

- ✅ Event 직접 입력 기능 구현됨
- ✅ 동적 Event 카테고리 로딩 구현됨
- ✅ 메인 페이지와 어드민 페이지 Event 동기화됨

## 배포 방법

### Vercel 배포 (권장)

1. **GitHub에 푸시**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Vercel에서 배포**
   - Vercel 대시보드 접속
   - "Add New Project" 클릭
   - GitHub 레포지토리 선택
   - 환경 변수 설정 (위 2번 참고)
   - "Deploy" 클릭

3. **배포 후 확인**
   - [ ] 홈페이지 로드 확인
   - [ ] 어드민 페이지 접근 확인 (`/admin/upload`)
   - [ ] 로그인 기능 테스트 (비밀번호: 1234)
   - [ ] 데이터 저장/조회 테스트
   - [ ] Event 직접 입력 기능 테스트
   - [ ] 메인 페이지 Event 카테고리 동기화 확인

## 주의사항

1. **환경 변수**: 반드시 Vercel에 설정해야 합니다. 없으면 Supabase 연결 실패
2. **Supabase RLS**: 현재는 모든 사용자에게 열려있습니다. 프로덕션에서는 인증 추가 권장
3. **이미지 저장**: 현재는 Base64로 저장됩니다. 대용량 이미지는 Supabase Storage 사용 권장
4. **어드민 비밀번호**: 프로덕션에서는 더 강력한 비밀번호로 변경 권장

## 문제 해결

### 빌드 에러
- 환경 변수가 설정되지 않았을 수 있습니다
- Vercel 환경 변수 확인

### 런타임 에러
- Supabase 연결 확인
- 브라우저 콘솔에서 네트워크 에러 확인
- Supabase 대시보드에서 테이블 생성 확인

### Event 카테고리 미표시
- `/api/events` 엔드포인트 확인
- 데이터베이스에 event 데이터가 있는지 확인
