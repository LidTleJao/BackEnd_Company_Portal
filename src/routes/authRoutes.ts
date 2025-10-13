// const express = require("express");
import express from "express";
// const { registerUser } = require("../controllers/authControllers");
import { loginUser, registerUser } from "../controllers/authControllers.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
router.post("/registration", registerUser);
router.post("/login", loginUser);
router.get("/me", verifyToken, (req, res) => {
    res.json({ ok: true, user: req });
});

export default router;