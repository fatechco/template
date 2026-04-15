// @ts-nocheck
import TopBar from "./TopBar";
import MainNav from "./MainNav";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-[100] w-full">
      <TopBar />
      <MainNav />
    </header>
  );
}