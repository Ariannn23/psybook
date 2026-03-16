import { Link } from "react-router-dom";
import { Heart, Brain, MessageCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
  {
    title: "Terapia Individual",
    desc: "Descubre herramientas para conocerte mejor y superar bloqueos emocionales profundos.",
    icon: Heart,
    color: "bg-rose-50 text-rose-600",
  },
  {
    title: "Ansiedad y Estrés",
    desc: "Técnicas de regulación para volver a disfrutar de tu presente sin preocupaciones constantes.",
    icon: Brain,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Terapia de Pareja",
    desc: "Reconecta con quien amas mediante comunicación asertiva y resolución de conflictos.",
    icon: MessageCircle,
    color: "bg-emerald-50 text-emerald-600",
  },
];

export default function Services() {
  return (
    <section id="servicios" className="py-32 px-6 bg-white relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-[0.3em] mb-4">
              Áreas de Expertise
            </h2>
            <h3 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tighter">
              Especialidades diseñadas para tu equilibrio.
            </h3>
          </div>
          <p className="text-lg text-slate-500 max-w-sm">
            Tratamientos modernos avalados científicamente para los retos del
            mundo actual.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {services.map((s, i) => (
            <div
              key={i}
              className="group p-12 rounded-[3rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-3xl hover:shadow-emerald-100 transition-all duration-500 hover:-translate-y-3"
            >
              <div
                className={cn(
                  "w-20 h-20 rounded-3xl flex items-center justify-center mb-10 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all",
                  s.color,
                )}
              >
                <s.icon className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">
                {s.title}
              </h4>
              <p className="text-lg text-slate-500 leading-relaxed mb-10">
                {s.desc}
              </p>
              <Link
                to="/reservar"
                className="inline-flex items-center gap-3 text-emerald-600 font-black uppercase text-sm tracking-widest group-hover:gap-5 transition-all"
              >
                Explorar Sesión <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
