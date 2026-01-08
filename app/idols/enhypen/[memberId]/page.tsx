"use client";

import { useState } from "react";
import { members, events } from "@/data/enhypen";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShoppingBag, Calendar, MapPin, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function MemberPage({ params }: { params: { memberId: string } }) {
  const member = members.find((m) => m.id === params.memberId);
  const memberEvents = events.filter((event) =>
    event.outfits.some((outfit) => outfit.memberId === params.memberId)
  );
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  if (!member) {
    return <div>Member not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/idols/enhypen">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 size-4" />
            Back to ENHYPEN
          </Button>
        </Link>
        <div className="flex items-center gap-6">
          <div className="relative size-32 overflow-hidden rounded-full">
            <Image
              src={member.image}
              alt={member.stageName}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{member.stageName}</h1>
            <p className="text-muted-foreground">{member.name}</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {memberEvents.map((event) => (
          <div key={event.id} className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              <h2 className="text-xl font-semibold">{event.name}</h2>
              <span className="text-muted-foreground">{event.date}</span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {event.outfits
                .filter((outfit) => outfit.memberId === params.memberId)
                .map((outfit) => (
                  <Card key={outfit.id}>
                    <CardHeader>
                      <CardTitle>{outfit.description}</CardTitle>
                      <CardDescription>{outfit.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative mb-4 h-64 w-full">
                        <Image
                          src={outfit.images[0]}
                          alt={outfit.description}
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>
                      <div className="space-y-4">
                        {outfit.items.map((item) => (
                          <div key={item.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {item.brand}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">
                                  ₩{item.price.toLocaleString()}
                                </p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => toggleItem(item.id)}
                                >
                                  {expandedItems.has(item.id) ? (
                                    <ChevronUp className="size-4" />
                                  ) : (
                                    <ChevronDown className="size-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            {expandedItems.has(item.id) && (
                              <div className="space-y-2 border-l-2 border-gray-200 pl-4">
                                {item.purchaseOptions.map((option) => (
                                  <div
                                    key={option.store}
                                    className="flex items-center justify-between text-sm"
                                  >
                                    <div>
                                      <p className="font-medium">
                                        {option.store}
                                      </p>
                                      <p className="text-muted-foreground">
                                        ₩{option.price.toLocaleString()}
                                      </p>
                                    </div>
                                    <Link
                                      href={option.link}
                                      target="_blank"
                                      className={option.inStock ? "" : "opacity-50"}
                                    >
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={!option.inStock}
                                      >
                                        <ExternalLink className="mr-2 size-4" />
                                        {option.inStock ? "구매하기" : "품절"}
                                      </Button>
                                    </Link>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 