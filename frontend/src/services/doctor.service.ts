import { apiRequest } from "./api";

export interface DoctorAppointment {
  id: number;
  patientId: number;
  appointmentDate: string;
  status: "WITH_DOCTOR" | "COMPLETED";
  reason: string;
  nurseNotes: string | null;
  doctorNotes: string | null;
  createdAt: string;
  updatedAt: string;
  patient: {
    id: number;
    name: string;
    email: string;
  };
}

interface DoctorAppointmentsResponse {
  appointments: DoctorAppointment[];
}

export const getDoctorAppointments = async (): Promise<DoctorAppointment[]> => {
  const response = await apiRequest<DoctorAppointmentsResponse>(
    "/appointments/doctor"
  );

  return response.appointments;
};

export const completeDoctorConsultation = async (
  id: number,
  doctorNotes: string
): Promise<DoctorAppointment> => {
  const response = await apiRequest<{
    message: string;
    appointment: DoctorAppointment;
  }>(`/appointments/${id}/doctor-complete`, {
    method: "PATCH",
    body: JSON.stringify({
      doctorNotes,
    }),
  });

  return response.appointment;
};
