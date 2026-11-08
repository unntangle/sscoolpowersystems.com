import { graphql } from "./__generated__";

/*
 * Shared Storefront fragments. Metafields use the `ss` namespace (see scripts/seed-shopify.ts).
 * Codegen inlines referenced fragments into each operation document.
 */

export const ImageFragment = graphql(`
  fragment Image on Image {
    url
    altText
    width
    height
  }
`);

export const MoneyFragment = graphql(`
  fragment Money on MoneyV2 {
    amount
    currencyCode
  }
`);

export const MenuItemFragment = graphql(`
  fragment MenuItem on MenuItem {
    id
    title
    url
    type
    resourceId
    tags
  }
`);

/** Everything a product card / listing / search result needs. */
export const ProductCardFragment = graphql(`
  fragment ProductCard on Product {
    id
    handle
    title
    vendor
    productType
    availableForSale
    tags
    featuredImage {
      ...Image
    }
    priceRange {
      minVariantPrice {
        ...Money
      }
      maxVariantPrice {
        ...Money
      }
    }
    compareAtPriceRange {
      maxVariantPrice {
        ...Money
      }
    }
    firstVariant: variants(first: 1) {
      nodes {
        id
        availableForSale
      }
    }
    pricingMode: metafield(namespace: "ss", key: "pricing_mode") {
      value
    }
    priceBandMin: metafield(namespace: "ss", key: "price_band_min") {
      value
    }
    priceBandMax: metafield(namespace: "ss", key: "price_band_max") {
      value
    }
    energyRating: metafield(namespace: "ss", key: "energy_rating") {
      value
    }
    capacity: metafield(namespace: "ss", key: "capacity") {
      value
    }
    keyFeatures: metafield(namespace: "ss", key: "key_features") {
      value
    }
  }
`);

/** Full product page data. */
export const ProductDetailFragment = graphql(`
  fragment ProductDetail on Product {
    ...ProductCard
    description
    descriptionHtml
    seo {
      title
      description
    }
    options {
      id
      name
      optionValues {
        id
        name
      }
    }
    media(first: 20) {
      nodes {
        __typename
        alt
        mediaContentType
        ... on MediaImage {
          image {
            ...Image
          }
        }
        ... on Video {
          sources {
            url
            mimeType
          }
          previewImage {
            ...Image
          }
        }
        ... on ExternalVideo {
          embedUrl
          host
          previewImage {
            ...Image
          }
        }
      }
    }
    variants(first: 50) {
      nodes {
        id
        title
        sku
        availableForSale
        selectedOptions {
          name
          value
        }
        price {
          ...Money
        }
        compareAtPrice {
          ...Money
        }
        image {
          ...Image
        }
      }
    }
    warrantyYears: metafield(namespace: "ss", key: "warranty_years") {
      value
    }
    powerWatts: metafield(namespace: "ss", key: "power_watts") {
      value
    }
    installationInfo: metafield(namespace: "ss", key: "installation_info") {
      value
    }
    tamilTitle: metafield(namespace: "ss", key: "tamil_title") {
      value
    }
    tamilSummary: metafield(namespace: "ss", key: "tamil_summary") {
      value
    }
    notInBox: metafield(namespace: "ss", key: "not_in_box") {
      references(first: 20) {
        nodes {
          __typename
          ... on Metaobject {
            id
            fields {
              key
              value
            }
          }
        }
      }
    }
    allInPackage: metafield(namespace: "ss", key: "all_in_package") {
      references(first: 20) {
        nodes {
          __typename
          ... on Metaobject {
            id
            fields {
              key
              value
            }
          }
        }
      }
    }
    bundleItems: metafield(namespace: "ss", key: "bundle_items") {
      references(first: 10) {
        nodes {
          __typename
          ... on ProductVariant {
            id
            title
            availableForSale
            price {
              ...Money
            }
            compareAtPrice {
              ...Money
            }
            product {
              handle
              title
              featuredImage {
                ...Image
              }
            }
          }
        }
      }
    }
  }
`);

export const CartFragment = graphql(`
  fragment Cart on Cart {
    id
    checkoutUrl
    totalQuantity
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
      applicable
    }
    cost {
      subtotalAmount {
        ...Money
      }
      totalAmount {
        ...Money
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        attributes {
          key
          value
        }
        cost {
          totalAmount {
            ...Money
          }
          amountPerQuantity {
            ...Money
          }
          compareAtAmountPerQuantity {
            ...Money
          }
        }
        merchandise {
          __typename
          ... on ProductVariant {
            id
            title
            availableForSale
            selectedOptions {
              name
              value
            }
            image {
              ...Image
            }
            product {
              id
              handle
              title
              vendor
            }
          }
        }
      }
    }
  }
`);
