import { Instagram, Twitter, Linkedin, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="pt-32 pb-16 px-6 bg-white border-t border-slate-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <img
                src="/icono_psybook.png"
                alt="PsyBook Logo"
                className="w-10 h-10 object-contain"
              />
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
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-50 rounded-full blur-3xl -z-10 opacity-60" />
    </footer>
  );
}
