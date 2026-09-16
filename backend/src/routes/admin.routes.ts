import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { createStaff } from "../controllers/admin.controller.js";

const router = Router();

router.use(authenticate);
router.use(authorize("ADMIN"));

router.post("/staff", createStaff);

export default router;
