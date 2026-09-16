import { useEffect, useState } from "react";

import { getCurrentUser } from "../services/auth.service";
import {
  getPendingPrescriptions,
  type PharmacyPrescription,
} from "../services/pharmacy.service";
import LogoutButton from "../components/LogoutButton";
import DispensePrescriptionButton from "../components/DispensePrescriptionButton";

function PharmacistDashboard() {
  const user = getCurrentUser();

  const [prescriptions, setPrescriptions] = useState<PharmacyPrescription[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPrescriptions = async () => {
    try {
      setError("");
      setLoading(true);

      const data = await getPendingPrescriptions();

      console.log("Pharmacy prescriptions:", data);

      setPrescriptions(data);
    } catch (error) {
      console.error("Failed to load prescriptions:", error);

      setError(
        error instanceof Error ? error.message : "Failed to load prescriptions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const handleDispensed = async () => {
    await loadPrescriptions();
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              AASTU Clinic & Care
            </h1>

            <p className="text-sm text-slate-500">Pharmacist Dashboard</p>
          </div>

          <LogoutButton />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <section>
          <h2 className="text-2xl font-bold text-slate-900">
            Welcome, {user?.name}
          </h2>

          <p className="mt-1 text-slate-500">
            Review and dispense patient prescriptions.
          </p>
        </section>

        <section className="mt-8">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Prescription queue
            </h2>

            <p className="text-sm text-slate-500">
              Prescriptions available for dispensing
            </p>
          </div>

          {loading && (
            <p className="mt-6 text-sm text-slate-500">
              Loading prescriptions...
            </p>
          )}

          {error && (
            <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && prescriptions.length === 0 && (
            <div className="mt-6 rounded-lg bg-white p-6 text-center shadow-sm">
              <p className="text-slate-500">
                No prescriptions are currently waiting for dispensing.
              </p>
            </div>
          )}

          {!loading && !error && prescriptions.length > 0 && (
            <div className="mt-6 space-y-4">
              {prescriptions.map((prescription) => (
                <article
                  key={prescription.id}
                  className="rounded-lg bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        Prescription #{prescription.id}
                      </p>

                      <h3 className="mt-1 text-lg font-semibold text-slate-900">
                        {prescription.appointment.patient.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {prescription.appointment.patient.email}
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      PRESCRIPTION
                    </span>
                  </div>

                  <div className="mt-5 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                    <p>
                      <span className="font-medium text-slate-900">
                        Appointment:
                      </span>{" "}
                      {new Date(
                        prescription.appointment.appointmentDate
                      ).toLocaleString()}
                    </p>

                    <p>
                      <span className="font-medium text-slate-900">
                        Doctor:
                      </span>{" "}
                      {prescription.doctor.name}
                    </p>

                    <p>
                      <span className="font-medium text-slate-900">
                        Reason:
                      </span>{" "}
                      {prescription.appointment.reason}
                    </p>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-slate-900">
                      Medicines
                    </h4>

                    <div className="mt-3 space-y-3">
                      {prescription.items.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-lg bg-slate-50 p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-slate-900">
                                {item.medicine.name}
                              </p>

                              <p className="mt-1 text-sm text-slate-600">
                                Quantity: {item.quantity}
                              </p>
                            </div>

                            <p className="text-sm text-slate-600">
                              Stock: {item.medicine.stockQuantity}
                            </p>
                          </div>

                          <div className="mt-3 space-y-1 text-sm text-slate-600">
                            <p>
                              <span className="font-medium text-slate-900">
                                Dosage:
                              </span>{" "}
                              {item.dosage}
                            </p>

                            <p>
                              <span className="font-medium text-slate-900">
                                Frequency:
                              </span>{" "}
                              {item.frequency}
                            </p>

                            <p>
                              <span className="font-medium text-slate-900">
                                Duration:
                              </span>{" "}
                              {item.duration}
                            </p>

                            {item.instructions && (
                              <p>
                                <span className="font-medium text-slate-900">
                                  Instructions:
                                </span>{" "}
                                {item.instructions}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <DispensePrescriptionButton
                    prescriptionId={prescription.id}
                    onDispensed={handleDispensed}
                  />
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default PharmacistDashboard;
