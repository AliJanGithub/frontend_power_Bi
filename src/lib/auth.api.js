import axios from 'axios';
import api from './api'; // Assuming your api.js is in the same directory and exported as default

// const AUTH_BASE_URL = '/auth';
const url=import.meta.env.VITE_API_URL
export const authApi = {
    /**
     * Step 1: Request a password reset link be sent to the user's email.
     * POST /auth/forgot-password
    
     */
    forgotPasswordRequest: async (email) => {
        // Uses the imported and configured 'api' Axios instance
        const response = await axios.post(`${url}/auth/forgot-password`, { email });
        return response.data;
    },

    /**
     * Step 2: Submit the new password along with the reset token.
     * POST /auth/reset-password/:token
  
     */
    resetPassword: async (token, newPassword) => {
        // Uses the imported and configured 'api' Axios instance
        // NOTE: The interceptor might attach an old/expired token, but the backend should ignore it for this public route.
        const response = await api.post(`${url}/auth/reset-password/${token}`, { password: newPassword });
        return response.data;
    },
};
