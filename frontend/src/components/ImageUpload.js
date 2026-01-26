import React, { useState, useRef } from 'react';
import { Camera, X, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const ImageUpload = ({ 
  onUpload, 
  currentImage = null, 
  folder = 'gravelmatch',
  aspectRatio = 'square',
  placeholder = 'Carica immagine'
}) => {
  const { api } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const fileInputRef = useRef(null);

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]'
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Seleziona un file immagine');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Immagine troppo grande (max 10MB)');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`/api/upload/image?folder=${folder}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setPreview(response.data.url);
        onUpload && onUpload(response.data.url);
        toast.success('Immagine caricata!');
      }
    } catch (error) {
      toast.error('Errore nel caricamento');
      setPreview(currentImage);
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onUpload && onUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`relative ${aspectClasses[aspectRatio]} w-full rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-800 border-dashed`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        data-testid="image-upload-input"
      />

      {preview ? (
        <>
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
            data-testid="clear-image-btn"
          >
            <X size={16} className="text-white" />
          </button>
        </>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute inset-0 flex flex-col items-center justify-center hover:bg-zinc-800/50 transition-colors"
          data-testid="upload-trigger-btn"
        >
          {uploading ? (
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Camera size={32} className="text-zinc-600 mb-2" />
              <span className="text-sm text-zinc-500">{placeholder}</span>
            </>
          )}
        </button>
      )}

      {uploading && preview && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export const ProfilePictureUpload = ({ currentImage, onUpload }) => {
  const { api } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Seleziona un file immagine');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/api/upload/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setPreview(response.data.url);
        onUpload && onUpload(response.data.url);
        toast.success('Foto profilo aggiornata!');
      }
    } catch (error) {
      toast.error('Errore nel caricamento');
      setPreview(currentImage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        data-testid="profile-picture-input"
      />
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="w-24 h-24 rounded-full overflow-hidden bg-primary/20 cursor-pointer relative group"
      >
        {preview ? (
          <img src={preview} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera size={32} className="text-primary" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {uploading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload size={24} className="text-white" />
          )}
        </div>
      </div>
    </div>
  );
};
