"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn, isAuthenticated } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(true);

  // 이미 로그인되어 있는지 확인
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/admin/upload");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { success, error: signInError } = await signIn(password);
      
      if (!success) {
        setError(signInError || "비밀번호가 올바르지 않습니다.");
        setIsLoading(false);
        return;
      }

      // 로그인 성공 시 어드민 페이지로 리다이렉트
      router.push("/admin/upload");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "로그인 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">어드민 로그인</CardTitle>
          <CardDescription>
            관리자 비밀번호를 입력하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="4자리 비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={4}
                required
                disabled={isLoading}
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  로그인 중...
                </>
              ) : (
                "로그인"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
