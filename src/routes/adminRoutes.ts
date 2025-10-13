import { Router } from "express";
import { listRealmRoles, assignRealmRoleToUser } from "../controllers/roleControllers.js";
import { verifyToken, requireRealmRole } from "../middleware/auth.js";

const router = Router();

// ต้องมี token และต้องมี role ระดับ realm เป็น 'realm-admin' (หรือกำหนดเอง)
router.get("/roles", verifyToken, requireRealmRole("realm-admin"), listRealmRoles);
router.post("/roles/assign", verifyToken, requireRealmRole("realm-admin"), assignRealmRoleToUser);

export default router;
