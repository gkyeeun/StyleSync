# 배포 가이드

## ✅ 빌드 확인 완료

- ✅ TypeScript 타입 체크 통과
- ✅ Next.js 프로덕션 빌드 성공
- ✅ 모든 라우트 정상 생성

## 배포 전 체크리스트

### 1. Supabase 설정

1. **Supabase 프로젝트 생성**
   - https://supabase.com 에서 프로젝트 생성
   - `README_SUPABASE.md` 참고

2. **데이터베이스 스키마 실행**
   - Supabase 대시보드 → SQL Editor
   - `supabase/schema.sql` 내용 실행

### 2. 환경 변수 설정

#### 로컬 개발용 (`.env.local`)
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Vercel 배포용
1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Environment Variables
3. 다음 변수 추가:
   - `NEXT_PUBLIC_SUPABASE_URL` (Production, Preview, Development 모두)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Production, Preview, Development 모두)

### 3. Vercel 배포

#### GitHub 연동 배포 (권장)
1. GitHub에 코드 푸시
2. Vercel 대시보드 → Add New Project
3. GitHub 레포지토리 선택
4. 환경 변수 설정 (위 2번 참고)
5. Deploy 클릭

#### Vercel CLI 배포
```bash
npm i -g vercel
vercel
```

### 4. 배포 후 확인사항

- [ ] 홈페이지 로드 확인
- [ ] 어드민 페이지 접근 확인 (`/admin/upload`)
- [ ] 데이터 저장/조회 테스트
- [ ] 찜 기능 테스트
- [ ] 이미지 업로드 테스트

## 빌드 결과

```
Route (app)
┌ ○ /                          (Static)
├ ○ /_not-found                (Static)
├ ○ /admin/upload              (Static)
├ ƒ /api/favorites             (Dynamic)
├ ƒ /api/outfits               (Dynamic)
├ ƒ /api/outfits/[id]          (Dynamic)
├ ○ /favorites                 (Static)
├ ○ /gallery                   (Static)
├ ƒ /idols/[idolId]            (Dynamic)
├ ○ /idols/enhypen             (Static)
├ ƒ /idols/enhypen/[memberId]  (Dynamic)
├ ○ /look                      (Static)
├ ƒ /look/[member]/[date]/[event] (Dynamic)
├ ƒ /members/[memberId]        (Dynamic)
└ ○ /search                    (Static)
```

## 주의사항

1. **환경 변수**: `.env.local`은 Git에 커밋하지 마세요 (이미 `.gitignore`에 포함됨)
2. **Supabase RLS**: 현재는 모든 사용자에게 열려있습니다. 프로덕션에서는 인증 추가 권장
3. **이미지 저장**: 현재는 Base64로 저장됩니다. 대용량 이미지는 Supabase Storage 사용 권장

## 문제 해결

### 빌드 에러
- 환경 변수가 설정되지 않았을 수 있습니다
- `.env.local` 파일 확인

### 런타임 에러
- Supabase 연결 확인
- 브라우저 콘솔에서 네트워크 에러 확인
- Supabase 대시보드에서 테이블 생성 확인
