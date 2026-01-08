"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { FashionItem, Style } from "@/types/fashion"
import { useEffect, useState } from "react"
import { getFavoriteIds, toggleFavorite } from "@/lib/favorites"
import { loadFashionItems } from "@/lib/fashionStorage"
import Image from "next/image"

// 임시 데이터
const fashionItems: FashionItem[] = [
  {
    id: "1",
    member: "정원",
    event: "공항",
    date: "2024-03-15",
    image: ["https://i.imgur.com/4QZt5Gx.jpg"],
    brand: "ADER ERROR",
    item: "Oversized T-shirt",
    style: ["꾸안꾸", "모노톤"],
    link: "https://www.musinsa.com/app/goods/123456",
    description: "정원의 공항 패션",
    price: 189000,
    isSaved: false,
    items: []
  },
  {
    id: "2",
    member: "성훈",
    event: "위버스 셀카",
    date: "2024-03-14",
    image: ["https://i.imgur.com/5QZt5Gx.jpg"],
    brand: "BALENCIAGA",
    item: "Track Jacket",
    style: ["스트릿", "오버사이즈"],
    link: "https://www.musinsa.com/app/goods/123457",
    description: "성훈의 위버스 셀카 패션",
    price: 289000,
    isSaved: false,
    items: []
  },
  {
    id: "3",
    member: "희승",
    event: "콘서트",
    date: "2024-03-13",
    image: ["https://i.imgur.com/6QZt5Gx.jpg"],
    brand: "SAINT LAURENT",
    item: "Leather Jacket",
    style: ["올블랙", "시크"],
    link: "https://www.musinsa.com/app/goods/123458",
    description: "희승의 콘서트 패션",
    price: 389000,
    isSaved: false,
    items: []
  }
]

export default function MemberPage({ params }: { params: { memberId: string } }) {
  const [items, setItems] = useState<FashionItem[]>([])
  const [selectedEvent, setSelectedEvent] = useState<string>("all")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [selectedStyle, setSelectedStyle] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])

  useEffect(() => {
    const loaded = loadFashionItems().map(item => ({
      ...item,
      style: item.style as Style[],
      isSaved: getFavoriteIds().includes(item.id),
      description: item.description ?? "",
      price: Number(item.price) || 0,
    }));
    setItems(loaded);
  }, []);

  // 찜 상태가 변경될 때마다 아이템 목록 업데이트
  useEffect(() => {
    const favoriteIds = getFavoriteIds();
    setItems(prevItems => 
      prevItems.map(item => ({
        ...item,
        isSaved: favoriteIds.includes(item.id)
      }))
    );
  }, []);

  // 멤버별 필터링
  const memberItems = items.filter(item => item.member === params.memberId)

  // 이벤트 유형별 필터링
  const eventFilteredItems = selectedEvent === "all" 
    ? memberItems 
    : memberItems.filter(item => item.event === selectedEvent)

  // 브랜드별 필터링
  const brandFilteredItems = selectedBrand === "all"
    ? eventFilteredItems
    : eventFilteredItems.filter(item => item.brand === selectedBrand)

  // 스타일별 필터링
  const styleFilteredItems = selectedStyle === "all"
    ? brandFilteredItems
    : brandFilteredItems.filter(item => item.style.includes(selectedStyle as any))

  // 가격 범위 필터링
  const priceFilteredItems = styleFilteredItems.filter(
    item => item.price >= priceRange[0] && item.price <= priceRange[1]
  )

  // 날짜순 정렬
  const sortedItems = [...priceFilteredItems].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const handleToggleFavorite = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(itemId);
    setItems(prevItems => 
      prevItems.map(item => ({
      ...item,
      isSaved: item.id === itemId ? !item.isSaved : item.isSaved
      }))
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {params.memberId}&apos;s Fashion
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                Check out {params.memberId}&apos;s various fashion styles.
              </p>
            </div>

            {/* Filters */}
            <div className="mt-8 grid gap-6">
              <div className="flex flex-wrap gap-4">
                <Button
                  variant={selectedEvent === "all" ? "default" : "outline"}
                  onClick={() => setSelectedEvent("all")}
                >
                  All
                </Button>
                <Button
                  variant={selectedEvent === "Airport" ? "default" : "outline"}
                  onClick={() => setSelectedEvent("Airport")}
                >
                  Airport
                </Button>
                <Button
                  variant={selectedEvent === "Weverse Selfie" ? "default" : "outline"}
                  onClick={() => setSelectedEvent("Weverse Selfie")}
                >
                  Weverse Selfie
                </Button>
                <Button
                  variant={selectedEvent === "Concert" ? "default" : "outline"}
                  onClick={() => setSelectedEvent("Concert")}
                >
                  Concert
                </Button>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  variant={selectedBrand === "all" ? "default" : "outline"}
                  onClick={() => setSelectedBrand("all")}
                >
                  All Brands
                </Button>
                <Button
                  variant={selectedBrand === "ADER ERROR" ? "default" : "outline"}
                  onClick={() => setSelectedBrand("ADER ERROR")}
                >
                  ADER ERROR
                </Button>
                <Button
                  variant={selectedBrand === "BALENCIAGA" ? "default" : "outline"}
                  onClick={() => setSelectedBrand("BALENCIAGA")}
                >
                  BALENCIAGA
                </Button>
                <Button
                  variant={selectedBrand === "SAINT LAURENT" ? "default" : "outline"}
                  onClick={() => setSelectedBrand("SAINT LAURENT")}
                >
                  SAINT LAURENT
                </Button>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  variant={selectedStyle === "all" ? "default" : "outline"}
                  onClick={() => setSelectedStyle("all")}
                >
                  All Styles
                </Button>
                <Button
                  variant={selectedStyle === "Casual" ? "default" : "outline"}
                  onClick={() => setSelectedStyle("Casual")}
                >
                  Casual
                </Button>
                <Button
                  variant={selectedStyle === "Monotone" ? "default" : "outline"}
                  onClick={() => setSelectedStyle("Monotone")}
                >
                  Monotone
                </Button>
                <Button
                  variant={selectedStyle === "Street" ? "default" : "outline"}
                  onClick={() => setSelectedStyle("Street")}
                >
                  Street
                </Button>
                <Button
                  variant={selectedStyle === "Oversized" ? "default" : "outline"}
                  onClick={() => setSelectedStyle("Oversized")}
                >
                  Oversized
                </Button>
                <Button
                  variant={selectedStyle === "All Black" ? "default" : "outline"}
                  onClick={() => setSelectedStyle("All Black")}
                >
                  All Black
                </Button>
                <Button
                  variant={selectedStyle === "Chic" ? "default" : "outline"}
                  onClick={() => setSelectedStyle("Chic")}
                >
                  Chic
                </Button>
              </div>
            </div>

            {/* Items Grid */}
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedItems.map((item) => (
                <Link href={`/look/${item.id}`} key={item.id}>
                  <Card className="overflow-hidden rounded-none transition-shadow hover:shadow-lg">
                    <CardContent className="p-0">
                      <div className="relative aspect-[3/4]">
                        <Image
                          src={Array.isArray(item.image) ? item.image[0] : item.image}
                          alt={`${item.member}의 ${item.event} 패션`}
                          className="size-full object-cover"
                          width={300}
                          height={400}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="p-4">
                      <div className="flex w-full items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{item.event}</h3>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                          <p className="mb-2 text-sm">{item.brand}</p>
                          <div className="flex flex-wrap gap-2">
                            {item.style.map((style:any) => (
                              <Badge key={style} variant="secondary" className="rounded-none">
                                {style}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={item.isSaved ? "text-red-500" : ""}
                          onClick={(e) => handleToggleFavorite(e, item.id)}
                        >
                          <Heart className="size-5" />
                        </Button>
                      </div>
                    </CardFooter>
                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full rounded-none" asChild>
                        <a href={item.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          구매하기
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 