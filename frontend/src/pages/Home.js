import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BottomNav } from '../components/BottomNav';
import { RouteCard } from '../components/RouteCard';
import { toast } from 'sonner';

export default function Home() {
  const navigate = useNavigate();
  const { user, api } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await api.get('/api/routes');
      setRoutes(response.data);
    } catch (error) {
      toast.error('Errore nel caricamento dei percorsi');
    } finally {
      setLoading(false);
    }
  };

  const fetchAiSuggestions = async () => {
    if (aiSuggestions) return;
    setLoadingAi(true);
    try {
      const response = await api.get('/api/ai/route-suggestions');
      setAiSuggestions(response.data.suggestions);
    } catch (error) {
      toast.error('Suggerimenti AI non disponibili');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-white/5 px-4 py-4 z-40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-sm">Ciao, {user?.name?.split(' ')[0] || 'Rider'}</p>
            <h1 className="text-xl font-bold text-zinc-100 font-heading">Esplora Percorsi</h1>
          </div>
          <button
            onClick={() => navigate('/create-route')}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-glow"
            data-testid="create-route-btn"
          >
            <Plus size={20} className="text-white" />
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* AI Suggestions Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-px"
          style={{ background: 'linear-gradient(135deg, #E05D34 0%, #B91C1C 100%)' }}
        >
          <div className="bg-zinc-900 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="text-accent" size={18} />
              <span className="text-sm font-medium text-accent uppercase tracking-wider">AI Suggerimenti</span>
            </div>
            
            {aiSuggestions ? (
              <p className="text-zinc-300 text-sm whitespace-pre-line">{aiSuggestions}</p>
            ) : (
              <button
                onClick={fetchAiSuggestions}
                disabled={loadingAi}
                className="text-zinc-400 text-sm hover:text-zinc-200 transition-colors flex items-center gap-2"
                data-testid="get-ai-suggestions"
              >
                {loadingAi ? (
                  <>
                    <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    Generando suggerimenti...
                  </>
                ) : (
                  'Clicca per ricevere suggerimenti personalizzati per i tuoi prossimi ride'
                )}
              </button>
            )}
          </div>
        </motion.div>

        {/* Routes Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-primary" size={18} />
              <h2 className="text-lg font-semibold text-zinc-100">Percorsi Recenti</h2>
            </div>
            <span className="text-sm text-zinc-500">{routes.length} percorsi</span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-xl skeleton" />
              ))}
            </div>
          ) : routes.length > 0 ? (
            <div className="grid gap-4">
              {routes.map((route, index) => (
                <RouteCard key={route.id} route={route} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-zinc-500 mb-4">Nessun percorso disponibile</p>
              <button
                onClick={() => navigate('/create-route')}
                className="text-primary hover:underline"
              >
                Crea il primo percorso
              </button>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
