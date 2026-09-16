import "dotenv/config";

import bcrypt from "bcryptjs";

import prisma from "../lib/prisma.js";

const testUsers = [
  {
    name: "Test Patient",
    email: "patient2@example.com",
    password: "password123",
    role: "PATIENT" as const,
  },
  {
    name: "Test Nurse",
    email: "nurse2@example.com",
    password: "password123",
    role: "NURSE" as const,
  },
  {
    name: "Test Doctor",
    email: "fira.doctor@example.com",
    password: "password123",
    role: "DOCTOR" as const,
  },
  {
    name: "Test Pharmacist",
    email: "pharmacist@example.com",
    password: "password123",
    role: "PHARMACIST" as const,
  },
  {
    name: "Test Administrator",
    email: "admin@aastu-clinic.local",
    password: "AdminPassword123",
    role: "ADMIN" as const,
  },
];

for (const user of testUsers) {
  const hashedPassword = await bcrypt.hash(user.password, 12);

  await prisma.user.upsert({
    where: {
      email: user.email,
    },
    update: {
      name: user.name,
      password: hashedPassword,
      role: user.role,
    },
    create: {
      name: user.name,
      email: user.email,
      password: hashedPassword,
      role: user.role,
    },
  });
}

await prisma.$disconnect();
