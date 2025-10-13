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

export async function createUserOnKeycloak(
  accessToken: string,
  u: { email: string; firstName?: string; lastName?: string; phone?: string }
) {
  const url = `${base}/admin/realms/${realm}/users`;
  const res = await axios.post(
    url,
    {
      username: u.email,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      enabled: true,
      emailVerified: false,
      attributes: {
        phone: u.phone ?? "",
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  // return res.data;
  const location: string = res.headers.location;
  const id = location.split("/").pop()!;
  return id;
}

export async function kcSetPassword(
  token: string,
  userId: string,
  value: string,
  temporary = true
) {
  const url = `${base}/admin/realms/${realm}/users/${userId}/reset-password`;
  await axios.put(
    url,
    {
      type: "password",
      value,
      temporary,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}

export async function kcSendVerifyEmail(token: string, userId: string) {
  const url = `${base}/admin/realms/${realm}/users/${userId}/send-verify-email`;
  await axios.put(
    url,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}

export async function kcAssignRealmRole(
  token: string,
  userId: string,
  roleName: string
) {
  const role = (
    await axios.get(`${base}/admin/realms/${realm}/roles/${roleName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).data;

  await axios.post(
    `${base}/admin/realms/${realm}/users/${userId}/role-mappings/realm`,
    [role],
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}
