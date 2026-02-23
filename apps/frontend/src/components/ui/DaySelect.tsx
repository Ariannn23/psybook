import { useState } from "react";
import { Check, ChevronDown, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface DaySelectProps {
  value: number;
  onChange: (value: number) => void;
}

const DAYS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export default function DaySelect({ value, onChange }: DaySelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border bg-white transition-all duration-300 shadow-sm group",
          isOpen
            ? "border-emerald-500 ring-4 ring-emerald-500/10 shadow-lg shadow-emerald-100/50"
            : "border-slate-200 hover:border-emerald-300 hover:shadow-md",
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2 rounded-xl transition-colors duration-300",
              isOpen
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-50 text-slate-400 group-hover:text-emerald-500",
            )}
          >
            <Calendar size={18} />
          </div>
          <span className="font-bold text-slate-700">{DAYS[value]}</span>
        </div>
        <ChevronDown
          size={20}
          className={cn(
            "text-slate-400 transition-transform duration-300",
            isOpen && "rotate-180 text-emerald-500",
          )}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-40 mt-3 w-full overflow-hidden rounded-3xl bg-white p-2 shadow-2xl shadow-emerald-200/50 ring-1 ring-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-1">
              {DAYS.map((day, index) => (
                <button
                  key={index}
                  type="button"
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group/item",
                    value === index
                      ? "bg-emerald-50 text-emerald-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600",
                  )}
                  onClick={() => {
                    onChange(index);
                    setIsOpen(false);
                  }}
                >
                  <span
                    className={cn(
                      "text-sm font-bold",
                      value === index
                        ? "text-emerald-900"
                        : "text-slate-700 group-hover/item:text-emerald-700",
                    )}
                  >
                    {day}
                  </span>
                  {value === index && (
                    <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200 animate-in zoom-in-50">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
