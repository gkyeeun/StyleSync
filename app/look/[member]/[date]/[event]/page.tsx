"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Outfit } from "@/types/fashion";
import { loadOutfits, deleteOutfit } from "@/lib/fashionStorage";
import { ArrowLeft, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LookDetail() {
  const params = useParams();
  const router = useRouter();
  const { member, date, event } = params as { member: string; date: string; event: string };
  const decodedMember = decodeURIComponent(member);
  const decodedEvent = decodeURIComponent(event);
  const [outfit, setOutfit] = useState<Outfit | null>(null);

  useEffect(() => {
    if (decodedMember && decodedEvent) {
      const allOutfits = loadOutfits();
      // 해당 착장(멤버+날짜+카테고리)에 속한 아웃핏 찾기
      const found = allOutfits.find(
        (outfit) =>
          outfit.member === decodedMember &&
          outfit.date === date &&
          outfit.event === decodedEvent
      );
      setOutfit(found || null);
    }
  }, [decodedMember, decodedEvent]);

  const handleDelete = () => {
    if (outfit && window.confirm('이 룩을 삭제하시겠습니까?')) {
      deleteOutfit(outfit.id);
      router.push('/');
    }
  };

  // 브랜드별 공식몰/대표몰 검색 URL 패턴
  const brandSearchUrls: Record<string, (item: string) => string> = {
    AMIRI: (item) => `https://www.amiri.com/en-us/search?q=${encodeURIComponent(item)}`,
    LANVIN: (item) => `https://www.lanvin.com/en/search/?q=${encodeURIComponent(item)}`,
    ZARA: (item) => `https://www.zara.com/kr/ko/search?searchTerm=${encodeURIComponent(item)}`,
    MUSINSA: (item) => `https://search.musinsa.com/search/musinsa/goods?q=${encodeURIComponent(item)}`,
    '29CM': (item) => `https://search.29cm.co.kr/search?keyword=${encodeURIComponent(item)}`,
    // 필요시 추가 브랜드
  };

  function getPurchaseLink(brand: string, item: string) {
    const upperBrand = brand.trim().toUpperCase();
    if (brandSearchUrls[upperBrand]) {
      return brandSearchUrls[upperBrand](item);
    }
    // fallback: 구글 검색
    return `https://www.google.com/search?q=${encodeURIComponent(brand + ' ' + item)}`;
  }

  if (!outfit) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">No items found for this look.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background dark:bg-[#09090b]">
      <div className="container px-4 py-8 md:px-6">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-gray-200">
          <ArrowLeft className="mr-2 size-4" />
          Back to Home
        </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="size-4" />
            Delete Look
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <Image
              src={Array.isArray(outfit.image) ? outfit.image[0] : outfit.image[0]}
              alt={`${outfit.member}의 ${outfit.event} 패션`}
              className="size-full object-cover"
              width={300}
              height={400}
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-3xl font-bold">{outfit.member}</h1>
              <p className="text-gray-400">{outfit.event} · {outfit.date}</p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold">Items</h2>
              <div className="space-y-4">
                {outfit.items.map((item, idx) => (
                  <Card key={idx} className="mb-2 bg-background dark:bg-[#18181b]">
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="text-lg font-semibold">{item.brand}</div>
                          <div className="text-base">{item.item}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.currency} {item.price?.toLocaleString()}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {item.style.map((style) => (
                              <Badge key={style} variant="secondary" className="rounded-none border-0 bg-gray-100 font-medium text-gray-700">
                                {style}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button asChild variant="outline" className="mt-2 md:mt-0">
                          <a href={item.link || getPurchaseLink(item.brand, item.item)} target="_blank" rel="noopener noreferrer">
                            <ShoppingCart className="mr-2 size-4" /> 구매하러 가기
                          </a>
                        </Button>
                      </div>
                      {item.description && (
                        <div className="mt-2 text-xs text-gray-400">{item.description}</div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 