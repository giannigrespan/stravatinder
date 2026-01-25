import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mountain, MapPin, Ruler, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    experience_level: '',
    avg_distance: '',
    preferred_zone: '',
    bio: ''
  });

  const levels = [
    { value: 'beginner', label: 'Principiante', desc: 'Nuove alle strade bianche', icon: '🌱' },
    { value: 'intermediate', label: 'Intermedio', desc: 'Esperienze regolari', icon: '🚴' },
    { value: 'expert', label: 'Esperto', desc: 'Veterano del gravel', icon: '🏆' }
  ];

  const distances = [
    { value: 30, label: '20-40 km', desc: 'Uscite brevi' },
    { value: 60, label: '40-80 km', desc: 'Medie distanze' },
    { value: 100, label: '80-120 km', desc: 'Lunghe distanze' },
    { value: 150, label: '120+ km', desc: 'Ultra endurance' }
  ];

  const zones = [
    'Toscana', 'Lombardia', 'Veneto', 'Emilia-Romagna', 
    'Piemonte', 'Lazio', 'Trentino', 'Sardegna', 'Sicilia', 'Altro'
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateProfile(profile);
      toast.success('Profilo completato!');
      navigate('/home');
    } catch (error) {
      toast.error('Errore nel salvare il profilo');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return profile.experience_level;
    if (step === 2) return profile.avg_distance;
    if (step === 3) return profile.preferred_zone;
    return false;
  };

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto"
      >
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                s <= step ? 'bg-primary' : 'bg-zinc-800'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Experience Level */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 text-primary mb-2">
                <Mountain size={20} />
                <span className="text-sm font-medium uppercase tracking-wider">Step 1 di 3</span>
              </div>
              <h2 className="text-3xl font-bold text-zinc-100 font-heading">
                Qual è il tuo livello?
              </h2>
              <p className="text-zinc-400 mt-2">Ci aiuta a trovare rider compatibili</p>
            </div>

            <div className="space-y-3">
              {levels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setProfile({ ...profile, experience_level: level.value })}
                  className={`w-full p-4 rounded-xl border text-left transition-all duration-300 ${
                    profile.experience_level === level.value
                      ? 'bg-primary/10 border-primary'
                      : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                  }`}
                  data-testid={`level-${level.value}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{level.icon}</span>
                    <div>
                      <p className="font-semibold text-zinc-100">{level.label}</p>
                      <p className="text-sm text-zinc-400">{level.desc}</p>
                    </div>
                    {profile.experience_level === level.value && (
                      <Check className="ml-auto text-primary" size={20} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Average Distance */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 text-primary mb-2">
                <Ruler size={20} />
                <span className="text-sm font-medium uppercase tracking-wider">Step 2 di 3</span>
              </div>
              <h2 className="text-3xl font-bold text-zinc-100 font-heading">
                Quanto pedali?
              </h2>
              <p className="text-zinc-400 mt-2">La tua distanza media preferita</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {distances.map((dist) => (
                <button
                  key={dist.value}
                  onClick={() => setProfile({ ...profile, avg_distance: dist.value })}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                    profile.avg_distance === dist.value
                      ? 'bg-primary/10 border-primary'
                      : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                  }`}
                  data-testid={`distance-${dist.value}`}
                >
                  <p className="font-mono text-xl font-bold text-zinc-100">{dist.label}</p>
                  <p className="text-sm text-zinc-400">{dist.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Preferred Zone */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 text-primary mb-2">
                <MapPin size={20} />
                <span className="text-sm font-medium uppercase tracking-wider">Step 3 di 3</span>
              </div>
              <h2 className="text-3xl font-bold text-zinc-100 font-heading">
                Dove pedali?
              </h2>
              <p className="text-zinc-400 mt-2">La tua zona preferita</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {zones.map((zone) => (
                <button
                  key={zone}
                  onClick={() => setProfile({ ...profile, preferred_zone: zone })}
                  className={`px-4 py-2 rounded-full border transition-all duration-300 ${
                    profile.preferred_zone === zone
                      ? 'bg-primary text-white border-primary'
                      : 'bg-zinc-900/50 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                  }`}
                  data-testid={`zone-${zone.toLowerCase()}`}
                >
                  {zone}
                </button>
              ))}
            </div>

            {/* Bio */}
            <div className="pt-4">
              <label className="text-sm text-zinc-400 mb-2 block">Bio (opzionale)</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 text-zinc-100 placeholder:text-zinc-600 transition-all resize-none h-24"
                placeholder="Racconta qualcosa di te..."
                data-testid="profile-bio"
              />
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 rounded-full border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Indietro
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed() || loading}
            className="flex-1 bg-primary text-white hover:bg-primary/90 shadow-glow transition-all duration-300 rounded-full px-8 py-3 font-bold tracking-wide uppercase text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            data-testid="profile-next-btn"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {step === 3 ? 'Completa' : 'Avanti'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
