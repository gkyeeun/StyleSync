"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FashionItem } from "@/types/fashion";
import { loadFashionItems } from "@/lib/fashionStorage";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function AllLooks() {
  const [items, setItems] = useState<FashionItem[]>([]);

  useEffect(() => {
    const allItems = loadFashionItems();
    setItems(allItems);
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
      <div className="container px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">모든 착장</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <Card key={idx} className="bg-background dark:bg-[#18181b]">
              <CardContent className="p-4">
                <div className="relative aspect-[3/4] w-full mb-4">
                  <img
                    src={item.image && Array.isArray(item.image) ? item.image[0] : ""}
                    alt={`${item.member} fashion`}
                    className="object-cover w-full h-full rounded-none"
                  />
                </div>
                <div className="font-semibold text-lg">{item.member}</div>
                <div className="text-base">{item.event} · {item.date}</div>
                <div className="text-sm text-muted-foreground">₩ {item.price?.toLocaleString()}</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.style.map((style) => (
                    <Badge key={style} variant="secondary" className="rounded-none bg-gray-100 text-gray-700 border-0 font-medium">
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