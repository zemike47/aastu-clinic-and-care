import { useEffect, useState } from "react";

import { getCurrentUser } from "../services/auth.service";
import {
  cancelAppointment,
  getMyAppointments,
  type Appointment,
} from "../services/appointment.service";
import LogoutButton from "../components/LogoutButton";
import BookAppointmentForm from "../components/BookAppointmentForm";
import EditAppointmentForm from "../components/EditAppointmentForm";
import FollowUpAppointmentForm from "../components/FollowUpAppointmentForm";

function PatientDashboard() {
  const user = getCurrentUser();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);

  const [editingAppointmentId, setEditingAppointmentId] = useState<
    number | null
  >(null);

  const [cancellingAppointmentId, setCancellingAppointmentId] = useState<
    number | null
  >(null);

  const [followUpAppointmentId, setFollowUpAppointmentId] = useState<
    number | null
  >(null);

  const loadAppointments = async () => {
    try {
      setError("");

      const data = await getMyAppointments();

      console.log("My appointments:", data);

      setAppointments(data);
    } catch (error) {
      console.error("Failed to load appointments:", error);

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

  const handleAppointmentCreated = async () => {
    setShowBookingForm(false);
    await loadAppointments();
  };

  const handleAppointmentUpdated = async () => {
    setEditingAppointmentId(null);
    await loadAppointments();
  };

  const handleFollowUpCreated = async () => {
    setFollowUpAppointmentId(null);
    await loadAppointments();
  };

  const handleCancelAppointment = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingAppointmentId(id);
      setError("");

      await cancelAppointment(id);

      await loadAppointments();
    } catch (error) {
      console.error("Failed to cancel appointment:", error);

      setError(
        error instanceof Error ? error.message : "Failed to cancel appointment"
      );
    } finally {
      setCancellingAppointmentId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              AASTU Clinic & Care
            </h1>

            <p className="text-sm text-slate-500">Patient Portal</p>
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
            Manage your appointments and view your medical information.
          </p>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Appointments
              </h2>

              <p className="text-sm text-slate-500">Your clinic visits</p>
            </div>

            {!showBookingForm && (
              <button
                type="button"
                onClick={() => setShowBookingForm(true)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Book appointment
              </button>
            )}
          </div>

          {showBookingForm && (
            <BookAppointmentForm
              onCreated={handleAppointmentCreated}
              onCancel={() => setShowBookingForm(false)}
            />
          )}

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
                You don't have any appointments yet.
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

                      <h3 className="mt-1 font-semibold text-slate-900">
                        {appointment.reason}
                      </h3>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {appointment.status.replace("_", " ")}
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-slate-600">
                    {new Date(appointment.appointmentDate).toLocaleString()}
                  </p>

                  {appointment.status === "WITH_NURSE" && (
                    <>
                      {editingAppointmentId === appointment.id ? (
                        <EditAppointmentForm
                          appointment={appointment}
                          onUpdated={handleAppointmentUpdated}
                          onCancel={() => setEditingAppointmentId(null)}
                        />
                      ) : (
                        <div className="mt-5 flex gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingAppointmentId(appointment.id)
                            }
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleCancelAppointment(appointment.id)
                            }
                            disabled={
                              cancellingAppointmentId === appointment.id
                            }
                            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            {cancellingAppointmentId === appointment.id
                              ? "Cancelling..."
                              : "Cancel appointment"}
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {appointment.nurseNotes && (
                    <div className="mt-5">
                      <h4 className="text-sm font-semibold text-slate-900">
                        Nurse assessment
                      </h4>

                      <p className="mt-2 text-sm text-slate-600">
                        {appointment.nurseNotes}
                      </p>
                    </div>
                  )}

                  {appointment.doctorNotes && (
                    <div className="mt-5">
                      <h4 className="text-sm font-semibold text-slate-900">
                        Doctor consultation
                      </h4>

                      <p className="mt-2 text-sm text-slate-600">
                        {appointment.doctorNotes}
                      </p>
                    </div>
                  )}

                  {appointment.prescription && (
                    <div className="mt-5">
                      <h4 className="text-sm font-semibold text-slate-900">
                        Prescription
                      </h4>

                      <div className="mt-3 space-y-3">
                        {appointment.prescription.items.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-lg bg-slate-50 p-4"
                          >
                            <p className="font-medium text-slate-900">
                              {item.medicine.name}
                            </p>

                            <div className="mt-2 space-y-1 text-sm text-slate-600">
                              <p>
                                <span className="font-medium">Dosage:</span>{" "}
                                {item.dosage}
                              </p>

                              <p>
                                <span className="font-medium">Frequency:</span>{" "}
                                {item.frequency}
                              </p>

                              <p>
                                <span className="font-medium">Duration:</span>{" "}
                                {item.duration}
                              </p>

                              <p>
                                <span className="font-medium">Quantity:</span>{" "}
                                {item.quantity}
                              </p>

                              {item.instructions && (
                                <p>
                                  <span className="font-medium">
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
                  )}

                  {appointment.status === "COMPLETED" && (
                    <>
                      {followUpAppointmentId === appointment.id ? (
                        <FollowUpAppointmentForm
                          appointment={appointment}
                          onCreated={handleFollowUpCreated}
                          onCancel={() => setFollowUpAppointmentId(null)}
                        />
                      ) : (
                        <div className="mt-5">
                          <button
                            type="button"
                            onClick={() =>
                              setFollowUpAppointmentId(appointment.id)
                            }
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                          >
                            Book follow-up
                          </button>
                        </div>
                      )}
                    </>
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

export default PatientDashboard;
