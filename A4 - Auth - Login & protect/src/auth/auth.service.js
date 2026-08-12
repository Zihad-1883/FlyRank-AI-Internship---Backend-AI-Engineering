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

export const authService = {
    signupIntoSupabase,
    loginIntoSupabase
}
