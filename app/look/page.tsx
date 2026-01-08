"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FashionItem } from "@/types/fashion";
import { loadFashionItems } from "@/lib/fashionStorage";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AllLooks() {
  const [items, setItems] = useState<FashionItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const allItems = await loadFashionItems();
      setItems(allItems);
    };
    loadData();
  }, []);

  if (!items.length) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">No looks found.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background dark:bg-[#09090b]">
      <div className="container px-4 py-8 md:px-6">
        <h1 className="mb-8 text-3xl font-bold">모든 착장</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <Card key={idx} className="bg-background dark:bg-[#18181b]">
              <CardContent className="p-4">
                <div className="relative mb-4 aspect-[3/4] w-full">
                  <Image
                    src={Array.isArray(item.image) ? item.image[0] : item.image[0]}
                    alt={`${item.member}의 ${item.event} 패션`}
                    className="size-full object-cover"
                    width={300}
                    height={400}
                  />
                </div>
                <div className="text-lg font-semibold">{item.member}</div>
                <div className="text-base">{item.event} · {item.date}</div>
                <div className="text-sm text-muted-foreground">₩ {item.price?.toLocaleString()}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.style.map((style:any) => (
                    <Badge key={style} variant="secondary" className="rounded-none border-0 bg-gray-100 font-medium text-gray-700">
                      {style}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/look/${encodeURIComponent(item.member)}/${item.date}/${encodeURIComponent(item.event)}`}>
                    상세 보기
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 