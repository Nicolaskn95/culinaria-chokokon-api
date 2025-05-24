import { NextFunction, Request, Response } from "npm:express";
import npmTthrowlhos from "npm:throwlhos";
import { UserRepository } from "../models/VisionDB/User/UserRepository.ts";
import {
  IRequestUser,
  RequestUserSelect,
} from "../models/VisionDB/User/User.ts";

const UserTokenApiMiddle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req?.headers?.authorization ||
    req?.headers?.Authorization;

  try {
    if (!authorization) {
      throw npmTthrowlhos.default.err_forbidden(
        "Acesso Negado: não foi enviada uma autorização.",
      );
    }

    const [, apiToken] = (authorization as string)?.split(" ");

    if (!apiToken) {
      throw npmTthrowlhos.default.err_forbidden(
        "Acesso Negado: não foi enviada uma token.",
      );
    }

    const userRepository = new UserRepository();
    const requestUser: IRequestUser = await userRepository.findByApiToken(
      apiToken,
    ).select(RequestUserSelect);

    if (!requestUser?._id) {
      throw npmTthrowlhos.default.err_forbidden(
        "Acesso Negado: não foi encontrado usuário para esta token.",
      );
    }

    req.user = requestUser;
  } catch (exception) {
    return next(exception);
  }

  next();
};

export { UserTokenApiMiddle };
