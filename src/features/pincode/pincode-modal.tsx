"use client";

import * as React from "react";
import { ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Modal, ModalContent, ModalTrigger } from "@/components/ui/modal";
import { toast } from "@/components/ui/toast";
import type { Dictionary } from "@/i18n";
import { cn } from "@/lib/utils";
import { setPincodeAction } from "./actions";

interface PincodeModalProps {
  pincode: string | null;
  t: Pick<Dictionary, "pincode" | "utility">;
  className?: string;
}

export function PincodeModal({ pincode, t, className }: PincodeModalProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(pincode ?? "");
  const [error, setError] = React.useState<string>();
  const [pending, startTransition] = React.useTransition();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[1-9]\d{5}$/.test(value.trim())) {
      setError(t.pincode.invalid);
      return;
    }
    startTransition(async () => {
      const result = await setPincodeAction(value);
      if (!result.ok) {
        setError(t.pincode.invalid);
        return;
      }
      setError(undefined);
      setOpen(false);
      toast.success(t.pincode.saved);
    });
  }

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger
        className={cn(
          "inline-flex min-h-8 items-center gap-1.5 rounded-sm text-left text-neutral-700 transition-colors hover:text-neutral-950",
          className,
        )}
      >
        <MapPin className="size-3.5 shrink-0" aria-hidden />
        {pincode ? (
          <span>
            {t.utility.deliveringTo} <strong className="font-semibold text-neutral-950">{pincode}</strong>
          </span>
        ) : (
          <span className="font-medium">{t.utility.setPincode}</span>
        )}
        <ChevronRight className="size-3.5 shrink-0" aria-hidden />
      </ModalTrigger>
      <ModalContent title={t.pincode.title} description={t.pincode.description} size="sm">
        <form onSubmit={submit} className="grid gap-4" noValidate>
          <Field label={t.pincode.label} error={error} required>
            {(p) => (
              <Input
                {...p}
                value={value}
                onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                placeholder="600017"
              />
            )}
          </Field>
          <Button type="submit" loading={pending} className="w-full">
            {t.pincode.submit}
          </Button>
        </form>
      </ModalContent>
    </Modal>
  );
}
