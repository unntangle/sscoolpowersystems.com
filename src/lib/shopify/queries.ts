import { graphql } from "./__generated__";

/*
 * Every operation takes $language/$country and uses @inContext so Shopify returns
 * Tamil translations and India pricing when asked. See context.ts.
 */

export const ShopQuery = graphql(`
  query Shop($language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    shop {
      name
      description
      primaryDomain {
        url
      }
      brand {
        logo {
          image {
            ...Image
          }
        }
      }
      showPriceBands: metafield(namespace: "ss", key: "show_price_bands") {
        value
      }
    }
    localization {
      availableLanguages {
        isoCode
        endonymName
      }
    }
  }
`);

export const MenuQuery = graphql(`
  query Menu($handle: String!, $language: LanguageCode, $country: CountryCode)
  @inContext(language: $language, country: $country) {
    menu(handle: $handle) {
      id
      title
      items {
        ...MenuItem
        items {
          ...MenuItem
          items {
            ...MenuItem
          }
        }
      }
    }
  }
`);

export const CollectionsQuery = graphql(`
  query Collections($first: Int!, $after: String, $language: LanguageCode, $country: CountryCode)
  @inContext(language: $language, country: $country) {
    collections(first: $first, after: $after, sortKey: TITLE) {
      nodes {
        id
        handle
        title
        description
        updatedAt
        image {
          ...Image
        }
        seo {
          title
          description
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`);

export const CollectionProductsQuery = graphql(`
  query CollectionProducts(
    $handle: String!
    $first: Int!
    $after: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
    $language: LanguageCode
    $country: CountryCode
  ) @inContext(language: $language, country: $country) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      image {
        ...Image
      }
      seo {
        title
        description
      }
      products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, filters: $filters) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`);

export const ProductByHandleQuery = graphql(`
  query ProductByHandle($handle: String!, $language: LanguageCode, $country: CountryCode)
  @inContext(language: $language, country: $country) {
    product(handle: $handle) {
      ...ProductDetail
    }
  }
`);

export const ProductRecommendationsQuery = graphql(`
  query ProductRecommendations(
    $productId: ID!
    $intent: ProductRecommendationIntent
    $language: LanguageCode
    $country: CountryCode
  ) @inContext(language: $language, country: $country) {
    productRecommendations(productId: $productId, intent: $intent) {
      ...ProductCard
    }
  }
`);

export const PredictiveSearchQuery = graphql(`
  query PredictiveSearch($query: String!, $limit: Int, $language: LanguageCode, $country: CountryCode)
  @inContext(language: $language, country: $country) {
    predictiveSearch(query: $query, limit: $limit, limitScope: EACH, types: [PRODUCT, COLLECTION, QUERY]) {
      products {
        ...ProductCard
      }
      collections {
        id
        handle
        title
        image {
          ...Image
        }
      }
      queries {
        text
        styledText
      }
    }
  }
`);

export const CartQuery = graphql(`
  query Cart($cartId: ID!, $language: LanguageCode, $country: CountryCode)
  @inContext(language: $language, country: $country) {
    cart(id: $cartId) {
      ...Cart
    }
  }
`);
