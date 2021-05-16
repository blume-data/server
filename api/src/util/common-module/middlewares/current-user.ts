import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {JWT_COOKIE_NAME, JWT_KEY} from "../utils";

interface UserPayload {
  id: string;
  email: string;
  userName: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: any;
    }
  }
}

export const getCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies[JWT_COOKIE_NAME]) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.cookies[JWT_COOKIE_NAME],
      JWT_KEY
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}

  next();
};
