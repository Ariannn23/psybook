import { useNavigate } from "react-router-dom";
import PatientForm from "@/components/patients/PatientForm";
import type { PatientFormData } from "@/components/patients/PatientForm";
import { createPatient } from "@/api/patients";
import { useState } from "react";
import axios from "axios";

export default function AddPatientPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: PatientFormData) => {
    setIsLoading(true);
    setError("");
    try {
      await createPatient(data);
      navigate("/dashboard/patients");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to create patient");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Add New Patient</h1>
        <p className="text-slate-500">Register a new patient to the system</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <PatientForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
