import { createRemoteJWKSet, jwtVerify } from "jose";

const realm = process.env.KEYCLOAK_REALM!;
const base = process.env.KEYCLOAK_BASE_URL!;
const jwks = createRemoteJWKSet(new URL(`${base}/realms/${realm}/protocol/openid-connect/certs`));

export function requireAuth(requiredRoles?: string[]) {
  return async (req: any, res: any, next: any) => {
    try {
      const auth = req.headers.authorization || "";
      const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
      if (!token) return res.status(401).json({ message: "No token" });

      const { payload } = await jwtVerify(token, jwks, {
        issuer: `${base}/realms/${realm}`,
      });

      // roles ใน Keycloak อยู่ใน realm_access.roles
      const roles: string[] = (payload as any)?.realm_access?.roles ?? [];
      req.user = { sub: payload.sub, email: (payload as any).email, roles };

      if (requiredRoles?.length) {
        const ok = requiredRoles.some(r => roles.includes(r));
        if (!ok) return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (e:any) {
      return res.status(401).json({ message: "Invalid token", detail: e.message });
    }
  };
}
