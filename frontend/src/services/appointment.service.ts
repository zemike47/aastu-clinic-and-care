import { apiRequest } from "./api";

export interface Appointment {
  id: number;
  patientId: number;
  appointmentDate: string;
  status: "WITH_NURSE" | "WITH_DOCTOR" | "COMPLETED" | "CANCELLED";
  reason: string;
  nurseNotes: string | null;
  doctorNotes: string | null;
  createdAt: string;
  updatedAt: string;
  prescription: {
    id: number;
    createdAt: string;
    items: {
      id: number;
      quantity: number;
      dosage: string;
      frequency: string;
      duration: string;
      instructions: string | null;
      medicine: {
        id: number;
        name: string;
        stockQuantity: number;
        price: string;
      };
    }[];
  } | null;
}

interface AppointmentsResponse {
  appointments: Appointment[];
}

interface CreateAppointmentData {
  appointmentDate: string;
  reason: string;
}

interface UpdateAppointmentData {
  appointmentDate: string;
  reason: string;
}

export const getMyAppointments = async (): Promise<Appointment[]> => {
  const response = await apiRequest<AppointmentsResponse>("/appointments/my");

  return response.appointments;
};

export const createAppointment = async (
  data: CreateAppointmentData
): Promise<Appointment> => {
  const response = await apiRequest<{
    message: string;
    appointment: Appointment;
  }>("/appointments", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response.appointment;
};

export const updateAppointment = async (
  id: number,
  data: UpdateAppointmentData
): Promise<Appointment> => {
  const response = await apiRequest<{
    message: string;
    appointment: Appointment;
  }>(`/appointments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  return response.appointment;
};

export const cancelAppointment = async (id: number): Promise<Appointment> => {
  const response = await apiRequest<{
    message: string;
    appointment: Appointment;
  }>(`/appointments/${id}/cancel`, {
    method: "PATCH",
  });

  return response.appointment;
};
