import { Response } from "express";
import prisma from "../lib/prisma.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { appointmentDate, reason } = req.body;

    if (!appointmentDate || !reason) {
      return res.status(400).json({
        message: "Appointment date and reason are required",
      });
    }

    const parsedDate = new Date(appointmentDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid appointment date",
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: req.user!.userId,
        appointmentDate: parsedDate,
        reason,
        status: "WITH_NURSE",
      },
    });

    return res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.error("Create appointment error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getMyAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: req.user!.userId,
      },
      orderBy: {
        appointmentDate: "desc",
      },
      include: {
        prescription: {
          include: {
            items: {
              include: {
                medicine: true,
              },
            },
          },
        },
      },
    });

    return res.json({
      appointments,
    });
  } catch (error) {
    console.error("Get appointments error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateMyAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const appointmentId = Number(req.params.id);
    const { appointmentDate, reason } = req.body;

    if (Number.isNaN(appointmentId)) {
      return res.status(400).json({
        message: "Invalid appointment ID",
      });
    }

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patientId: req.user!.userId,
      },
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (appointment.status !== "WITH_NURSE") {
      return res.status(400).json({
        message: "Only appointments waiting for a nurse can be updated",
      });
    }

    const data: {
      appointmentDate?: Date;
      reason?: string;
    } = {};

    if (appointmentDate !== undefined) {
      const parsedDate = new Date(appointmentDate);

      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          message: "Invalid appointment date",
        });
      }

      data.appointmentDate = parsedDate;
    }

    if (reason !== undefined) {
      if (!reason.trim()) {
        return res.status(400).json({
          message: "Reason cannot be empty",
        });
      }

      data.reason = reason;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "Provide appointmentDate or reason to update",
      });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: appointment.id,
      },
      data,
    });

    return res.json({
      message: "Appointment updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Update appointment error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const cancelMyAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const appointmentId = Number(req.params.id);

    if (Number.isNaN(appointmentId)) {
      return res.status(400).json({
        message: "Invalid appointment ID",
      });
    }

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patientId: req.user!.userId,
      },
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (appointment.status !== "WITH_NURSE") {
      return res.status(400).json({
        message: "This appointment can no longer be cancelled",
      });
    }

    const cancelledAppointment = await prisma.appointment.update({
      where: {
        id: appointment.id,
      },
      data: {
        status: "CANCELLED",
      },
    });

    return res.json({
      message: "Appointment cancelled successfully",
      appointment: cancelledAppointment,
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getNurseAppointments = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        status: "WITH_NURSE",
      },
      orderBy: {
        appointmentDate: "asc",
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.json({
      appointments,
    });
  } catch (error) {
    console.error("Get nurse appointments error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const completeNurseAssessment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const appointmentId = Number(req.params.id);
    const { nurseNotes } = req.body;

    if (Number.isNaN(appointmentId)) {
      return res.status(400).json({
        message: "Invalid appointment ID",
      });
    }

    if (!nurseNotes || !nurseNotes.trim()) {
      return res.status(400).json({
        message: "Nurse notes are required",
      });
    }

    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (appointment.status !== "WITH_NURSE") {
      return res.status(400).json({
        message: "Appointment is not waiting for a nurse",
      });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        nurseNotes,
        status: "WITH_DOCTOR",
      },
    });

    return res.json({
      message: "Nurse assessment completed",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Complete nurse assessment error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getDoctorAppointments = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        status: "WITH_DOCTOR",
      },
      orderBy: {
        appointmentDate: "asc",
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.json({
      appointments,
    });
  } catch (error) {
    console.error("Get doctor appointments error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const completeDoctorConsultation = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const appointmentId = Number(req.params.id);
    const { doctorNotes } = req.body;

    if (Number.isNaN(appointmentId)) {
      return res.status(400).json({
        message: "Invalid appointment ID",
      });
    }

    if (!doctorNotes || !doctorNotes.trim()) {
      return res.status(400).json({
        message: "Doctor notes are required",
      });
    }

    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (appointment.status !== "WITH_DOCTOR") {
      return res.status(400).json({
        message: "Appointment is not waiting for a doctor",
      });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        doctorNotes,
        status: "COMPLETED",
      },
    });

    return res.json({
      message: "Doctor consultation completed",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Complete doctor consultation error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const createPrescription = async (req: AuthRequest, res: Response) => {
  try {
    const appointmentId = Number(req.params.id);
    const { items } = req.body;

    if (Number.isNaN(appointmentId)) {
      return res.status(400).json({
        message: "Invalid appointment ID",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Prescription items are required",
      });
    }

    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
      include: {
        prescription: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (appointment.status !== "COMPLETED") {
      return res.status(400).json({
        message: "Prescription can only be created for a completed appointment",
      });
    }

    if (appointment.prescription) {
      return res.status(409).json({
        message: "Prescription already exists for this appointment",
      });
    }

    const medicineIds = items.map((item) => Number(item.medicineId));

    const medicines = await prisma.medicineInventory.findMany({
      where: {
        id: {
          in: medicineIds,
        },
      },
    });

    if (medicines.length !== medicineIds.length) {
      return res.status(400).json({
        message: "One or more medicines do not exist",
      });
    }

    const prescription = await prisma.prescription.create({
      data: {
        appointmentId,
        doctorId: req.user!.userId,
        items: {
          create: items.map((item) => ({
            medicineId: Number(item.medicineId),
            quantity: Number(item.quantity),
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            instructions: item.instructions || null,
          })),
        },
      },
      include: {
        items: {
          include: {
            medicine: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Prescription created successfully",
      prescription,
    });
  } catch (error) {
    console.error("Create prescription error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getPendingPrescriptions = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const prescriptions = await prisma.prescription.findMany({
      where: {
        status: "PENDING",
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        appointment: {
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            medicine: true,
          },
        },
      },
    });

    return res.json({
      prescriptions,
    });
  } catch (error) {
    console.error("Get pending prescriptions error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const dispensePrescription = async (req: AuthRequest, res: Response) => {
  try {
    const prescriptionId = Number(req.params.id);

    if (!Number.isInteger(prescriptionId) || prescriptionId <= 0) {
      return res.status(400).json({
        message: "Invalid prescription ID",
      });
    }

    const prescription = await prisma.prescription.findUnique({
      where: {
        id: prescriptionId,
      },
      include: {
        items: true,
      },
    });

    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    if (prescription.status === "DISPENSED") {
      return res.status(409).json({
        message: "Prescription has already been dispensed",
      });
    }

    await prisma.$transaction(async (tx) => {
      for (const item of prescription.items) {
        const medicine = await tx.medicineInventory.findUnique({
          where: {
            id: item.medicineId,
          },
        });

        if (!medicine) {
          throw new Error(`Medicine with ID ${item.medicineId} not found`);
        }

        if (medicine.stockQuantity < item.quantity) {
          throw new Error(
            `Insufficient stock for ${medicine.name}. Available: ${medicine.stockQuantity}`
          );
        }

        await tx.medicineInventory.update({
          where: {
            id: item.medicineId,
          },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      await tx.prescription.update({
        where: {
          id: prescriptionId,
        },
        data: {
          status: "DISPENSED",
        },
      });
    });

    return res.status(200).json({
      message: "Prescription dispensed successfully",
    });
  } catch (error) {
    console.error("Dispense prescription error:", error);

    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to dispense prescription",
    });
  }
};
