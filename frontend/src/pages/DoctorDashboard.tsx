import { useEffect, useState } from "react";

import { getCurrentUser } from "../services/auth.service";
import {
  getDoctorAppointments,
  type DoctorAppointment,
} from "../services/doctor.service";
import LogoutButton from "../components/LogoutButton";
import DoctorConsultationForm from "../components/DoctorConsultationForm";

function DoctorDashboard() {
  const user = getCurrentUser();

  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [consultingAppointmentId, setConsultingAppointmentId] = useState<
    number | null
  >(null);

  const loadAppointments = async () => {
    try {
      setError("");
      setLoading(true);

      const data = await getDoctorAppointments();

      console.log("Doctor appointments:", data);

      setAppointments(data);
    } catch (error) {
      console.error("Failed to load doctor appointments:", error);

      setError(
        error instanceof Error ? error.message : "Failed to load appointments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleConsultationCompleted = async () => {
    setConsultingAppointmentId(null);

    await loadAppointments();
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              AASTU Clinic & Care
            </h1>

            <p className="text-sm text-slate-500">Doctor Dashboard</p>
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
            Review patients waiting for consultation.
          </p>
        </section>

        <section className="mt-8">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Waiting for consultation
            </h2>

            <p className="text-sm text-slate-500">
              Appointments that have completed nurse assessment
            </p>
          </div>

          {loading && (
            <p className="mt-6 text-sm text-slate-500">
              Loading appointments...
            </p>
          )}

          {error && (
            <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && appointments.length === 0 && (
            <div className="mt-6 rounded-lg bg-white p-6 text-center shadow-sm">
              <p className="text-slate-500">
                No patients are currently waiting for consultation.
              </p>
            </div>
          )}

          {!loading && !error && appointments.length > 0 && (
            <div className="mt-6 space-y-4">
              {appointments.map((appointment) => (
                <article
                  key={appointment.id}
                  className="rounded-lg bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        Appointment #{appointment.id}
                      </p>

                      <h3 className="mt-1 text-lg font-semibold text-slate-900">
                        {appointment.patient.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {appointment.patient.email}
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      WITH DOCTOR
                    </span>
                  </div>

                  <div className="mt-5 space-y-2 text-sm text-slate-600">
                    <p>
                      <span className="font-medium text-slate-900">
                        Appointment:
                      </span>{" "}
                      {new Date(appointment.appointmentDate).toLocaleString()}
                    </p>

                    <p>
                      <span className="font-medium text-slate-900">
                        Reason:
                      </span>{" "}
                      {appointment.reason}
                    </p>
                  </div>

                  {appointment.nurseNotes && (
                    <div className="mt-5 rounded-lg bg-slate-50 p-4">
                      <h4 className="text-sm font-semibold text-slate-900">
                        Nurse assessment
                      </h4>

                      <p className="mt-2 text-sm text-slate-600">
                        {appointment.nurseNotes}
                      </p>
                    </div>
                  )}

                  {consultingAppointmentId === appointment.id ? (
                    <DoctorConsultationForm
                      appointment={appointment}
                      onCompleted={handleConsultationCompleted}
                      onCancel={() => setConsultingAppointmentId(null)}
                    />
                  ) : (
                    <div className="mt-5">
                      <button
                        type="button"
                        onClick={() =>
                          setConsultingAppointmentId(appointment.id)
                        }
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                      >
                        Start consultation
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default DoctorDashboard;
