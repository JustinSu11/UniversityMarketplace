import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const colors = [
    'bg-red-500', 
    'bg-yellow-500', 
    'bg-green-500', 
    'bg-blue-500', 
    'bg-indigo-500', 
    'bg-purple-500', 
    'bg-pink-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-cyan-500'
]

export const getRandomColor = (name) => {
  if (!name) return colors[0]
  const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0)
  const index = Math.abs(hash % colors.length)
  return colors[index]
}