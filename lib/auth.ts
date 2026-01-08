// 간단한 비밀번호 인증 (4자리)
// ⚠️ 비밀번호 변경: 아래 값을 원하는 4자리 숫자로 변경하세요
const ADMIN_PASSWORD = "1234"; // 관리자 비밀번호

const AUTH_KEY = "admin_authenticated";
const AUTH_TIMESTAMP_KEY = "admin_auth_timestamp";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24시간

// 로그인
export async function signIn(password: string): Promise<{ success: boolean; error?: string }> {
  if (password === ADMIN_PASSWORD) {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_KEY, "true");
      localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
    }
    return { success: true };
  }
  return { success: false, error: "비밀번호가 올바르지 않습니다." };
}

// 로그아웃
export async function signOut(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_TIMESTAMP_KEY);
  }
}

// 현재 인증 상태 확인
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  
  const authStatus = localStorage.getItem(AUTH_KEY);
  const timestamp = localStorage.getItem(AUTH_TIMESTAMP_KEY);
  
  if (!authStatus || authStatus !== "true" || !timestamp) {
    return false;
  }
  
  // 세션 만료 확인 (24시간)
  const authTime = parseInt(timestamp, 10);
  const now = Date.now();
  
  if (now - authTime > SESSION_DURATION) {
    // 세션 만료
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_TIMESTAMP_KEY);
    return false;
  }
  
  return true;
}

// 현재 사용자 가져오기 (호환성을 위해 유지)
export async function getCurrentUser(): Promise<{ id: string } | null> {
  if (isAuthenticated()) {
    return { id: "admin" };
  }
  return null;
}
