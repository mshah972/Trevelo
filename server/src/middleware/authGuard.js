import jwkToPem from "jwk-to-pem";
import jwt from "jsonwebtoken";
import axios from "axios";
import { config } from "../config/env.js";

let jwksCache = null;
let pems = {};

export async function authGuard(req, res, next) {
    try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
        if (!token) return res.status(401).json({ ok: false, error: "Missing token" });

        if (!jwksCache) {
            const { data } = await axios.get(config.cognitoJwksUri, { timeout: 3000 });
            jwksCache = data.keys;
            pems = data.keys.reduce((acc, k) => {
                acc[k.kid] = jwkToPem(k);
                return acc;
            }, {});
        }

        const [headerB64] = token.split(".");
        const header = JSON.parse(Buffer.from(headerB64, "base64").toString("utf8"));
        const pem = pems[header.kid];
        if (!pem) return res.status(401).json({ ok: false, error: "Invalid token key id" });

        const verified = jwt.verify(token, pem, { algorithms: ["RS256"] });

        const expectedIss = `https://cognito-idp.${config.awsRegion}.amazonaws.com/${config.cognitoUserPoolId}`;
        if (verified.iss !== expectedIss) return res.status(401).json({ ok: false, error: "Invalid issuer" });

        req.user = { sub: verified.sub, email: verified.email, name: verified.name };
        next();
    } catch (err) {
        return res.status(401).json({ ok: false, error: "Unauthorized" });
    }
}