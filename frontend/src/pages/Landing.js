import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Mountain } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1760892471981-be82b084323e?w=1200)' 
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-end px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Mountain className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold font-heading text-zinc-100">GravelMatch</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none text-zinc-100 font-heading">
            Trova il tuo<br />
            <span className="gradient-text">prossimo ride</span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-md">
            Scopri percorsi gravel incredibili e connettiti con rider che condividono la tua passione per l'avventura.
          </p>

          {/* Stats */}
          <div className="flex gap-8 py-6">
            <div>
              <p className="text-3xl font-bold text-primary font-mono">500+</p>
              <p className="text-sm text-zinc-500">Percorsi</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary font-mono">2.5K+</p>
              <p className="text-sm text-zinc-500">Rider</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary font-mono">150+</p>
              <p className="text-sm text-zinc-500">Match/mese</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-4">
            <button
              onClick={() => navigate('/register')}
              className="w-full bg-primary text-white hover:bg-primary/90 shadow-glow transition-all duration-300 rounded-full px-8 py-4 font-bold tracking-wide uppercase text-sm flex items-center justify-center gap-2"
              data-testid="get-started-btn"
            >
              Inizia ora
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700 rounded-full px-6 py-4 font-medium text-sm"
              data-testid="login-btn"
            >
              Ho già un account
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
