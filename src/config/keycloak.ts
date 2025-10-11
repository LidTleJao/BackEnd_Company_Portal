import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const base = process.env.KEYCLOAK_BASE_URL!;
const realm = process.env.KEYCLOAK_REALM!;
const clientId = process.env.KEYCLOAK_CLIENT_ID!;
const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET!;

export async function getAdminToken() {
  const url = `${base}/realms/${realm}/protocol/openid-connect/token`;
  const data = new URLSearchParams([
    ["grant_type", "client_credentials"],
    ["client_id", clientId],
    ["client_secret", clientSecret],
  ]);

  const res = await axios.post(url, data.toString());
  return res.data.access_token;
}

export async function createUserOnKeycloak(accessToken: string, userData: any) {
  const url = `${base}/admin/realms/${realm}/users`;
  const res = await axios.post(url, userData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return res.data;
}