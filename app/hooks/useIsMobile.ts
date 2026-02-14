import { useEffect, useState } from "react";

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function checkScreen() {
      // até 767px considera celular
      setIsMobile(window.innerWidth <= 767);
    }

    checkScreen(); // roda na montagem

    window.addEventListener("resize", checkScreen);

    return () => {
      window.removeEventListener("resize", checkScreen);
    };
  }, []);

  return isMobile;
}
