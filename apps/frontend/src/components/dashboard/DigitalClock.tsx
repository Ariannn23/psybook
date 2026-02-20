import { useState, useEffect } from "react";

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (date: Date) => {
    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const months = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${dayName}, ${day} ${month}`;
  };

  return (
    <div className="flex flex-col items-end bg-gradient-to-br from-slate-50 to-white px-4 py-3 rounded-lg border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="text-2xl font-mono font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
        {formatTime(time)}
      </div>
      <div className="text-xs text-slate-500 font-medium mt-1">
        {formatDate(time)}
      </div>
    </div>
  );
}
