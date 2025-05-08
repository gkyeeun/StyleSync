import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StartDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          무료로 시작하기
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>무료 체험 시작하기</DialogTitle>
          <DialogDescription>
            아래 정보를 입력하여 14일 무료 체험을 시작하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              이름
            </Label>
            <Input
              id="name"
              placeholder="홍길동"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              회사명
            </Label>
            <Input
              id="company"
              placeholder="회사명"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">시작하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 