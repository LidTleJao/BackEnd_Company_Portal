import { Request, Response, NextFunction } from "express";
import jwt, { JwtHeader } from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const issuer = `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}`;

const client = jwksClient({
  jwksUri: `${issuer}/protocol/openid-connect/certs`,
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 10 * 60 * 1000,
});

function getKey(header: JwtHeader, cb: (err: Error | null, key?: string) => void) {
  if (!header.kid) return cb(new Error("No kid in token header"));
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return cb(err);
    const signingKey = key?.getPublicKey();
    cb(null, signingKey);
  });
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ message: "Missing token" });

  const token = auth.split(" ")[1];
  jwt.verify(
    token,
    getKey as any,
    { algorithms: ["RS256"], issuer },
    (err, decoded: any) => {
      if (err) return res.status(401).json({ message: "Unauthorized" });
      (req as any).kc = decoded; // เก็บ payload ไว้ใช้งานต่อ
      next();
    }
  );
}

// ใช้เช็คว่าใน token มี role ที่ต้องการไหม (realm role)
export function requireRealmRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const kc: any = (req as any).kc;
    const roles: string[] = kc?.realm_access?.roles || [];
    if (!roles.includes(role)) return res.status(403).json({ message: "Forbidden" });
    next();
  };
}
