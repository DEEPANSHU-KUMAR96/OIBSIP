import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Flame, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const { handleLogin, loading, error, isAuthenticated, clearAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    clearAuthError();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) clearAuthError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(formData);
    } catch (err) {
      // Error handled by redux slice & hook
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col md:flex-row bg-[#fff8f5] text-[#1e1b18]">
      {/* Left Side: Hero Image Area (Desktop) */}
      <section className="hidden md:flex relative w-1/2 min-h-screen bg-[#34302c] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-1000 ease-out"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1600&auto=format&fit=crop')",
          }}
        />
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-[#1e1b18]/95 via-[#1e1b18]/40 to-black/20" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 lg:p-16 h-full text-white w-full">
          {/* Top Brand Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#c41e3a] to-[#9e0027] flex items-center justify-center shadow-lg shadow-[#c41e3a]/30">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-wider text-white">
              PIZZADelivery
            </span>
          </div>

          {/* Hero Bottom Text */}
          <div className="space-y-4 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wider text-amber-200 uppercase">
              <Sparkles className="w-3.5 h-3.5" /> PIZZADelivery
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold leading-tight drop-shadow-md">
              Welcome Back to the Hearth
            </h1>
            <p className="text-stone-300 text-base leading-relaxed font-light">
              Sign in to manage your orders, access exclusive seasonal menus, and savor traditional wood-fired perfection.
            </p>
          </div>
        </div>
      </section>

      {/* Right Side: Login Form Area */}
      <section className="w-full md:w-1/2 min-h-screen flex flex-col justify-center items-center p-6 sm:p-10 md:p-12 lg:p-16 relative bg-[#fff8f5]">
        {/* Mobile Background Header */}
        <div
          className="md:hidden absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop')",
          }}
        />
        <div className="md:hidden absolute inset-0 z-0 bg-surface/92 backdrop-blur-md" />

        <div className="w-full max-w-md relative z-10 my-auto">
          {/* Mobile Brand Header */}
          <div className="md:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#c41e3a] text-white shadow-lg mb-3">
              <Flame className="w-7 h-7" />
            </div>
            <h1 className="font-display text-2xl font-bold text-[#9e0027] tracking-tight">
              ARTISANAL HEARTH
            </h1>
          </div>

          {/* Section Header */}
          <div className="text-center md:text-left mb-8">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1e1b18] tracking-tight mb-2">
              Welcome Back
            </h2>
            <p className="text-[#5b4040] text-sm sm:text-base">
              Sign in to continue your gourmet journey.
            </p>
          </div>

          {/* Error Alert Box */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-sm flex items-start gap-3 animate-fade-in shadow-sm">
              <AlertCircle className="w-5 h-5 text-[#ba1a1a] shrink-0 mt-0.5" />
              <span className="font-medium leading-snug">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1b18] mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-5 h-5 text-[#8f6f6f] pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="auth-input-field w-full bg-white border border-outline-variant/60 rounded-xl pl-12 pr-4 py-3.5 text-sm text-[#1e1b18] placeholder-[#8f6f6f]/50 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1b18]" htmlFor="password">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs font-semibold text-[#9e0027] hover:underline transition-colors"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-5 h-5 text-[#8f6f6f] pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="auth-input-field w-full bg-white border border-outline-variant/60 rounded-xl pl-12 pr-12 py-3.5 text-sm text-[#1e1b18] placeholder-[#8f6f6f]/50 transition-all duration-200"
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-[#8f6f6f] hover:text-[#1e1b18] transition-colors p-1 rounded-md focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-[#c41e3a] to-[#9e0027] text-white font-bold text-sm tracking-wider uppercase rounded-xl py-4 px-6 shadow-lg shadow-[#c41e3a]/30 hover:shadow-xl hover:shadow-[#c41e3a]/40 hover:opacity-95 active:scale-[0.98] transition-all duration-200 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center py-6">
            <div className="grow border-t border-outline-variant/40" />
            <span className="shrink-0 mx-4 text-xs font-semibold text-[#8f6f6f] tracking-widest uppercase">
              OR
            </span>
            <div className="grow border-t border-outline-variant/40" />
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            className="w-full bg-white border-2 border-outline-variant/50 text-[#1e1b18] rounded-xl py-3.5 px-6 font-semibold text-sm hover:bg-[#fbf2ed] active:scale-[0.98] transition-all duration-200 flex justify-center items-center gap-3 cursor-pointer shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Footer Link */}
          <p className="text-center text-sm text-[#5b4040] mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#9e0027] font-bold hover:underline ml-1">
              Register
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;