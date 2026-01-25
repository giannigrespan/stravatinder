import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Mountain, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
      toast.success('Bentornato!');
      navigate('/home');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Credenziali non valide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-6">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1760892471981-be82b084323e?w=1200)' 
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Mountain className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold font-heading text-zinc-100">GravelMatch</span>
        </div>

        {/* Form Card */}
        <div className="glass rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-zinc-100 mb-2 font-heading">Bentornato</h2>
          <p className="text-zinc-400 mb-6">Accedi per continuare la tua avventura</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg pl-12 pr-4 py-3 text-zinc-100 placeholder:text-zinc-600 transition-all"
                  placeholder="nome@email.com"
                  required
                  data-testid="login-email"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg pl-12 pr-12 py-3 text-zinc-100 placeholder:text-zinc-600 transition-all"
                  placeholder="••••••••"
                  required
                  data-testid="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white hover:bg-primary/90 shadow-glow transition-all duration-300 rounded-full px-8 py-3 font-bold tracking-wide uppercase text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              data-testid="login-submit"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Accedi
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-zinc-500 mt-6">
            Non hai un account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Registrati
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
