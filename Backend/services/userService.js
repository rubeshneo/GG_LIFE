import User from "../models/User.js";

/**
 * Find a user by their email address.
 * @param {string} email - The email to search for.
 * @returns {Promise<Object|null>} The user document or null if not found.
 */
export const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

/**
 * Find a user by their ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Object|null>} The user document or null if not found.
 */
export const findUserById = async (userId) => {
    return await User.findById(userId);
};

/**
 * Create a new user.
 * @param {Object} userData - The user data to create.
 * @returns {Promise<Object>} The created user document.
 */
export const createUser = async (userData) => {
    return await User.create(userData);
};

/**
 * Update a user by their ID.
 * @param {string} userId - The ID of the user.
 * @param {Object} updateData - The data to update.
 * @returns {Promise<Object|null>} The updated user document or null if not found.
 */
export const updateUserById = async (userId, updateData) => {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

/**
 * Save a user document.
 * @param {Object} user - The user document to save.
 * @returns {Promise<Object>} The saved user document.
 */
export const saveUser = async (user) => {
    return await user.save();
};
