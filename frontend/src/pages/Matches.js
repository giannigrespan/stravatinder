import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BottomNav } from '../components/BottomNav';
import { toast } from 'sonner';

export default function Matches() {
  const navigate = useNavigate();
  const { api } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await api.get('/api/matches');
      setMatches(response.data);
    } catch (error) {
      toast.error('Errore nel caricamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-white/5 px-4 py-4 z-40">
        <div className="flex items-center gap-2">
          <MessageCircle className="text-primary" size={20} />
          <h1 className="text-xl font-bold text-zinc-100 font-heading">I tuoi Match</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl skeleton" />
            ))}
          </div>
        ) : matches.length > 0 ? (
          <div className="space-y-3">
            {matches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/chat/${match.id}`)}
                className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-primary/50 transition-colors cursor-pointer"
                data-testid={`match-${match.id}`}
              >
                <div className="relative">
                  <img
                    src={match.user?.profile_picture || 'https://images.unsplash.com/photo-1764532436308-34b8f462315c?w=100'}
                    alt={match.user?.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-success border-2 border-background" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-zinc-100">{match.user?.name || 'Rider'}</h3>
                  {match.last_message ? (
                    <p className="text-sm text-zinc-500 truncate">{match.last_message.content}</p>
                  ) : (
                    <p className="text-sm text-primary">Nuovo match! Scrivi per primo</p>
                  )}
                </div>

                <ChevronRight size={20} className="text-zinc-600" />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-[50vh] text-center"
          >
            <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
              <MessageCircle size={32} className="text-zinc-600" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-300 mb-2">Nessun match ancora</h3>
            <p className="text-zinc-500 mb-6">Inizia a swipare per trovare rider compatibili</p>
            <button
              onClick={() => navigate('/discover')}
              className="bg-primary text-white hover:bg-primary/90 rounded-full px-6 py-3 font-medium"
            >
              Scopri Rider
            </button>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
