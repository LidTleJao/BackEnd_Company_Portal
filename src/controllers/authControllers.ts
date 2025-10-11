import type { Request, Response } from "express";
import { AppDataSource } from "../config/db.js";
import { User } from "../entities/User.js";
import { getAdminToken, createUserOnKeycloak } from "../config/keycloak.js";

export async function registerUser(req: Request, res: Response) {
  try {
    const { email, phone, nationalId } = req.body;
    const token = await getAdminToken();

    await createUserOnKeycloak(token, {
      username: email,
      email,
      enabled: true,
      emailVerified: false,
      attributes: { phone },
    });

    const userRepo = AppDataSource.getRepository(User);
    const newUser = userRepo.create({ email, phone, nationalId });
    await userRepo.save(newUser);

    res.status(201).json({ ok: true, message: "User registered successfully" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ ok: false, message: err.message });
  }
}
