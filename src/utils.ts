import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ParsedSearch = {
  text: string[];
  size?: number;
  color?: string;
  priceMin?: number;
  priceMax?: number;
  inStockOnly?: boolean;
};

const COLOR_KEYWORDS: Record<string, string> = {
  blue: 'blue', mavi: 'blue', lacivert: 'blue',
  red: 'red', kirmizi: 'red', kırmızı: 'red', bordo: 'red',
  green: 'green', yesil: 'green', yeşil: 'green',
  black: 'black', siyah: 'black',
  white: 'white', beyaz: 'white',
  gray: 'gray', gri: 'gray',
  yellow: 'yellow', sari: 'yellow', sarı: 'yellow',
};

function hexToRgb(hex?: string): { r: number; g: number; b: number } | null {
  if (!hex) return null;
  const normalized = hex.trim().replace('#', '');
  if (normalized.length !== 6) return null;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  if ([r, g, b].some((v) => Number.isNaN(v))) return null;
  return { r, g, b };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max - min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h, s, l };
}

function hexToColorFamily(hex?: string): string | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  // very light/dark overrides
  if (l >= 0.9) return 'white';
  if (l <= 0.12) return 'black';
  if (s <= 0.12) return 'gray';
  // hue buckets
  if ((h >= 0 && h < 15) || (h >= 345 && h <= 360)) return 'red';
  if (h >= 15 && h < 45) return 'yellow';
  if (h >= 45 && h < 75) return 'yellow';
  if (h >= 75 && h < 165) return 'green';
  if (h >= 165 && h < 255) return 'blue';
  if (h >= 255 && h < 345) return 'red'; // includes magenta/pink leaning to red family
  return null;
}

export function parseSearchQuery(input: string): ParsedSearch {
  const q = input.trim().toLowerCase();
  if (!q) return { text: [] };

  const tokens = q.split(/\s+/);
  const parsed: ParsedSearch = { text: [] };

  // size detection ("42", "size 42", "numara 42", "uk 8")
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (/^(size|numara|uk)$/i.test(t) && i + 1 < tokens.length) {
      const num = Number(tokens[i + 1].replace(/[^0-9]/g, ''));
      if (!Number.isNaN(num)) parsed.size = num;
      i += 1;
      continue;
    }
    const num = Number(t.replace(/[^0-9]/g, ''));
    if (!Number.isNaN(num) && num >= 20 && num <= 50) {
      parsed.size = num;
      continue;
    }
    parsed.text.push(t);
  }

  // color detection
  for (const t of [...parsed.text]) {
    const mapped = COLOR_KEYWORDS[t];
    if (mapped) {
      parsed.color = mapped;
      parsed.text = parsed.text.filter((x) => x !== t);
    }
  }

  // price range: "<5000", "> 8000", "5000-9000", "under 5k", "over 10k"
  const priceMatch = q.match(/(\d+[\.,]?\d*)\s*-\s*(\d+[\.,]?\d*)|(?:^|\s)(?:<|under|alt|max)\s*(\d+[\.,]?\d*)|(?:^|\s)(?:>|over|üst|min)\s*(\d+[\.,]?\d*)/);
  if (priceMatch) {
    if (priceMatch[1] && priceMatch[2]) {
      parsed.priceMin = Number(priceMatch[1].replace(/\D/g, ''));
      parsed.priceMax = Number(priceMatch[2].replace(/\D/g, ''));
    } else if (priceMatch[3]) {
      parsed.priceMax = Number(priceMatch[3].replace(/\D/g, ''));
    } else if (priceMatch[4]) {
      parsed.priceMin = Number(priceMatch[4].replace(/\D/g, ''));
    }
  }

  // stock-only cues
  if (/only\s+available|stokta|in\s*stock|mevcut/i.test(q)) parsed.inStockOnly = true;

  return parsed;
}

export function matchesParsedSearch(shoe: any, parsed: ParsedSearch): boolean {
  // text match for name/slug
  const textOk = parsed.text.length === 0 || parsed.text.some((t) =>
    String(shoe.name).toLowerCase().includes(t) || String(shoe.slug).toLowerCase().includes(t),
  );

  // size
  const sizeOk = parsed.size
    ? Array.isArray(shoe.sizes) && shoe.sizes.some((s: any) => {
        const num = Number(String(s.label).replace(/[^0-9]/g, ''));
        return num === parsed.size && s.stock === true;
      })
    : true;

  // color heuristic: infer family from bgColor hex and also check name/slug text
  const colorOk = parsed.color
    ? (() => {
        const family = hexToColorFamily(shoe.bgColor);
        if (family && family === parsed.color) return true;
        return [shoe.name, shoe.slug]
          .filter(Boolean)
          .some((v: any) => String(v).toLowerCase().includes(parsed.color as string));
      })()
    : true;

  // price
  const priceNumeric = Number(String(shoe.price).replace(/[^0-9]/g, ''));
  const priceMinOk = parsed.priceMin ? priceNumeric >= parsed.priceMin : true;
  const priceMaxOk = parsed.priceMax ? priceNumeric <= parsed.priceMax : true;

  // stock only: any size in stock
  const stockOk = parsed.inStockOnly
    ? Array.isArray(shoe.sizes) && shoe.sizes.some((s: any) => s.stock === true)
    : true;

  return textOk && sizeOk && colorOk && priceMinOk && priceMaxOk && stockOk;
}
