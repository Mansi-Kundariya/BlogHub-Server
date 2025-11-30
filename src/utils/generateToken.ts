import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "1m", // short expiry
    // expiresIn: "2m", // short expiry
  });
};

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "1d",
    // expiresIn: "7d",
  });
};
