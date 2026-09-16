import { apiRequest } from "./api";

export interface PrescriptionItemInput {
  medicineId: number;
  quantity: number;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  id: number;
  appointmentId: number;
  doctorId: number;
  createdAt: string;
  updatedAt: string;
  items: {
    id: number;
    prescriptionId: number;
    medicineId: number;
    quantity: number;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string | null;
  }[];
}

export const createPrescription = async (
  appointmentId: number,
  items: PrescriptionItemInput[]
): Promise<Prescription> => {
  const response = await apiRequest<{
    message: string;
    prescription: Prescription;
  }>(`/appointments/${appointmentId}/prescription`, {
    method: "POST",
    body: JSON.stringify({ items }),
  });

  return response.prescription;
};
