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
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Idols
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">ENHYPEN</h1>
        <p className="text-muted-foreground">
          ENHYPEN 멤버들의 패션을 확인하고 구매할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {members.map((member) => (
          <Link key={member.id} href={`/idols/enhypen/${member.id}`}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="relative h-48 w-full mb-4">
                  <Image
                    src={member.image}
                    alt={member.stageName}
                    fill
                    className="object-cover rounded-lg"
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