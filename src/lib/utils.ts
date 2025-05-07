import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }
  
export const formatNumber = (num:number) => {
  if (num < 1000) return num.toString();

  const units = ["k", "M", "B", "T"];
  const order = Math.floor(Math.log10(num) / 3);
  const unit = units[order - 1];
  const scaled = num / Math.pow(1000, order);

  return scaled % 1 === 0 ? `${scaled}${unit}` : `${scaled.toFixed(1)}${unit}`;
};  

export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const pad = (n: number): string => n.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  } else {
    return `${pad(minutes)}:${pad(seconds)}`;
  }
}