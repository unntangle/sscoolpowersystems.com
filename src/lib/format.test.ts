import { describe, expect, it } from "vitest";
import { discountPercent, formatINR, toNumber } from "./format";

describe("formatINR", () => {
  it("uses Indian digit grouping and no paise for whole rupees", () => {
    expect(formatINR(132990)).toBe("₹1,32,990");
  });

  it("shows paise when present", () => {
    expect(formatINR(99.5)).toBe("₹99.50");
  });
});

describe("discountPercent", () => {
  it("rounds down so a saving is never overstated", () => {
    // 13000 / 45990 = 28.27% -> 28
    expect(discountPercent(32990, 45990)).toBe(28);
  });

  it("returns null when there is no discount", () => {
    expect(discountPercent(45990, 45990)).toBeNull();
    expect(discountPercent(50000, 45990)).toBeNull();
  });

  it("returns null for invalid input or sub-1% discounts", () => {
    expect(discountPercent(0, 100)).toBeNull();
    expect(discountPercent(100, 0)).toBeNull();
    expect(discountPercent(99.5, 100)).toBeNull();
  });
});

describe("toNumber", () => {
  it("parses Shopify decimals", () => {
    expect(toNumber("32990.0")).toBe(32990);
  });

  it("returns null for empty or invalid values", () => {
    expect(toNumber("")).toBeNull();
    expect(toNumber(null)).toBeNull();
    expect(toNumber("abc")).toBeNull();
  });
});
