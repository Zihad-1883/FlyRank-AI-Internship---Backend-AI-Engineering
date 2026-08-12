import { Router } from "express";
import { authController } from "./auth.controller.js";
import { tokenVerifier } from "../middleware/index.js";

export const authRouter = Router();
export const protectedRouter = Router();

authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);
authRouter.post("/logout", tokenVerifier, authController.logout);

protectedRouter.get("/profile", tokenVerifier, authController.profile);
protectedRouter.get("/dashboard", tokenVerifier, authController.dashboard);