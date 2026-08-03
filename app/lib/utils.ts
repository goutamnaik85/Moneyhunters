import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function wrapDigit(n: number): number {
  return ((n % 10) + 10) % 10;
}

export function formatDigit(n: number): string {
  return String(wrapDigit(n));
}

export const RED_JODIS = ['05','50','16','61','27','72','38','83','49','94'];
