import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertCircle, Loader2, Mail, Lock, User, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
  const [currentRole, setCurrentRole] = useState<'teacher' | 'principal' | 'hr_admin'>('teacher');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        if (!email || !password) {
          setError('Please enter both email and password');
          setIsLoading(false);
          return;
        }
        await login(email, password);
      } else {
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

  const getRoleDisplayValue = (role: string) => role === 'hr_admin' ? 'admin' : role;

  const handleRoleChange = (value: string) => {
    const backendRole = value === 'admin' ? 'hr_admin' : value;
    setCurrentRole(backendRole as 'principal' | 'teacher' | 'hr_admin');
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 overflow-hidden font-sans">
      {/* Left Side - Enterprise Hero Panel */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Enterprise Grade Multi-Layer Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#0f1e4d]/95 via-[#1b3a8a]/90 to-[#2a5bd7]/85 mix-blend-multiply" />
        <div className="absolute inset-0 z-10 bg-black/20" /> {/* Subtle depth */}

        {/* Content */}
        <div className="relative z-20 flex flex-col justify-between w-full p-16 h-full text-white">
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="h-1 w-12 bg-[#7DD3FC] rounded-full"></div>
            <h3 className="text-sm font-bold tracking-[0.2em] text-blue-100 uppercase font-sans">
              System Access
            </h3>
          </div>

          <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <h1 className="text-6xl font-extrabold leading-[1.1] tracking-tight">
              Inspiring Minds,<br />
              <span className="text-[#7DD3FC]">Shaping Futures.</span>
            </h1>

            <p className="text-blue-100/90 text-xl leading-relaxed font-light max-w-md border-l-2 border-[#7DD3FC]/50 pl-6">
              Welcome to the Knowledge Sustainability International School performance evaluation system.
              Empowering educators with data-driven insights.
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-blue-200/80 animate-in fade-in duration-1000 delay-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#7DD3FC]" />
              <span>Secure Environment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#7DD3FC]" />
              <span>Institutional Access Only</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Secure Login Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative bg-gray-50/50">

        {/* Mobile Background */}
        <div className="absolute inset-0 lg:hidden z-0 bg-gradient-to-br from-slate-900 to-blue-900" />

        <div className="w-full max-w-[440px] relative z-10 animate-in fade-in zoom-in-95 duration-500">

          {/* Logo Badge */}
          <div className="flex justify-center mb-8">
            <div className="h-24 w-24 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-4 flex items-center justify-center ring-1 ring-gray-100">
              <img src={logo} alt="KSIS Logo" className="w-full h-full object-contain" />
            </div>
          </div>

          <Card className="border-0 shadow-[0_20px_40px_rgba(0,0,0,0.08)] rounded-2xl bg-white overflow-hidden">
            <div className="p-8 lg:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-sm text-gray-500 mt-2 font-medium">
                  {isLogin
                    ? 'Enter your institutional credentials to proceed'
                    : 'Set up your teaching profile'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wider ml-1">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Dr. John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={isLoading}
                        className="pl-11 h-12 bg-[#F8FAFF] border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all font-medium text-gray-700"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wider ml-1">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="name@ksis.edu.kw"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="pl-11 h-12 bg-[#F8FAFF] border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all font-medium text-gray-700 placeholder:font-normal"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Password</Label>
                    {isLogin && <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Forgot?</a>}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="pl-11 h-12 bg-[#F8FAFF] border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all font-medium text-gray-700 placeholder:font-normal"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wider ml-1">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-11 h-12 bg-[#F8FAFF] border-gray-200 rounded-xl"
                      />
                    </div>
                  </div>
                )}

                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wider ml-1">Role</Label>
                      <Select value={getRoleDisplayValue(currentRole)} onValueChange={handleRoleChange}>
                        <SelectTrigger className="h-12 bg-[#F8FAFF] border-gray-200 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="principal">Principal</SelectItem>
                          <SelectItem value="admin">HR/Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {currentRole === 'teacher' && (
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wider ml-1">Dept</Label>
                        <Select value={departmentId} onValueChange={setDepartmentId}>
                          <SelectTrigger className="h-12 bg-[#F8FAFF] border-gray-200 rounded-xl">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm animate-in slide-in-from-top-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  ) : (
                    <span>{isLogin ? 'Secure Sign In' : 'Create Account'}</span>
                  )}
                </Button>
              </form>

              {/* Trust Signal */}
              <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                <p className="flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Secure academic access · Institutional authentication
                </p>
              </div>
            </div>
          </Card>

          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-sm font-semibold text-blue-900 hover:text-blue-700 transition-colors"
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

