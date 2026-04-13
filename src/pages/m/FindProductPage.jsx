import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FindProductPage() {
  const navigate = useNavigate();

  // Redirect to Kemetro mobile search
  useEffect(() => {
    navigate("/m/kemetro/search");
  }, [navigate]);

  return null;
}