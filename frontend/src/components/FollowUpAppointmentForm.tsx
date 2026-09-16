import { useState } from "react";
import type { FormEvent } from "react";

import {
  createAppointment,
  type Appointment,
} from "../services/appointment.service";

interface FollowUpAppointmentFormProps {
  appointment: Appointment;
  onCreated: () => void;
  onCancel: () => void;
}

function FollowUpAppointmentForm({
  appointment,
  onCreated,
  onCancel,
}: FollowUpAppointmentFormProps) {
  const [appointmentDate, setAppointmentDate] = useState("");
  const [reason, setReason] = useState(
    `Follow-up for appointment #${appointment.id}`
  );
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await createAppointment({
        appointmentDate: new Date(appointmentDate).toISOString(),
        reason,
      });

      onCreated();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to book follow-up appointment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-5">
      <h4 className="font-semibold text-slate-900">
        Book follow-up appointment
      </h4>

      <p className="mt-1 text-sm text-slate-500">
        Schedule another visit with the clinic.
      </p>

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
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Booking..." : "Book follow-up"}
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

export default FollowUpAppointmentForm;
