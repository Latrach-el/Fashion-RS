import { cn } from "@/lib/utils";
import { Shirt } from "lucide-react";
import Link from "next/link";

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 px-5 py-4 font-bold", className)}>
      <div className="relative">
        <Shirt className="h-6 w-6 text-black" strokeWidth={1.5} />
      </div>
      FashionFit
    </Link>
  );
}
