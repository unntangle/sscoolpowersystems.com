import { describe, expect, it } from "vitest";
import {
  fieldsToRecord,
  parseEnergyRating,
  parsePriceBand,
  parsePricingMode,
  parseStringList,
} from "./metafields";

describe("parsePricingMode", () => {
  it("accepts the three valid modes", () => {
    expect(parsePricingMode("public")).toBe("public");
    expect(parsePricingMode("rfq")).toBe("rfq");
    expect(parsePricingMode(" WhatsApp_Quote ")).toBe("whatsapp_quote");
  });

  it("falls back to whatsapp_quote so prices never leak by accident", () => {
    expect(parsePricingMode(undefined)).toBe("whatsapp_quote");
    expect(parsePricingMode("")).toBe("whatsapp_quote");
    expect(parsePricingMode("cart")).toBe("whatsapp_quote");
  });
});

describe("parseStringList", () => {
  it("parses JSON list metafields", () => {
    expect(parseStringList('["Inverter compressor"," Copper coil ",""]')).toEqual([
      "Inverter compressor",
      "Copper coil",
    ]);
  });

  it("returns [] for bad input", () => {
    expect(parseStringList("not json")).toEqual([]);
    expect(parseStringList('{"a":1}')).toEqual([]);
    expect(parseStringList(null)).toEqual([]);
  });
});

describe("parseEnergyRating", () => {
  it("accepts 1-5 only", () => {
    expect(parseEnergyRating("5")).toBe(5);
    expect(parseEnergyRating("0")).toBeNull();
    expect(parseEnergyRating("6")).toBeNull();
    expect(parseEnergyRating("3.5")).toBeNull();
  });
});

describe("parsePriceBand", () => {
  it("returns min and max", () => {
    expect(parsePriceBand("32990", "38990")).toEqual({ min: 32990, max: 38990 });
  });

  it("drops an invalid max and rejects a missing min", () => {
    expect(parsePriceBand("32990", "1000")).toEqual({ min: 32990, max: null });
    expect(parsePriceBand(null, "38990")).toBeNull();
  });
});

describe("fieldsToRecord", () => {
  it("maps metaobject fields", () => {
    expect(fieldsToRecord([{ key: "item", value: "Stabiliser" }, { key: "note", value: null }])).toEqual({
      item: "Stabiliser",
      note: undefined,
    });
  });
});
