import KemeworkTopBar from "./KemeworkTopBar";
import KemeworkMainNav from "./KemeworkMainNav";

export default function KemeworkHeader() {
  return (
    <header className="sticky top-0 z-[100] w-full">
      <KemeworkTopBar />
      <KemeworkMainNav />
    </header>
  );
}