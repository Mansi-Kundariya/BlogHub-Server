import { Router, type Response, type Request } from "express";
import {
  forgotPassword,
  getNewAccessToken,
  login,
  logout,
  resetPassword,
  signup,
  verifyAccount,
  // verifyToken,
} from "../controllers/auth.controller";
import { auth } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/verify-account", verifyAccount);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetToken", resetPassword);
router.post("/logout", logout);
// router.post("/verify-token", verifyToken);
router.post("/refresh-token", getNewAccessToken);

router.get("/profile", auth, (req: Request, res: Response) => {
  res.json({ message: "Protected route", userId: req.userId });
});

export default router;