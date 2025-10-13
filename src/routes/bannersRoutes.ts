import e, { Router } from "express";
import { AppDataSource } from "../config/db.js";
import { requireAuth } from "../middleware/keycloakAuth.js";
const router = Router();


router.get("/menu", requireAuth(), async (req, res) => {
    res.json({
        items: [
            { code: "checkin", name: "ลงเวลา" },
            { code: "leave", name: "ลางาน" },
            { code: "helpdesk", name: "helpdesk" },
            { code: "reimburse", name: "เบิกเงิน" },
            { code: "finance", name: "การเงิน" },
        ]
    });
});

router.get("/finance", requireAuth(["admin","account"]), async (req, res) => {
    res.json({ message: "ข้อมูลการเงิน" });
});

export default router;