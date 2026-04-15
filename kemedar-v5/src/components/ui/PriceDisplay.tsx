// @ts-nocheck
"use client";
import { useCurrency } from '@/lib/currency-context';

/**
 * PriceDisplay — renders a price using the globally selected currency.
 *
 * Props:
 *   amountEGP   {number}  — raw EGP amount (source of truth)
 *   size        {"sm"|"md"|"lg"} — text size preset (default "md")
 *   className   {string}  — extra tailwind classes on the wrapper
 *   showPerSqm  {boolean} — show a second line with price/sqm
 *   areaSqm     {number}  — required when showPerSqm=true
 *   contactForPrice {boolean} — show "Contact for Price" instead
 */
export default function PriceDisplay({
  amountEGP,
  size = "md",
  className = "",
  showPerSqm = false,
  areaSqm,
  contactForPrice = false,
}) {
  const { formatPrice } = useCurrency();

  if (contactForPrice) {
    return <span className={`font-black text-[#FF6B00] ${sizeClass(size)} ${className}`}>Contact for Price</span>;
  }

  if (amountEGP == null || amountEGP === 0) {
    return <span className={`font-black text-[#FF6B00] ${sizeClass(size)} ${className}`}>Price on Request</span>;
  }

  return (
    <span className={`font-black text-[#FF6B00] leading-tight ${sizeClass(size)} ${className}`}>
      {formatPrice(amountEGP)}
      {showPerSqm && areaSqm > 0 && (
        <span className="block text-xs font-normal text-gray-400 mt-0.5">
          {formatPrice(amountEGP / areaSqm)} / m²
        </span>
      )}
    </span>
  );
}

function sizeClass(size) {
  if (size === "sm") return "text-sm";
  if (size === "lg") return "text-2xl";
  return "text-lg";
}