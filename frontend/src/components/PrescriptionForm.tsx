import { useState } from "react";
import type { FormEvent } from "react";

import {
  createPrescription,
  type PrescriptionItemInput,
} from "../services/prescription.service";

interface PrescriptionFormProps {
  appointmentId: number;
  onCreated: () => void;
  onCancel: () => void;
}

function PrescriptionForm({
  appointmentId,
  onCreated,
  onCancel,
}: PrescriptionFormProps) {
  const [medicineId, setMedicineId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const parsedMedicineId = Number(medicineId);
    const parsedQuantity = Number(quantity);

    if (!parsedMedicineId || !parsedQuantity) {
      setError("Medicine ID and quantity are required");
      return;
    }

    if (parsedQuantity <= 0) {
      setError("Quantity must be greater than zero");
      return;
    }

    const item: PrescriptionItemInput = {
      medicineId: parsedMedicineId,
      quantity: parsedQuantity,
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      duration: duration.trim(),
      instructions: instructions.trim() || undefined,
    };

    try {
      setError("");
      setSubmitting(true);

      await createPrescription(appointmentId, [item]);

      onCreated();
    } catch (error) {
      console.error("Failed to create prescription:", error);

      setError(
        error instanceof Error ? error.message : "Failed to create prescription"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-5">
      <h4 className="font-semibold text-slate-900">Create prescription</h4>

      <p className="mt-1 text-sm text-slate-500">
        Enter the medicine and prescription instructions.
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Medicine ID
          </label>

          <input
            type="number"
            min="1"
            value={medicineId}
            onChange={(event) => setMedicineId(event.target.value)}
            placeholder="Example: 1"
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Quantity
          </label>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            placeholder="Example: 10"
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Dosage
          </label>

          <input
            type="text"
            value={dosage}
            onChange={(event) => setDosage(event.target.value)}
            placeholder="Example: 500mg"
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Frequency
          </label>

          <input
            type="text"
            value={frequency}
            onChange={(event) => setFrequency(event.target.value)}
            placeholder="Example: 3 times daily"
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Duration
          </label>

          <input
            type="text"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            placeholder="Example: 5 days"
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Instructions
          </label>

          <textarea
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            rows={3}
            placeholder="Example: Take after meals"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create prescription"}
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

export default PrescriptionForm;
