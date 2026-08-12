import { authService } from "./auth.service.js";

const signup = async (req, res) => {
    const payload = req.body;
    const result = await authService.signupIntoSupabase(payload);
    return res.status(result.statusCode).json(result);
}

const login = async (req, res) => {
    const payload = req.body;
    const result = await authService.loginIntoSupabase(payload);
    return res.status(result.statusCode).json(result);
}

export const authController = {
    signup,
    login
}