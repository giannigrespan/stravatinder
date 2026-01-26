import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, Mountain, Ruler, MapPin, ChevronRight, Edit2, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BottomNav } from '../components/BottomNav';
import { ProfilePictureUpload } from '../components/ImageUpload';
import { NotificationBell, NotificationPanel } from '../components/Notifications';
import { toast } from 'sonner';

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    experience_level: user?.experience_level || '',
    avg_distance: user?.avg_distance || '',
    preferred_zone: user?.preferred_zone || '',
    age: user?.age || ''
  });
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Arrivederci!');
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({
        ...profile,
        avg_distance: profile.avg_distance ? parseInt(profile.avg_distance) : null,
        age: profile.age ? parseInt(profile.age) : null
      });
      setEditing(false);
      toast.success('Profilo aggiornato');
    } catch (error) {
      toast.error('Errore nel salvataggio');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpdate = (url) => {
    // Profile picture is updated directly via the API
  };

  const levelLabels = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    expert: 'Esperto'
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-white/5 px-4 py-4 z-40">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-100 font-heading">Profilo</h1>
          <div className="flex items-center gap-2">
            <NotificationBell />
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="p-2 rounded-full hover:bg-white/5 transition-colors"
                data-testid="edit-profile"
              >
                <Edit2 size={18} className="text-zinc-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      <NotificationPanel />

      <div className="px-4 py-6 space-y-6">
        {/* Profile Card with Picture Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl"
        >
          <ProfilePictureUpload 
            currentImage={user?.profile_picture}
            onUpload={handleProfilePictureUpdate}
          />
          <div>
            <h2 className="text-xl font-bold text-zinc-100">{user?.name}</h2>
            <p className="text-zinc-500">{user?.email}</p>
            {user?.age && <p className="text-sm text-zinc-400">{user.age} anni</p>}
          </div>
        </motion.div>

        {editing ? (
          /* Edit Form */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Nome</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 text-zinc-100 transition-all"
                data-testid="settings-name"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Età</label>
              <input
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 text-zinc-100 transition-all"
                placeholder="Es: 30"
                min="18"
                max="99"
                data-testid="settings-age"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 text-zinc-100 transition-all resize-none h-24"
                placeholder="Racconta qualcosa di te..."
                data-testid="settings-bio"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Livello</label>
              <select
                value={profile.experience_level}
                onChange={(e) => setProfile({ ...profile, experience_level: e.target.value })}
                className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 text-zinc-100 transition-all"
                data-testid="settings-level"
              >
                <option value="">Seleziona</option>
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="expert">Esperto</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Distanza media (km)</label>
              <input
                type="number"
                value={profile.avg_distance}
                onChange={(e) => setProfile({ ...profile, avg_distance: e.target.value })}
                className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 text-zinc-100 transition-all"
                placeholder="50"
                data-testid="settings-distance"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Zona preferita</label>
              <input
                type="text"
                value={profile.preferred_zone}
                onChange={(e) => setProfile({ ...profile, preferred_zone: e.target.value })}
                className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 text-zinc-100 transition-all"
                placeholder="Es: Toscana"
                data-testid="settings-zone"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setEditing(false)}
                className="flex-1 px-6 py-3 rounded-full border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-primary text-white hover:bg-primary/90 rounded-full px-6 py-3 font-medium disabled:opacity-50"
                data-testid="settings-save"
              >
                {loading ? 'Salvando...' : 'Salva'}
              </button>
            </div>
          </motion.div>
        ) : (
          /* Profile Info */
          <div className="space-y-4">
            {user?.bio && (
              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <p className="text-zinc-300">{user.bio}</p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <Mountain size={18} className="text-primary" />
                  <span className="text-zinc-400">Livello</span>
                </div>
                <span className="text-zinc-200">{levelLabels[user?.experience_level] || 'Non impostato'}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <Ruler size={18} className="text-primary" />
                  <span className="text-zinc-400">Distanza media</span>
                </div>
                <span className="text-zinc-200 font-mono">{user?.avg_distance ? `${user.avg_distance} km` : 'Non impostato'}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-primary" />
                  <span className="text-zinc-400">Zona</span>
                </div>
                <span className="text-zinc-200">{user?.preferred_zone || 'Non impostato'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        {!editing && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-red-500/50 transition-colors group"
            data-testid="logout-btn"
          >
            <div className="flex items-center gap-3">
              <LogOut size={18} className="text-red-400" />
              <span className="text-red-400">Esci</span>
            </div>
            <ChevronRight size={18} className="text-zinc-600 group-hover:text-red-400" />
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
