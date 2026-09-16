import request from "supertest";

import app from "../app.js";

type TestRole = "PATIENT" | "NURSE" | "DOCTOR" | "PHARMACIST" | "ADMIN";

const credentials: Record<TestRole, { email: string; password: string }> = {
  PATIENT: {
    email: "patient2@example.com",
    password: "password123",
  },
  NURSE: {
    email: "nurse2@example.com",
    password: "password123",
  },
  DOCTOR: {
    email: "fira.doctor@example.com",
    password: "password123",
  },
  PHARMACIST: {
    email: "pharmacist@example.com",
    password: "password123",
  },
  ADMIN: {
    email: "admin@aastu-clinic.local",
    password: "AdminPassword123",
  },
};

export const getToken = async (role: TestRole): Promise<string> => {
  const response = await request(app)
    .post("/api/auth/login")
    .send(credentials[role]);

  if (response.status !== 200) {
    throw new Error(
      `Could not login as ${role}. Received status ${response.status}`
    );
  }

  return response.body.token;
};
