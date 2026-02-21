import { cn } from "@/lib/utils";

interface PageLoaderProps {
  className?: string;
  fullPage?: boolean;
  message?: string;
}

export default function PageLoader({
  className,
  fullPage = true,
  message = "Iniciando PsyBook",
}: PageLoaderProps) {
  return (
    <div
      className={cn(
        fullPage ? "fixed inset-0 z-[100]" : "w-full min-h-[400px] flex-1",
        "flex flex-col items-center justify-center bg-white animate-in fade-in duration-500",
        className,
      )}
    >
      <div className="relative scale-90 md:scale-100">
        {/* Animated background rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-50 rounded-full animate-ping opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-50 rounded-full animate-pulse opacity-10"></div>

        {/* Branded Logo Container */}
        <div className="relative bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-emerald-100/50 border border-slate-50 flex items-center justify-center animate-in zoom-in-50 duration-700">
          <img
            src="/icono_psybook.png"
            alt="PsyBook"
            className="w-16 h-16 object-contain animate-pulse"
          />
        </div>
      </div>

      {/* Loading bar */}
      <div className="mt-12 w-48 h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
        <div className="h-full bg-linear-to-r from-emerald-400 to-teal-500 rounded-full animate-infinite-progress"></div>
      </div>

      <div className="mt-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
}
