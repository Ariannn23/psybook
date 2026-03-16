import { Link } from "react-router-dom";
import { CheckCircle2, Star, Heart, Shield } from "lucide-react";

export default function About() {
  return (
    <section id="sobre-mi" className="py-24 px-6">
      <div className="max-w-7xl mx-auto bg-slate-900 rounded-[4rem] p-12 md:p-24 flex flex-col lg:grid lg:grid-cols-2 items-center gap-16 overflow-hidden relative border border-white/5 shadow-3xl shadow-slate-300">
        <div className="absolute top-0 right-0 w-[60%] h-full bg-linear-to-bl from-emerald-500/10 to-transparent z-0" />

        <div className="relative z-10 w-full">
          <div className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">
              Trayectoria Mental
            </span>
          </div>
          <h3 className="text-4xl md:text-6xl font-black text-white mb-10 leading-[1.1] tracking-tighter">
            Ciencia y empatía <br />
            <span className="text-emerald-400">al servicio de tu salud.</span>
          </h3>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-12 max-w-lg">
            Creemos que cada persona es un universo único. Por eso, no
            aplicamos métodos genéricos, sino que construimos un plan
            terapéutico a medida del paciente.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 mb-12 text-white/90">
            {[
              "Psicólogo Clínico Matriculado",
              "Certificado en Mindfulness",
              "Más de 15 especialidades",
              "Atención 100% Confidencial",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors"
              >
                <CheckCircle2 className="text-emerald-400 w-6 h-6 shrink-0" />
                <span className="font-bold text-sm tracking-wide">
                  {item}
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/reservar"
            className="inline-flex py-5 px-12 bg-emerald-500 text-white rounded-2xl font-black text-lg hover:bg-emerald-400 hover:shadow-xl hover:shadow-emerald-500/30 transition-all hover:-translate-y-1"
          >
            Agenda tu consulta
          </Link>
        </div>

        <div className="w-full relative py-10">
          <div className="aspect-square bg-linear-to-br from-emerald-400/20 to-teal-400/5 rounded-[4rem] border border-white/10 flex items-center justify-center p-10 relative group">
            <div className="absolute inset-0 bg-emerald-500/5 rounded-[4rem] animate-pulse" />
            <div className="relative z-20 w-full aspect-square bg-slate-800 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col items-center justify-center p-12 text-center group-hover:scale-[1.02] transition-transform duration-700">
              <div className="w-32 h-32 bg-linear-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/20">
                <Star className="w-16 h-16 text-white fill-white/20" />
              </div>
              <span className="text-4xl font-black text-white mb-4">
                +500
              </span>
              <span className="text-slate-400 text-lg font-bold">
                Vidas transformadas con éxito
              </span>
              <div className="mt-10 flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="w-5 h-5 fill-emerald-400 text-emerald-400"
                  />
                ))}
              </div>
            </div>
            <div className="absolute -top-10 -left-6 bg-white p-6 rounded-3xl shadow-2xl animate-bounce duration-3000">
              <Heart className="w-8 h-8 text-rose-500 fill-rose-50" />
            </div>
            <div className="absolute -bottom-8 -right-4 bg-white p-6 rounded-3xl shadow-2xl">
              <Shield color="#10b981" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
