"use client";

import { useEffect, useState } from "react";

export function LiveClock() {
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimestamp(
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
          now.getDate()
        ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(
          now.getMinutes()
        ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!timestamp) return <div className="text-xs mt-2 opacity-0">0000-00-00 00:00:00</div>;

  const [date, time] = timestamp.split(" ");

  return (
    <div className="text-xs mt-2">
      <div>{date}</div>
      <div>{time}</div>
    </div>
  );
}
