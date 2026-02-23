import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Loader2, User } from "lucide-react";
import { getPatients } from "@/api/patients";
import type { Patient } from "@/types/patients";
import { cn } from "@/lib/utils";

interface PatientSelectProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function PatientSelect({
  value,
  onChange,
  error,
}: PatientSelectProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (err) {
        console.error("Failed to fetch patients", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const selectedPatient = patients.find((p) => p.id === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !isLoading && setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border bg-slate-50 transition-all duration-300 shadow-sm group",
          error
            ? "border-rose-200 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500"
            : "border-slate-100 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500",
          isLoading && "opacity-50 cursor-not-allowed",
          isOpen &&
            "bg-white border-emerald-500 ring-4 ring-emerald-500/10 shadow-lg shadow-emerald-100/50",
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2 rounded-xl transition-colors duration-300",
              selectedPatient
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-100 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500",
            )}
          >
            <User size={18} />
          </div>
          <span
            className={cn(
              "block truncate text-sm font-semibold",
              !selectedPatient ? "text-slate-400" : "text-slate-700",
            )}
          >
            {selectedPatient ? selectedPatient.name : "Seleccionar paciente..."}
          </span>
        </div>
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
        ) : (
          <ChevronsUpDown
            className={cn(
              "w-4 h-4 transition-transform duration-300",
              isOpen ? "rotate-180 text-emerald-500" : "text-slate-400",
            )}
          />
        )}
      </button>

      {error && (
        <p className="mt-2 text-xs text-rose-500 font-bold ml-1">{error}</p>
      )}

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-3 w-full max-h-[320px] overflow-auto rounded-3xl bg-white p-2 shadow-2xl shadow-emerald-200/50 ring-1 ring-slate-100 focus:outline-none scrollbar-thin scrollbar-thumb-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
            {patients.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-slate-200" />
                </div>
                <p className="text-sm font-medium text-slate-400">
                  No se encontraron pacientes.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {patients.map((patient) => (
                  <button
                    key={patient.id}
                    type="button"
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group/item",
                      value === patient.id
                        ? "bg-emerald-50 text-emerald-900"
                        : "text-slate-600 hover:bg-slate-50",
                    )}
                    onClick={() => {
                      onChange(patient.id);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-colors font-bold text-xs",
                          value === patient.id
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-400 group-hover/item:bg-emerald-100 group-hover/item:text-emerald-600",
                        )}
                      >
                        {patient.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <p
                          className={cn(
                            "text-sm font-bold truncate",
                            value === patient.id
                              ? "text-emerald-900"
                              : "text-slate-700",
                          )}
                        >
                          {patient.name}
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          DNI: {patient.dni}
                        </p>
                      </div>
                    </div>
                    {value === patient.id && (
                      <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200 animate-in zoom-in-50">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
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
