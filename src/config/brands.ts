/**
 * Brands SS Cool Power Systems sells. Logos are optional files under /public/images/brands/
 * (use the official artwork supplied with your dealer authorisation). Without a file the
 * brand name is shown as text.
 */
export interface Brand {
  handle: string;
  name: string;
  logo: string;
}

export const brands: Brand[] = [
  { handle: "panasonic", name: "Panasonic", logo: "/images/brands/panasonic.svg" },
  { handle: "mitsubishi-heavy-industries", name: "Mitsubishi Heavy Industries", logo: "/images/brands/mitsubishi-heavy-industries.svg" },
  { handle: "daikin", name: "Daikin", logo: "/images/brands/daikin.svg" },
  { handle: "mitsubishi-electric", name: "Mitsubishi Electric", logo: "/images/brands/mitsubishi-electric.svg" },
  { handle: "haier", name: "Haier", logo: "/images/brands/haier.svg" },
];
