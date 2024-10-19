import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getContrastColor(bgColor) {
  // Преобразуем цвет в RGB
  let color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);

  // Вычисляем яркость
  let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

  // Возвращаем черный или белый в зависимости от яркости фона
  return (yiq >= 128) ? 'black' : 'white';
}
