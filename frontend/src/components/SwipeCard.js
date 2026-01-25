import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { MapPin, Mountain, Ruler, X, Heart, Sparkles } from 'lucide-react';

export const SwipeCard = ({ user, onSwipe, onViewTips }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = (_, info) => {
    setIsDragging(false);
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      animate(x, 500, { duration: 0.3 });
      setTimeout(() => onSwipe('like'), 300);
    } else if (info.offset.x < -threshold) {
      animate(x, -500, { duration: 0.3 });
      setTimeout(() => onSwipe('dislike'), 300);
    } else {
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 });
    }
  };

  const handleButtonSwipe = (action) => {
    const targetX = action === 'like' ? 500 : -500;
    animate(x, targetX, { duration: 0.3 });
    setTimeout(() => onSwipe(action), 300);
  };

  const levelColors = {
    beginner: 'text-green-400',
    intermediate: 'text-yellow-400',
    expert: 'text-red-400'
  };

  const levelLabels = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    expert: 'Esperto'
  };

  return (
    <div className="relative h-[70vh] w-full max-w-sm mx-auto">
      <motion.div
        className="swipe-card absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border border-white/10 cursor-grab active:cursor-grabbing"
        style={{ x, rotate, opacity }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        data-testid="swipe-card"
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${user.profile_picture || 'https://images.unsplash.com/photo-1764532436308-34b8f462315c?w=600'})` 
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Like/Nope Indicators */}
        <motion.div 
          className="absolute top-8 right-8 px-4 py-2 rounded-lg border-2 border-green-500 rotate-12"
          style={{ opacity: likeOpacity }}
        >
          <span className="text-green-500 font-bold text-2xl">LIKE</span>
        </motion.div>
        
        <motion.div 
          className="absolute top-8 left-8 px-4 py-2 rounded-lg border-2 border-red-500 -rotate-12"
          style={{ opacity: nopeOpacity }}
        >
          <span className="text-red-500 font-bold text-2xl">NOPE</span>
        </motion.div>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white font-heading">
                {user.name}{user.age && <span className="font-normal text-zinc-400">, {user.age}</span>}
              </h2>
              <p className="text-zinc-400 flex items-center gap-1 mt-1">
                <MapPin size={14} />
                {user.location || user.preferred_zone || 'Italia'}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewTips && onViewTips(user.id);
              }}
              className="p-3 rounded-full bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
              data-testid="ai-tips-btn"
            >
              <Sparkles size={20} />
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
              <Mountain size={14} className={levelColors[user.experience_level] || 'text-zinc-400'} />
              <span className="text-sm text-zinc-200">
                {levelLabels[user.experience_level] || 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
              <Ruler size={14} className="text-primary" />
              <span className="text-sm text-zinc-200 font-mono">
                {user.avg_distance ? `${user.avg_distance}km` : 'N/A'}
              </span>
            </div>
          </div>

          {user.bio && (
            <p className="text-zinc-300 text-sm line-clamp-2">{user.bio}</p>
          )}
        </div>
      </motion.div>

      {/* Action Buttons */}
      {!isDragging && (
        <div className="absolute -bottom-20 left-0 right-0 flex justify-center gap-6">
          <button
            onClick={() => handleButtonSwipe('dislike')}
            className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/50 transition-colors duration-300"
            data-testid="swipe-dislike-btn"
          >
            <X size={28} className="text-zinc-400 hover:text-red-400" />
          </button>
          <button
            onClick={() => handleButtonSwipe('like')}
            className="w-16 h-16 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center hover:bg-primary/30 transition-colors duration-300 shadow-glow"
            data-testid="swipe-like-btn"
          >
            <Heart size={28} className="text-primary" />
          </button>
        </div>
      )}
    </div>
  );
};
