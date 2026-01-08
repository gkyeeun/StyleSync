"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { createWorker } from "tesseract.js";
import { saveOutfit, loadOutfits, updateOutfit } from "@/lib/fashionStorage";
import { Outfit, ItemDetail } from "@/types/fashion";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { getFavoriteIds } from "@/lib/favorites";

export default function AdminUploadPage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    member: "",
    event: "공항",
    date: "",
    description: ""
  });
  const [outfitList, setOutfitList] = useState<Outfit[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  // 여러 아이템 입력 세트
  const [itemFields, setItemFields] = useState<ItemDetail[]>([
    {
      brand: "",
      item: "",
      price: 0,
      style: [],
      link: "",
      description: "",
      currency: "₩",
      name: "",
      purchaseLink: "",
      image: "",
      purchaseOptions: [],
      availability: "",
      lastUpdated: ""
    }
  ]);

  // 최초 마운트 시 데이터베이스에서 불러오기
  useEffect(() => {
    const loadData = async () => {
      const outfits = await loadOutfits();
      setOutfitList(outfits);
    };
    loadData();
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newBase64s: string[] = [];
    let loaded = 0;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (
          e.target?.result &&
          typeof e.target.result === 'string' &&
          e.target.result.startsWith('data:image/')
        ) {
          newBase64s.push(e.target.result);
        }
        loaded++;
        if (loaded === files.length) {
          // 빈 값 없이 data:image/로 시작하는 값만 저장
          const filtered = newBase64s.filter(img => img && img.startsWith('data:image/'));
          console.log('handleImageUpload: filtered images', filtered);
          setImages(prev => [...prev, ...filtered]);
          setImageFiles(prev => [...prev, ...filtered]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // OCR 텍스트 자동 파싱 함수
  function parseFashionText(text: string) {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    let brand = "";
    let item = "";
    let price = "";
    let member = "";
    let etc = "";
    
    const brandList: string[] = [];
    const itemList: string[] = [];
    const priceList: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^[A-Z][A-Z\s]+$/.test(line) && line.length < 30) {
        brandList.push(line);
        if (lines[i+1] && !/^[A-Z][A-Z\s]+$/.test(lines[i+1])) {
          itemList.push(lines[i+1]);
        }
        if (lines[i+2] && /[₩$]/.test(lines[i+2])) {
          priceList.push(lines[i+2]);
        }
      }
    }
    
    brand = brandList.join(", ");
    item = itemList.join(", ");
    price = priceList.join(", ");
    return { brand, item, price, member, etc };
  }

  const handleExtract = async () => {
    if (imageFiles.length === 0 || imageFiles.every(img => !img)) return;
    setLoading(true);
    try {
      const worker = await createWorker('eng') as any;
      const { data: { text } } = await worker.recognize(imageFiles[0]);
      setOcrText(text);
      // OCR 결과 자동 파싱 및 필드 자동 입력
      const parsed = parseFashionText(text);
      setFields(f => ({ ...f, ...parsed }));
      setItemFields([{
        brand: parsed.brand, item: parsed.item, price: Number(parsed.price) || 0, style: [], link: "", description: parsed.etc || "", currency: "₩",
        name: "",
        purchaseLink: "",
        image: "",
        purchaseOptions: []
      }]);
      await worker.terminate();
    } catch (err) {
      console.error('OCR Error:', err);
      setOcrText("OCR failed. Please try again.");
    }
    setLoading(false);
  };

  // 아이템 입력 세트 추가/삭제
  const handleAddItemField = () => {
    setItemFields([...itemFields, {
      brand: "", item: "", price: 0, style: [], link: "", description: "", currency: "₩",
      name: "",
      purchaseLink: "",
      image: "",
      purchaseOptions: []
    }]);
  };

  const handleRemoveItemField = (idx: number) => {
    setItemFields(itemFields.filter((_, i) => i !== idx));
  };

  const handleItemFieldChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setItemFields(prev => {
      const newFields = [...prev];
      const value = e.target.name === 'price' ? Number(e.target.value) || 0 : e.target.value;
      newFields[idx] = { ...newFields[idx], [e.target.name]: value };
      return newFields;
    });
  };

  // 기존 필드 핸들러 수정
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  // 저장/수정
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const outfitData = {
        member: fields.member,
        event: fields.event,
        date: fields.date || new Date().toISOString().slice(0, 10),
        image: images,
        description: fields.description,
        items: itemFields.map(item => ({
          ...item,
          price: Number(item.price) || 0,
          style: Array.isArray(item.style) ? item.style : [],
          link: item.link || "",
          description: item.description || "",
          currency: item.currency || "₩"
        }))
      };

      if (editId) {
        // 수정 모드: 기존 아이템 업데이트
        const favoriteIds = await getFavoriteIds();
        const updatedOutfit = {
          ...outfitData,
          id: editId,
          isSaved: favoriteIds.includes(editId)
        };
        await updateOutfit(updatedOutfit);
        const updatedList = await loadOutfits();
        setOutfitList(updatedList);
      } else {
        // 새 아이템 생성
        const newOutfit = await saveOutfit(outfitData);
        setOutfitList(prev => [newOutfit, ...prev]);
      }

      // 폼 초기화
      setFields({
        member: "",
        event: "공항",
        date: "",
        description: ""
      });
      setImages([]);
      setItemFields([{
        brand: "", item: "", price: 0, style: [], link: "", description: "", currency: "₩",
        name: "",
        purchaseLink: "",
        image: "",
        purchaseOptions: []
      }]);
      setEditId(null);

      router.refresh();
    } catch (error) {
      console.error("Error saving outfit:", error);
      alert("아이템 저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 수정 버튼 클릭 시
  const handleEdit = (outfit: Outfit) => {
    setFields({
      member: outfit.member,
      event: outfit.event,
      date: outfit.date,
      description: outfit.description || ""
    });
    setImages(Array.isArray(outfit.image) ? outfit.image : [outfit.image]);
    setItemFields(outfit.items);
    setEditId(outfit.id);
  };

  // 삭제 버튼 클릭 시
  const handleDelete = async (id: string) => {
    try {
      await deleteOutfit(id);
      const updatedList = await loadOutfits();
      setOutfitList(updatedList);
    } catch (error) {
      console.error('Error deleting outfit:', error);
      alert('아이템 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">Upload Fashion Item</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Member Info Section */}
        <Card>
          <CardHeader>
            <CardTitle>Member Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
                <Label htmlFor="member">Member</Label>
            <Input
              id="member"
              name="member"
              value={fields.member}
              onChange={handleFieldChange}
              required
            />
          </div>
          <div>
                <Label htmlFor="event">Event</Label>
                <select
                  id="event"
                  name="event"
                  value={fields.event}
                  onChange={handleFieldChange}
                  className="w-full rounded-md border bg-background px-3 py-2"
                  required
                >
                  <option value="공항">공항</option>
                  <option value="방송">방송</option>
                  <option value="행사">행사</option>
                  <option value="화보">화보</option>
                  <option value="위버스 셀카">위버스 셀카</option>
                  <option value="콘서트">콘서트</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={fields.date}
              onChange={handleFieldChange}
              required
            />
              </div>
          </div>
          <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={fields.description}
              onChange={handleFieldChange}
                placeholder="Enter outfit description..."
              />
          </div>
          </CardContent>
        </Card>

        {/* Image Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="image" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Upload className="size-4" />
                    <span>Upload Images</span>
        </div>
            <Input
                    id="image"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
                </Label>
                <Button
                  type="button"
                  onClick={handleExtract}
                  disabled={loading || images.length === 0}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    "Extract Text"
                  )}
                </Button>
        </div>

        {images.length > 0 && (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={img}
                        alt={`Uploaded ${idx + 1}`}
                        className="h-32 w-full rounded-lg object-cover"
                      />
                      <button
              type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
            )}
          </div>
          </CardContent>
        </Card>

        {/* Items Section */}
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
        <div className="space-y-4">
              {itemFields.map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor={`brand-${idx}`}>Brand</Label>
                    <Input
                      id={`brand-${idx}`}
                      name="brand"
                      value={item.brand}
                      onChange={(e) => handleItemFieldChange(idx, e)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`item-${idx}`}>Item</Label>
                    <Input
                      id={`item-${idx}`}
                      name="item"
                      value={item.item}
                      onChange={(e) => handleItemFieldChange(idx, e)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`price-${idx}`}>Price</Label>
                    <div className="flex gap-2">
                      <select
                        name="currency"
                        value={item.currency}
                        onChange={(e) => handleItemFieldChange(idx, e)}
                        className="w-20 rounded-md border bg-background p-2"
                      >
                        <option value="₩">₩</option>
                        <option value="$">$</option>
                      </select>
                      <Input
                        id={`price-${idx}`}
                        name="price"
                        type="number"
                        value={item.price}
                        onChange={(e) => handleItemFieldChange(idx, e)}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`link-${idx}`}>Link</Label>
                    <Input
                      id={`link-${idx}`}
                      name="link"
                      value={item.link}
                      onChange={(e) => handleItemFieldChange(idx, e)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={`description-${idx}`}>Description</Label>
                    <Textarea
                      id={`description-${idx}`}
                      name="description"
                      value={item.description}
                      onChange={(e) => handleItemFieldChange(idx, e)}
                      placeholder="Enter item description..."
                    />
                  </div>
                  {idx > 0 && (
                    <div className="md:col-span-2">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleRemoveItemField(idx)}
                      >
                        Remove Item
                      </Button>
                    </div>
                  )}
                </div>
          ))}
          <Button
            type="button"
                onClick={handleAddItemField}
            variant="outline"
          >
            Add Another Item
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Outfit"
            )}
          </Button>
        </div>
      </form>

      {/* Registered Items Section */}
      <div className="mt-10 space-y-4">
        <h2 className="mb-2 text-xl font-bold">Registered Outfits</h2>
        {outfitList.length === 0 ? (
          <div className="text-gray-500">No outfits registered yet.</div>
        ) : (
          outfitList.map(outfit => (
            <Card key={outfit.id} className="flex items-center gap-4 p-4">
              {outfit.image && Array.isArray(outfit.image) && outfit.image[0] && (
                <img
                  src={outfit.image[0]}
                  alt={outfit.member}
                  className="size-20 rounded object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{outfit.member}</h3>
                <p className="text-sm text-gray-500">{outfit.event}</p>
                <p className="text-sm text-gray-500">{outfit.date}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(outfit)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(outfit.id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 