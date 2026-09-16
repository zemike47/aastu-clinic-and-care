import { useState } from "react";

import { dispensePrescription } from "../services/pharmacy.service";

interface DispensePrescriptionButtonProps {
  prescriptionId: number;
  onDispensed: () => void;
}

function DispensePrescriptionButton({
  prescriptionId,
  onDispensed,
}: DispensePrescriptionButtonProps) {
  const [dispensing, setDispensing] = useState(false);
  const [error, setError] = useState("");

  const handleDispense = async () => {
    try {
      setError("");
      setDispensing(true);

      await dispensePrescription(prescriptionId);

      onDispensed();
    } catch (error) {
      console.error("Failed to dispense prescription:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to dispense prescription"
      );
    } finally {
      setDispensing(false);
    }
  };

  return (
    <div className="mt-5">
      {error && (
        <div className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleDispense}
        disabled={dispensing}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {dispensing ? "Dispensing..." : "Dispense prescription"}
      </button>
    </div>
  );
}

export default DispensePrescriptionButton;
