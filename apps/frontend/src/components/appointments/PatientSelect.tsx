import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
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
          "w-full flex items-center justify-between px-4 py-2 rounded-lg border bg-slate-50 border-slate-300 text-left focus:ring-2 focus:ring-emerald-500 transition-all",
          error && "border-red-500 focus:ring-red-500",
          isLoading && "opacity-50 cursor-not-allowed",
        )}
      >
        <span
          className={cn("block truncate", !selectedPatient && "text-slate-500")}
        >
          {selectedPatient ? selectedPatient.name : "Select a patient..."}
        </span>
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin opacity-50" />
        ) : (
          <ChevronsUpDown className="w-4 h-4 opacity-50" />
        )}
      </button>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
            {patients.length === 0 ? (
              <div className="px-4 py-2 text-slate-500">No patients found.</div>
            ) : (
              patients.map((patient) => (
                <div
                  key={patient.id}
                  className={cn(
                    "relative cursor-pointer select-none py-2 pl-10 pr-4 text-slate-900 hover:bg-emerald-50",
                    value === patient.id && "bg-emerald-50 text-emerald-900",
                  )}
                  onClick={() => {
                    onChange(patient.id);
                    setIsOpen(false);
                  }}
                >
                  <span
                    className={cn(
                      "block truncate",
                      value === patient.id && "font-medium",
                    )}
                  >
                    {patient.name}
                  </span>
                  {value === patient.id && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
