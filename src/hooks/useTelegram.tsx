import { useEffect, useState } from "react";

declare global {
  interface Window {
    Telegram?: any;
  }
}

export function useTelegram() {
  const [telegramId, setTelegramId] = useState<number | null>(null);

useEffect(() => {
  console.log('window.Telegram:', window.Telegram);
  console.log('window.Telegram.WebApp:', window.Telegram?.WebApp);

  if (window.Telegram?.WebApp) {
    const userId = window.Telegram.WebApp.initDataUnsafe?.user?.id;
    if (userId) {
      setTelegramId(userId);
    } else {
      const handler = () => {
        const newId = window.Telegram.WebApp.initDataUnsafe?.user?.id || null;
        setTelegramId(newId);
      };
      window.Telegram.WebApp.onEvent('auth', handler);
      return () => {
        window.Telegram.WebApp.offEvent('auth', handler);
      };
    }
  } else {
    console.warn('Telegram WebApp SDK topilmadi, fallback ID berildi');
    setTelegramId(5470835195); // TEST uchun
  }
}, []);




  return { telegramId };
}
