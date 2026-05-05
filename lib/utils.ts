import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatNiche(niche: string, customNiche: string | null) {
  if (niche === 'custom' && customNiche)
    return customNiche.slice(0, 30) + (customNiche.length > 30 ? '…' : '')
  return niche.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}
