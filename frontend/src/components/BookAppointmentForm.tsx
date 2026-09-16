import { useState } from "react";
import type { FormEvent } from "react";

import { createAppointment } from "../services/appointment.service";

interface BookAppointmentFormProps {
  onCreated: () => void;
  onCancel: () => void;
}

function BookAppointmentForm({
  onCreated,
  onCancel,
}: BookAppointmentFormProps) {
  const [appointmentDate, setAppointmentDate] = useState("");
  const [reason, setReason] = useState("");
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
        error instanceof Error ? error.message : "Failed to book appointment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Book an appointment
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Choose a date and tell us why you need a visit.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Appointment date and time
          </label>

          <input
            type="datetime-local"
            value={appointmentDate}
            onChange={(event) => setAppointmentDate(event.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            required
          />
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Reason for visit
          </label>

          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            placeholder="Describe the reason for your visit"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Booking..." : "Confirm appointment"}
        </button>
      </form>
    </div>
  );
}

export default BookAppointmentForm;
