import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format, isSameDay, addDays } from "date-fns";
import { es } from "date-fns/locale";
import {
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  User,
  ChevronRight,
  ChevronLeft,
  Check,
  Award,
  ShieldCheck,
  Stethoscope,
  ArrowRight,
  ArrowLeft,
  Info,
  Star,
  Users,
} from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";
import PageLoader from "@/components/ui/PageLoader";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

type Step = "service" | "doctor" | "dateTime" | "patient" | "success";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description?: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty?: string;
}

export default function PublicBookingPage() {
  const [step, setStep] = useState<Step>("service");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+51 ",
    dni: "",
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [servicesRes, doctorsRes] = await Promise.all([
          axios.get(`${API_URL}/public/services`),
          axios.get(`${API_URL}/public/doctors`),
        ]);

        if (servicesRes.data.success) {
          setServices(servicesRes.data.data);
        }
        if (doctorsRes.data.success) {
          setDoctors(doctorsRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setTimeout(() => setIsInitialLoading(false), 800);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (step === "dateTime" && selectedService && selectedDoctor) {
      fetchSlots();
    }
  }, [step, selectedDate, selectedService, selectedDoctor]);

  const fetchSlots = async () => {
    setIsLoadingSlots(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const response = await axios.get(`${API_URL}/public/slots`, {
        params: {
          date: dateStr,
          serviceId: selectedService?.id,
          doctorId: selectedDoctor?.id,
        },
      });
      if (response.data.success) {
        setAvailableSlots(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/public/appointments`, {
        doctorId: selectedDoctor?.id,
        serviceId: selectedService?.id,
        date: format(selectedDate, "yyyy-MM-dd"),
        startTime: selectedSlot,
        patientData: formData,
      });
      if (response.data.success) {
        setStep("success");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isInitialLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              title="Volver al inicio"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <img
                src="/icono_psybook.png"
                alt="PsyBook Logo"
                className="w-10 h-10 object-contain drop-shadow-sm"
              />
              <span className="text-xl font-bold tracking-tight text-slate-800">
                PsyBook
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
              <ShieldCheck className="w-4 h-4" />
              <span>Reserva Segura</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Stepper Progress */}
          {step !== "success" && (
            <div className="mb-10">
              <div className="flex items-center justify-between relative px-2">
                {[
                  { id: "service", label: "Servicio", icon: Stethoscope },
                  { id: "doctor", label: "Profesional", icon: Users },
                  { id: "dateTime", label: "Fecha y Hora", icon: CalendarIcon },
                  { id: "patient", label: "Tus Datos", icon: User },
                ].map((s, idx, arr) => {
                  const Icon = s.icon;
                  const isActive = step === s.id;
                  const isCompleted = arr.findIndex((x) => x.id === step) > idx;

                  return (
                    <React.Fragment key={s.id}>
                      <div className="flex flex-col items-center z-10">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2",
                            isActive
                              ? "bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-200 scale-110"
                              : isCompleted
                                ? "bg-emerald-100 border-emerald-100 text-emerald-600"
                                : "bg-white border-slate-100 text-slate-400",
                          )}
                        >
                          {isCompleted ? (
                            <Check className="w-6 h-6 stroke-3" />
                          ) : (
                            <Icon className="w-6 h-6" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "mt-3 text-[10px] font-bold uppercase tracking-wider text-center max-w-[80px]",
                            isActive
                              ? "text-emerald-700 underline underline-offset-4"
                              : "text-slate-400",
                          )}
                        >
                          {s.label}
                        </span>
                      </div>
                      {idx < arr.length - 1 && (
                        <div className="flex-1 h-[2px] mx-2 bg-slate-100 relative top-[-15px]">
                          <div
                            className={cn(
                              "absolute inset-0 bg-emerald-500 transition-all duration-700",
                              isCompleted ? "w-full" : "w-0",
                            )}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step Content */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            {step === "service" && (
              <div className="p-8 md:p-12">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Selecciona un Servicio
                  </h1>
                  <p className="text-slate-500">
                    Elige la modalidad de atención que mejor se adapte a tus
                    necesidades.
                  </p>
                </div>

                <div className="grid gap-4">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedService(s);
                        setStep("doctor");
                      }}
                      className={cn(
                        "group relative p-6 text-left rounded-3xl border-2 transition-all duration-300",
                        selectedService?.id === s.id
                          ? "border-emerald-500 bg-emerald-50/30"
                          : "border-slate-50 hover:border-emerald-200 hover:bg-slate-50/50",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 mb-1">
                            {s.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-emerald-500" />
                              {s.duration} min
                            </span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span className="text-emerald-700 font-bold">
                              ${s.price}
                            </span>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:border-emerald-500 transition-all">
                          <ChevronRight className="w-6 h-6" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === "doctor" && (
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                      Elige a tu Profesional
                    </h1>
                    <p className="text-slate-500">
                      Contamos con especialistas altamente capacitados para
                      acompañarte.
                    </p>
                  </div>
                  <button
                    onClick={() => setStep("service")}
                    title="Volver"
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {doctors.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => {
                        setSelectedDoctor(d);
                        setStep("dateTime");
                      }}
                      className={cn(
                        "group p-8 text-center rounded-[2.5rem] border-2 transition-all duration-300 relative overflow-hidden",
                        selectedDoctor?.id === d.id
                          ? "border-emerald-500 bg-emerald-50/30 ring-4 ring-emerald-500/10"
                          : "border-slate-50 hover:border-emerald-200 hover:bg-slate-50/50",
                      )}
                    >
                      <div className="relative mb-6">
                        <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-slate-100 to-slate-200 mx-auto flex items-center justify-center spill-shadow group-hover:scale-105 transition-transform">
                          <User className="w-12 h-12 text-slate-400" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-xl border-4 border-white flex items-center justify-center shadow-lg">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      <h3 className="text-xl font-black text-slate-900 mb-1">
                        {d.name}
                      </h3>
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4">
                        Especialista en Salud Mental
                      </p>

                      <div className="flex items-center justify-center gap-1 mb-6">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                          />
                        ))}
                        <span className="text-xs font-black text-slate-400 ml-1">
                          5.0
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs font-black text-slate-600 border border-slate-100 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        Seleccionar Profesional{" "}
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === "dateTime" && (
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                      ¿Cuándo te gustaría venir?
                    </h1>
                    <p className="text-slate-500">
                      Horarios disponibles para {selectedDoctor?.name}.
                    </p>
                  </div>
                  <button
                    onClick={() => setStep("doctor")}
                    title="Volver"
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  {/* Mini Calendar (Simplified for now with day list) */}
                  <div>
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 block">
                      1. Selecciona el Día
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({ length: 12 }).map((_, i) => {
                        const date = addDays(new Date(), i);
                        const isSelected = isSameDay(date, selectedDate);

                        return (
                          <button
                            key={i}
                            onClick={() => {
                              setSelectedDate(date);
                              setSelectedSlot(null);
                            }}
                            className={cn(
                              "flex flex-col items-center p-3 rounded-2xl border-2 transition-all",
                              isSelected
                                ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100"
                                : "bg-white border-slate-50 hover:border-emerald-200",
                            )}
                          >
                            <span className="text-[10px] font-bold uppercase mb-1 opacity-70">
                              {format(date, "EEE", { locale: es })}
                            </span>
                            <span className="text-lg font-bold">
                              {format(date, "d")}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 block">
                      2. Selecciona la Hora
                    </label>
                    {isLoadingSlots ? (
                      <div className="grid grid-cols-2 gap-3 animate-pulse">
                        {[1, 2, 3, 4].map((n) => (
                          <div
                            key={n}
                            className="h-12 bg-slate-50 rounded-xl"
                          />
                        ))}
                      </div>
                    ) : availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={cn(
                              "py-3 px-4 rounded-xl border-2 font-bold transition-all",
                              selectedSlot === slot
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "bg-white border-slate-50 hover:border-emerald-200 text-slate-700",
                            )}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-slate-50 rounded-3xl p-6 text-center">
                        <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-400 text-sm font-medium">
                          No hay horarios disponibles para este día.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-10 flex justify-end">
                  <button
                    disabled={!selectedSlot}
                    onClick={() => setStep("patient")}
                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition-all active:scale-95"
                  >
                    Continuar
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {step === "patient" && (
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                      Tus Datos Personales
                    </h1>
                    <p className="text-slate-500">
                      Casi terminamos. Necesitamos estos datos para confirmar tu
                      cita.
                    </p>
                  </div>
                  <button
                    onClick={() => setStep("dateTime")}
                    title="Volver"
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                </div>

                <form
                  onSubmit={handleBooking}
                  className="grid md:grid-cols-2 gap-6"
                >
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Nombre Completo
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Ej: Juan Pérez"
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        DNI / Documento
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Número de documento"
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                        value={formData.dni}
                        onChange={(e) =>
                          setFormData({ ...formData, dni: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Email
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="correo@ejemplo.com"
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Teléfono
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="Ej: +51 900 000 000"
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-6">
                    <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 mb-8">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-emerald-900 mb-0.5">
                            Resumen de tu Reserva
                          </h4>
                          <p className="text-sm text-emerald-700 font-medium leading-relaxed">
                            {selectedService?.name} •{" "}
                            {format(selectedDate, "d 'de' MMMM", {
                              locale: es,
                            })}{" "}
                            a las {selectedSlot} hs <br />
                            <span className="text-xs font-black uppercase text-emerald-600">
                              Atendido por: {selectedDoctor?.name}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Clock className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-6 h-6" />
                          Confirmar mi Reserva
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === "success" && (
              <div className="p-12 text-center animate-in zoom-in-95 duration-700">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mb-3">
                  ¡Cita Reservada!
                </h1>
                <p className="text-lg text-slate-500 max-w-md mx-auto mb-10">
                  Hemos enviado los detalles de tu reserva a{" "}
                  <span className="text-emerald-700 font-bold">
                    {formData.email}
                  </span>
                  . ¡Te esperamos con {selectedDoctor?.name}!
                </p>

                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Fecha
                    </span>
                    <span className="font-bold text-slate-700">
                      {format(selectedDate, "dd/MM/yyyy")}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Horario
                    </span>
                    <span className="font-bold text-slate-700">
                      {selectedSlot} hs
                    </span>
                  </div>
                </div>

                <div className="mt-12">
                  <button
                    onClick={() => window.location.reload()}
                    className="text-emerald-600 font-bold hover:underline transition-all"
                  >
                    Hacer otra reserva
                  </button>
                </div>
              </div>
            )}
          </div>

          <footer className="mt-12 text-center text-slate-400 text-xs font-medium space-y-2">
            <p>© 2026 PsyBook • Plataforma de Salud Mental</p>
            <p>
              Al reservar aceptas nuestros términos y políticas de privacidad.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
