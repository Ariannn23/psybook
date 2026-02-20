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
  DollarSign,
  Trash2,
  X,
  AlertCircle,
  Pencil,
} from "lucide-react";

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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Servicios</h1>
          <p className="text-slate-500">Gestiona tus servicios de consulta</p>
        </div>
        <button
          onClick={() => {
            setEditingService(null);
            reset({ duration: 60, price: 0, name: "", description: "" });
            setIsModalOpen(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Agregar Servicio
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => handleEdit(service)}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4 relative group cursor-pointer hover:shadow-md hover:border-emerald-200 transition-all"
            >
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="text-emerald-500 hover:text-emerald-700 bg-emerald-50 p-1.5 rounded-md"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => handleDelete(service.id, e)}
                  className="text-slate-400 hover:text-red-500 bg-red-50 p-1.5 rounded-md"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 pr-16">
                  {service.name}
                </h3>
                {service.description && (
                  <p className="text-slate-500 text-sm mt-1 line-clamp-2">
                    {service.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm mt-auto pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                  <Clock className="w-3.5 h-3.5" />
                  {service.duration} min
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                  <DollarSign className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {editingService ? "Editar Servicio" : "Nuevo Servicio"}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Nombre del Servicio
                </label>
                <input
                  {...register("name")}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Ej. Consulta Inicial"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Descripción
                </label>
                <textarea
                  {...register("description")}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  placeholder="Detalles opcionales..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Duración (min)
                  </label>
                  <input
                    type="number"
                    {...register("duration")}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  {errors.duration && (
                    <p className="text-sm text-red-500">
                      {errors.duration.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Precio ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("price")}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500">
                      {errors.price.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50",
                    editingService
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "bg-emerald-600 hover:bg-emerald-700",
                  )}
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingService ? "Actualizar Servicio" : "Crear Servicio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
// Add Utility for classnames if not imported
import { cn } from "@/lib/utils";
