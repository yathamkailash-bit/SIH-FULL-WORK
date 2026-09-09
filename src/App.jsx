import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { VoiceProvider } from './context/VoiceContext';
import { AppDataProvider } from './context/AppDataContext';

import { MobileFrame } from './components/common/MobileFrame';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Splash } from './components/auth/Splash';
import { LanguageSelection } from './components/auth/LanguageSelection';
import { RoleSelection } from './components/auth/RoleSelection';
import { AuthModal } from './components/auth/AuthModal';

import { ArtisanHome } from './components/artisan/ArtisanHome';
import { CustomerHome } from './components/customer/CustomerHome';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainRouter = () => {
  const { currentStep, role, setCurrentStep } = useAuth();

  // Sync state with URL hash routing so browser back button works cleanly
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (['splash', 'language', 'role', 'auth', 'home'].includes(hash)) {
        if (hash !== currentStep) {
          setCurrentStep(hash);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentStep, setCurrentStep]);

  useEffect(() => {
    if (window.location.hash !== `#/${currentStep}`) {
      window.history.pushState(null, '', `#/${currentStep}`);
    }
  }, [currentStep]);

  if (currentStep === 'splash') return <Splash />;
  if (currentStep === 'language') return <LanguageSelection />;
  if (currentStep === 'role') return <RoleSelection />;
  if (currentStep === 'auth') return <AuthModal />;

  // Home view by Role
  if (role === 'artisan') return <ArtisanHome />;
  if (role === 'customer') return <CustomerHome />;
  if (role === 'admin') return <AdminDashboard />;

  return <ArtisanHome />;
};

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <VoiceProvider>
          <AuthProvider>
            <AppDataProvider>
              <MobileFrame>
                <MainRouter />
              </MobileFrame>
            </AppDataProvider>
          </AuthProvider>
        </VoiceProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
