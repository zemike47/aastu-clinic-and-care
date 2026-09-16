import { useState } from "react";
import type { FormEvent } from "react";

import {
  completeNurseAssessment,
  type NurseAppointment,
} from "../services/nurse.service";

interface NurseAssessmentFormProps {
  appointment: NurseAppointment;
  onCompleted: () => void;
  onCancel: () => void;
}

function NurseAssessmentForm({
  appointment,
  onCompleted,
  onCancel,
}: NurseAssessmentFormProps) {
  const [nurseNotes, setNurseNotes] = useState(appointment.nurseNotes ?? "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!nurseNotes.trim()) {
      setError("Assessment notes are required");
      return;
    }

    try {
      setError("");
      setSubmitting(true);

      await completeNurseAssessment(appointment.id, nurseNotes.trim());

      onCompleted();
    } catch (error) {
      console.error("Failed to complete nurse assessment:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to complete nurse assessment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-5">
      <h4 className="font-semibold text-slate-900">Nurse assessment</h4>

      <p className="mt-1 text-sm text-slate-500">
        Record the patient's assessment before sending them to the doctor.
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Assessment notes
        </label>

        <textarea
          value={nurseNotes}
          onChange={(event) => setNurseNotes(event.target.value)}
          rows={5}
          placeholder="Record the patient's symptoms, observations, and assessment..."
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-500"
          required
        />

        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Complete assessment"}
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

export default NurseAssessmentForm;
