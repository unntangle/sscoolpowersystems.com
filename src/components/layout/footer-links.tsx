"use client";

import Link from "next/link";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { ChevronDown } from "lucide-react";
import type { ResolvedLink } from "./nav-types";

export interface ResolvedFooterGroup {
  title: string;
  links: ResolvedLink[];
}

/** Footer link groups for the dark footer: columns on desktop, accordion on mobile. */
export function FooterLinks({ groups }: { groups: ResolvedFooterGroup[] }) {
  return (
    <>
      <div className="hidden gap-x-8 gap-y-10 md:grid md:grid-cols-4">
        {groups.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="mb-3 text-sm font-medium text-white">{group.title}</h2>
            <ul className="grid gap-2">
              {group.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-xs text-white/60 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <AccordionPrimitive.Root type="multiple" className="md:hidden">
        {groups.map((group) => (
          <AccordionPrimitive.Item key={group.title} value={group.title} className="border-b border-white/10">
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="flex min-h-12 flex-1 items-center justify-between text-left text-sm font-medium text-white [&[data-state=open]>svg]:rotate-180">
                {group.title}
                <ChevronDown className="size-4 text-white/60 transition-transform" aria-hidden />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <ul className="grid gap-1 pb-4">
                {group.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="block py-1.5 text-sm text-white/65">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        ))}
      </AccordionPrimitive.Root>
    </>
  );
}
