import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mountain, MapPin, ArrowRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export const RouteCard = ({ route, index = 0 }) => {
  const navigate = useNavigate();

  const difficultyColors = {
    easy: 'bg-green-500/20 text-green-400 border-green-500/30',
    moderate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    hard: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    extreme: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const difficultyLabels = {
    easy: 'Facile',
    moderate: 'Moderato',
    hard: 'Difficile',
    extreme: 'Estremo'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => navigate(`/route/${route.id}`)}
      className="bg-zinc-900/50 border border-zinc-800 hover:border-primary/50 transition-colors duration-300 rounded-xl p-4 cursor-pointer group"
      data-testid={`route-card-${route.id}`}
    >
      {/* Image */}
      <div className="relative h-40 rounded-lg overflow-hidden mb-3">
        <img
          src={route.image_url || 'https://images.unsplash.com/photo-1760892471981-be82b084323e?w=400'}
          alt={route.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${difficultyColors[route.difficulty]}`}>
            {difficultyLabels[route.difficulty] || route.difficulty}
          </span>
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm">
          <Heart size={12} className="text-primary" />
          <span className="text-xs text-zinc-200">{route.likes || 0}</span>
        </div>
      </div>

      {/* Content */}
      <h3 className="font-semibold text-zinc-100 mb-2 group-hover:text-primary transition-colors">
        {route.title}
      </h3>

      <div className="flex items-center gap-3 text-sm text-zinc-400 mb-3">
        <div className="flex items-center gap-1">
          <MapPin size={14} />
          <span>{route.start_point?.name || 'Italia'}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <div className="flex items-center gap-1 text-zinc-400">
            <span className="font-mono text-primary font-medium">{route.distance}</span>
            <span className="text-xs">km</span>
          </div>
          {route.elevation && (
            <div className="flex items-center gap-1 text-zinc-400">
              <Mountain size={14} />
              <span className="font-mono">{route.elevation}</span>
              <span className="text-xs">m</span>
            </div>
          )}
        </div>
        <ArrowRight size={18} className="text-zinc-600 group-hover:text-primary group-hover:translate-x-1 transition-transform duration-300" />
      </div>
    </motion.div>
  );
};
