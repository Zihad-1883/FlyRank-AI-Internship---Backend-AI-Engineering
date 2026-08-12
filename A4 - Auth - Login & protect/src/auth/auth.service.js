import { supabase } from "../config/supabase.js";

const signupIntoSupabase = async (payload) => {
    const { email, password } = payload || {};
    if (!email || !password) {
        return {
            statusCode: 400,
            error: "Email and password are required"
        };
    }
    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });
    if (error) {
        return {
            statusCode: 400,
            message: error.message
        }
    }
    return {
        statusCode: 201,
        message: "User created successfully",
        data
    }
}

const loginIntoSupabase = async (payload) => {
    const { email, password } = payload || {};
    if (!email || !password) {
        return {
            statusCode: 400,
            message: "Email and Password are required"
        }
    }
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    if (error) {
        return {
            statusCode: 401,
            error: error.message
        }
    }
    return {
        statusCode: 200,
        message: "User logged in successfully",
        data
    }
}

const getProfileFromSupabase = async (token) => {
    if (!token) {
        return {
            statusCode: 401,
            error: "Access token required"
        };
    }
    const cleanToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
    if (!cleanToken) {
        return {
            statusCode: 401,
            error: "Access token required"
        };
    }
    const { data, error } = await supabase.auth.getUser(cleanToken);
    if (error) {
        return {
            statusCode: 401,
            error: "Invalid or expired token"
        };
    }
    return {
        statusCode: 200,
        message: "User profile fetched successfully",
        data: {
            id: data.user.id,
            email: data.user.email,
            created_at: data.user.created_at
        }
    };
}

export const authService = {
    signupIntoSupabase,
    loginIntoSupabase,
    getProfileFromSupabase
}
