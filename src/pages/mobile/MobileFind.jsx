import { useOutletContext } from "react-router-dom";
import FindKemedar from "@/components/mobile/find/FindKemedar";
import FindKemework from "@/components/mobile/find/FindKemework";
import FindKemetro from "@/components/mobile/find/FindKemetro";

export default function MobileFind() {
  const { activeModule } = useOutletContext();

  return (
    <div className="pb-24">
      {activeModule === "kemedar" && <FindKemedar />}
      {activeModule === "kemework" && <FindKemework />}
      {activeModule === "kemetro" && <FindKemetro />}
    </div>
  );
}