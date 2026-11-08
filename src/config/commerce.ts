/** Commerce rules. PLACEHOLDER values: confirm with the client. */
export const commerce = {
  /** Minimum order value for online (public-priced) orders, INR. */
  minOrderValue: 500,
  /** Max quantity per cart line. */
  maxLineQuantity: 10,
  /** Delivery promise for serviceable pincodes, in days. */
  deliveryDays: "2–3",
  /** Pincodes we deliver to directly (Chennai + nearby). Others are confirmed on WhatsApp. */
  serviceablePincodePrefixes: ["600", "601", "602", "603"],
} as const;
