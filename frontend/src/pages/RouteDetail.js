import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Mountain, Heart, Share2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BottomNav } from '../components/BottomNav';
import { toast } from 'sonner';

export default function RouteDetail() {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const { api } = useAuth();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchRoute();
  }, [routeId]);

  const fetchRoute = async () => {
    try {
      const response = await api.get(`/api/routes/${routeId}`);
      setRoute(response.data);
    } catch (error) {
      toast.error('Percorso non trovato');
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (liked) return;
    try {
      await api.post(`/api/routes/${routeId}/like`);
      setLiked(true);
      setRoute({ ...route, likes: (route.likes || 0) + 1 });
      toast.success('Percorso salvato nei preferiti');
    } catch (error) {
      toast.error('Errore');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: route.title,
        text: `Scopri questo percorso gravel: ${route.title}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiato!');
    }
  };

  const difficultyLabels = {
    easy: { label: 'Facile', color: 'text-green-400' },
    moderate: { label: 'Moderato', color: 'text-yellow-400' },
    hard: { label: 'Difficile', color: 'text-orange-400' },
    extreme: { label: 'Estremo', color: 'text-red-400' }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!route) return null;

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Hero Image */}
      <div className="relative h-72">
        <img
          src={route.image_url || 'https://images.unsplash.com/photo-1760892471981-be82b084323e?w=800'}
          alt={route.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 rounded-full glass flex items-center justify-center"
          data-testid="route-back"
        >
          <ArrowLeft size={20} className="text-zinc-200" />
        </button>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full glass flex items-center justify-center"
            data-testid="route-share"
          >
            <Share2 size={18} className="text-zinc-200" />
          </button>
          <button
            onClick={handleLike}
            className={`w-10 h-10 rounded-full glass flex items-center justify-center ${liked ? 'bg-primary/20' : ''}`}
            data-testid="route-like"
          >
            <Heart size={18} className={liked ? 'text-primary fill-primary' : 'text-zinc-200'} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-zinc-100 font-heading mb-2">{route.title}</h1>
            <div className="flex items-center gap-2 text-zinc-400">
              <MapPin size={16} />
              <span>{route.start_point?.name || 'Italia'}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
              <p className="font-mono text-2xl font-bold text-primary">{route.distance}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">km</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
              <p className="font-mono text-2xl font-bold text-zinc-100">{route.elevation || '-'}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">m dislivello</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
              <p className={`text-lg font-bold ${difficultyLabels[route.difficulty]?.color || 'text-zinc-100'}`}>
                {difficultyLabels[route.difficulty]?.label || route.difficulty}
              </p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">difficoltà</p>
            </div>
          </div>

          {/* Description */}
          {route.description && (
            <div>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">Descrizione</h3>
              <p className="text-zinc-400 leading-relaxed">{route.description}</p>
            </div>
          )}

          {/* Tags */}
          {route.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {route.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-zinc-800/50 text-zinc-400 text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Author */}
          <div className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">
              <User size={20} className="text-zinc-400" />
            </div>
            <div>
              <p className="font-medium text-zinc-200">{route.user_name || 'Rider'}</p>
              <p className="text-sm text-zinc-500">
                Pubblicato il {new Date(route.created_at).toLocaleDateString('it-IT')}
              </p>
            </div>
          </div>

          {/* Likes */}
          <div className="flex items-center gap-2 text-zinc-500">
            <Heart size={16} className={liked ? 'text-primary fill-primary' : ''} />
            <span>{route.likes || 0} rider hanno salvato questo percorso</span>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
