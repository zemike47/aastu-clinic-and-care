import { apiRequest } from "./api";

export interface NurseAppointment {
  id: number;
  patientId: number;
  appointmentDate: string;
  status: "WITH_NURSE";
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

interface NurseAppointmentsResponse {
  appointments: NurseAppointment[];
}

export const getNurseAppointments = async (): Promise<NurseAppointment[]> => {
  const response = await apiRequest<NurseAppointmentsResponse>(
    "/appointments/nurse"
  );

  return response.appointments;
};

export const completeNurseAssessment = async (
  id: number,
  nurseNotes: string
): Promise<NurseAppointment> => {
  const response = await apiRequest<{
    message: string;
    appointment: NurseAppointment;
  }>(`/appointments/${id}/nurse-complete`, {
    method: "PATCH",
    body: JSON.stringify({
      nurseNotes,
    }),
  });

  return response.appointment;
};
