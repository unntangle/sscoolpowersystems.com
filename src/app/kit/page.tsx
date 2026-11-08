import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KitDemo } from "./kit-demo";

export const metadata: Metadata = {
  title: "UI kit",
  robots: { index: false, follow: false },
};

/** Living style guide for the base UI kit. Dev only (set ENABLE_UI_KIT=1 to show it on a preview deploy). */
export default function KitPage() {
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_UI_KIT !== "1") notFound();
  return <KitDemo />;
}
