// const express = require("express");
import express from "express";
// const { registerUser } = require("../controllers/authControllers");
import { registerUser } from "../controllers/authControllers.js";

const router = express.Router();
router.post("/registration", registerUser);

export default router;