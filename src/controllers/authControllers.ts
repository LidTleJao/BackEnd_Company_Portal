import type { Request, Response } from "express";
import { AppDataSource } from "../config/db.js";
import { User } from "../entities/User.js";
import {
  getAdminToken,
  createUserOnKeycloak,
  kcSetPassword,
  kcAssignRealmRole,
  kcSendVerifyEmail,
} from "../config/keycloak.js";
import axios from "axios";

export async function registerUser(req: Request, res: Response) {
  try {
    const { email, phone, firstName, lastName, password } = req.body;
    const token = await getAdminToken();
    const userId = await createUserOnKeycloak(token, {
      email,
      firstName,
      lastName,
      phone,
    });

    await kcSetPassword(token, userId, password ?? "ChangeMe123!", true);

    await kcAssignRealmRole(token, userId, "employee");

    // await kcSendVerifyEmail(token, userId);

    const userRepo = AppDataSource.getRepository(User);
    const newUser = userRepo.create({ email, phone });
    await userRepo.save(newUser);

    res.status(201).json({ ok: true, message: "User registered successfully" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ ok: false, message: err.message });
  }
}

export async function loginUser(req: any, res: any) {
  try {
    const { email, password } = req.body;
    const tokenUrl = `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`;

    const params = new URLSearchParams();
    params.append("client_id", process.env.KEYCLOAK_CLIENT_ID!);
    // params.append("client_secret", process.env.KEYCLOAK_CLIENT_SECRET!);
    if (process.env.KEYCLOAK_CLIENT_SECRET?.trim()) {
      params.append("client_secret", process.env.KEYCLOAK_CLIENT_SECRET);
    }
    params.append("grant_type", "password");

    params.append("username", email);
    params.append("password", password);

    const { data } = await axios.post(tokenUrl, params.toString(),{
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    // data = { access_token, refresh_token, expires_in, ... }
    res.status(200).json({ ok: true, ...data });
  } catch (err: any) {
    console.error("KC login error:", err.response?.data || err.message);
    // ส่งข้อความดิบกลับมาด้วย จะได้ไล่สาเหตุได้ทันที
    return res.status(401).json({
      ok: false,
      message: "Invalid credentials",
      detail: err.response?.data || err.message,
    });
  }
}
