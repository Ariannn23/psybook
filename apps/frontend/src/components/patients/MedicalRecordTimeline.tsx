import { useState, useEffect } from "react";
import type { SVGProps } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  Plus,
  FileText,
  User as UserIcon,
  Clock,
  Trash2,
  AlertCircle,
  Paperclip,
  X,
  ImageIcon,
} from "lucide-react";
import {
  getMedicalRecordsByPatient,
  createMedicalRecord,
  deleteMedicalRecord,
} from "@/api/medical-records";
import type { MedicalRecord } from "@/types/medical-records";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import PageLoader from "@/components/ui/PageLoader";
import { logger } from "@/utils/logger";
import axios from "axios";

const noteSchema = z.object({
  content: z.string().min(1, "Note cannot be empty"),
});

type NoteFormData = z.infer<typeof noteSchema>;

interface MedicalRecordTimelineProps {
  patientId: string;
}

function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function MedicalRecordTimeline({
  patientId,
}: MedicalRecordTimelineProps) {
  const { user } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
  });

  useEffect(() => {
    fetchRecords();
  }, [patientId]);

  const fetchRecords = async () => {
    try {
      const data = await getMedicalRecordsByPatient(patientId);
      setRecords(data);
    } catch (err) {
      logger.error("Failed to fetch medical records", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: NoteFormData) => {
    setIsSubmitting(true);
    setError("");
    try {
      const newRecord = await createMedicalRecord({
        patientId,
        content: data.content,
        attachments: selectedFiles,
      });
      setRecords([newRecord, ...records]);
      reset();
      setSelectedFiles([]);
    } catch (err: unknown) {
      logger.error("Failed to create record", err);
      const msg = (() => {
        if (!axios.isAxiosError(err)) return undefined;
        const data = err.response?.data;
        if (!data || typeof data !== "object") return undefined;
        if (!("message" in data)) return undefined;
        const maybeMessage = (data as { message?: unknown }).message;
        return typeof maybeMessage === "string" ? maybeMessage : undefined;
      })();
      setError(msg ?? "Failed to save note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    try {
      await deleteMedicalRecord(id);
      setRecords(records.filter((r) => r.id !== id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete note.";
      alert(message);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="bg-white rounded-4xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
        <div className="p-8">
          <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <Plus className="w-5 h-5 text-emerald-600" />
            </div>
            Añadir Evolución Clínica
          </h3>

          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-2xl text-sm flex items-center gap-3 border border-red-100 animate-shake">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative group">
              <textarea
                {...register("content")}
                className={cn(
                  "w-full px-6 py-5 rounded-3xl border bg-slate-50 outline-none transition-all duration-300 min-h-[160px] resize-none font-medium text-slate-700",
                  "focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500",
                  errors.content
                    ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                    : "border-slate-100",
                )}
                placeholder="Describe los avances, observaciones o el resumen de la sesión de hoy..."
              />
              <div className="absolute bottom-4 right-4 text-[10px] font-black uppercase text-slate-300 tracking-widest pointer-events-none group-focus-within:opacity-0 transition-opacity">
                Shift + Enter para nueva línea
              </div>
            </div>

            {errors.content && (
              <p className="text-xs text-red-500 ml-2 font-bold">
                {errors.content.message}
              </p>
            )}

            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-xs font-bold text-slate-600 shadow-sm border border-slate-100 animate-slide-in"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedFiles(
                          selectedFiles.filter((_, i) => i !== index),
                        )
                      }
                      className="ml-1 text-slate-300 hover:text-red-500 transition-colors"
                      title="Eliminar archivo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-50 gap-4">
              <div className="relative">
                <input
                  type="file"
                  multiple
                  id="file-upload"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      setSelectedFiles((prev) => [
                        ...prev,
                        ...Array.from(e.target.files!),
                      ]);
                    }
                  }}
                />
                <label
                  htmlFor="file-upload"
                  className="group cursor-pointer flex items-center gap-2.5 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-sm transition-all text-xs font-bold uppercase tracking-widest"
                >
                  <Paperclip className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                  Adjuntar Archivos
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative overflow-hidden bg-slate-900 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-100 active:scale-95 disabled:opacity-50 font-bold uppercase tracking-widest text-xs"
              >
                <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <SaveIcon className="w-4 h-4" />
                      Guardar Nota
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-4 px-2">
          <div className="p-3 bg-white shadow-sm border border-slate-100 rounded-2xl">
            <FileText className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Histórico de Evolución
          </h3>
        </div>

        {isLoading ? (
          <PageLoader
            fullPage={false}
            message="Recuperando historial clínico..."
          />
        ) : records.length === 0 ? (
          <div className="text-center py-24 bg-slate-50/50 rounded-4xl border border-dashed border-slate-200">
            <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm w-20 h-20 flex items-center justify-center mx-auto mb-6 transform -rotate-12">
              <AlertCircle className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-sm">
              No hay registros clínicos disponibles
            </p>
          </div>
        ) : (
          <div className="relative ml-10 space-y-12">
            <div className="absolute left-0 top-4 bottom-4 w-1 bg-linear-to-b from-emerald-500 via-slate-100 to-transparent rounded-full" />

            {records.map((record, index) => (
              <div
                key={record.id}
                className="relative group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute left-[-10px] top-6 h-6 w-6 rounded-full border-4 border-white bg-emerald-500 shadow-lg shadow-emerald-200 group-hover:scale-125 transition-transform duration-300 z-10" />

                <div className="ml-10 bg-white rounded-4xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-emerald-100/40 hover:border-emerald-100 transition-all duration-500">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 font-bold text-slate-600">
                        <UserIcon className="w-3.5 h-3.5 text-emerald-500" />
                        {record.user?.name || "Especialista"}
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 font-bold text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        {capitalize(
                          new Date(record.createdAt).toLocaleString("es-ES", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }),
                        )}
                      </div>
                    </div>
                    {user?.id === record.userId && (
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        title="Eliminar evolución"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="prose max-w-none text-slate-700 font-medium leading-relaxed whitespace-pre-wrap text-lg">
                    {record.content}
                  </div>

                  {record.attachments && record.attachments.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-slate-50 flex flex-wrap gap-4">
                      {record.attachments.map((filename, idx) => {
                        const fileUrl = `${import.meta.env.VITE_API_URL?.replace("/api", "")}/uploads/${filename}`;
                        const isImage = filename.match(
                          /\.(jpg|jpeg|png|gif)$/i,
                        );

                        return (
                          <a
                            key={idx}
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "group/file relative rounded-2xl overflow-hidden border-2 transition-all duration-300",
                              isImage
                                ? "w-32 h-32 border-slate-50 hover:border-emerald-500 hover:shadow-lg"
                                : "px-6 py-4 flex items-center gap-4 bg-slate-50 border-slate-100 hover:bg-white hover:border-emerald-500 hover:shadow-sm",
                            )}
                          >
                            {isImage ? (
                              <>
                                <img
                                  src={fileUrl}
                                  alt="Adjunto"
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover/file:scale-110"
                                />
                                <div className="absolute inset-0 bg-emerald-950/40 opacity-0 group-hover/file:opacity-100 transition-opacity flex items-center justify-center">
                                  <ImageIcon className="w-6 h-6 text-white" />
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="p-2 bg-white rounded-xl shadow-sm">
                                  <FileText className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
                                    Documento
                                  </span>
                                  <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">
                                    {filename}
                                  </span>
                                </div>
                              </>
                            )}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SaveIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}
