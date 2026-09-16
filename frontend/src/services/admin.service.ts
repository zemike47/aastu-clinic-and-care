import { apiRequest } from "./api";

export type StaffRole = "NURSE" | "DOCTOR" | "PHARMACIST";

export interface CreateStaffData {
  name: string;
  email: string;
  password: string;
  role: StaffRole;
}

export interface StaffUser {
  id: number;
  name: string;
  email: string;
  role: StaffRole;
}

interface CreateStaffResponse {
  message: string;
  user: StaffUser;
}

export const createStaff = async (
  data: CreateStaffData
): Promise<StaffUser> => {
  const response = await apiRequest<CreateStaffResponse>("/admin/staff", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response.user;
};
