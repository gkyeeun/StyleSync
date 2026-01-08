# Supabase 설정 가이드

이 프로젝트는 Supabase를 데이터베이스로 사용합니다.

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 가입하고 로그인
2. "New Project" 클릭
3. 프로젝트 이름, 데이터베이스 비밀번호 설정
4. 리전 선택 (가장 가까운 리전 권장)
5. 프로젝트 생성 완료 대기 (약 2분)

## 2. 데이터베이스 스키마 생성

1. Supabase 대시보드에서 "SQL Editor" 메뉴 클릭
2. "New Query" 클릭
3. `supabase/schema.sql` 파일의 내용을 복사하여 붙여넣기
4. "Run" 버튼 클릭하여 실행

## 3. 환경 변수 설정

1. Supabase 대시보드에서 "Settings" → "API" 메뉴로 이동
2. 다음 값들을 복사:
   - `Project URL` (예: `https://xxxxx.supabase.co`)
   - `anon public` 키

3. 프로젝트 루트에 `.env.local` 파일 생성:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4. `.env.local` 파일을 `.gitignore`에 추가되어 있는지 확인 (이미 추가되어 있어야 함)

## 4. 개발 서버 실행

```bash
npm run dev
```

## 5. 데이터 마이그레이션 (선택사항)

기존 localStorage에 저장된 데이터가 있다면, 수동으로 어드민 페이지(`/admin/upload`)를 통해 다시 등록하거나, 마이그레이션 스크립트를 작성할 수 있습니다.

## 주의사항

- `.env.local` 파일은 절대 Git에 커밋하지 마세요
- Supabase의 Row Level Security (RLS) 정책이 현재는 모든 사용자에게 열려있습니다
- 프로덕션 환경에서는 인증을 추가하고 RLS 정책을 더 엄격하게 설정하세요
