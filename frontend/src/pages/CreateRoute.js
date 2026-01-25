import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Mountain, Save, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BottomNav } from '../components/BottomNav';
import { toast } from 'sonner';

export default function CreateRoute() {
  const navigate = useNavigate();
  const { api } = useAuth();
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState({
    title: '',
    description: '',
    distance: '',
    elevation: '',
    difficulty: 'moderate',
    start_point: { name: '', lat: 0, lng: 0 },
    image_url: '',
    tags: []
  });

  const difficulties = [
    { value: 'easy', label: 'Facile', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    { value: 'moderate', label: 'Moderato', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    { value: 'hard', label: 'Difficile', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    { value: 'extreme', label: 'Estremo', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
  ];

  const tagOptions = ['Panoramico', 'Tecnico', 'Forest', 'Colline', 'Pianura', 'Sterrato', 'Single Track'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!route.title || !route.distance) {
      toast.error('Compila i campi obbligatori');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/routes', {
        ...route,
        distance: parseFloat(route.distance),
        elevation: route.elevation ? parseInt(route.elevation) : null
      });
      toast.success('Percorso creato!');
      navigate('/home');
    } catch (error) {
      toast.error('Errore nella creazione');
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag) => {
    if (route.tags.includes(tag)) {
      setRoute({ ...route, tags: route.tags.filter(t => t !== tag) });
    } else {
      setRoute({ ...route, tags: [...route.tags, tag] });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-white/5 px-4 py-4 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-white/5"
          >
            <ArrowLeft size={20} className="text-zinc-400" />
          </button>
          <h1 className="text-xl font-bold text-zinc-100 font-heading">Nuovo Percorso</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Image Upload Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-48 rounded-xl bg-zinc-900/50 border border-zinc-800 border-dashed flex items-center justify-center cursor-pointer hover:border-zinc-700 transition-colors overflow-hidden"
        >
          {route.image_url ? (
            <img src={route.image_url} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <Camera size={32} className="text-zinc-600 mx-auto mb-2" />
              <p className="text-sm text-zinc-500">Aggiungi una foto</p>
            </div>
          )}
        </motion.div>

        {/* Image URL */}
        <div>
          <label className="text-sm text-zinc-400 mb-2 block">URL Immagine (opzionale)</label>
          <input
            type="url"
            value={route.image_url}
            onChange={(e) => setRoute({ ...route, image_url: e.target.value })}
            className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 text-zinc-100 placeholder:text-zinc-600 transition-all"
            placeholder="https://..."
            data-testid="route-image-url"
          />
        </div>

        {/* Title */}
        <div>
          <label className="text-sm text-zinc-400 mb-2 block">Titolo *</label>
          <input
            type="text"
            value={route.title}
            onChange={(e) => setRoute({ ...route, title: e.target.value })}
            className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 text-zinc-100 placeholder:text-zinc-600 transition-all"
            placeholder="Es: Giro delle colline senesi"
            required
            data-testid="route-title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-zinc-400 mb-2 block">Descrizione</label>
          <textarea
            value={route.description}
            onChange={(e) => setRoute({ ...route, description: e.target.value })}
            className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 text-zinc-100 placeholder:text-zinc-600 transition-all resize-none h-24"
            placeholder="Descrivi il percorso..."
            data-testid="route-description"
          />
        </div>

        {/* Distance & Elevation */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Distanza (km) *</label>
            <div className="relative">
              <input
                type="number"
                value={route.distance}
                onChange={(e) => setRoute({ ...route, distance: e.target.value })}
                className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 text-zinc-100 placeholder:text-zinc-600 transition-all"
                placeholder="50"
                min="1"
                required
                data-testid="route-distance"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Dislivello (m)</label>
            <div className="relative">
              <Mountain className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input
                type="number"
                value={route.elevation}
                onChange={(e) => setRoute({ ...route, elevation: e.target.value })}
                className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg pl-10 pr-4 py-3 text-zinc-100 placeholder:text-zinc-600 transition-all"
                placeholder="800"
                min="0"
                data-testid="route-elevation"
              />
            </div>
          </div>
        </div>

        {/* Start Point */}
        <div>
          <label className="text-sm text-zinc-400 mb-2 block">Punto di partenza</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              type="text"
              value={route.start_point.name}
              onChange={(e) => setRoute({ ...route, start_point: { ...route.start_point, name: e.target.value } })}
              className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg pl-10 pr-4 py-3 text-zinc-100 placeholder:text-zinc-600 transition-all"
              placeholder="Es: Piazza del Campo, Siena"
              data-testid="route-start"
            />
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="text-sm text-zinc-400 mb-2 block">Difficoltà</label>
          <div className="grid grid-cols-4 gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff.value}
                type="button"
                onClick={() => setRoute({ ...route, difficulty: diff.value })}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                  route.difficulty === diff.value
                    ? diff.color
                    : 'bg-zinc-900/50 text-zinc-500 border-zinc-800'
                }`}
                data-testid={`difficulty-${diff.value}`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="text-sm text-zinc-400 mb-2 block">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tagOptions.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                  route.tags.includes(tag)
                    ? 'bg-primary/20 text-primary border-primary/50'
                    : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white hover:bg-primary/90 shadow-glow transition-all duration-300 rounded-full px-8 py-4 font-bold tracking-wide uppercase text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          data-testid="route-submit"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save size={18} />
              Pubblica Percorso
            </>
          )}
        </button>
      </form>

      <BottomNav />
    </div>
  );
}
