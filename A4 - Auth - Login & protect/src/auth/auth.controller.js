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

const logout = async (req, res) => {
    const result = await authService.logoutFromSupabase();
    if (result.statusCode === 204) {
        return res.status(204).send();
    }
    return res.status(result.statusCode).json(result);
}

const profile = async (req, res) => {
    const user = req.user;
    const result = await authService.getProfileFromSupabase(user);
    return res.status(result.statusCode).json(result);
}

const dashboard = async (req, res) => {
    const user = req.user;
    const result = await authService.getDashboardFromSupabase(user);
    return res.status(result.statusCode).json(result);
}

export const authController = {
    signup,
    login,
    logout,
    profile,
    dashboard
}