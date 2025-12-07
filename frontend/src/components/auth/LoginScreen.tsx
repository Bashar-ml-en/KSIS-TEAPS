import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';
import logo from '../../assets/ksis_logo.jpg';
import studentsImage from '../../assets/aiuis-login-illustration.png';
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
  const [currentRole, setCurrentRole] = useState<'principal' | 'teacher' | 'hr_admin'>('teacher');

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

        await authService.register({
          name: fullName,
          email,
          password,
          password_confirmation: confirmPassword,
          role: currentRole,
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
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-700/70 to-slate-800/80 backdrop-blur-sm" />

      <Card className="w-full max-w-5xl relative z-10 shadow-2xl border-blue-800/50 bg-black/98 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="illustration-right"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="order-2 lg:order-1 bg-gradient-to-br from-blue-950 via-blue-500 to-blue-950 p-8 lg:p-12 flex flex-col items-center justify-center text-black relative overflow-hidden"
              >
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-300/10 rounded-full blur-3xl animate-pulse delay-700" />

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-center z-10"
                >
                  <img src={studentsImage}
                    alt="Education Illustration"
                    className="w-84 h-84 object-contain mx-auto mb-6 drop-shadow-2xl animate-float"
                  />


                  <h2 className="text-black mb-4">Knowledge Sustainability International School</h2>
                  <p className="text-blue-100 text-sm max-w-sm">
                    Empowering educators through comprehensive performance evaluation and continuous professional development.
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="illustration-left"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="order-2 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 p-8 lg:p-12 flex flex-col items-center justify-center text-black relative overflow-hidden"
              >
                <div className="absolute top-10 right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-300/10 rounded-full blur-3xl animate-pulse delay-700" />

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-center z-10"
                >
                  <img
                    src={studentsImage}
                    alt="Students"
                    className="w-64 h-64 object-contain mx-auto mb-6 drop-shadow-2xl"
                  />
                  <h2 className="text-black mb-4">Join KSIS Today</h2>
                  <p className="text-blue-100 text-sm max-w-sm">
                    Create your account and start your journey towards excellence in teaching and professional growth.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login-form' : 'register-form'}
              initial={{ x: isLogin ? 100 : -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isLogin ? -100 : 100, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className={`p-8 lg:p-12 flex flex-col justify-center ${isLogin ? 'order-2' : 'order-1'}`}
            >
              <div className="max-w-md mx-auto w-full">
                <motion.div
                  className="flex justify-center mb-8"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-2xl animate-pulse" />
                    <div
                      className="absolute inset-0 bg-blue-00/20 rounded-full blur-3xl animate-pulse"
                      style={{ animationDelay: '0.5s' }}
                    />
                    <div className="absolute inset-0 bg-blue-600/40 rounded-full blur-xl" />

                    <div className="relative p-6 bg-gradient-to-br from-blue-50 via-black to-blue-50 rounded-full shadow-2xl border-4 border-blue-200">
                      <img src={logo} alt="KSIS Logo" className="w-20 h-20 object-contain relative z-10" />
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                  <h1 className="text-blue-950 text-center mb-2">{isLogin ? 'Welcome Back!' : 'Create Account'}</h1>
                  <p className="text-gray-600 text-center mb-8 text-sm">
                    {isLogin ? 'Sign in to continue' : 'Join Knowledge Sustainability International School (KSIS)'}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                      <div>
                        <Label>Full Name</Label>
                        <Input
                          type="text"
                          placeholder="Enter your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    )}

                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <Label>Password</Label>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    {!isLogin && (
                      <div>
                        <Label>Confirm Password</Label>
                        <Input
                          type="password"
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    )}

                    {!isLogin && (
                      <div>
                        <Label>Select Role</Label>
                        <Select value={getRoleDisplayValue(currentRole)} onValueChange={handleRoleChange} disabled={isLoading}>
                          <SelectTrigger>
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

                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <p className="text-red-700 text-xs">{error}</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-blue-900 hover:bg-blue-950 text-white shadow-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {isLogin ? 'Signing in...' : 'Creating account...'}
                        </>
                      ) : (
                        isLogin ? 'Login' : 'Register'
                      )}
                    </Button>

                    <div className="text-center">
                      <p className="text-gray-600 text-sm">
                        {isLogin ? "Don't have an account? " : 'Already have an account? '}
                        <button
                          onClick={toggleMode}
                          type="button"
                          className="text-blue-900 hover:underline"
                          disabled={isLoading}
                        >
                          {isLogin ? 'Register now' : 'Login'}
                        </button>
                      </p>
                    </div>

                    {/* Test credentials helper - can be removed in production */}
                    {isLogin && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                        <p className="text-blue-800 font-medium mb-1">Test Credentials:</p>
                        <p className="text-blue-600">HR Admin: hr@ksis.edu.kw / password123</p>
                        <p className="text-blue-600">Principal: principal@ksis.edu.kw / password123</p>
                        <p className="text-blue-600">Teacher: teacher@ksis.edu.kw / password123</p>
                      </div>
                    )}
                  </form>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
