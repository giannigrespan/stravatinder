import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, RefreshCw, Sparkles, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BottomNav } from '../components/BottomNav';
import { SwipeCard } from '../components/SwipeCard';
import { DiscoverFilters } from '../components/DiscoverFilters';
import { toast } from 'sonner';

export default function Discover() {
  const { api } = useAuth();
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [aiTips, setAiTips] = useState('');
  const [showTips, setShowTips] = useState(false);
  const [filters, setFilters] = useState({
    min_age: null,
    max_age: null,
    min_distance: null,
    max_distance: null,
    experience_level: '',
    zone: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (filters.min_age) params.append('min_age', filters.min_age);
    if (filters.max_age) params.append('max_age', filters.max_age);
    if (filters.min_distance) params.append('min_distance', filters.min_distance);
    if (filters.max_distance) params.append('max_distance', filters.max_distance);
    if (filters.experience_level) params.append('experience_level', filters.experience_level);
    if (filters.zone) params.append('zone', filters.zone);
    return params.toString();
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const queryString = buildQueryString();
      const url = `/api/discover${queryString ? `?${queryString}` : ''}`;
      const response = await api.get(url);
      setUsers(response.data);
      setCurrentIndex(0);
    } catch (error) {
      toast.error('Errore nel caricamento');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (action) => {
    const currentUser = users[currentIndex];
    if (!currentUser) return;

    try {
      const response = await api.post('/api/swipe', {
        target_user_id: currentUser.id,
        action
      });

      if (response.data.match) {
        setMatchedUser(currentUser);
        setShowMatch(true);
      }

      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      toast.error('Errore durante lo swipe');
    }
  };

  const fetchAiTips = async (userId) => {
    try {
      const response = await api.get(`/api/ai/match-tips?target_user_id=${userId}`);
      setAiTips(response.data.tips);
      setShowTips(true);
    } catch (error) {
      toast.error('Suggerimenti non disponibili');
    }
  };

  const handleFiltersApply = () => {
    fetchUsers();
  };

  const currentUser = users[currentIndex];

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-white/5 px-4 py-4 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="text-primary" size={20} />
            <h1 className="text-xl font-bold text-zinc-100 font-heading">Scopri Rider</h1>
          </div>
          <div className="flex items-center gap-2">
            <DiscoverFilters 
              filters={filters} 
              onFiltersChange={setFilters}
              onApply={handleFiltersApply}
            />
            <button
              onClick={fetchUsers}
              className="p-2 rounded-full hover:bg-white/5 transition-colors"
              data-testid="refresh-users"
            >
              <RefreshCw size={20} className="text-zinc-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {loading ? (
          <div className="h-[70vh] rounded-3xl skeleton" />
        ) : currentUser ? (
          <SwipeCard
            user={currentUser}
            onSwipe={handleSwipe}
            onViewTips={fetchAiTips}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-[60vh] text-center"
          >
            <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
              <Users size={32} className="text-zinc-600" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-300 mb-2">Nessun rider disponibile</h3>
            <p className="text-zinc-500 mb-6">Prova a modificare i filtri o riprova più tardi</p>
            <button
              onClick={fetchUsers}
              className="bg-primary text-white hover:bg-primary/90 rounded-full px-6 py-3 font-medium flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Aggiorna
            </button>
          </motion.div>
        )}

        {/* Remaining count */}
        {users.length > 0 && currentIndex < users.length && (
          <p className="text-center text-zinc-500 text-sm mt-24">
            {users.length - currentIndex} rider disponibili
          </p>
        )}
      </div>

      {/* Match Modal */}
      <AnimatePresence>
        {showMatch && matchedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6"
            onClick={() => setShowMatch(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-4xl font-bold gradient-text mb-4 font-heading">È un Match!</h2>
              <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden border-4 border-primary">
                <img
                  src={matchedUser.profile_picture || 'https://images.unsplash.com/photo-1764532436308-34b8f462315c?w=200'}
                  alt={matchedUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xl text-zinc-200 mb-6">Tu e {matchedUser.name} vi siete piaciuti!</p>
              <button
                onClick={() => setShowMatch(false)}
                className="bg-primary text-white hover:bg-primary/90 rounded-full px-8 py-3 font-bold"
                data-testid="match-close"
              >
                Continua
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Tips Modal */}
      <AnimatePresence>
        {showTips && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center p-4"
            onClick={() => setShowTips(false)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="w-full max-w-md glass rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-accent" size={20} />
                  <h3 className="font-semibold text-zinc-100">Spunti di conversazione</h3>
                </div>
                <button onClick={() => setShowTips(false)} className="text-zinc-500">
                  <X size={20} />
                </button>
              </div>
              <p className="text-zinc-300 whitespace-pre-line">{aiTips}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
