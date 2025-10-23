import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastProvider';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2 } from '../icons/Icons';
import { Logo } from '../Logo';
import { useNavigate } from 'react-router-dom';
// import '../mycss'
export function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
 const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const result = await login(formData.email, formData.password);

    if (result.success) {
      showToast(`Login successful! Welcome back, ${result.user?.name || "User"}!`, "success");
      navigate("/");
    } else {
      const message = result.error || "Login failed. Please try again.";
      setError(message);
      showToast(message, "error");
    }
  } catch (err) {
    console.error("Unexpected login error:", err);
    const message = "Unexpected error occurred during login.";
    setError(message);
    showToast(message, "error");
  } finally {
    setLoading(false);
  }
};


  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div id='legacy-design-wrapper' className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Logo size="xl" />
          </div>
          <p className="mt-4 text-gray-600">Sign in to access your dashboards</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your email and password to access BI Portal 365
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              <div className="text-center">
                <button 
                  type="button"
                  onClick={() =>navigate('/forgot-password')}
                  className="text-blue-600 hover:text-blue-800 text-sm hover:underline bg-transparent border-0 cursor-pointer"
                >
                  Forgot your password?
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-primary/5 to-success/5 border border-primary/10">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-gray-700">Demo Credentials:</p>
              {/* <div className="text-xs text-gray-600 space-y-1">
                <p className="bg-white/50 rounded px-2 py-1">Admin: alijan061333@gmail.com / SuperAdmin@123</p>
                <p className="bg-white/50 rounded px-2 py-1">User: john.doe@company.com / user123</p>
              </div> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}