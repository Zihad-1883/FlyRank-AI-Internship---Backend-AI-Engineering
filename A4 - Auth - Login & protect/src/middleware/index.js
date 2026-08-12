import { supabase } from "../config/supabase.js";

export const tokenVerifier = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({
            error: "Access token required"
        });
    }
    const cleanToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
    if (!cleanToken) {
        return res.status(401).json({
            error: "Access token required"
        });
    }
    const { data, error } = await supabase.auth.getUser(cleanToken);
    if (error) {
        return res.status(401).json({
            error: "Invalid or expired token"
        });
    }

    const { user } = data;
    req.user = user;
    next();
}