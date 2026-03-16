import { useState } from "react";
import {
  CheckCircle,
  User,
  FileText,
  ArrowRight,
  X,
  History,
} from "lucide-react";
import type { Appointment } from "@/types/appointments";

interface SessionConfirmationModalProps {
  appointment: Appointment;
  onConfirm: (notes: string, scheduleNext: boolean) => Promise<void>;
  onCancel: () => void;
}

export default function SessionConfirmationModal({
  appointment,
  onConfirm,
  onCancel,
}: SessionConfirmationModalProps) {
  const [step, setStep] = useState(1);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinalize = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(notes, false); // scheduleNext handled by navigation in parent if true
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-4xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Finalizar Sesión
              </h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                Paso {step} de 2
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto">
          {step === 1 ? (
            <div className="space-y-6 animate-slide-in">
              <div className="flex items-start gap-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/30">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <User className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">
                    {appointment.patient?.name}
                  </p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">
                    {appointment.service?.name} • {appointment.startTime}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <FileText className="w-3.5 h-3.5" />
                  Evolución Clínica / Notas de Sesión
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Escribe aquí los puntos clave de la sesión, avances o temas a tratar en la próxima..."
                  className="w-full h-40 p-4 rounded-2xl border border-slate-200 bg-slate-50/30 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none text-slate-700 font-medium"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-slide-in text-center py-4">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-white shadow-lg">
                <History className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  ¿Deseas agendar la próxima?
                </h3>
                <p className="text-slate-500 text-sm font-medium px-4">
                  Mantener la regularidad es clave para el progreso del
                  paciente. Puedes agendar ahora o hacerlo más tarde.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={handleFinalize}
                  className="w-full p-4 rounded-2xl border-2 border-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-50 hover:border-slate-200 transition-all cursor-pointer"
                >
                  Finalizar sin agendar
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-50 bg-slate-50/30 flex gap-3">
          {step === 1 ? (
            <>
              <button
                onClick={onCancel}
                className="flex-1 py-4 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 group cursor-pointer"
              >
                Siguiente
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="px-6 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-white rounded-2xl transition-all cursor-pointer"
              >
                Atrás
              </button>
              <button
                onClick={async () => {
                  setIsSubmitting(true);
                  await onConfirm(notes, true);
                  setIsSubmitting(false);
                }}
                disabled={isSubmitting}
                className="flex-1 py-4 bg-emerald-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Guardando..." : "Confirmar y Agendar Próxima"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
