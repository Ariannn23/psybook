import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "¿Cómo reservo mi primera cita?",
    a: "Es muy sencillo. Haz clic en el botón 'Reservar Cita', selecciona el servicio que necesitas, elige un profesional y busca un horario disponible en el calendario. Recibirás una confirmación inmediata por correo electrónico.",
  },
  {
    q: "¿Qué duración tienen las sesiones?",
    a: "Típicamente las sesiones individuales duran entre 50 y 60 minutos. Las terapias de pareja o grupales pueden extenderse hasta los 90 minutos según el caso específico.",
  },
  {
    q: "¿Es la información confidencial?",
    a: "Absolutamente. La confidencialidad es la base de la ética psicológica. Toda la información compartida en sesión está protegida por el secreto profesional y nuestro sistema cumple con los más altos estándares de seguridad.",
  },
  {
    q: "¿Puedo cancelar o reprogramar una cita?",
    a: "Sí, puedes reprogramar hasta 24 horas antes de la sesión sin costo adicional. Esto nos permite ofrecer ese espacio a otra persona que pueda necesitarlo.",
  },
];

export default function Faq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section id="faq" className="py-32 px-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h3 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
            Preguntas Frecuentes.
          </h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={cn(
                "rounded-3xl border border-slate-200 overflow-hidden transition-all duration-300",
                openFaq === i
                  ? "bg-white shadow-xl shadow-slate-200 border-white"
                  : "bg-transparent hover:bg-white/50",
              )}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-8 py-7 flex items-center justify-between text-left group"
              >
                <span
                  className={cn(
                    "text-lg md:text-xl font-bold transition-colors",
                    openFaq === i
                      ? "text-slate-900"
                      : "text-slate-600 group-hover:text-slate-900",
                  )}
                >
                  {faq.q}
                </span>
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    openFaq === i
                      ? "bg-slate-900 text-white rotate-45"
                      : "bg-slate-100 text-slate-400 group-hover:bg-slate-200",
                  )}
                >
                  <Plus className="w-6 h-6" />
                </div>
              </button>
              <div
                className={cn(
                  "px-8 transition-all duration-300 ease-in-out",
                  openFaq === i
                    ? "max-h-96 pb-8"
                    : "max-h-0 pointer-events-none",
                )}
              >
                <p className="text-lg text-slate-500 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
