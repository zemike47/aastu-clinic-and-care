export type Role = "PATIENT" | "NURSE" | "DOCTOR" | "PHARMACIST" | "ADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
