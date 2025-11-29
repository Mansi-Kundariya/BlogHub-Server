import type { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken";
import { sendEmail } from "../services/emailService";
// import { Op } from "sequelize";

export const signup = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res
      .status(400)
      .json(new ApiResponse(false, "All fields are required"));
  }

  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    return res.status(400).json(new ApiResponse(false, "User already exists"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const varificationToken = Math.floor(100000 + Math.random() * 900000);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    varificationToken,
    verificationTokenExpiresAt: new Date(Date.now() + 60 * 1000), // 1 min
  });

  if (!user) {
    return res.status(500).json(new ApiResponse(false, "Signup failed"));
  }

  const token = generateToken(user?.id);
  await sendEmail(
    user.email,
    "Blog Hub - Verify your account",
    "otp", // template filename
    { name: user.firstName, otp: varificationToken.toString() }
  );

  return res.json(
    new ApiResponse(true, "Signup successful", {
      user: {
        ...user.toJSON(),
        password: undefined,
        varificationToken: undefined,
        verificationTokenExpiresAt: undefined,
      },
      token,
    })
  );
};

export const verifyAccount = async (req: Request, res: Response) => {
  const { email, varificationToken } = req.body;

  if (!varificationToken || !email) {
    return res
      .status(400)
      .json(new ApiResponse(false, "All fields are required"));
  }

  const user = await User.findOne({
    where: {
      email,
      varificationToken,
      // verificationTokenExpiresAt: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    return res.status(404).json(new ApiResponse(false, "User not found"));
  }

  if (
    !user.verificationTokenExpiresAt ||
    user.verificationTokenExpiresAt < new Date()
  ) {
    return res.status(400).json(new ApiResponse(false, "Token expired"));
  }

  user.varificationToken = null;
  user.verificationTokenExpiresAt = null;
  await user.save();

  return res.status(200).json(
    new ApiResponse(true, "Email verified successfully!", {
      user: { ...user.toJSON(), password: undefined },
      token: generateToken(user.id),
    })
  );
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json(new ApiResponse(false, "All fields are required"));
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(false, "User does not exist with this email"));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json(new ApiResponse(false, "Invalid credentials"));
  }

  if (user.varificationToken) {
    return res
      .status(401)
      .json(new ApiResponse(false, "Please verify your account"));
  }

  return res.status(200).json(
    new ApiResponse(true, "Login successful", {
      user: { ...user.toJSON(), password: undefined },
      token: generateToken(user.id),
    })
  );
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json(new ApiResponse(false, "All fields are required"));
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(false, "User does not exist with this email"));
  }

  const resetPasswordToken = Math.floor(100000 + Math.random() * 900000);
  const resetPasswordTokenExpiresAt = new Date(Date.now() + 60 * 1000); // 1 min

  user.resetPasswordToken = resetPasswordToken.toString();
  user.resetPasswordTokenExpiresAt = resetPasswordTokenExpiresAt;
  await user.save();

  await sendEmail(
    user.email,
    "Blog Hub - Reset your password",
    "reset-password", // template filename
    { name: user.firstName, token: resetPasswordToken.toString() }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        true,
        `Password reset link has been sent to ${user.email}`
      )
    );
};

export const resetPassword = async (req: Request, res: Response) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  if (!resetToken || !password) {
    return res
      .status(400)
      .json(new ApiResponse(false, "All fields are required"));
  }

  const user = await User.findOne({
    where: {
      resetPasswordToken: resetToken,
      // resetPasswordExpiresAt: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    return res.status(404).json(new ApiResponse(false, "User not found"));
  }

  if (
    !user.resetPasswordTokenExpiresAt ||
    user.resetPasswordTokenExpiresAt < new Date()
  ) {
    return res.status(400).json(new ApiResponse(false, "Token expired"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordTokenExpiresAt = null;
  await user.save();

  return res.status(200).json(
    new ApiResponse(true, "Password reset successfully!", {
      user: { ...user.toJSON(), password: undefined },
      token: generateToken(user.id),
    })
  );
};
