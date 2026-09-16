import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../app.js";
import { getToken } from "./test-auth.js";

describe("Authentication and RBAC security", () => {
  const results: {
    description: string;
    status: number;
    rejected: boolean;
  }[] = [];

  const record = (
    description: string,
    status: number,
    expectedStatus: number | number[]
  ) => {
    const expected = Array.isArray(expectedStatus)
      ? expectedStatus
      : [expectedStatus];

    results.push({
      description,
      status,
      rejected: expected.includes(status),
    });
  };

  it("rejects requests without a JWT", async () => {
    const response = await request(app).post("/api/admin/staff").send({
      name: "Unauthorized User",
      email: "unauthorized@example.com",
      password: "password123",
      role: "NURSE",
    });

    record("No JWT → ADMIN", response.status, 401);

    expect(response.status).toBe(401);
  });

  it("rejects requests with an invalid JWT", async () => {
    const response = await request(app)
      .post("/api/admin/staff")
      .set("Authorization", "Bearer invalid-token")
      .send({
        name: "Unauthorized User",
        email: "invalid@example.com",
        password: "password123",
        role: "NURSE",
      });

    record("Invalid JWT → ADMIN", response.status, 401);

    expect(response.status).toBe(401);
  });

  it("rejects PATIENT access to staff endpoints", async () => {
    const token = await getToken("PATIENT");

    const endpoints = [
      "/api/appointments/nurse",
      "/api/appointments/doctor",
      "/api/appointments/pharmacy/prescriptions",
    ];

    for (const endpoint of endpoints) {
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`);

      record(`PATIENT → ${endpoint}`, response.status, 403);

      expect(response.status).toBe(403);
    }
  });

  it("rejects NURSE access to unauthorized endpoints", async () => {
    const token = await getToken("NURSE");

    const requests = [
      {
        description: "NURSE → DOCTOR",
        request: request(app)
          .get("/api/appointments/doctor")
          .set("Authorization", `Bearer ${token}`),
      },
      {
        description: "NURSE → PHARMACY",
        request: request(app)
          .get("/api/appointments/pharmacy/prescriptions")
          .set("Authorization", `Bearer ${token}`),
      },
      {
        description: "NURSE → ADMIN",
        request: request(app)
          .post("/api/admin/staff")
          .set("Authorization", `Bearer ${token}`)
          .send({
            name: "Unauthorized Staff",
            email: "security-nurse@example.com",
            password: "password123",
            role: "DOCTOR",
          }),
      },
    ];

    for (const item of requests) {
      const response = await item.request;

      record(item.description, response.status, 403);

      expect(response.status).toBe(403);
    }
  });

  it("rejects DOCTOR access to unauthorized endpoints", async () => {
    const token = await getToken("DOCTOR");

    const requests = [
      {
        description: "DOCTOR → NURSE",
        request: request(app)
          .get("/api/appointments/nurse")
          .set("Authorization", `Bearer ${token}`),
      },
      {
        description: "DOCTOR → PHARMACY",
        request: request(app)
          .get("/api/appointments/pharmacy/prescriptions")
          .set("Authorization", `Bearer ${token}`),
      },
      {
        description: "DOCTOR → ADMIN",
        request: request(app)
          .post("/api/admin/staff")
          .set("Authorization", `Bearer ${token}`)
          .send({
            name: "Unauthorized Staff",
            email: "security-doctor@example.com",
            password: "password123",
            role: "NURSE",
          }),
      },
    ];

    for (const item of requests) {
      const response = await item.request;

      record(item.description, response.status, 403);

      expect(response.status).toBe(403);
    }
  });

  it("rejects PHARMACIST access to unauthorized endpoints", async () => {
    const token = await getToken("PHARMACIST");

    const requests = [
      {
        description: "PHARMACIST → NURSE",
        request: request(app)
          .get("/api/appointments/nurse")
          .set("Authorization", `Bearer ${token}`),
      },
      {
        description: "PHARMACIST → DOCTOR",
        request: request(app)
          .get("/api/appointments/doctor")
          .set("Authorization", `Bearer ${token}`),
      },
      {
        description: "PHARMACIST → ADMIN",
        request: request(app)
          .post("/api/admin/staff")
          .set("Authorization", `Bearer ${token}`)
          .send({
            name: "Unauthorized Staff",
            email: "security-pharmacist@example.com",
            password: "password123",
            role: "NURSE",
          }),
      },
    ];

    for (const item of requests) {
      const response = await item.request;

      record(item.description, response.status, 403);

      expect(response.status).toBe(403);
    }
  });

  it("achieves 100% rejection of unauthorized requests", () => {
    const total = results.length;
    const rejected = results.filter((result) => result.rejected).length;
    const percentage = (rejected / total) * 100;

    console.log("\nSecurity Test Results");
    console.log("---------------------");
    console.log(`Unauthorized requests: ${total}`);
    console.log(`Rejected requests:     ${rejected}`);
    console.log(`Rejection rate:        ${percentage.toFixed(2)}%`);

    for (const result of results) {
      console.log(
        `${result.rejected ? "✓" : "✗"} ${result.description} → ${
          result.status
        }`
      );
    }

    expect(total).toBeGreaterThan(0);
    expect(rejected).toBe(total);
    expect(percentage).toBe(100);
  });
});
