import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "AASTU Clinic and Care API is running",
  });
});

export default router;
