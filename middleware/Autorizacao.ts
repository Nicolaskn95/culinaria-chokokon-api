import { MiddlewareFn } from "../types/generics.ts";
import {
  Request,
  Response,
  Status,
} from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { verify } from "https://deno.land/x/djwt@v2.8/mod.ts";

class Authorization {
  private readonly JWT_SECRET = Deno.env.get("JWT_SECRET");
  private key: CryptoKey | null = null;

  private async initializeKey(): Promise<CryptoKey> {
    if (this.key) return this.key;

    const encoder = new TextEncoder();
    const keyData = encoder.encode(this.JWT_SECRET);
    this.key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );
    return this.key;
  }

  ensureAuthenticated: MiddlewareFn = async (req, res, next) => {
    try {
      const authHeader = req.headers.get("Authorization");

      if (!authHeader) {
        res.status = Status.Unauthorized;
        res.body = {
          success: false,
          message: "No authorization header provided",
        };
        return;
      }

      const token = authHeader.replace("Bearer ", "");

      try {
        const key = await this.initializeKey();
        const payload = await verify(token, key);

        // Add user information to the request
        // req. = {
        //   id: payload.id as string,
        //   email: payload.email as string,
        //   name: payload.name as string,
        //   role: payload.role as string,
        // };

        await next();
      } catch (error) {
        res.status = Status.Unauthorized;
        res.body = {
          success: false,
          message: "Token Expirado",
        };
        return;
      }
    } catch (error) {
      res.status = Status.InternalServerError;
      res.body = {
        success: false,
        message: "Erro interno durante a autenticação",
      };
      return;
    }
  };
}

export default new Authorization();
