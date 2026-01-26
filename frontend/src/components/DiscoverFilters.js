import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown } from 'lucide-react';

export const DiscoverFilters = ({ filters, onFiltersChange, onApply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const experienceLevels = [
    { value: '', label: 'Tutti' },
    { value: 'beginner', label: 'Principiante' },
    { value: 'intermediate', label: 'Intermedio' },
    { value: 'expert', label: 'Esperto' }
  ];

  const zones = [
    '', 'Toscana', 'Lombardia', 'Veneto', 'Emilia-Romagna', 
    'Piemonte', 'Lazio', 'Trentino', 'Sardegna', 'Sicilia'
  ];

  const handleApply = () => {
    onFiltersChange(localFilters);
    onApply && onApply();
    setIsOpen(false);
  };

  const handleReset = () => {
    const resetFilters = {
      min_age: null,
      max_age: null,
      min_distance: null,
      max_distance: null,
      experience_level: '',
      zone: ''
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== null && v !== '');

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
          hasActiveFilters 
            ? 'bg-primary/20 border-primary text-primary' 
            : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
        }`}
        data-testid="open-filters-btn"
      >
        <Filter size={16} />
        <span className="text-sm font-medium">Filtri</span>
        {hasActiveFilters && (
          <span className="w-2 h-2 rounded-full bg-primary" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-zinc-900 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-zinc-100 font-heading">Filtri Ricerca</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-white/5"
                >
                  <X size={20} className="text-zinc-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Age Range */}
                <div>
                  <label className="text-sm text-zinc-400 mb-3 block">Età</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-zinc-500 mb-1 block">Min</span>
                      <input
                        type="number"
                        value={localFilters.min_age || ''}
                        onChange={(e) => setLocalFilters({
                          ...localFilters,
                          min_age: e.target.value ? parseInt(e.target.value) : null
                        })}
                        placeholder="18"
                        min="18"
                        max="99"
                        className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-primary rounded-lg px-4 py-3 text-zinc-100"
                        data-testid="filter-min-age"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-zinc-500 mb-1 block">Max</span>
                      <input
                        type="number"
                        value={localFilters.max_age || ''}
                        onChange={(e) => setLocalFilters({
                          ...localFilters,
                          max_age: e.target.value ? parseInt(e.target.value) : null
                        })}
                        placeholder="65"
                        min="18"
                        max="99"
                        className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-primary rounded-lg px-4 py-3 text-zinc-100"
                        data-testid="filter-max-age"
                      />
                    </div>
                  </div>
                </div>

                {/* Distance Range */}
                <div>
                  <label className="text-sm text-zinc-400 mb-3 block">Distanza media preferita (km)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-zinc-500 mb-1 block">Min</span>
                      <input
                        type="number"
                        value={localFilters.min_distance || ''}
                        onChange={(e) => setLocalFilters({
                          ...localFilters,
                          min_distance: e.target.value ? parseInt(e.target.value) : null
                        })}
                        placeholder="20"
                        min="0"
                        className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-primary rounded-lg px-4 py-3 text-zinc-100"
                        data-testid="filter-min-distance"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-zinc-500 mb-1 block">Max</span>
                      <input
                        type="number"
                        value={localFilters.max_distance || ''}
                        onChange={(e) => setLocalFilters({
                          ...localFilters,
                          max_distance: e.target.value ? parseInt(e.target.value) : null
                        })}
                        placeholder="150"
                        min="0"
                        className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-primary rounded-lg px-4 py-3 text-zinc-100"
                        data-testid="filter-max-distance"
                      />
                    </div>
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="text-sm text-zinc-400 mb-3 block">Livello esperienza</label>
                  <div className="flex flex-wrap gap-2">
                    {experienceLevels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setLocalFilters({ ...localFilters, experience_level: level.value })}
                        className={`px-4 py-2 rounded-full border transition-all ${
                          localFilters.experience_level === level.value
                            ? 'bg-primary text-white border-primary'
                            : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                        }`}
                        data-testid={`filter-level-${level.value || 'all'}`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zone */}
                <div>
                  <label className="text-sm text-zinc-400 mb-3 block">Zona</label>
                  <div className="relative">
                    <select
                      value={localFilters.zone || ''}
                      onChange={(e) => setLocalFilters({ ...localFilters, zone: e.target.value })}
                      className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-primary rounded-lg px-4 py-3 text-zinc-100 appearance-none cursor-pointer"
                      data-testid="filter-zone"
                    >
                      <option value="">Tutte le zone</option>
                      {zones.filter(z => z).map((zone) => (
                        <option key={zone} value={zone}>{zone}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleReset}
                  className="flex-1 px-6 py-3 rounded-full border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
                  data-testid="reset-filters-btn"
                >
                  Reset
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 bg-primary text-white hover:bg-primary/90 rounded-full px-6 py-3 font-medium shadow-glow"
                  data-testid="apply-filters-btn"
                >
                  Applica Filtri
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
