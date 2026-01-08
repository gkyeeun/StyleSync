"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { ArrowLeft, Heart, Share2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// 임시 데이터
const idolData = {
  name: "NewJeans",
  image: "https://picsum.photos/800/800?random=1",
  description: "HYBE 소속의 5인조 걸그룹",
  outfits: [
    {
      id: 1,
      name: "Hypebeast 스타일",
      image: "https://picsum.photos/800/600?random=4",
      brand: "Nike x Stussy",
      price: "₩450,000",
      items: [
        { name: "Nike x Stussy Hoodie", price: "₩250,000" },
        { name: "Nike Air Force 1", price: "₩200,000" },
      ],
    },
    {
      id: 2,
      name: "미니멀리스트 룩",
      image: "https://picsum.photos/800/600?random=5",
      brand: "Acne Studios",
      price: "₩380,000",
      items: [
        { name: "Acne Studios Sweater", price: "₩280,000" },
        { name: "Acne Studios Jeans", price: "₩100,000" },
      ],
    },
  ],
};

export default function IdolPage({ params }: { params: { idolId: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      {/* Back Button */}
      <div className="container p-4 md:px-6">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="size-4" />
            뒤로 가기
          </Button>
        </Link>
      </div>

      {/* Idol Profile */}
      <section className="container px-4 py-8 md:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={idolData.image}
              alt={idolData.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-4xl font-bold">{idolData.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">
              {idolData.description}
            </p>
            <div className="flex gap-4">
              <Button variant="outline" size="lg" className="gap-2">
                <Heart className="size-4" />
                좋아요
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Share2 className="size-4" />
                공유하기
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Outfits Section */}
      <section className="container px-4 py-8 md:px-6">
        <h2 className="mb-8 text-3xl font-bold">최근 의상</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {idolData.outfits.map((outfit) => (
            <Card key={outfit.id}>
              <div className="relative aspect-video">
                <Image
                  src={outfit.image}
                  alt={outfit.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{outfit.name}</CardTitle>
                <CardDescription>
                  브랜드: {outfit.brand}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {outfit.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="text-gray-500">{item.price}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full gap-2">
                    <ShoppingBag className="size-4" />
                    구매하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
} 