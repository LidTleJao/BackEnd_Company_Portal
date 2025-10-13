import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const base = process.env.KEYCLOAK_BASE_URL!;
const realm = process.env.KEYCLOAK_REALM!;
const clientId = process.env.KEYCLOAK_CLIENT_ID!;
const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET!;

async function getSAAccessToken() {
  const url = `${base}/realms/${realm}/protocol/openid-connect/token`;
  const data = new URLSearchParams([
    ["grant_type", "client_credentials"],
    ["client_id", clientId],
    ["client_secret", clientSecret],
  ]);
  const res = await axios.post(url, data);
  return res.data.access_token as string;
}

export async function listRealmRoles(req: any, res: any) {
  try {
    const token = await getSAAccessToken();
    const { data } = await axios.get(`${base}/admin/realms/${realm}/roles`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.json({ ok: true, roles: data });
  } catch (e: any) {
    res.status(500).json({ ok: false, message: e.message });
  }
}

export async function assignRealmRoleToUser(req: any, res: any) {
  try {
    const { userId, roleName } = req.body;
    const token = await getSAAccessToken();
    const role = (
      await axios.get(`${base}/admin/realms/${realm}/roles/${roleName}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).data;

    await axios.post(
      `${base}/admin/realms/${realm}/users/${userId}/role-mappings/realm`,
      [role],
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ ok: false, message: e.message });
  }
}
