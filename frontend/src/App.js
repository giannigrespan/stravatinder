import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './components/Notifications';
import { Toaster } from 'sonner';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileSetup from './pages/ProfileSetup';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import Chat from './pages/Chat';
import CreateRoute from './pages/CreateRoute';
import RouteDetail from './pages/RouteDetail';
import Settings from './pages/Settings';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/home" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/profile-setup" element={<PrivateRoute><ProfileSetup /></PrivateRoute>} />
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/discover" element={<PrivateRoute><Discover /></PrivateRoute>} />
      <Route path="/matches" element={<PrivateRoute><Matches /></PrivateRoute>} />
      <Route path="/chat/:matchId" element={<PrivateRoute><Chat /></PrivateRoute>} />
      <Route path="/create-route" element={<PrivateRoute><CreateRoute /></PrivateRoute>} />
      <Route path="/route/:routeId" element={<PrivateRoute><RouteDetail /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <NotificationProvider>
          <div className="min-h-screen bg-background">
            <AppRoutes />
            <Toaster 
              position="top-center" 
              toastOptions={{
                style: {
                  background: '#18181b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#F4F4F5'
                }
              }}
            />
          </div>
        </NotificationProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
