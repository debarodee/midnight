import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useEffect, useRef } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import PhoneAuth from './pages/auth/PhoneAuth';
import EmailAuth from './pages/auth/EmailAuth';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Domains from './pages/Domains';
import Assistant from './pages/Assistant';
import Journal from './pages/Journal';
import Settings from './pages/Settings';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import FAQ from './pages/FAQ';
import Layout from './components/Layout';
import ScrollToTop from './components/common/ScrollToTop';
import { onAuthChange, createUserDocument, handleRedirectResult } from './lib/firebase';

function App() {
  const { isAuthenticated, setUser, setLoading } = useAuthStore();
  const redirectHandled = useRef(false);

  useEffect(() => {
    // Handle redirect result (for mobile OAuth fallback)
    const checkRedirectResult = async () => {
      if (redirectHandled.current) return;
      redirectHandled.current = true;
      
      try {
        const user = await handleRedirectResult();
        if (user) {
          // User signed in via redirect - create user document
          await createUserDocument(user);
          setUser({
            id: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'User',
            photoURL: user.photoURL || undefined,
            createdAt: new Date(),
            settings: {
              theme: 'light',
              notifications: true,
              reminderTime: '09:00',
            },
          });
        }
      } catch (error) {
        console.error('Redirect result error:', error);
      }
    };
    
    checkRedirectResult();
  }, [setUser]);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in - create/get user document
        await createUserDocument(firebaseUser);
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          photoURL: firebaseUser.photoURL || undefined,
          createdAt: new Date(),
          settings: {
            theme: 'light',
            notifications: true,
            reminderTime: '09:00',
          },
        });
      } else {
        // User is signed out - only clear if not in demo mode
        const isDemoMode = useAuthStore.getState().isDemoMode;
        if (!isDemoMode) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/app" replace /> : <Landing />} 
        />
        
        {/* Auth routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/app" replace /> : <Login />} 
        />
        <Route 
          path="/login/phone" 
          element={isAuthenticated ? <Navigate to="/app" replace /> : <PhoneAuth />} 
        />
        <Route 
          path="/login/email" 
          element={isAuthenticated ? <Navigate to="/app" replace /> : <EmailAuth />} 
        />
        
        {/* Legal/Info pages */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/faq" element={<FAQ />} />
        
        {/* Protected routes */}
        <Route 
          path="/app" 
          element={isAuthenticated ? <Layout /> : <Navigate to="/" replace />}
        >
          <Route index element={<Dashboard />} />
          <Route path="goals" element={<Goals />} />
          <Route path="domains" element={<Domains />} />
          <Route path="domains/:domainType" element={<Domains />} />
          <Route path="assistant" element={<Assistant />} />
          <Route path="journal" element={<Journal />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
