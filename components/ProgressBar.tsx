"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ProgressBar() {
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    setLoading(true);
    setWidth(0);
    timer = setInterval(() => {
      setWidth((w) => (w < 90 ? w + 10 : w));
    }, 100);
    return () => {
      clearInterval(timer);
      setLoading(false);
      setWidth(100);
      setTimeout(() => setWidth(0), 400);
    };
  }, [pathname]);

  return (
    <div className="fixed top-0 left-0 w-full z-[999] pointer-events-none">
      <div
        className="h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 transition-all duration-300"
        style={{ width: `${width}%`, opacity: width > 0 ? 1 : 0 }}
      />
    </div>
  );
}
