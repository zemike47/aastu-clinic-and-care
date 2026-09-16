import { useState } from "react";
import type { FormEvent } from "react";

import {
  updateAppointment,
  type Appointment,
} from "../services/appointment.service";

interface EditAppointmentFormProps {
  appointment: Appointment;
  onUpdated: () => void;
  onCancel: () => void;
}

function EditAppointmentForm({
  appointment,
  onUpdated,
  onCancel,
}: EditAppointmentFormProps) {
  const [appointmentDate, setAppointmentDate] = useState(
    new Date(appointment.appointmentDate).toISOString().slice(0, 16)
  );

  const [reason, setReason] = useState(appointment.reason);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await updateAppointment(appointment.id, {
        appointmentDate: new Date(appointmentDate).toISOString(),
        reason,
      });

      onUpdated();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update appointment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
      <h4 className="font-semibold text-slate-900">Edit appointment</h4>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Date and time
        </label>

        <input
          type="datetime-local"
          value={appointmentDate}
          onChange={(event) => setAppointmentDate(event.target.value)}
          min={new Date().toISOString().slice(0, 16)}
          required
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-500"
        />

        <label className="mb-2 mt-4 block text-sm font-medium text-slate-700">
          Reason
        </label>

        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          rows={3}
          required
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-500"
        />

        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save changes"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditAppointmentForm;
