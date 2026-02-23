import { useEffect, useState } from "react";
import {
  Check,
  ChevronsUpDown,
  Loader2,
  DollarSign,
  Clock,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getServices } from "@/api/services";
import type { Service } from "@/types/services";

interface ServiceSelectProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function ServiceSelect({
  value,
  onChange,
  error,
}: ServiceSelectProps) {
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data.filter((s) => s.isActive));
      } catch (err) {
        console.error("Failed to fetch services", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const selectedService = services.find((s) => s.id === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !isLoading && setOpen(!open)}
        className={cn(
          "w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border bg-slate-50 transition-all duration-300 shadow-sm group",
          error
            ? "border-rose-200 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500"
            : "border-slate-100 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500",
          isLoading && "opacity-50 cursor-not-allowed",
          open &&
            "bg-white border-emerald-500 ring-4 ring-emerald-500/10 shadow-lg shadow-emerald-100/50",
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2 rounded-xl transition-colors duration-300",
              selectedService
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-100 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500",
            )}
          >
            <Stethoscope size={18} />
          </div>
          <div className="text-left">
            <span
              className={cn(
                "block truncate text-sm font-semibold",
                !selectedService ? "text-slate-400" : "text-slate-700",
              )}
            >
              {selectedService
                ? selectedService.name
                : "Seleccionar servicio..."}
            </span>
            {selectedService && (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Clock size={10} className="text-emerald-500" />{" "}
                  {selectedService.duration} min
                </span>
                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  ${selectedService.price}
                </span>
              </div>
            )}
          </div>
        </div>
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
        ) : (
          <ChevronsUpDown
            className={cn(
              "w-4 h-4 transition-transform duration-300",
              open ? "rotate-180 text-emerald-500" : "text-slate-400",
            )}
          />
        )}
      </button>

      {error && (
        <p className="mt-2 text-xs text-rose-500 font-bold ml-1">{error}</p>
      )}

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-3 w-full max-h-[320px] overflow-auto rounded-3xl bg-white p-2 shadow-2xl shadow-emerald-200/50 ring-1 ring-slate-100 focus:outline-none scrollbar-thin scrollbar-thumb-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
            {services.length === 0 ? (
              <div className="px-4 py-8 text-center text-slate-500">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Stethoscope className="w-6 h-6 text-slate-200" />
                </div>
                <p className="text-sm font-medium text-slate-400">
                  No hay servicios activos.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    className={cn(
                      "w-full text-left relative cursor-pointer select-none p-3.5 rounded-2xl transition-all duration-200 group/item flex flex-col gap-1",
                      value === service.id
                        ? "bg-emerald-50"
                        : "text-slate-600 hover:bg-slate-50",
                    )}
                    onClick={() => {
                      onChange(service.id);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "text-sm font-bold",
                          value === service.id
                            ? "text-emerald-900"
                            : "text-slate-700",
                        )}
                      >
                        {service.name}
                      </span>
                      {value === service.id && (
                        <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200 animate-in zoom-in-50">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white rounded-lg border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <Clock size={12} className="text-emerald-500" />
                        {service.duration} min
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-600 rounded-lg text-[10px] font-black text-white uppercase tracking-widest shadow-sm">
                        <DollarSign size={12} />
                        {service.price}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
