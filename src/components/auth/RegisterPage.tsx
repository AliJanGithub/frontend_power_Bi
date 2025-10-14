// import React, { useState } from 'react';
// import { useAuth } from '../AuthContext';
// import { useToast } from '../ToastProvider';
// import { Button } from '../ui/button';
// import { Input } from '../ui/input';
// import { Label } from '../ui/label';
// import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '../ui/card';
// import { Alert, AlertDescription } from '../ui/alert';
// import { Loader2, CheckCircle } from '../icons/Icons';
// import { Logo } from '../Logo';

// export function RegisterPage() {
//   const { register } = useAuth();
//   const { showToast } = useToast();
//   const [formData, setFormData] = useState({
//     name: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [isSuccess, setIsSuccess] = useState(false);
//   const token = 'demo_token'; // Mock token for demo

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       setIsLoading(false);
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError('Password must be at least 6 characters long');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const result = await register(token || '', formData.password, formData.name);
//       if (result.success) {
//         setIsSuccess(true);
//         showToast('Account created successfully');
//         setTimeout(() => {
//           (window as any).navigate('login');
//         }, 2000);
//       } else {
//         setError(result.error || 'Registration failed');
//       }
//     } catch (err) {
//       setError('An unexpected error occurred');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   if (isSuccess) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-success/10 via-white to-success/20 px-4">
//         <div className="w-full max-w-md text-center space-y-6">
//           <div className="flex justify-center">
//             <div className="bg-success p-4 rounded-full shadow-lg">
//               <CheckCircle className="h-10 w-10 text-white" />
//             </div>
//           </div>
//           <div>
//             <h1 className="text-3xl text-gray-900 mb-2">Welcome to BI Portal 365!</h1>
//             <p className="text-gray-600">
//               Your account has been successfully created. You will be redirected to the login page shortly.
//             </p>
//           </div>
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
//           <h1 className="text-2xl tracking-tight text-gray-900">Create Your Account</h1>
//           <p className="mt-2 text-gray-600">Complete your registration to access BI Portal 365</p>
//         </div>

//         <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
//           <CardHeader className="text-center pb-2">
//             <CardTitle className="text-2xl text-gray-900">Account Setup</CardTitle>
//             <CardDescription className="text-gray-600">
//               Set up your password and complete your profile
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {error && (
//                 <Alert variant="destructive">
//                   <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//               )}

//               {!token && (
//                 <Alert>
//                   <AlertDescription>
//                     Invalid or missing registration token. Please contact your administrator for a new invitation.
//                   </AlertDescription>
//                 </Alert>
//               )}

//               <div className="space-y-2">
//                 <Label htmlFor="name">Full Name</Label>
//                 <Input
//                   id="name"
//                   name="name"
//                   type="text"
//                   placeholder="Enter your full name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   disabled={isLoading || !token}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                   id="password"
//                   name="password"
//                   type="password"
//                   placeholder="Create a password (min. 6 characters)"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   disabled={isLoading || !token}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="confirmPassword">Confirm Password</Label>
//                 <Input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type="password"
//                   placeholder="Confirm your password"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   required
//                   disabled={isLoading || !token}
//                 />
//               </div>

//               <Button 
//                 type="submit" 
//                 className="w-full" 
//                 disabled={isLoading || !token}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Creating Account...
//                   </>
//                 ) : (
//                   'Create Account'
//                 )}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>

//         <div className="text-center">
//           <p className="text-sm text-gray-600">
//             Already have an account?{' '}
//             <button 
//               onClick={() => (window as any).navigate('login')}
//               className="text-blue-600 hover:text-blue-800 hover:underline bg-transparent border-0 cursor-pointer"
//             >
//               Sign in here
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }