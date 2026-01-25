import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function Chat() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { api, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [matchUser, setMatchUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    fetchMatchInfo();
  }, [matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMatchInfo = async () => {
    try {
      const response = await api.get('/api/matches');
      const match = response.data.find(m => m.id === matchId);
      if (match) {
        setMatchUser(match.user);
      }
    } catch (error) {
      console.error('Error fetching match info');
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/api/chat/${matchId}`);
      setMessages(response.data);
    } catch (error) {
      toast.error('Errore nel caricamento messaggi');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await api.post('/api/chat', {
        match_id: matchId,
        content: newMessage.trim()
      });
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      toast.error('Errore nell\'invio');
    } finally {
      setSending(false);
    }
  };

  const getAiIcebreaker = async () => {
    if (!matchUser) return;
    try {
      const response = await api.get(`/api/ai/match-tips?target_user_id=${matchUser.id}`);
      setNewMessage(response.data.tips.split('\n')[0] || 'Ciao! Come va?');
    } catch (error) {
      setNewMessage('Ciao! Ho visto che anche tu sei appassionato di gravel!');
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-4">
        <button
          onClick={() => navigate('/matches')}
          className="p-2 -ml-2 rounded-full hover:bg-white/5"
          data-testid="chat-back"
        >
          <ArrowLeft size={20} className="text-zinc-400" />
        </button>
        
        {matchUser && (
          <div className="flex items-center gap-3">
            <img
              src={matchUser.profile_picture || 'https://images.unsplash.com/photo-1764532436308-34b8f462315c?w=100'}
              alt={matchUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="font-semibold text-zinc-100">{matchUser.name}</h2>
              <p className="text-xs text-zinc-500">{matchUser.preferred_zone || 'Italia'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex ${msg.is_mine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                  msg.is_mine
                    ? 'bg-primary text-white rounded-br-md'
                    : 'bg-zinc-800 text-zinc-200 rounded-bl-md'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.is_mine ? 'text-white/60' : 'text-zinc-500'}`}>
                  {new Date(msg.created_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-zinc-500 mb-4">Nessun messaggio ancora</p>
            <button
              onClick={getAiIcebreaker}
              className="flex items-center gap-2 text-accent hover:underline"
              data-testid="ai-icebreaker"
            >
              <Sparkles size={16} />
              Suggeriscimi un messaggio
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-white/5 bg-background">
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Scrivi un messaggio..."
            className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-primary focus:ring-1 focus:ring-primary rounded-full px-5 py-3 text-zinc-100 placeholder:text-zinc-600 transition-all"
            data-testid="chat-input"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="w-12 h-12 rounded-full bg-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
            data-testid="chat-send"
          >
            {sending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={18} className="text-white" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
