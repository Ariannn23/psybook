import { useEffect, useState } from "react";
import {
  Check,
  ChevronsUpDown,
  Loader2,
  DollarSign,
  Clock,
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
          "w-full flex items-center justify-between px-3 py-2 rounded-lg border bg-white border-slate-300 text-left focus:ring-2 focus:ring-emerald-500 transition-all text-sm h-10",
          error && "border-red-500 focus:ring-red-500",
          isLoading && "opacity-50 cursor-not-allowed",
        )}
      >
        <span
          className={cn(
            "block truncate flex-1",
            !selectedService && "text-slate-500",
          )}
        >
          {selectedService ? (
            <span className="flex items-center gap-2">
              <span className="font-medium">{selectedService.name}</span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                | {selectedService.duration}m - ${selectedService.price}
              </span>
            </span>
          ) : (
            "Select a service..."
          )}
        </span>
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin opacity-50 ml-2" />
        ) : (
          <ChevronsUpDown className="w-4 h-4 opacity-50 ml-2" />
        )}
      </button>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
            {services.length === 0 ? (
              <div className="px-4 py-2 text-slate-500 text-center">
                No services found.
              </div>
            ) : (
              services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  className={cn(
                    "w-full text-left relative cursor-pointer select-none py-2 px-3 text-slate-900 hover:bg-emerald-50 flex flex-col gap-0.5",
                    value === service.id && "bg-emerald-50",
                  )}
                  onClick={() => {
                    onChange(service.id);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "font-medium",
                        value === service.id && "text-emerald-700",
                      )}
                    >
                      {service.name}
                    </span>
                    {value === service.id && (
                      <Check className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {service.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> ${service.price}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
