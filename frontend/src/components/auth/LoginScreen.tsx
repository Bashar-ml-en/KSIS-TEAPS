import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';
import logo from '../../assets/ksis_logo.jpg';

import backgroundImage from '../../assets/aiuis-bg.jpg';

export function LoginScreen() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [departmentId, setDepartmentId] = useState<string>('');
  const [currentRole, setCurrentRole] = useState<'teacher' | 'principal' | 'hr_admin'>('teacher');

  const departments = [
    { id: '1', name: 'Language' },
    { id: '2', name: 'STEM & Social Sciences' },
    { id: '3', name: 'Islamic Studies' },
    { id: '4', name: 'Student Affairs' },
    { id: '5', name: 'Co-curriculum & event' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login flow
        if (!email || !password) {
          setError('Please enter both email and password');
          setIsLoading(false);
          return;
        }

        await login(email, password);
        // Navigation is handled by App.tsx based on auth state change
      } else {
        // Registration flow
        if (!fullName || !email || !password || !confirmPassword) {
          setError('Please fill in all fields');
          setIsLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }

        if (password.length < 8) {
          setError('Password must be at least 8 characters');
          setIsLoading(false);
          return;
        }

        if (currentRole === 'teacher' && !departmentId) {
          setError('Please select a department');
          setIsLoading(false);
          return;
        }

        await authService.register({
          name: fullName,
          email,
          password,
          password_confirmation: confirmPassword,
          role: currentRole,
          department_id: currentRole === 'teacher' ? parseInt(departmentId) : undefined,
        });
        // Navigation is handled by App.tsx based on auth state change
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setFullName('');
    setConfirmPassword('');
    setDepartmentId('');
  };

  // Map frontend role display to backend role
  const getRoleDisplayValue = (role: string) => {
    switch (role) {
      case 'hr_admin':
        return 'admin';
      default:
        return role;
    }
  };

  const handleRoleChange = (value: string) => {
    // Map 'admin' selection to 'hr_admin' for backend
    const backendRole = value === 'admin' ? 'hr_admin' : value;
    setCurrentRole(backendRole as 'principal' | 'teacher' | 'hr_admin');
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden">
      {/* Left Side - Brand & Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0 opacity-40"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-blue-900/80 to-slate-900/90 z-10" />

        {/* Content */}
        <div className="relative z-20 flex flex-col justify-between w-full p-12 h-full">
          <div>
            <h3 className="text-xl font-bold tracking-wider text-blue-200 uppercase">KSIS TEAPS</h3>
          </div>

          <div className="space-y-6 max-w-lg">
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-md">
              Inspiring Minds,<br />
              <span className="text-blue-300">Shaping Futures.</span>
            </h1>
            <p className="text-blue-100/90 text-lg leading-relaxed font-light">
              Welcome to the Knowledge Sustainability International School performance evaluation system. Empowering educators with data-driven insights.
            </p>
          </div>

          <div className="text-xs text-blue-300/60 font-medium">
            © 2025 Knowledge Sustainability International School. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Login Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative bg-gray-50">

        {/* Mobile Background for small screens */}
        <div
          className="absolute inset-0 lg:hidden z-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />
        </div>

        <Card className="w-full max-w-md border-0 shadow-2xl lg:shadow-none bg-white/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none relative z-10 p-2 lg:p-0">
          <div className="p-6 lg:px-4 lg:py-2">

            {/* Logo Section - Constrained Size */}
            <div className="flex justify-center mb-8 lg:mb-10">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-white shadow-lg p-3 flex items-center justify-center border border-gray-100">
                <img
                  src={logo}
                  alt="KSIS Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="space-y-2 text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isLogin
                  ? 'Enter your credentials to access your dashboard'
                  : 'Enter your details below to create your account'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isLoading}
                    className="h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                <Input
                  type="email"
                  placeholder="name@ksis.edu.kw"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all"
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Confirm Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className="h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all"
                  />
                </div>
              )}

              {!isLogin && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Select Role</Label>
                  <Select value={getRoleDisplayValue(currentRole)} onValueChange={handleRoleChange} disabled={isLoading}>
                    <SelectTrigger className="h-11 bg-white border-gray-300 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="principal">Principal</SelectItem>
                      <SelectItem value="admin">HR/Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {!isLogin && currentRole === 'teacher' && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Select Department</Label>
                  <Select value={departmentId} onValueChange={setDepartmentId} disabled={isLoading}>
                    <SelectTrigger className="h-11 bg-white border-gray-300 rounded-lg">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                )}
              </Button>

              {isLogin && (
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Demo Credentials</p>
                  <div className="space-y-1 text-xs text-gray-600 font-mono">
                    <div className="flex justify-between"><span>Admin:</span> <span className="select-all">hr@ksis.edu.kw</span></div>
                    <div className="flex justify-between"><span>Principal:</span> <span className="select-all">principal@ksis.edu.kw</span></div>
                    <div className="flex justify-between"><span>Teacher:</span> <span className="select-all">teacher@ksis.edu.kw</span></div>
                    <div className="text-center pt-1 text-gray-400">(pw: password123)</div>
                  </div>
                </div>
              )}
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-gray-500">
                {isLogin ? "New to KSIS?" : "Already have an account?"}
              </span>
              <button
                onClick={toggleMode}
                type="button"
                className="ml-2 font-semibold text-blue-900 hover:text-blue-700 hover:underline transition-colors focus:outline-none"
                disabled={isLoading}
              >
                {isLogin ? 'Create an account' : 'Sign in'}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
