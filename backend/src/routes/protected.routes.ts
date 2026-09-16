import { Router } from "express";
import { authenticate, AuthRequest } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.get("/me", authenticate, (req: AuthRequest, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});

router.get("/nurse", authenticate, authorize("NURSE"), (_req, res) => {
  res.json({
    message: "Welcome, nurse",
  });
});

router.get("/doctor", authenticate, authorize("DOCTOR"), (_req, res) => {
  res.json({
    message: "Welcome, doctor",
  });
});

export default router;
