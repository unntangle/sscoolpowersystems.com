"use server";

import { z } from "zod";
import { getLocale } from "@/i18n/server";
import { searchCatalog, type SearchResults } from "@/lib/catalog";

const querySchema = z.string().trim().min(2).max(80);

/** Predictive search for the header overlay. */
export async function predictiveSearchAction(query: string): Promise<SearchResults> {
  const parsed = querySchema.safeParse(query);
  if (!parsed.success) return { products: [], collections: [] };
  return searchCatalog(parsed.data, await getLocale(), 6);
}
