import { Response } from "https://deno.land/x/oak@v17.1.4/response.ts";
import { Request, Next } from "https://deno.land/x/oak@v17.1.4/mod.ts";

export type DefaultResponse<Data = any> = {
  success: boolean;
  message: string;
  data?: Data;
};

export type MiddlewareFn<T = DefaultResponse> = (
  req: Request,
  res: Response,
  next: Next
) => Promise<void | Response>;
