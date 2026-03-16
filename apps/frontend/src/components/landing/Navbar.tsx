import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/icono_psybook.png"
            alt="PsyBook Logo"
            className="w-10 h-10 object-contain drop-shadow-sm"
          />
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
          <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
            <Link
              to="/login"
              className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors"
            >
              Acceder
            </Link>
            <Link
              to="/reservar"
              className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-200 transition-all active:scale-95"
            >
              Reservar Cita
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <Link
            to="/login"
            className="text-sm font-bold text-slate-600 hover:text-emerald-600"
          >
            Acceder
          </Link>
          <button
            type="button"
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl"
            title="Menú"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
