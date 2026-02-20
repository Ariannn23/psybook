import { useState, useEffect } from "react";
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

const noteSchema = z.object({
  content: z.string().min(1, "Note cannot be empty"),
  attachments: z.any().optional(),
});

type NoteFormData = z.infer<typeof noteSchema>;

interface MedicalRecordTimelineProps {
  patientId: string;
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
      console.error("Failed to fetch medical records", err);
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
      // Prepend new record
      setRecords([newRecord, ...records]);
      reset();
      setSelectedFiles([]);
    } catch (err: any) {
      console.error("Failed to create record", err);
      setError(err.response?.data?.message || "Failed to save note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    try {
      await deleteMedicalRecord(id);
      setRecords(records.filter((r) => r.id !== id));
    } catch (err: any) {
      console.error("Failed to delete record", err);
      alert(err.response?.data?.message || "Failed to delete note.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-600" />
          Add Clinical Note
        </h3>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <textarea
            {...register("content")}
            className={cn(
              "w-full px-4 py-3 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all min-h-[100px] resize-none",
              errors.content ? "border-red-500" : "border-slate-300",
            )}
            placeholder="Write your observation, diagnosis, or session summary..."
          />
          {errors.content && (
            <p className="text-sm text-red-500">{errors.content.message}</p>
          )}

          {/* File Selection Display */}
          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-xs"
                >
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedFiles(
                        selectedFiles.filter((_, i) => i !== index),
                      )
                    }
                    className="text-slate-500 hover:text-red-500"
                    title="Remove file"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center">
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
                className="cursor-pointer flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors text-sm"
              >
                <Paperclip className="w-4 h-4" />
                Attach files
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <SaveIcon className="w-4 h-4" />
                  Save Note
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-500" />
          History
        </h3>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center p-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            No clinical records found.
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pl-6 pb-4">
            {records.map((record) => (
              <div key={record.id} className="relative group">
                <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 border-emerald-500 bg-white" />

                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <UserIcon className="w-3 h-3" />
                        <span className="font-medium text-slate-700">
                          {record.user?.name || "Unknown"}
                        </span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(record.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {user?.id === record.userId && (
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        title="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="prose max-w-none text-slate-700 whitespace-pre-wrap">
                    {record.content}
                  </div>

                  {/* Attachments Display */}
                  {record.attachments && record.attachments.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
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
                              "block border border-slate-200 rounded-lg overflow-hidden hover:border-emerald-500 transition-colors",
                              isImage
                                ? "w-24 h-24"
                                : "p-3 flex items-center gap-2 bg-slate-50",
                            )}
                          >
                            {isImage ? (
                              <img
                                src={fileUrl}
                                alt="Attachment"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <>
                                <FileText className="w-4 h-4 text-slate-500" />
                                <span className="text-xs text-slate-700 truncate max-w-[100px]">
                                  {filename}
                                </span>
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

function SaveIcon(props: any) {
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
