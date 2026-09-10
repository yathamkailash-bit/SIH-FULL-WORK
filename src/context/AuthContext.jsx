import React, { createContext, useContext, useState, useEffect } from 'react';
import { broadcastDataUpdate } from '../services/firebase';

const AuthContext = createContext();

// Simple, secure PIN hashing using Web Crypto API (SHA-256)
const hashPin = async (pinStr) => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(pinStr + '_kalakriti_salt_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback simple obfuscation if crypto subtle is disabled
    return btoa(pinStr + '_salt');
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kalakriti_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('kalakriti_role') || 'artisan';
  });

  const [currentStep, setCurrentStep] = useState(() => {
    return localStorage.getItem('kalakriti_step') || 'splash';
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

  /**
   * Secure PIN login & Registration
   * - Hashes PIN before comparison/storage
   * - Accepts real user name
   * - Generic fallback ("New Artisan") instead of hardcoded person names
   */
  const loginWithPin = async (phoneOrEmail, pin, mode = 'login', name = '') => {
    const cleanIdentifier = String(phoneOrEmail).trim();
    const cleanPin = String(pin).trim();
    const cleanName = String(name).trim();

    if (!cleanIdentifier) {
      return { success: false, error: 'Please enter a mobile number or email' };
    }

    if (!cleanPin || cleanPin.length !== 4 || !/^\d{4}$/.test(cleanPin)) {
      return { success: false, error: 'Please enter a valid 4-digit numeric PIN' };
    }

    if (mode === 'register' && !cleanName) {
      return { success: false, error: 'Please enter your full name to register.' };
    }

    // Generic fallback name for missing data
    const fallbackName = role === 'artisan' ? 'New Artisan' : (role === 'admin' ? 'Admin Coordinator' : 'Customer User');

    // Hash the PIN before storing or matching
    const hashedPin = await hashPin(cleanPin);

    // Load registered users DB from localStorage / Firestore cache
    const savedUsersStr = localStorage.getItem('kalakriti_users_db');
    let usersDb = {};
    try {
      usersDb = savedUsersStr ? JSON.parse(savedUsersStr) : {};
    } catch {
      usersDb = {};
    }

    // Stable ID generator based on identifier
    const stableId = 'user-' + cleanIdentifier.replace(/[^a-zA-Z0-9]/g, '_');

    if (mode === 'register') {
      usersDb[cleanIdentifier] = {
        id: stableId,
        pinHash: hashedPin,
        role: role,
        name: cleanName || fallbackName,
        state: 'Andhra Pradesh',
        registeredAt: new Date().toISOString()
      };
      localStorage.setItem('kalakriti_users_db', JSON.stringify(usersDb));
      broadcastDataUpdate('users', [usersDb[cleanIdentifier]]);
      return { success: true, registered: true };
    } else {
      // Login mode - MUST check if user exists first!
      if (!usersDb[cleanIdentifier]) {
        return {
          success: false,
          error: 'No account found for this mobile number or email. Please register first.'
        };
      }

      const storedHash = usersDb[cleanIdentifier].pinHash || usersDb[cleanIdentifier].pin;
      // Verify PIN hash or legacy plaintext pin
      if (storedHash !== hashedPin && storedHash !== cleanPin) {
        return { success: false, error: 'Incorrect PIN for this account. Please try again.' };
      }
    }

    const matchedUser = usersDb[cleanIdentifier];
    const newUser = {
      id: matchedUser.id || stableId,
      identifier: cleanIdentifier,
      role: matchedUser.role || role,
      name: matchedUser.name || cleanName || fallbackName,
      state: matchedUser.state || 'Andhra Pradesh'
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
