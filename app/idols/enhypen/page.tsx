"use client";

import { members } from "@/data/enhypen";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function EnhypenPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/idols">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft className="mr-2 size-4" />
          Back to Idols
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold">ENHYPEN</h1>
        <p className="text-muted-foreground">
          ENHYPEN 멤버들의 패션을 확인하고 구매할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {members.map((member) => (
          <Link key={member.id} href={`/idols/enhypen/${member.id}`}>
            <Card className="transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="relative mb-4 h-48 w-full">
                  <Image
                    src={member.image}
                    alt={member.stageName}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
                <h2 className="text-xl font-semibold">{member.stageName}</h2>
                <p className="text-muted-foreground">{member.name}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 