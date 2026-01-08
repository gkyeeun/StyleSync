"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Zap, Star, Heart } from "lucide-react";
import Link from "next/link";
import { StartDialog } from "@/components/start-dialog";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Style, Outfit, ItemDetail } from "@/types/fashion";
import { useEffect, useState } from "react";
import { getFavoriteIds, toggleFavorite, getFavoriteItems } from "@/lib/favorites";
import { loadOutfits } from "@/lib/fashionStorage";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const featuredIdols = [
  {
    id: "newjeans",
    name: "NewJeans",
    image: "https://i.imgur.com/8tMUxPj.jpg",
    latestOutfit: "Hypebeast 스타일",
    brand: "Nike x Stussy",
  },
  {
    id: "enhypen",
    name: "ENHYPEN",
    image: "https://i.imgur.com/2QZt5Gx.jpg",
    latestOutfit: "모노톤 스트릿 룩",
    brand: "Balenciaga",
  },
  {
    id: "lesserafim",
    name: "LE SSERAFIM",
    image: "https://i.imgur.com/3QZt5Gx.jpg",
    latestOutfit: "스트릿 패션",
    brand: "Off-White",
  },
];

// 임시 데이터 (이제 Outfit[] 구조를 사용)
const temporaryOutfits: Outfit[] = [
  {
    id: "1",
    member: "정원",
    event: "공항",
    date: "2024-03-15",
    image: ["https://i.imgur.com/4QZt5Gx.jpg"],
    description: "정원의 공항 패션",
    items: [
      {
        brand: "ADER ERROR", item: "Oversized T-shirt", price: 189000, style: ["꾸안꾸", "모노톤"], link: "https://www.musinsa.com/app/goods/123456", currency: "₩",
        name: "",
        purchaseLink: "",
        image: "",
        purchaseOptions: []
      }
    ],
    isSaved: false
  },
  {
    id: "2",
    member: "성훈",
    event: "위버스 셀카",
    date: "2024-03-14",
    image: ["https://i.imgur.com/5QZt5Gx.jpg"],
    description: "성훈의 위버스 셀카 패션",
    items: [
      {
        brand: "BALENCIAGA", item: "Track Jacket", price: 289000, style: ["스트릿", "오버사이즈"], link: "https://www.musinsa.com/app/goods/123457", currency: "₩",
        name: "",
        purchaseLink: "",
        image: "",
        purchaseOptions: []
      }
    ],
    isSaved: false
  },
  {
    id: "3",
    member: "희승",
    event: "콘서트",
    date: "2024-03-13",
    image: ["https://i.imgur.com/6QZt5Gx.jpg"],
    description: "희승의 콘서트 패션",
    items: [
      {
        brand: "SAINT LAURENT", item: "Leather Jacket", price: 389000, style: ["올블랙", "시크"], link: "https://www.musinsa.com/app/goods/123458", currency: "₩",
        name: "",
        purchaseLink: "",
        image: "",
        purchaseOptions: []
      }
    ],
    isSaved: false
  }
];

const eventCategories = [
  { id: "all", label: "전체" },
  { id: "공항", label: "공항" },
  { id: "방송", label: "방송" },
  { id: "행사", label: "행사" },
  { id: "화보", label: "화보" },
  { id: "위버스 셀카", label: "위버스 셀카" },
  { id: "콘서트", label: "콘서트" },
  { id: "기타", label: "기타" },
]

const members = ["정원", "성훈", "희승", "니키", "제이", "제이크", "선우"]

// Debounce hook (keeping it local as per original structure)
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Home() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [selectedMember, setSelectedMember] = useState<string>("all");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [filteredOutfits, setFilteredOutfits] = useState<Outfit[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const loadData = async () => {
      console.log('Home page useEffect: Loading outfits...');
      // Combine temporary data with loaded data, prioritize loaded data if IDs overlap
      const temporaryOutfits: Outfit[] = [
        // Your temporary outfit data here
      ];

      const loadedOutfitsData = await loadOutfits();
      const favoriteIdsData = await getFavoriteIds();
      
      const loadedOutfits = loadedOutfitsData.map(outfit => ({
          ...outfit,
          // Ensure nested item details conform to type
          items: outfit.items ? outfit.items.map((item: any) => ({
             ...item,
             currency: item.currency ?? "", // Ensure currency exists
             price: Number(item.price) || 0,
             style: Array.isArray(item.style) ? item.style : [], // Ensure style is array
             link: item.link || "", // Ensure link exists
             description: item.description || "" // Ensure description exists
          })) : [], // Ensure items is an array
          isSaved: favoriteIdsData.includes(outfit.id) // Sync saved status
       }));

      console.log('Home page useEffect: Loaded outfits', loadedOutfits);

      // Simple merge logic: Loaded data replaces temporary data with same ID
      const mergedOutfits = temporaryOutfits.map(tempOutfit => {
          const loaded = loadedOutfits.find(loadedOutfit => loadedOutfit.id === tempOutfit.id);
          return loaded ? loaded : tempOutfit;
      });
      // Add loaded outfits that were not in temporary data
      loadedOutfits.forEach(loadedOutfit => {
          if (!mergedOutfits.some(merged => merged.id === loadedOutfit.id)) {
              mergedOutfits.push(loadedOutfit);
          }
      });

      setOutfits(mergedOutfits);
      setFavoriteIds(favoriteIdsData);
    };
    loadData();
  }, []);

  // 찜 상태가 변경될 때마다 아웃핏 목록 업데이트
  useEffect(() => {
    const updateFavorites = async () => {
      const favoriteIds = await getFavoriteIds();
      setOutfits(prevOutfits =>
        prevOutfits.map(outfit => ({
          ...outfit,
          isSaved: favoriteIds.includes(outfit.id)
        }))
      );
    };
    updateFavorites();
  }, []);

  // 이벤트별 필터링
  const eventFilteredOutfits = selectedEvent === "all"
    ? outfits
    : outfits.filter(outfit => outfit.event === selectedEvent);

  // 멤버별 필터링
  const memberFilteredOutfits = selectedMember === "all"
    ? outfits
    : outfits.filter(outfit => outfit.member === selectedMember);

  // 날짜순 정렬 (전체 아웃핏 기준)
  const recentOutfits = [...outfits].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 날짜별로 아웃핏 그룹화
  const groupedRecentOutfits: { [date: string]: Outfit[] } = recentOutfits.reduce((acc, outfit) => {
    const date = outfit.date;
    if (!acc[date]) {
      acc[date] = [];
      }
    acc[date].push(outfit);
      return acc;
  }, {} as { [date: string]: Outfit[] });

  // 멤버별 최신 아웃핏 (필터링된 멤버 기준)
  const memberLatestOutfits = [...memberFilteredOutfits].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 6);

  const handleToggleFavorite = (e: React.MouseEvent, outfitId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(outfitId);

    // 찜 상태 업데이트
    setOutfits(prevOutfits =>
      prevOutfits.map(outfit => ({
        ...outfit,
        isSaved: outfit.id === outfitId ? !outfit.isSaved : outfit.isSaved
      }))
    );
  };

  const FashionCard = ({ outfit }: { outfit: Outfit }) => (
    <Link
      href={`/look/${encodeURIComponent(outfit.member)}/${outfit.date}/${encodeURIComponent(outfit.event)}`}
      key={outfit.id}
    >
      <Card className="overflow-hidden rounded-none transition-all hover:scale-105 hover:shadow-lg">
        <CardContent className="p-0">
          <div className="relative aspect-[3/4]">
            <Image
              src={Array.isArray(outfit.image) ? outfit.image[0] : outfit.image[0]}
              alt={`${outfit.member}의 ${outfit.event} 패션`}
              className="size-full object-cover"
              width={300}
              height={400}
            />
          </div>
        </CardContent>
        <CardFooter className="p-4">
          <div className="flex w-full items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{outfit.event}</h3>
              <p className="text-sm text-muted-foreground">{outfit.date}</p>
              {/* Display info for the first item as an example */}
              {outfit.items.length > 0 && (
                <>
                  <p className="mb-2 text-sm">{outfit.items[0].brand}</p>
                  <div className="flex flex-wrap gap-2">
                    {outfit.items[0].style.map((style:any, idx:any) => (
                      <Badge key={idx} variant="secondary" className="rounded-none">
                        {style}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={outfit.isSaved ? "text-red-500" : ""}
              onClick={(e) => handleToggleFavorite(e, outfit.id)}
            >
              <Heart className="size-5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )

  const LatestCard = ({ outfit }: { outfit: Outfit }) => (
    <Link
      href={`/look/${encodeURIComponent(outfit.member)}/${outfit.date}/${encodeURIComponent(outfit.event)}`}
      key={outfit.id}
    >
      <Card className="flex flex-row overflow-hidden rounded-lg transition-shadow hover:shadow-lg">
        <CardContent className="grow p-4">
          <div className="flex h-full flex-col justify-between">
            <div>
              <h3 className="mb-1 text-lg font-bold">{outfit.event}</h3>
              <p className="mb-1 text-sm text-muted-foreground">{outfit.date}</p>
              {outfit.items.length > 0 && (
                <p className="line-clamp-1 text-sm text-muted-foreground">{outfit.items[0].brand} - {outfit.items[0].item}</p>
              )}
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{outfit.description}</p>
            </div>
            {/* 찜 버튼 */}
            <Button
              variant="ghost"
              size="icon"
              className={outfit.isSaved ? "text-red-500" : "text-muted-foreground"}
              onClick={(e) => handleToggleFavorite(e, outfit.id)}
            >
              <Heart className="size-5" />
            </Button>
          </div>
        </CardContent>
        <div className="relative m-4 size-24 shrink-0">
            <Image
              src={Array.isArray(outfit.image) ? outfit.image[0] : outfit.image[0]}
              alt={`${outfit.member}의 ${outfit.event} 패션`}
              className="size-full rounded-md object-cover"
              width={96}
              height={96}
            />
          </div>
      </Card>
    </Link>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center space-y-4 pb-12 pt-24 text-center">
          <h1 className="mb-2 text-5xl font-extrabold tracking-tight">StyleSync</h1>
          <p className="mx-auto max-w-[700px] font-medium text-muted-foreground md:text-xl">
          Discover the latest K-pop fashion trends and brand information.<br />
          Get inspired by your favorite idols&apos; styles.
        </p>
      </section>

        {/* 활동별 섹션 */}
        <section className="w-full py-12">
          <div className="container px-4 md:px-6">
            <h2 className="mb-6 text-2xl font-bold">활동별</h2>
            <div className="mb-8 flex flex-wrap gap-2">
              {eventCategories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedEvent === category.id ? "default" : "outline"}
                  className="rounded-none"
                  onClick={() => setSelectedEvent(category.id)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
            <Carousel
              plugins={[
                Autoplay({ delay: 2000, stopOnInteraction: true }),
              ]}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {eventFilteredOutfits.length > 0 ? (
                  eventFilteredOutfits.map((outfit) => (
                    <CarouselItem key={outfit.id} className="basis-1/3 pl-4">
                      <div className="p-1">
                        <FashionCard outfit={outfit} />
                      </div>
                    </CarouselItem>
                  ))
                ) : (
                  <div className="col-span-full py-8 pl-4 text-center text-muted-foreground">
                    해당 카테고리의 아이템이 없습니다.
                  </div>
                )}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        {/* 멤버별 섹션 */}
        <section className="w-full bg-muted/50 py-12">
          <div className="container px-4 md:px-6">
            <h2 className="mb-6 text-2xl font-bold">멤버별</h2>
            <div className="mb-8 flex flex-wrap gap-2">
            <Button
              variant={selectedMember === "all" ? "default" : "outline"}
              className="rounded-none"
              onClick={() => setSelectedMember("all")}
            >
                전체
            </Button>
            {members.map(member => (
              <Button
                key={member}
                variant={selectedMember === member ? "default" : "outline"}
                className="rounded-none"
                onClick={() => setSelectedMember(member)}
              >
                {member}
              </Button>
            ))}
          </div>
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {memberLatestOutfits.map((outfit) => (
                  <CarouselItem key={outfit.id} className="basis-1/3 pl-4">
                    <div className="p-1">
                      <FashionCard outfit={outfit} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
        </div>
      </section>

        {/* 최신순 섹션 */}
        <section className="w-full py-12">
        <div className="container px-4 md:px-6">
            <h2 className="mb-6 text-2xl font-bold">최신순</h2>
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {recentOutfits.map((outfit) => (
                  <CarouselItem key={outfit.id} className="basis-1/3 pl-4">
                    <div className="p-1">
                      <LatestCard outfit={outfit} />
                    </div>
                  </CarouselItem>
            ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
        </div>
      </section>
      </main>
    </div>
  );
}
