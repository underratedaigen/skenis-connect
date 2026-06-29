import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("lt-LT", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(date));
}

export function formatNumber(value: number | null | undefined) {
  return new Intl.NumberFormat("lt-LT").format(value ?? 0);
}

export function truncate(value: string | null | undefined, length = 48) {
  if (!value) return "—";
  if (value.length <= length) return value;

  return `${value.slice(0, length - 1)}…`;
}

export function startOfDay(date = new Date()) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}
