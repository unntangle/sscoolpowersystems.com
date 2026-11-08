"use client";

import * as React from "react";
import { Info, MessageCircle, ShoppingCart } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Field, Input } from "@/components/ui/input";
import { Modal, ModalContent, ModalTrigger } from "@/components/ui/modal";
import { Price } from "@/components/ui/price";
import { Rating } from "@/components/ui/rating";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-neutral-200 py-10">
      <h2 className="mb-6 text-2xl font-bold text-neutral-900">{title}</h2>
      {children}
    </section>
  );
}

export function KitDemo() {
  const [stabiliser, setStabiliser] = React.useState(false);

  return (
    <main className="container-site py-16">
      <h1 className="text-display-3 font-bold">UI kit</h1>
      <p className="mt-2 text-neutral-600">Base components. Colours and type come from src/styles/tokens.css.</p>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Buy Now</Button>
          <Button variant="secondary">
            <ShoppingCart aria-hidden /> Add to Cart
          </Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="whatsapp">
            <MessageCircle aria-hidden /> Get Best Price on WhatsApp
          </Button>
          <Button loading>Saving</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </Section>

      <Section title="Typography">
        <p className="text-display-1 font-bold">Display 1</p>
        <p className="text-display-2 font-bold">Display 2</p>
        <p className="text-display-3 font-bold">Display 3</p>
        <p lang="ta" className="mt-4 text-lg">
          வாட்ஸ்அப்பில் சிறந்த விலையைப் பெறுங்கள் (Tamil sample, needs review)
        </p>
      </Section>

      <Section title="Form controls">
        <div className="grid max-w-md gap-5">
          <Field label="Name" required>
            {(p) => <Input {...p} placeholder="Your name" autoComplete="name" />}
          </Field>
          <Field label="Mobile number" required hint="We reply on WhatsApp" error="Enter a 10-digit mobile number">
            {(p) => <Input {...p} type="tel" inputMode="numeric" autoComplete="tel-national" />}
          </Field>
          <Field label="Capacity">
            {({ id, ...aria }) => (
              <Select>
                <SelectTrigger id={id} {...aria}>
                  <SelectValue placeholder="Choose capacity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Ton</SelectItem>
                  <SelectItem value="1.5">1.5 Ton</SelectItem>
                  <SelectItem value="2">2 Ton</SelectItem>
                </SelectContent>
              </Select>
            )}
          </Field>
          <label className="flex items-start gap-3 text-sm">
            <Checkbox checked={stabiliser} onCheckedChange={(v) => setStabiliser(v === true)} />
            <span>
              Add stabiliser (₹2,490) <span className="text-neutral-500">— unchecked by default</span>
            </span>
          </label>
        </div>
      </Section>

      <Section title="Badges, price, rating">
        <div className="flex flex-wrap gap-2">
          <Badge tone="success">5 Star</Badge>
          <Badge tone="danger">28% off</Badge>
          <Badge tone="accent">EASY EMIs</Badge>
          <Badge tone="brand">Installation included</Badge>
          <Badge tone="outline">1.5 Ton</Badge>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <Price amount={32990} mrp={45990} size="lg" showTaxNote />
          <Price mrp={45990} prefix="Starting from" />
          <Price amount={499} mrp={599} size="sm" />
        </div>
        <Rating className="mt-6" value={4.3} count={128} />
      </Section>

      <Section title="Modal, drawer, tooltip, toast">
        <div className="flex flex-wrap gap-3">
          <Modal>
            <ModalTrigger asChild>
              <Button variant="secondary">Open modal</Button>
            </ModalTrigger>
            <ModalContent title="Get Best Price on WhatsApp" description="Reply within 10 minutes, 9am–9pm">
              <p className="text-sm text-neutral-600">Form arrives in Phase 4.</p>
            </ModalContent>
          </Modal>

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="secondary">Open drawer</Button>
            </DrawerTrigger>
            <DrawerContent title="Your cart" footer={<Button className="w-full">Proceed to Checkout</Button>}>
              <p className="text-sm text-neutral-600">Cart drawer arrives in Phase 2.</p>
            </DrawerContent>
          </Drawer>

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="secondary">Bottom sheet</Button>
            </DrawerTrigger>
            <DrawerContent side="bottom" title="Filters">
              <p className="text-sm text-neutral-600">Mobile filter sheet.</p>
            </DrawerContent>
          </Drawer>

          <Tooltip content="Indicative cost. Final price confirmed on WhatsApp.">
            <Button variant="ghost" size="icon" aria-label="About indicative costs">
              <Info aria-hidden />
            </Button>
          </Tooltip>

          <Button variant="secondary" onClick={() => toast.success("Added to cart")}>
            Show toast
          </Button>
        </div>
      </Section>

      <Section title="Tabs and accordion">
        <Tabs defaultValue="offers">
          <TabsList aria-label="Spotlight">
            <TabsTrigger value="offers">Offers</TabsTrigger>
            <TabsTrigger value="recommended">Recommended for you</TabsTrigger>
          </TabsList>
          <TabsContent value="offers">Offer cards here.</TabsContent>
          <TabsContent value="recommended">Recommendations here.</TabsContent>
        </Tabs>
        <Accordion type="single" collapsible className="mt-8 max-w-xl">
          <AccordionItem value="a">
            <AccordionTrigger>Is installation included?</AccordionTrigger>
            <AccordionContent>Choose the All-in Installed Price to include it.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Do you give a GST invoice?</AccordionTrigger>
            <AccordionContent>Yes, on every order.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title="Carousel and skeleton">
        <Carousel label="Frequently paired products">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="rounded-lg border border-neutral-200 p-4 shadow-card">
              <Skeleton className="aspect-square w-full" />
              <p className="mt-3 text-sm font-medium">Product {i + 1}</p>
              <Price amount={1499 + i * 100} mrp={1999 + i * 100} size="sm" />
            </div>
          ))}
        </Carousel>
      </Section>
    </main>
  );
}
