import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatPercent(value: number | null | undefined): string {
  if (!value) return 'N/A';
  return `${value.toFixed(1)}%`;
}

/**
 * Join a store's address and city without repeating the city.
 *
 * 76 of the 94 mapped dispensaries already carry the city inside the address
 * string ("5609 N. Pennsylvania Avenue, Oklahoma City"), so appending the city
 * column unconditionally produced "…, Oklahoma City, OKLAHOMA CITY" on most
 * cards. 15 rows have no city at all, and a handful have a street fragment
 * sitting in the city column, so the address is the more trustworthy field and
 * city is only used to fill a genuine gap.
 */
export function formatStoreAddress(
  address: string | null,
  city: string | null
): string {
  const a = (address ?? '').trim().replace(/[,\s]+$/, '');
  const c = (city ?? '').trim();
  if (!a) return c;
  if (!c) return a;
  return a.toLowerCase().includes(c.toLowerCase()) ? a : `${a}, ${c}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}
