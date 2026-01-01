import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useEffect, useRef, useState } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import PhoneAuth from './pages/auth/PhoneAuth';
import EmailAuth from './pages/auth/EmailAuth';
import Onboarding from './pages/Onboarding';
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
import { onAuthChange, createUserDocument, handleRedirectResult, getUserDocument } from './lib/firebase';
import { Loader2 } from 'lucide-react';

// Protected Route Component that checks onboarding status
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!isAuthenticated || !user) {
        setCheckingOnboarding(false);
        return;
      }

      try {
        const userDoc = await getUserDocument(user.id);
        const hasCompletedOnboarding = userDoc?.hasCompletedOnboarding ?? false;
        
        // Update user in store with onboarding status
        if (userDoc) {
          useAuthStore.getState().setUser({
            ...user,
            displayName: userDoc.displayName || user.displayName,
            hasCompletedOnboarding,
            onboarding: userDoc.onboarding || null,
          });
        }

        // If user hasn't completed onboarding and not already on onboarding page, redirect
        if (!hasCompletedOnboarding && location.pathname !== '/onboarding') {
          // Will be handled by route guard
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setCheckingOnboarding(false);
      }
    };

    if (!isLoading) {
      checkOnboarding();
    }
  }, [isAuthenticated, user, isLoading, location.pathname]);

  if (checkingOnboarding || isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-cyan animate-spin" />
          <p className="text-white/60 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check if user needs onboarding
  const needsOnboarding = !user?.hasCompletedOnboarding;
  if (needsOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (!needsOnboarding && location.pathname === '/onboarding') {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}

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
          const userDoc = await getUserDocument(user.uid);
          setUser({
            id: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || '',
            photoURL: user.photoURL || undefined,
            createdAt: new Date(),
            hasCompletedOnboarding: userDoc?.hasCompletedOnboarding ?? false,
            onboarding: userDoc?.onboarding || null,
            settings: userDoc?.settings || {
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
        const userDoc = await getUserDocument(firebaseUser.uid);
        
        // Get display name with fallback: (1) auth displayName, (2) email prefix, (3) empty string
        let displayName = '';
        if (firebaseUser.displayName) {
          displayName = firebaseUser.displayName;
        } else if (firebaseUser.email) {
          displayName = firebaseUser.email.split('@')[0];
        }
        
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName,
          photoURL: firebaseUser.photoURL || undefined,
          createdAt: new Date(),
          hasCompletedOnboarding: userDoc?.hasCompletedOnboarding ?? false,
          onboarding: userDoc?.onboarding || null,
          settings: userDoc?.settings || {
            theme: 'light',
            notifications: true,
            reminderTime: '09:00',
          },
        });
      } else {
        // User is signed out
        setUser(null);
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
        
        {/* Onboarding route */}
        <Route 
          path="/onboarding" 
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected routes */}
        <Route 
          path="/app" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
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
