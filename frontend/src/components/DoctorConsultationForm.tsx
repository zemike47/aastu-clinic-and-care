import { useState } from "react";
import type { FormEvent } from "react";

import {
  completeDoctorConsultation,
  type DoctorAppointment,
} from "../services/doctor.service";

interface DoctorConsultationFormProps {
  appointment: DoctorAppointment;
  onCompleted: () => void;
  onCancel: () => void;
}

function DoctorConsultationForm({
  appointment,
  onCompleted,
  onCancel,
}: DoctorConsultationFormProps) {
  const [doctorNotes, setDoctorNotes] = useState(appointment.doctorNotes ?? "");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!doctorNotes.trim()) {
      setError("Doctor notes are required");
      return;
    }

    try {
      setError("");
      setSubmitting(true);

      await completeDoctorConsultation(appointment.id, doctorNotes.trim());

      onCompleted();
    } catch (error) {
      console.error("Failed to complete doctor consultation:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to complete consultation"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-5">
      <h4 className="font-semibold text-slate-900">Doctor consultation</h4>

      <p className="mt-1 text-sm text-slate-500">
        Record the clinical findings and consultation notes.
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Doctor notes
        </label>

        <textarea
          value={doctorNotes}
          onChange={(event) => setDoctorNotes(event.target.value)}
          rows={5}
          placeholder="Record diagnosis, clinical findings, recommendations, and follow-up notes..."
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-500"
          required
        />

        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Completing..." : "Complete consultation"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default DoctorConsultationForm;
