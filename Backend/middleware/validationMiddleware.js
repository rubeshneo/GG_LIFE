import { ApiError } from "../utils/ApiError.js";
import { HTTP_BAD_REQUEST } from "../utils/constants.js";

const nameRegex = /^[A-Za-z]+$/;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const passwordRegex = /(?=.*[A-Za-z])(?=.*\d)/;

export const validateSignup = (req, res, next) => {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
        throw new ApiError(HTTP_BAD_REQUEST, "All fields (firstname, lastname, email, password) are required");
    }

    if (!nameRegex.test(firstname)) {
        throw new ApiError(HTTP_BAD_REQUEST, "Firstname can contain only letters");
    }
    if (!nameRegex.test(lastname)) {
        throw new ApiError(HTTP_BAD_REQUEST, "Lastname can contain only letters");
    }

    if (!emailRegex.test(email)) {
        throw new ApiError(HTTP_BAD_REQUEST, "Invalid email format");
    }

    if (password.length < 8) {
        throw new ApiError(HTTP_BAD_REQUEST, "Password must be at least 8 characters long");
    }

    if (!passwordRegex.test(password)) {
        throw new ApiError(HTTP_BAD_REQUEST, "Password must contain letters and numbers");
    }

    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(HTTP_BAD_REQUEST, "Email and password are required");
    }

    if (!emailRegex.test(email)) {
        throw new ApiError(HTTP_BAD_REQUEST, "Invalid email format");
    }

    next();
};

export const validateSendCode = (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(HTTP_BAD_REQUEST, "Email is required");
    }

    if (!emailRegex.test(email)) {
        throw new ApiError(HTTP_BAD_REQUEST, "Invalid email format");
    }

    next();
};

export const validateVerifyCode = (req, res, next) => {
    const { email, code } = req.body;

    if (!email || !code) {
        throw new ApiError(HTTP_BAD_REQUEST, "Email and code are required");
    }

    if (!emailRegex.test(email)) {
        throw new ApiError(HTTP_BAD_REQUEST, "Invalid email format");
    }

    next();
};

export const validateResendCode = (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(HTTP_BAD_REQUEST, "Email is required");
    }

    if (!emailRegex.test(email)) {
        throw new ApiError(HTTP_BAD_REQUEST, "Invalid email format");
    }

    next();
};
