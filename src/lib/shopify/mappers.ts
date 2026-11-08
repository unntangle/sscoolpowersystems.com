import { toNumber } from "@/lib/format";
import type {
  CartFragment,
  ImageFragment,
  MoneyFragment,
  ProductCardFragment,
  ProductDetailFragment,
} from "./__generated__/graphql";
import {
  fieldsToRecord,
  parseDecimal,
  parseEnergyRating,
  parseInteger,
  parsePriceBand,
  parsePricingMode,
  parseStringList,
  type PriceBand,
  type PricingMode,
} from "./metafields";

/*
 * Map raw Storefront fragments into the app's domain types.
 * Rule: the selling price is only exposed for `public` products. For quote-led products it is stripped
 * here, before data can reach a client component or an RSC payload.
 */

export interface ShopImage {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

export function toImage(image: ImageFragment | null | undefined): ShopImage | null {
  if (!image) return null;
  return {
    url: image.url,
    altText: image.altText ?? null,
    width: image.width ?? null,
    height: image.height ?? null,
  };
}

export function toAmount(money: MoneyFragment | null | undefined): number | null {
  return money ? toNumber(money.amount) : null;
}

// ---------- Product card ----------

export interface ProductCard {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  image: ShopImage | null;
  pricingMode: PricingMode;
  /** Only set for `public` products. */
  price: number | null;
  mrp: number | null;
  /** "Starting from" band for quote-led products (UI still respects the global show/hide switch). */
  priceBand: PriceBand | null;
  /** Variant to add to cart (public products only). */
  defaultVariantId: string | null;
  energyRating: number | null;
  capacity: string | null;
  keyFeatures: string[];
}

export function toProductCard(p: ProductCardFragment): ProductCard {
  const pricingMode = parsePricingMode(p.pricingMode?.value);
  const isPublic = pricingMode === "public";
  const minPrice = toAmount(p.priceRange.minVariantPrice);
  const compareAt = toAmount(p.compareAtPriceRange.maxVariantPrice);

  // Convention: quote-led products store MRP as their Shopify price (compare-at optional).
  const mrp = compareAt && compareAt > 0 ? compareAt : isPublic ? null : minPrice;

  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    vendor: p.vendor,
    productType: p.productType,
    tags: p.tags,
    availableForSale: p.availableForSale,
    image: toImage(p.featuredImage),
    pricingMode,
    price: isPublic ? minPrice : null,
    mrp,
    priceBand: isPublic ? null : parsePriceBand(p.priceBandMin?.value, p.priceBandMax?.value),
    defaultVariantId: isPublic ? (p.firstVariant.nodes[0]?.id ?? null) : null,
    energyRating: parseEnergyRating(p.energyRating?.value),
    capacity: p.capacity?.value?.trim() || null,
    keyFeatures: parseStringList(p.keyFeatures?.value),
  };
}

// ---------- Product detail ----------

export type ProductMedia =
  | { kind: "image"; alt: string | null; image: ShopImage }
  | { kind: "video"; alt: string | null; sources: { url: string; mimeType: string }[]; poster: ShopImage | null }
  | { kind: "external_video"; alt: string | null; embedUrl: string; host: string; poster: ShopImage | null };

export interface ProductVariant {
  id: string;
  title: string;
  sku: string | null;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  price: number | null;
  mrp: number | null;
  image: ShopImage | null;
}

export interface NotInBoxItem {
  id: string;
  item: string;
  /** Indicative only: always label as such in the UI. */
  indicativeCost: number | null;
  note: string | null;
}

export interface PackageItem {
  id: string;
  item: string;
  price: number | null;
  kind: string | null;
}

export interface BundleItem {
  variantId: string;
  title: string;
  productTitle: string;
  handle: string;
  image: ShopImage | null;
  price: number | null;
  mrp: number | null;
  availableForSale: boolean;
}

export interface ProductDetail extends ProductCard {
  description: string;
  descriptionHtml: string;
  seo: { title: string | null; description: string | null };
  options: { id: string; name: string; values: string[] }[];
  media: ProductMedia[];
  variants: ProductVariant[];
  warrantyYears: number | null;
  powerWatts: number | null;
  installationInfo: string | null;
  tamilTitle: string | null;
  tamilSummary: string | null;
  notInBox: NotInBoxItem[];
  allInPackage: PackageItem[];
  /** Opt-in add-ons. NEVER pre-select or auto-add these (compliance). */
  bundleItems: BundleItem[];
}

type MediaNode = ProductDetailFragment["media"]["nodes"][number];

function toMedia(node: MediaNode): ProductMedia | null {
  const alt = node.alt ?? null;
  switch (node.__typename) {
    case "MediaImage": {
      const image = toImage(node.image);
      return image ? { kind: "image", alt, image } : null;
    }
    case "Video":
      return {
        kind: "video",
        alt,
        sources: node.sources.map((s) => ({ url: s.url, mimeType: s.mimeType })),
        poster: toImage(node.previewImage),
      };
    case "ExternalVideo":
      return {
        kind: "external_video",
        alt,
        embedUrl: node.embedUrl,
        host: node.host,
        poster: toImage(node.previewImage),
      };
    default:
      return null; // 3D models: optional, not supported in v1
  }
}

type ReferenceNodes<K extends "notInBox" | "allInPackage" | "bundleItems"> = NonNullable<
  NonNullable<ProductDetailFragment[K]>["references"]
>["nodes"];

function metaobjectRecords(nodes: ReferenceNodes<"notInBox" | "allInPackage"> | undefined) {
  const out: { id: string; fields: Record<string, string | undefined> }[] = [];
  for (const node of nodes ?? []) {
    if (node.__typename === "Metaobject") out.push({ id: node.id, fields: fieldsToRecord(node.fields) });
  }
  return out;
}

export function toProductDetail(p: ProductDetailFragment): ProductDetail {
  const card = toProductCard(p);
  const isPublic = card.pricingMode === "public";

  const variants: ProductVariant[] = p.variants.nodes.map((v) => {
    const price = toAmount(v.price);
    const compareAt = toAmount(v.compareAtPrice);
    return {
      id: v.id,
      title: v.title,
      sku: v.sku ?? null,
      availableForSale: v.availableForSale,
      selectedOptions: v.selectedOptions.map((o) => ({ name: o.name, value: o.value })),
      price: isPublic ? price : null,
      mrp: compareAt && compareAt > 0 ? compareAt : isPublic ? null : price,
      image: toImage(v.image),
    };
  });

  const bundleItems: BundleItem[] = [];
  for (const node of p.bundleItems?.references?.nodes ?? []) {
    if (node.__typename !== "ProductVariant") continue;
    const compareAt = toAmount(node.compareAtPrice);
    bundleItems.push({
      variantId: node.id,
      title: node.title,
      productTitle: node.product.title,
      handle: node.product.handle,
      image: toImage(node.product.featuredImage),
      price: toAmount(node.price),
      mrp: compareAt && compareAt > 0 ? compareAt : null,
      availableForSale: node.availableForSale,
    });
  }

  return {
    ...card,
    description: p.description,
    descriptionHtml: p.descriptionHtml,
    seo: { title: p.seo.title ?? null, description: p.seo.description ?? null },
    options: p.options.map((o) => ({ id: o.id, name: o.name, values: o.optionValues.map((v) => v.name) })),
    media: p.media.nodes.map(toMedia).filter((m): m is ProductMedia => m !== null),
    variants,
    warrantyYears: parseInteger(p.warrantyYears?.value),
    powerWatts: parseInteger(p.powerWatts?.value),
    installationInfo: p.installationInfo?.value?.trim() || null,
    tamilTitle: p.tamilTitle?.value?.trim() || null,
    tamilSummary: p.tamilSummary?.value?.trim() || null,
    notInBox: metaobjectRecords(p.notInBox?.references?.nodes).map(({ id, fields }) => ({
      id,
      item: fields.item ?? "",
      indicativeCost: parseDecimal(fields.indicative_cost),
      note: fields.note ?? null,
    })),
    allInPackage: metaobjectRecords(p.allInPackage?.references?.nodes).map(({ id, fields }) => ({
      id,
      item: fields.item ?? "",
      price: parseDecimal(fields.price),
      kind: fields.kind ?? null,
    })),
    bundleItems,
  };
}

// ---------- Cart ----------

export interface CartLine {
  id: string;
  quantity: number;
  merchandiseId: string;
  title: string;
  variantTitle: string;
  handle: string;
  vendor: string;
  image: ShopImage | null;
  unitPrice: number | null;
  unitMrp: number | null;
  lineTotal: number | null;
  availableForSale: boolean;
  attributes: { key: string; value: string }[];
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: number | null;
  total: number | null;
  currencyCode: string;
  discountCodes: { code: string; applicable: boolean }[];
  attributes: { key: string; value: string }[];
  lines: CartLine[];
}

export function toCart(c: CartFragment): Cart {
  const lines: CartLine[] = [];
  for (const line of c.lines.nodes) {
    const m = line.merchandise;
    if (m.__typename !== "ProductVariant") continue;
    lines.push({
      id: line.id,
      quantity: line.quantity,
      merchandiseId: m.id,
      title: m.product.title,
      variantTitle: m.title,
      handle: m.product.handle,
      vendor: m.product.vendor,
      image: toImage(m.image),
      unitPrice: toAmount(line.cost.amountPerQuantity),
      unitMrp: toAmount(line.cost.compareAtAmountPerQuantity),
      lineTotal: toAmount(line.cost.totalAmount),
      availableForSale: m.availableForSale,
      attributes: line.attributes.map((a) => ({ key: a.key, value: a.value ?? "" })),
    });
  }

  return {
    id: c.id,
    checkoutUrl: c.checkoutUrl,
    totalQuantity: c.totalQuantity,
    subtotal: toAmount(c.cost.subtotalAmount),
    total: toAmount(c.cost.totalAmount),
    currencyCode: c.cost.totalAmount.currencyCode,
    discountCodes: c.discountCodes.map((d) => ({ code: d.code, applicable: d.applicable })),
    attributes: c.attributes.map((a) => ({ key: a.key, value: a.value ?? "" })),
    lines,
  };
}
