"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Modal, ModalContent } from "@/components/ui/modal";
import { toast } from "@/components/ui/toast";
import { fmt, type Dictionary } from "@/i18n";
import { requestOtpAction, verifyOtpAction } from "./actions";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  t: Dictionary["login"];
}

export function LoginModal({ open, onOpenChange, t }: LoginModalProps) {
  const [step, setStep] = React.useState<"phone" | "otp">("phone");
  const [phone, setPhone] = React.useState("");
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [demo, setDemo] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (!open) {
      setStep("phone");
      setCode("");
      setError(undefined);
    }
  }, [open]);

  function sendOtp(event: React.FormEvent) {
    event.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone)) return setError(t.invalidPhone);
    startTransition(async () => {
      const result = await requestOtpAction(phone);
      if (!result.ok) return setError(result.error === "invalid" ? t.invalidPhone : t.notConfigured);
      setDemo(result.demo);
      setError(undefined);
      setStep("otp");
    });
  }

  function verify(event: React.FormEvent) {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) return setError(t.invalidOtp);
    startTransition(async () => {
      const result = await verifyOtpAction(phone, code);
      if (!result.ok) return setError(result.error === "invalid" ? t.invalidOtp : t.notConfigured);
      toast.success(t.success);
      onOpenChange(false);
    });
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent title={t.title} description={t.subtitle} size="sm">
        <ul className="grid gap-2 rounded-lg bg-brand-50 p-4 text-sm text-brand-900">
          {t.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-700" aria-hidden />
              {benefit}
            </li>
          ))}
        </ul>

        {step === "phone" ? (
          <form onSubmit={sendOtp} className="grid gap-4" noValidate>
            <Field label={t.mobileLabel} error={error} required>
              {(p) => (
                <div className="flex">
                  <span className="inline-flex h-11 items-center rounded-l-md border border-r-0 border-neutral-300 bg-neutral-50 px-3 text-sm text-neutral-600">
                    +91
                  </span>
                  <Input
                    {...p}
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="rounded-l-none"
                  />
                </div>
              )}
            </Field>
            <Button type="submit" loading={pending} className="w-full">
              {t.sendOtp}
            </Button>
          </form>
        ) : (
          <form onSubmit={verify} className="grid gap-4" noValidate>
            <p className="text-sm text-neutral-600">{fmt(t.otpSentTo, { phone })}</p>
            <Field label={t.otpLabel} error={error} hint={demo ? t.demoHint : undefined} required>
              {(p) => (
                <Input
                  {...p}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="text-center text-lg tracking-[0.5em]"
                />
              )}
            </Field>
            <Button type="submit" loading={pending} className="w-full">
              {t.verify}
            </Button>
            <Button
              variant="link"
              onClick={() => {
                setStep("phone");
                setError(undefined);
              }}
            >
              {t.changeNumber}
            </Button>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
