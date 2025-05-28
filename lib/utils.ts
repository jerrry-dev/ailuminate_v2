import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ObjectId } from "mongodb"

// Tailwind class merge utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Check if a MongoDB ObjectId is valid
export function isValidObjectId(id: string): boolean {
  return ObjectId.isValid(id)
}

// Generate a slug from a title or string
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

// Estimate read time from text content
export function calculateReadTime(text: string): string {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

// Generate a random token for email verification
export function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15)
}
