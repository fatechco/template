import KemetroTopBar from "./KemetroTopBar";
import KemetroMainNav from "./KemetroMainNav";
import KemetroCategoryNav from "./KemetroCategoryNav";

export default function KemetroHeader({ cartCount = 0, wishlistCount = 0 }) {
  return (
    <header className="sticky top-0 z-[100] w-full">
      <KemetroTopBar cartCount={cartCount} />
      <KemetroMainNav cartCount={cartCount} wishlistCount={wishlistCount} />
      <KemetroCategoryNav />
    </header>
  );
}