import Image from "next/image";
import type { ShopImage } from "@/lib/shopify/mappers";
import { cn } from "@/lib/utils";
import { artKindFor, ProductArt } from "./product-art";

interface ProductImageProps {
  image: ShopImage | null;
  title: string;
  productType?: string;
  /** next/image sizes attribute. */
  sizes: string;
  priority?: boolean;
  className?: string;
}

/** Square product image: Shopify photo when available, line-art placeholder otherwise. */
export function ProductImage({ image, title, productType, sizes, priority, className }: ProductImageProps) {
  return (
    <div className={cn("relative aspect-square overflow-hidden rounded-lg bg-neutral-50", className)}>
      {image ? (
        <Image
          src={image.url}
          alt={image.altText ?? title}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain p-4 mix-blend-multiply"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-[18%] text-brand-800/70">
          <ProductArt kind={artKindFor(productType, title)} label={title} />
        </div>
      )}
    </div>
  );
}
