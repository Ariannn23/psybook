import { useState } from "react";
import { Check, ChevronDown, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export default function StatusFilter({
  value,
  onChange,
  options,
}: StatusFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 px-5 py-3 rounded-2xl border bg-white transition-all duration-300 shadow-sm group min-w-[200px] justify-between",
          isOpen
            ? "border-emerald-500 ring-4 ring-emerald-500/10 shadow-lg shadow-emerald-100/50"
            : "border-slate-200 hover:border-emerald-300 hover:shadow-md",
        )}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "p-1.5 rounded-lg transition-colors duration-300",
              value !== "all"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-50 text-slate-400 group-hover:text-emerald-500",
            )}
          >
            <Filter size={14} />
          </div>
          <span className="text-sm font-bold text-slate-700">
            {selectedOption.label}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={cn(
            "text-slate-400 transition-transform duration-300",
            isOpen && "rotate-180 text-emerald-500",
          )}
        />
        {value !== "all" && (
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-40 mt-3 w-full min-w-[220px] overflow-hidden rounded-3xl bg-white p-2 shadow-2xl shadow-emerald-200/50 ring-1 ring-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group/item",
                    value === option.value
                      ? "bg-emerald-50 text-emerald-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600",
                  )}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <span
                    className={cn(
                      "text-sm font-bold",
                      value === option.value
                        ? "text-emerald-900"
                        : "text-slate-700 group-hover/item:text-emerald-700",
                    )}
                  >
                    {option.label}
                  </span>
                  {value === option.value && (
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
