import { Router } from "express";
import { forgotPassword, login, resetPassword, signup, verifyAccount } from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signup);
router.post("/verify-account", verifyAccount);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetToken", resetPassword);

export default router;
