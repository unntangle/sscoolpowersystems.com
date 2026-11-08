import { AirVent, BatteryCharging, Refrigerator, Tv, WashingMachine, type LucideIcon } from "lucide-react";
import type { NavIcon as NavIconKey } from "@/config/navigation";
import { cn } from "@/lib/utils";

const icons: Record<NavIconKey, LucideIcon> = {
  ac: AirVent,
  washer: WashingMachine,
  fridge: Refrigerator,
  tv: Tv,
  inverter: BatteryCharging,
};

export function NavIcon({ icon, className }: { icon: NavIconKey; className?: string }) {
  const Icon = icons[icon];
  return (
    <span className={cn("inline-flex size-10 items-center justify-center rounded-lg bg-accent-50 text-accent-700", className)}>
      <Icon className="size-5" aria-hidden />
    </span>
  );
}
