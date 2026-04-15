// @ts-nocheck
import Link from "next/link";

export default function MaterialsCartStrip({ cartCount, totalEGP }) {
  if (!cartCount || cartCount < 1) return null;

  return (
    <div
      className="flex items-center justify-between px-4 py-2.5 rounded-xl"
      style={{ background: "#0D9488" }}
    >
      <div>
        <p className="text-white font-bold text-[13px]">
          🛒 {cartCount} {cartCount === 1 ? "part" : "parts"} added to Kemetro cart
        </p>
        {totalEGP > 0 && (
          <p className="text-teal-100 text-[12px]">
            Est. materials: {Number(totalEGP).toLocaleString()} EGP
          </p>
        )}
      </div>
      <Link
        href="/kemetro/cart"
        className="text-white font-black text-[13px] whitespace-nowrap underline-offset-2 hover:underline"
      >
        View Cart →
      </Link>
    </div>
  );
}