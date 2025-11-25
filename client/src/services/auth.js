import { signIn, signUp, confirmSignUp, signOut, fetchAuthSession, resetPassword, confirmResetPassword } from "aws-amplify/auth";

/**
 * An asynchronous function to register a new user with the provided email, password, and name.
 * It handles the user sign-up and returns the user ID upon successful registration.
 *
 * @param {string} email - The email address of the user to be registered.
 * @param {string} password - The password chosen by the user.
 * @param {string} name - The name of the user to be registered.
 * @returns {Promise<{success: boolean, userId: string}>} A promise that resolves to an object containing a success flag and the userId of the newly registered user if successful.
 * @throws Will throw an error if the registration process fails.
 */
export const registerUser = async (email, password, name) => {
    try {
        const { userId } = await signUp({
            username: email,
            password,
            options: {
                userAttributes: {
                    email,
                    name,
                },
            },
        });
        return { success: true, userId };
    } catch (err) {
        throw err;
    }
};

/**
 * Asynchronously verifies a user's email address using a confirmation code.
 * Sends the provided email and confirmation code for verification and returns
 * a success response if the operation is completed successfully. If the verification
 * fails, an error is thrown.
 *
 * @param {string} email - The email address of the user to be verified.
 * @param {string} code - The confirmation code sent to the user's email for verification.
 * @returns {Promise<{success: boolean}>} A promise that resolves with an object
 * indicating the success of the operation.
 * @throws {Error} Throws an error if the email verification fails.
 */
export const verifyEmail = async (email, code) => {
    try {
        await confirmSignUp({ username: email, confirmationCode: code });
        return { success: true };
    } catch (err) {
        throw err;
    }
};

/**
 * Asynchronously handles user login by authenticating provided credentials.
 *
 * @param {string} email - The email address of the user attempting to sign in.
 * @param {string} password - The password associated with the provided email address.
 * @returns {Promise<Object>} A promise resolving to an object containing the result of the login attempt:
 * - `success` (boolean): Indicates whether the login was successful.
 * - `nextStep?` (string): Optional key that specifies the next step if login requires additional actions.
 * @throws Will throw an error if the authentication process fails.
 */
export const loginUser = async (email, password) => {
    try {
        const { isSignedIn, nextStep } = await signIn({ username: email, password });
        if (isSignedIn) {
            return { success: true };
        }
        return { success: false, nextStep };
    } catch (err) {
        throw err;
    }
};

/**
 * Logs out the currently authenticated user.
 *
 * This asynchronous function attempts to sign out the user from the application.
 * If an error occurs during the sign-out process, it will log the error to the console.
 *
 * @function logoutUser
 * @async
 * @throws Will log an error message to the console if the sign-out operation fails.
 */
export const logoutUser = async () => {
    try {
        await signOut();
    } catch (err) {
        console.error("Error signing out", err);
    }
};

/**
 * Retrieves the authentication token asynchronously.
 *
 * The function attempts to fetch the authentication session and extract the ID token.
 * If the operation is successful, it returns the token as a string.
 * In case of an error or if the token is unavailable, it returns null.
 *
 * @returns {Promise<string | null>} A promise that resolves to the ID token as a string
 * or null if the operation fails or the token is unavailable.
 */
export const getAuthToken = async () => {
    try {
        const { token } = await fetchAuthSession();
        return token?.idToken?.toString();
    } catch (err) {
        return null;
    }
};

/**
 * Initiates the password reset process for the provided email address.
 *
 * @function
 * @async
 * @param {string} email - The email address of the user requesting a password reset.
 * @returns {Promise<string>} A promise that resolves to the next step in the password reset process.
 * @throws {Error} Throws an error if the password reset process fails.
 */
export const initiatePasswordReset = async (email) => {
    try {
        const output = await resetPassword({ username: email });
        const { nextStep } = output;
        return nextStep.resetPasswordStep;
    } catch (err) {
        throw err;
    }
};

/**
 * Completes the password reset process by verifying the confirmation code and setting the new password.
 *
 * @async
 * @function completePasswordRest
 *
 * @param {string} email - The email address associated with the user's account.
 * @param {string} code - The confirmation code received by the user for resetting the password.
 * @param {string} newPassword - The new password to be set for the user's account.
 *
 * @throws {Error} Throws an error if the password reset confirmation fails.
 */
export const completePasswordRest = async (email, code, newPassword) => {
    try {
        await confirmResetPassword({
            username: email,
            confirmationCode: code,
            newPassword: newPassword
        });
    } catch (err) {
        throw err;
    }
};