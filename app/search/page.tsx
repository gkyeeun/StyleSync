// app/search/page.tsx
import { Suspense } from "react";
import SearchClient from "./SearchClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center">로딩 중...</div>}>
      <SearchClient />
    </Suspense>
  );
}