import { type Response } from "express";

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: false, // true in production (https)
    sameSite: "strict",
    path: "/",
    maxAge:  2 * 60 * 1000, // 2 min
    // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
