import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Zap } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { StartDialog } from "@/components/start-dialog";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center space-y-4 pt-24 pb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          당신의 비즈니스를 위한<br />
          최고의 SaaS 솔루션
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          비즈니스 성장을 위한 모든 도구를 한 곳에서 만나보세요.
          지금 바로 시작하세요.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <StartDialog />
          <Button size="lg" variant="outline">
            데모 신청하기
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  빠른 성장
                </CardTitle>
                <CardDescription>
                  최적화된 도구로 비즈니스 성장을 가속화하세요.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>실시간 분석</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>자동화된 워크플로우</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>스마트 인사이트</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  쉬운 통합
                </CardTitle>
                <CardDescription>
                  기존 도구들과 원활하게 통합되어 작동합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>API 연동</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>플러그인 지원</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>맞춤형 통합</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-500" />
                  안전한 보안
                </CardTitle>
                <CardDescription>
                  최고 수준의 보안으로 데이터를 안전하게 보호합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>엔드투엔드 암호화</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>2단계 인증</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>정기 보안 감사</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              지금 바로 시작하세요
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
              14일 무료 체험으로 모든 기능을 경험해보세요.
              신용카드 정보가 필요하지 않습니다.
            </p>
            <StartDialog />
          </div>
        </div>
      </section>
    </div>
  );
}
