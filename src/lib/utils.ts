import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const REGISTRATION_DEADLINE = "2026-12-31T18:29:59.000Z";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "To be announced";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "To be announced";
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return "To be announced";
  }
}

export function formatDateOnly(dateStr: string | null | undefined): string {
  if (!dateStr) return "To be announced";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "To be announced";
    return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(d);
  } catch {
    return "To be announced";
  }
}
