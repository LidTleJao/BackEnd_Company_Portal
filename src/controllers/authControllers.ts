const express = require("express");
const { getAdminToken, createUserOnKeycloak } = require("../config/keycloak");
const { userModel } = require("../models/userModel");
const { encrypt } = require("../utils/encrypt");

async function registerUser(req: any, res: any) {
  try {
    const { firstName, lastName, email, phone, nationalId } = req.body;
    const token = await getAdminToken();

    // 1️⃣ สร้างผู้ใช้ใน Keycloak
    await createUserOnKeycloak(token, {
      firstName,
      lastName,
      email,
      username: email,
      enabled: true,
      emailVerified: false,
      attributes: { phone },
    });

    // 2️⃣ เก็บข้อมูลเสริมใน MongoDB
    const encrypted = encrypt(nationalId);
    const last4 = nationalId.slice(-4);

    const user = new userModel({
      keycloakId: email,
      firstName,
      lastName,
      email,
      phone,
      nationalIdEncrypted: encrypted,
      nationalIdLast4: last4,
    });

    await user.save();
    return res.status(201).json({ ok: true, message: "User registered successfully" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ ok: false, message: err.message });
  }
}

module.exports = {
  registerUser,
};
