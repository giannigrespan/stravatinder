import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, MessageCircle, MapPin, User } from 'lucide-react';

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, path: '/home', label: 'Home' },
    { icon: MapPin, path: '/create-route', label: 'Percorsi' },
    { icon: Users, path: '/discover', label: 'Scopri' },
    { icon: MessageCircle, path: '/matches', label: 'Match' },
    { icon: User, path: '/settings', label: 'Profilo' }
  ];

  return (
    <nav className="fixed bottom-6 left-4 right-4 h-16 glass rounded-full flex items-center justify-around shadow-2xl z-50" data-testid="bottom-nav">
      {navItems.map(({ icon: Icon, path, label }) => {
        const isActive = location.pathname === path || 
          (path === '/matches' && location.pathname.startsWith('/chat'));
        
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-colors duration-300 ${
              isActive 
                ? 'text-primary bg-primary/10' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
            }`}
            aria-label={label}
            data-testid={`nav-${label.toLowerCase()}`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] mt-1 font-medium">{label}</span>
          </button>
        );
      })}
    </nav>
  );
};
