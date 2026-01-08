"use client";

import { useEffect, useState } from 'react';
import { Outfit, Style } from "@/types/fashion";
import { loadOutfits } from "@/lib/fashionStorage";
import { getFavoriteIds, toggleFavorite } from "@/lib/favorites";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

// FashionCard 컴포넌트
const FashionCard = ({ outfit }: { outfit: Outfit }) => (
  <Link 
    href={`/look/${encodeURIComponent(outfit.member)}/${outfit.date}/${encodeURIComponent(outfit.event)}`} 
    key={outfit.id}
  >
    <Card className="overflow-hidden rounded-none transition-all duration-300 hover:scale-105 hover:shadow-lg">
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
    </Card>
  </Link>
);

// 찜 토글 핸들러
const handleToggleFavorite = async (e: React.MouseEvent, outfitId: string) => {
  e.preventDefault();
  e.stopPropagation();
  await toggleFavorite(outfitId);
  // Note: State update will happen in the parent component
};

export default function GalleryPage() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("latest");

  useEffect(() => {
    const loadData = async () => {
      const allOutfits = await loadOutfits();
      const favoriteIds = await getFavoriteIds();
      
      // Filter out outfits that have no images
      const outfitsWithImages = allOutfits.filter(outfit => 
        Array.isArray(outfit.image) && 
        outfit.image.length > 0 && 
        outfit.image.some(img => typeof img === 'string' && img.trim() !== '')
      );

      const outfitsWithSavedStatus = outfitsWithImages.map(outfit => ({
        ...outfit,
        isSaved: favoriteIds.includes(outfit.id)
      }));
      
      setOutfits(outfitsWithSavedStatus);
      setLoading(false);
    };
    loadData();
  }, []);

  // 찜 상태가 변경될 때마다 아이템 목록 업데이트
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

  // 필터링 및 정렬된 아이템 목록
  const filteredAndSortedOutfits = outfits
    .filter(outfit => selectedMember === "all" || outfit.member === selectedMember)
    .filter(outfit => selectedEvent === "all" || outfit.event === selectedEvent)
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return 0;
    });

  // 고유한 멤버 목록 추출
  const uniqueMembers = Array.from(new Set(outfits.map(outfit => outfit.member))).sort();
  
  // 고유한 이벤트 목록 추출
  const uniqueEvents = Array.from(new Set(outfits.map(outfit => outfit.event))).sort();

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">로딩 중...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">갤러리</h1>
        <div className="flex gap-4">
          <Select value={selectedMember} onValueChange={setSelectedMember}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="멤버 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 멤버</SelectItem>
              {uniqueMembers.map(member => (
                <SelectItem key={member} value={member}>
                  {member}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="활동 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 활동</SelectItem>
              {uniqueEvents.map(event => (
                <SelectItem key={event} value={event}>
                  {event}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="정렬 기준" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="oldest">오래된 순</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAndSortedOutfits.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedOutfits.map(outfit => (
            <FashionCard key={outfit.id} outfit={outfit} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          표시할 아이템이 없습니다.
        </div>
      )}
    </div>
  );
} 