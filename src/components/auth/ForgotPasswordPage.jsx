// import React, { useState } from 'react';
// import { useAuth } from '../AuthContext';
// import { useToast } from '../ToastProvider';
// import { Button } from '../ui/button';
// import { Input } from '../ui/input';
// import { Label } from '../ui/label';
// import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '../ui/card';
// import { Alert, AlertDescription } from '../ui/alert';
// import { Loader2, Mail, CheckCircle } from '../icons/Icons';
// import { Logo } from '../Logo';
// import { useNavigate } from 'react-router-dom';

// export function ForgotPasswordPage() {
//   const { forgotPassword } = useAuth();
//   const { showToast } = useToast();
//   const [email, setEmail] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [isSuccess, setIsSuccess] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     try {
//       const result = await forgotPassword(email);
//       if (result.success) {
//         setIsSuccess(true);
//         showToast('Password reset email sent');
//       } else {
//         setError(result.error || 'Failed to send reset email');
//       }
//     } catch (err) {
//       setError('An unexpected error occurred');
//     } finally {
//       setIsLoading(false);
//     }
//   };
// const navigate=useNavigate()
//   if (isSuccess) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-4">
//         <div className="w-full max-w-md space-y-8">
//           <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
//             <CardContent className="pt-8 text-center space-y-4">
//               <div className="flex justify-center">
//                 <div className="bg-success p-4 rounded-full shadow-lg">
//                   <CheckCircle className="h-10 w-10 text-white" />
//                 </div>
//               </div>
//               <div>
//                 <h2 className="text-xl text-gray-900 mb-2">Email Sent!</h2>
//                 <p className="text-gray-600 mb-4">
//                   We've sent a password reset link to <strong>{email}</strong>
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   Please check your email and follow the instructions to reset your password.
//                 </p>
//               </div>
//               <div className="pt-4">
//                 <Button 
//                   variant="outline" 
//                   className="w-full"
//                   onClick={() => navigate('/login')}
//                 >
//                   Back to Login
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-4">
//       <div className="w-full max-w-md space-y-8">
//         <div className="text-center">
//           <div className="flex justify-center mb-6">
//             <Logo size="xl" />
//           </div>
//           <h1 className="text-2xl tracking-tight text-gray-900">Reset Password</h1>
//           <p className="mt-2 text-gray-600">Enter your email to receive a password reset link</p>
//         </div>

//         <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
//           <CardHeader className="text-center pb-2">
//             <CardTitle className="flex items-center justify-center gap-2 text-2xl text-gray-900">
//               <Mail className="h-6 w-6 text-primary" />
//               Forgot Password
//             </CardTitle>
//             <CardDescription className="text-gray-600">
//               We'll send you a link to reset your password
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {error && (
//                 <Alert variant="destructive">
//                   <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//               )}

//               <div className="space-y-2">
//                 <Label htmlFor="email">Email Address</Label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="your.email@company.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   disabled={isLoading}
//                 />
//               </div>

//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Sending Reset Link...
//                   </>
//                 ) : (
//                   'Send Reset Link'
//                 )}
//               </Button>

//               <div className="text-center">
//                 <button 
//                   onClick={() => navigate('login')}
//                   className="text-blue-600 hover:text-blue-800 text-sm hover:underline bg-transparent border-0 cursor-pointer"
//                 >
//                   Back to Sign In
//                 </button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }





















import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ToastProvider'; // Assuming this provides showToast
import { authApi } from '../../lib/auth.api'; // Updated import path
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Mail, CheckCircle, Lock } from '../icons/Icons';
import { Logo } from '../Logo';

// Helper to get query params (like the 'token') from the URL
const useQuery = () => {
  return new URLSearchParams(window.location.search);
};

export function ForgotPasswordPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const query = useQuery();
    const resetToken = query.get('token');
       console.log(resetToken)
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const isResetMode = !!resetToken;
    
    // --- State 1: Request Password Reset Link (Forgot Password) ---
    const handleForgotPasswordRequest = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Hitting the POST /auth/forgot-password route
            const result = await authApi.forgotPasswordRequest(email);
            
            // Note: Backend should return a success message regardless of email existence for security
            if (result.success) {
                setIsSuccess(true);
                showToast(result.message || 'Password reset email sent');
            } else {
                // This path should ideally not be hit if the backend handles enumeration correctly
                setError(result.message || 'Failed to send reset email');
            }
        } catch (err) {
            // Display generic message if request fails (network error, etc.)
            const errorMessage = err.response?.data?.message || 'Failed to process request. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // --- State 2: Reset Password with Token ---
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }
        if (newPassword.length < 8) { // Basic validation
             setError("Password must be at least 8 characters long.");
             setIsLoading(false);
             return;
        }
          
        try {
            // Hitting the POST /auth/reset-password/:token route
            const result = await authApi.resetPassword(resetToken, newPassword);
            
            if (result.success && result.data.accessToken && result.data.refreshToken) {
                // Successful reset also logs the user in (based on your backend structure)
                localStorage.setItem('accessToken', result.data.accessToken);
                localStorage.setItem('refreshToken', result.data.refreshToken);
                localStorage.setItem('user', JSON.stringify(result.data.user)); // Store user data
                
                showToast('Password reset successful. Welcome back!');
                
                // Navigate to dashboard or secure page
                navigate('/'); 
            } else {
                setError(result.message || 'Failed to reset password. Token may be invalid.');
            }
        } catch (err) {
          console.log(err)
            const errorMessage = err.response?.data?.message || 'Invalid or expired token. Please request a new link.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    // --- Success View (for Email Request only) ---
    if (isSuccess && !isResetMode) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-4">
                <div className="w-full max-w-md space-y-8">
                    <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                        <CardContent className="pt-8 text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="bg-green-500 p-4 rounded-full shadow-lg">
                                    <CheckCircle className="h-10 w-10 text-white" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl text-gray-900 mb-2">Email Sent!</h2>
                                <p className="text-gray-600 mb-4">
                                    If an account with that email exists, a password reset link has been sent.
                                </p>
                                <p className="text-sm text-gray-500">
                                    Please check your spam folder if you don't see it within a few minutes.
                                </p>
                            </div>
                            <div className="pt-4">
                                <Button 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={() => navigate('/login')}
                                >
                                    Back to Login
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
    
    // --- Main View (Forgot or Reset Mode) ---
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <Logo size="xl" />
                    </div>
                    <h1 className="text-2xl tracking-tight text-gray-900">
                        {isResetMode ? 'Set New Password' : 'Reset Password'}
                    </h1>
                    <p className="mt-2 text-gray-600">
                        {isResetMode ? 'Enter and confirm your new password.' : 'Enter your email to receive a password reset link.'}
                    </p>
                </div>

                <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="flex items-center justify-center gap-2 text-2xl text-gray-900">
                            {isResetMode ? <Lock className="h-6 w-6 text-primary" /> : <Mail className="h-6 w-6 text-primary" />}
                            {isResetMode ? 'Password Reset' : 'Forgot Password'}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            {isResetMode ? 'Token found. Set your new password now.' : 'We will email you instructions.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={isResetMode ? handlePasswordReset : handleForgotPasswordRequest} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {/* Email Input (Forgot Password Mode) */}
                            {!isResetMode && (
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="your.email@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            )}

                            {/* Password Inputs (Reset Password Mode) */}
                            {isResetMode && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            placeholder="Enter new password (min 8 chars)"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </>
                            )}

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {isResetMode ? 'Resetting Password...' : 'Sending Reset Link...'}
                                    </>
                                ) : (
                                    isResetMode ? 'Set New Password' : 'Send Reset Link'
                                )}
                            </Button>

                            <div className="text-center">
                                <button 
                                    onClick={() => navigate('/login')}
                                    className="text-blue-600 hover:text-blue-800 text-sm hover:underline bg-transparent border-0 cursor-pointer"
                                    type="button"
                                >
                                    Back to Sign In
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
