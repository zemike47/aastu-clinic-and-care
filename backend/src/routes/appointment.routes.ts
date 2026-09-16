import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

import {
  createAppointment,
  getMyAppointments,
  updateMyAppointment,
  cancelMyAppointment,
  getNurseAppointments,
  completeNurseAssessment,
  createPrescription,
  completeDoctorConsultation,
  getDoctorAppointments,
  getPendingPrescriptions,
  dispensePrescription,
} from "../controllers/appointment.controller.js";

const router = Router();

router.use(authenticate);

router.post("/", authorize("PATIENT"), createAppointment);

router.get("/my", authorize("PATIENT"), getMyAppointments);

router.patch("/:id", authorize("PATIENT"), updateMyAppointment);

router.patch("/:id/cancel", authorize("PATIENT"), cancelMyAppointment);

router.get("/nurse", authorize("NURSE"), getNurseAppointments);

router.patch(
  "/:id/nurse-complete",
  authorize("NURSE"),
  completeNurseAssessment
);

router.post("/:id/prescription", authorize("DOCTOR"), createPrescription);
router.get("/doctor", authorize("DOCTOR"), getDoctorAppointments);

router.patch(
  "/:id/doctor-complete",
  authorize("DOCTOR"),
  completeDoctorConsultation
);

router.get(
  "/pharmacy/prescriptions",
  authorize("PHARMACIST"),
  getPendingPrescriptions
);

router.patch(
  "/pharmacy/prescriptions/:id/dispense",
  authorize("PHARMACIST"),
  dispensePrescription
);

export default router;
