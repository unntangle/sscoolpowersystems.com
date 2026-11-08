import Image from "next/image";
import { cn } from "@/lib/utils";
import { ProductArt, type ArtKind } from "./product-art";

type SceneTone = "warm" | "sand" | "cool" | "dark" | "light";

const scenes: Record<SceneTone, { wall: string; floor: string; art: string; light: string }> = {
  warm: {
    wall: "from-[#8c7663] via-[#7a6553] to-[#5f4e40]",
    floor: "from-[#4d3f34] to-[#3a2f27]",
    art: "text-[#f5efe6]",
    light: "bg-[#f3e3cc]/25",
  },
  sand: {
    wall: "from-[#d9c6ad] via-[#cbb495] to-[#b89d7e]",
    floor: "from-[#a68b6d] to-[#8f7659]",
    art: "text-[#3d3127]",
    light: "bg-white/40",
  },
  cool: {
    wall: "from-[#7d8c97] via-[#6c7b86] to-[#56636d]",
    floor: "from-[#465159] to-[#363f46]",
    art: "text-[#eef3f6]",
    light: "bg-white/25",
  },
  dark: {
    wall: "from-[#3a3632] via-[#2e2b28] to-[#22201e]",
    floor: "from-[#1c1a18] to-[#141312]",
    art: "text-[#e9e3da]",
    light: "bg-[#f3e3cc]/15",
  },
  light: {
    wall: "from-[#f1ece5] via-[#ebe4da] to-[#ddd3c6]",
    floor: "from-[#cfc3b3] to-[#bfb19f]",
    art: "text-[#43403b]",
    light: "bg-white/70",
  },
};

/** Styled room-scene placeholder: wall, window light, floor and the product as line art. */
export function ScenePlaceholder({
  art,
  tone = "warm",
  artPosition = "right",
  className,
}: {
  art: ArtKind;
  tone?: SceneTone;
  artPosition?: "right" | "center" | "left";
  className?: string;
}) {
  const s = scenes[tone];
  return (
    <div aria-hidden className={cn("absolute inset-0 overflow-hidden bg-gradient-to-b", s.wall, className)}>
      <div className={cn("absolute top-[8%] h-[58%] w-[22%] rounded-sm blur-2xl", s.light, artPosition === "left" ? "right-[12%]" : "left-[48%]")} />
      <div className={cn("absolute inset-x-0 bottom-0 h-[24%] bg-gradient-to-b", s.floor)} />
      <div
        className={cn(
          "absolute bottom-[14%] h-[62%] max-h-[30rem]",
          artPosition === "right" && "right-[6%] w-[42%] sm:right-[10%] sm:w-[32%]",
          artPosition === "center" && "left-1/2 w-[46%] -translate-x-1/2",
          artPosition === "left" && "left-[8%] w-[36%]",
          s.art,
        )}
      >
        <ProductArt kind={art} className="drop-shadow-[0_30px_30px_rgba(0,0,0,0.25)] [&_*]:[fill-opacity:0.06]" />
      </div>
    </div>
  );
}

/** Real photo when available, otherwise the placeholder scene. Always fills its (relative) parent. */
export function Photo({
  src,
  alt,
  art,
  tone,
  artPosition,
  sizes,
  priority,
  className,
}: {
  src: string | null;
  alt: string;
  art: ArtKind;
  tone?: SceneTone;
  artPosition?: "right" | "center" | "left";
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (src) {
    return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={cn("object-cover", className)} />;
  }
  return <ScenePlaceholder art={art} tone={tone} artPosition={artPosition} className={className} />;
}
