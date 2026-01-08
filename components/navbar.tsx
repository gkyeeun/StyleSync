"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchTerm.trim() !== '') {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-bold">
            StyleSync
          </Link>
          <Link href="/" className="text-lg font-medium text-muted-foreground">
          K-Fashion
        </Link>
        </div>
        <div className="flex items-center gap-4">
          {/* <Link href="/members">
            <Button variant="ghost">멤버</Button>
          </Link> */}
          <Link href="/gallery">
            <Button variant="ghost">갤러리</Button>
          </Link>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="검색..." 
              className="w-full pl-9 md:w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
          <Link href="/favorites">
            <Button variant="ghost" size="icon">
              <Heart className="size-5" />
            </Button>
          </Link>
          <Link href="/admin/upload">
            <Button variant="ghost" size="icon">
              <Shield className="size-5" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
} 