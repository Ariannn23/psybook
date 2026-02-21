import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Star,
  Shield,
  CheckCircle2,
  ArrowRight,
  Heart,
  Brain,
  MessageCircle,
  Menu,
  Plus,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Brain className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-linear-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              PsyBook
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#servicios"
              className="relative text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors group py-1"
            >
              Servicios
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500/60 rounded-full transition-all duration-300 group-hover:w-full" />
            </a>
            <a
              href="#sobre-mi"
              className="relative text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors group py-1"
            >
              Sobre mí
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500/60 rounded-full transition-all duration-300 group-hover:w-full" />
            </a>
            <a
              href="#faq"
              className="relative text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors group py-1"
            >
              Preguntas
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500/60 rounded-full transition-all duration-300 group-hover:w-full" />
            </a>
            <Link
              to="/reservar"
              className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-200 transition-all active:scale-95"
            >
              Reservar Cita
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-slate-600"
            title="Menú"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
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
            {/* Main Card */}
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

            {/* Decorative Floating Elements */}
            <div className="absolute -top-12 -right-8 w-32 h-32 bg-linear-to-br from-teal-400 to-emerald-500 rounded-[2.5rem] -z-10 rotate-12 blur-3xl opacity-20" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-200 rounded-full -z-10 blur-[100px] opacity-40" />
          </div>
        </div>
      </section>

      {/* Services Section */}
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
            {[
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
            ].map((s, i) => (
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

      {/* About Section */}
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
              {/* Float elements */}
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

      {/* FAQ Section */}
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

      {/* Footer */}
      <footer className="pt-32 pb-16 px-6 bg-white border-t border-slate-100 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-slate-900">
                  PsyBook
                </span>
              </div>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                Elevando los estándares de la salud mental en el mundo digital.
                Tu paz comienza aquí.
              </p>
              <div className="flex gap-4">
                {[
                  { Icon: Instagram, title: "Instagram" },
                  { Icon: Twitter, title: "Twitter" },
                  { Icon: Linkedin, title: "LinkedIn" },
                  { Icon: Facebook, title: "Facebook" },
                ].map(({ Icon, title }, i) => (
                  <a
                    key={i}
                    href="#"
                    title={title}
                    className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white hover:-translate-y-1 transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="col-span-1">
              <h4 className="text-slate-900 font-black uppercase text-sm tracking-widest mb-8">
                Navegación
              </h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-slate-500 hover:text-emerald-600 font-bold transition-colors"
                  >
                    Inicio
                  </a>
                </li>
                <li>
                  <a
                    href="#servicios"
                    className="text-slate-500 hover:text-emerald-600 font-bold transition-colors"
                  >
                    Servicios
                  </a>
                </li>
                <li>
                  <a
                    href="#sobre-mi"
                    className="text-slate-500 hover:text-emerald-600 font-bold transition-colors"
                  >
                    Sobre mí
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-slate-500 hover:text-emerald-600 font-bold transition-colors"
                  >
                    Preguntas
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="text-slate-900 font-black uppercase text-sm tracking-widest mb-8">
                Servicios
              </h4>
              <ul className="space-y-4 text-slate-500 font-bold">
                <li>Terapia Individual</li>
                <li>Terapia de Pareja</li>
                <li>Ansiedad y Burnout</li>
                <li>Desarrollo Personal</li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="text-slate-900 font-black uppercase text-sm tracking-widest mb-8">
                Contacto
              </h4>
              <ul className="space-y-4 text-slate-500 font-bold">
                <li>hola@psybook.app</li>
                <li>Calle Progresista 123</li>
                <li>Tel: +123 456 789</li>
                <li className="pt-4">
                  <div className="px-5 py-2 bg-emerald-50 text-emerald-700 rounded-full inline-flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Soporte 24/7 activo
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-slate-400 text-sm font-medium">
              © 2026 PsyBook App. El futuro de la salud mental comienza hoy.
            </p>
            <div className="flex gap-10 text-slate-400 text-sm font-bold tracking-tight">
              <a href="#" className="hover:text-slate-900 transition-colors">
                Términos de Servicio
              </a>
              <a href="#" className="hover:text-slate-900 transition-colors">
                Privacidad
              </a>
              <a href="#" className="hover:text-slate-900 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
        {/* BG Decor */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-50 rounded-full blur-3xl -z-10 opacity-60" />
      </footer>
    </div>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
