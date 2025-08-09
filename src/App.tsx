import { useEffect, useState } from "react";
import { useTelegram } from "./hooks/useTelegram";
import OwnerDashboard from "./pages/OwnerDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import ZamerchiDashboard from "./pages/ZamerchiDashboard";
import BrigaderDashboard from "./pages/BrigaderDashboard";
import Loader from "./components/Loader";

type UserRole = "OWNER" | "MANAGER" | "ZAMERCHI" | "BRIGADER";

export default function App() {
  const { telegramId } = useTelegram();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // telegramId null bo'lsa hali ma'lumot kelmagan - loading davom etsin
    if (telegramId === null) {
      // hali id kelmagan, loadingni ushlab turamiz
      return;
    }

    if (!telegramId) {
      setError("Telegram ID topilmadi 🚫");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`https://www.keldibekov.online/user/by-telegram/${telegramId}`);

        if (!res.ok) throw new Error(`Server xatosi: ${res.status}`);

        const data = await res.json();

        if (!data?.role) throw new Error("Role bo‘sh yoki noto‘g‘ri");

        setRole(data.role as UserRole);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Noma’lum xato");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [telegramId]);

  if (loading || telegramId === null) return <Loader />;

  if (error) return <div style={{ color: "red", padding: 20 }}>{error}</div>;

  switch (role) {
    case "OWNER":
      return <OwnerDashboard />;
    case "MANAGER":
      return <ManagerDashboard />;
    case "ZAMERCHI":
      return <ZamerchiDashboard />;
    case "BRIGADER":
      return <BrigaderDashboard />;
    default:
      return <div>Ruhsat yoq yoki foydalanuvchi topilmadi 😏</div>;
  }
}
