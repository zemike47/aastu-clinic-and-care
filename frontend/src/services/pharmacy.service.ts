import { apiRequest } from "./api";

export interface PharmacyPrescription {
  id: number;
  appointmentId: number;
  doctorId: number;
  createdAt: string;
  updatedAt: string;

  appointment: {
    id: number;
    appointmentDate: string;
    status: string;
    reason: string;

    patient: {
      id: number;
      name: string;
      email: string;
    };
  };

  doctor: {
    id: number;
    name: string;
    email: string;
  };

  items: {
    id: number;
    prescriptionId: number;
    medicineId: number;
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
}

interface PharmacyPrescriptionsResponse {
  prescriptions: PharmacyPrescription[];
}

export const getPendingPrescriptions = async (): Promise<
  PharmacyPrescription[]
> => {
  const response = await apiRequest<PharmacyPrescriptionsResponse>(
    "/appointments/pharmacy/prescriptions"
  );

  return response.prescriptions;
};

export const dispensePrescription = async (id: number): Promise<void> => {
  await apiRequest<{
    message: string;
  }>(`/appointments/pharmacy/prescriptions/${id}/dispense`, {
    method: "PATCH",
  });
};
