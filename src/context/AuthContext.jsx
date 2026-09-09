import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kalakriti_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('kalakriti_role') || 'artisan';
  });

  const [currentStep, setCurrentStep] = useState(() => {
    return localStorage.getItem('kalakriti_step') || 'splash'; // splash -> language -> role -> auth -> home
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('kalakriti_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kalakriti_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('kalakriti_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('kalakriti_step', currentStep);
  }, [currentStep]);

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
  };

  // NOTE: Mocked auth for hackathon demo — replace with real backend auth before production.
  const loginWithPin = (phoneOrEmail, pin, mode = 'login') => {
    const cleanIdentifier = String(phoneOrEmail).trim();
    const cleanPin = String(pin).trim();

    if (!cleanIdentifier) {
      return { success: false, error: 'Please enter a mobile number or email' };
    }

    if (!cleanPin || cleanPin.length !== 4 || !/^\d{4}$/.test(cleanPin)) {
      return { success: false, error: 'Please enter a valid 4-digit numeric PIN' };
    }

    // Load registered users DB from localStorage
    const savedUsersStr = localStorage.getItem('kalakriti_users_db');
    let usersDb = {};
    try {
      usersDb = savedUsersStr ? JSON.parse(savedUsersStr) : {};
    } catch {
      usersDb = {};
    }

    const defaultName = role === 'artisan' ? 'Govindappa V.' : (role === 'admin' ? 'Admin Coordinator' : 'Samyuktha R.');

    if (mode === 'register') {
      // Register new user or update PIN
      usersDb[cleanIdentifier] = {
        pin: cleanPin,
        role: role,
        name: defaultName,
        state: 'Andhra Pradesh'
      };
      localStorage.setItem('kalakriti_users_db', JSON.stringify(usersDb));
    } else {
      // Login mode - if user exists, verify PIN
      if (usersDb[cleanIdentifier]) {
        if (usersDb[cleanIdentifier].pin !== cleanPin) {
          return { success: false, error: 'Incorrect PIN for this account. Please try again.' };
        }
      } else {
        // Auto-save initial record for smooth onboarding if not yet in DB
        usersDb[cleanIdentifier] = {
          pin: cleanPin,
          role: role,
          name: defaultName,
          state: 'Andhra Pradesh'
        };
        localStorage.setItem('kalakriti_users_db', JSON.stringify(usersDb));
      }
    }

    const matchedUser = usersDb[cleanIdentifier];
    const newUser = {
      id: 'user-' + Date.now(),
      identifier: cleanIdentifier,
      role: role,
      name: matchedUser?.name || defaultName,
      state: matchedUser?.state || 'Andhra Pradesh'
    };

    setUser(newUser);
    setCurrentStep('home');
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setCurrentStep('role');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        currentStep,
        setCurrentStep,
        selectRole,
        loginWithPin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
