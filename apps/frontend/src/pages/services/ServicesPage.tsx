import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  getServices,
  createService,
  deleteService,
  updateService,
} from "@/api/services";
import type { Service } from "@/types/services";
import {
  Loader2,
  Plus,
  Clock,
  Trash2,
  X,
  AlertCircle,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PageLoader from "@/components/ui/PageLoader";

const serviceSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  duration: z.coerce.number().int().positive("La duración debe ser positiva"),
  price: z.coerce.number().positive("El precio debe ser positivo"),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingService, setEditingService] = useState<Service | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      duration: 60,
      price: 0,
    },
  });

  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (err) {
      console.error("Failed to fetch services", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setValue("name", service.name);
    setValue("description", service.description || "");
    setValue("duration", service.duration);
    setValue("price", service.price);
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    reset({ duration: 60, price: 0, name: "", description: "" });
    setError("");
  };

  const onSubmit = async (data: ServiceFormData) => {
    setIsSubmitting(true);
    setError("");
    try {
      if (editingService) {
        const updated = await updateService(editingService.id, data);
        setServices(
          services.map((s) => (s.id === editingService.id ? updated : s)),
        );
      } else {
        const newService = await createService(data);
        setServices([...services, newService]);
      }
      closeModal();
    } catch (err) {
      console.error("Failed to save service", err);
      setError("Error al guardar el servicio. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering edit
    if (!confirm("¿Estás seguro de eliminar este servicio?")) return;
    try {
      await deleteService(id);
      setServices(services.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete service", err);
      alert("Error al eliminar el servicio");
    }
  };

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Servicios
          </h1>
          <p className="text-slate-500 mt-1">
            Gestiona de forma eficiente tus servicios de consulta y
            especialidades.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingService(null);
            reset({ duration: 60, price: 0, name: "", description: "" });
            setIsModalOpen(true);
          }}
          className="group relative bg-slate-900 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-emerald-200 active:scale-95 cursor-pointer"
        >
          <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          <Plus className="w-5 h-5 relative z-10" />
          <span className="font-bold relative z-10">Agregar Servicio</span>
        </button>
      </div>

      {isLoading ? (
        <PageLoader fullPage={false} message="Cargando servicios..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-emerald-200/50"
            >
              {/* Decorative Gradient Background on Hover */}
              <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Decorative Circle */}
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150 pointer-events-none" />

              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 translate-x-2 group-hover:translate-x-0">
                <button
                  className="bg-white/90 backdrop-blur-sm text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg shadow-sm border border-slate-100 transition-colors cursor-pointer"
                  title="Editar"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(service);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => handleDelete(service.id, e)}
                  className="bg-white/90 backdrop-blur-sm text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg shadow-sm border border-slate-100 transition-colors cursor-pointer"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="relative z-0">
                <div className="w-12 h-12 rounded-xl bg-emerald-100/50 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-emerald-200/50">
                  <span className="text-xl font-bold">
                    {service.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-2 group-hover:text-emerald-700 transition-colors line-clamp-1 pr-16">
                  {service.name}
                </h3>
                {service.description && (
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4 h-10">
                    {service.description}
                  </p>
                )}
              </div>

              <div className="mt-auto pt-4 border-t border-slate-50 relative z-0 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100/50">
                  <Clock className="w-3.5 h-3.5" />
                  {service.duration} min
                </div>
                <div className="flex items-center gap-1 text-slate-700 font-bold text-lg">
                  <span className="text-sm font-normal text-slate-400">$</span>
                  {service.price}
                </div>
              </div>
            </div>
          ))}
          {services.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              <p>No se encontraron servicios. Crea uno para comenzar.</p>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-4xl shadow-2xl max-w-md w-full overflow-hidden relative border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>

            <div className="relative">
              <div className="p-8 border-b border-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 rounded-xl">
                      <Plus className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      {editingService ? "Editar Servicio" : "Nuevo Servicio"}
                    </h2>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {error && (
                <div className="mx-8 mt-6 bg-rose-50 text-rose-600 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border border-rose-100">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
                    Nombre del Servicio
                  </label>
                  <input
                    {...register("name")}
                    className={cn(
                      "w-full px-5 py-3.5 rounded-2xl border bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 font-semibold text-slate-700 shadow-sm",
                      errors.name
                        ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500"
                        : "border-slate-100 focus:border-emerald-500",
                    )}
                    placeholder="Ej. Consulta Inicial"
                  />
                  {errors.name && (
                    <p className="text-xs text-rose-500 font-bold ml-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
                    Descripción
                  </label>
                  <textarea
                    {...register("description")}
                    rows={2}
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 resize-none font-medium text-slate-600 shadow-sm"
                    placeholder="Detalles opcionales..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
                      Duración (min)
                    </label>
                    <input
                      type="number"
                      {...register("duration")}
                      className={cn(
                        "w-full px-5 py-3.5 rounded-2xl border bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 font-semibold text-slate-700 shadow-sm",
                        errors.duration
                          ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500"
                          : "border-slate-100 focus:border-emerald-500",
                      )}
                    />
                    {errors.duration && (
                      <p className="text-xs text-rose-500 font-bold ml-1">
                        {errors.duration.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
                      Precio ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("price")}
                      className={cn(
                        "w-full px-5 py-3.5 rounded-2xl border bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 font-semibold text-slate-700 shadow-sm",
                        errors.price
                          ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500"
                          : "border-slate-100 focus:border-emerald-500",
                      )}
                    />
                    {errors.price && (
                      <p className="text-xs text-rose-500 font-bold ml-1">
                        {errors.price.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-50">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "group relative overflow-hidden text-white px-8 py-3.5 rounded-2xl flex items-center gap-2 transition-all duration-300 hover:shadow-xl active:scale-95 disabled:opacity-50 font-bold uppercase tracking-widest text-xs cursor-pointer",
                      editingService
                        ? "bg-amber-500 hover:shadow-amber-100"
                        : "bg-emerald-600 hover:shadow-emerald-100",
                    )}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : editingService ? (
                      <Pencil className="w-4 h-4 relative z-10" />
                    ) : (
                      <Plus className="w-4 h-4 relative z-10" />
                    )}
                    <span className="relative z-10">
                      {editingService
                        ? "Actualizar Servicio"
                        : "Crear Servicio"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
