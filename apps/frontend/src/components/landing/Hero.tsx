import { Link } from "react-router-dom";
import { ChevronRight, Star, Brain, Heart, Quote } from "lucide-react";

export default function Hero() {
  return (
    <section className="pt-48 pb-32 px-6 relative overflow-visible">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-200/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-200/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-full shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
              Atención personalizada y segura
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 leading-[1.05] mb-8 tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Tu mente es <br />
            <span className="bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent italic">
              tu activo más vital.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            En PsyBook combinamos tecnología y empatía para ofrecerte un
            espacio de sanación único. No pospongas tu paz mental; la primera
            sesión es el primer paso hacia una vida plena.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 w-full sm:w-auto">
            <Link
              to="/reservar"
              className="px-12 py-6 bg-slate-900 text-white rounded-3xl font-bold text-xl flex items-center justify-center gap-3 shadow-2xl shadow-slate-200 hover:bg-emerald-600 hover:-translate-y-1 transition-all active:scale-95 group"
            >
              Reservar Ahora
              <ChevronRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-4 animate-in fade-in duration-1000 delay-500">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((idx) => (
                <div
                  key={idx}
                  className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={`https://i.pravatar.cc/150?u=${idx + 10}`}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex gap-0.5 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="w-4 h-4 fill-emerald-500 text-emerald-500"
                  />
                ))}
              </div>
              <p className="text-sm font-bold text-slate-700">
                +1000 pacientes atendidos este mes
              </p>
            </div>
          </div>
        </div>

        <div className="relative animate-in zoom-in duration-1000 delay-500">
          <div className="relative z-10 bg-white/40 backdrop-blur-3xl p-10 rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white/50 overflow-hidden group hover:shadow-[0_48px_80px_-20px_rgba(16,185,129,0.15)] transition-all duration-700">
            <div className="absolute top-0 right-0 p-12 translate-x-12 -translate-y-12 opacity-[0.03] text-emerald-900 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000">
              <Brain className="w-64 h-64" />
            </div>

            <div className="flex items-center gap-3 mb-8">
              <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-tighter">
                  Bienestar Mental
                </span>
              </div>
            </div>

            <p className="text-2xl md:text-3xl font-bold text-slate-800 leading-[1.2] mb-10 tracking-tight">
              "La psicología{" "}
              <span className="text-emerald-600 border-b-2 border-emerald-500/20">
                no es para locos
              </span>
              , es para quienes quieren aprender a gestionar su mundo interno
              y vivir con libertad."
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner group-hover:rotate-12 transition-transform duration-500">
                  <Brain className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 leading-none mb-1">
                    Enfoque Humano
                  </h4>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
                    Tu paz es prioridad
                  </p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200 group-hover:bg-emerald-600 group-hover:-rotate-12 transition-all duration-500">
                <Quote className="w-6 h-6 fill-current opacity-50" />
              </div>
            </div>
          </div>
          <div className="absolute -top-12 -right-8 w-32 h-32 bg-linear-to-br from-teal-400 to-emerald-500 rounded-[2.5rem] -z-10 rotate-12 blur-3xl opacity-20" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-200 rounded-full -z-10 blur-[100px] opacity-40" />
        </div>
      </div>
    </section>
  );
}
