import { Router } from "express";
import { authController } from "./auth.controller.js";

export const authRouter = Router();
export const protectedRouter = Router();

authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);

protectedRouter.get("/profile", authController.profile)