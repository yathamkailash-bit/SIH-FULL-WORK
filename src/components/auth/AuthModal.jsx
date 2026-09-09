import React, { useState } from 'react';
import { ChevronLeft, Lock, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const AuthModal = () => {
  const { role, setCurrentStep, loginWithPin } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [identifier, setIdentifier] = useState('9876543210');
  const [pin, setPin] = useState('');
  const [authError, setAuthError] = useState(null);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setAuthError(null);
    if (pin.length !== 4) {
      setAuthError("Please enter a 4-digit numeric PIN");
      return;
    }
    const result = loginWithPin(identifier, pin, mode);
    if (result && !result.success) {
      setAuthError(result.error || "Authentication failed. Please check your PIN.");
    }
  };

  const handlePinClick = (num) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
    }
  };

  const handlePinDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-[#FAF7F2] select-none">
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentStep('role')}
            className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-2xs hover:bg-stone-50"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full capitalize">
            {role} Portal
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-xs text-stone-500 font-medium mt-1">
          {mode === 'login' ? 'Enter your registered phone & 4-digit PIN' : 'Quick register with phone & 4-digit PIN'}
        </p>

        {/* Auth Mode Switcher Tabs */}
        <div className="flex bg-stone-200/70 p-1 rounded-xl mt-4">
          <button
            onClick={() => { setMode('login'); setAuthError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              mode === 'login' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setMode('register'); setAuthError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              mode === 'register' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-semibold text-center animate-in fade-in duration-200">
            {authError}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Mobile Number / Email
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-3.5 top-3 text-stone-400" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm font-semibold text-stone-900 focus:outline-none focus:border-emerald-600"
                placeholder="Enter mobile number"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              4-Digit PIN
            </label>
            {/* PIN Display */}
            <div className="flex justify-center gap-3 my-2">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-11 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-extrabold transition ${
                    pin[idx]
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : 'bg-white border-stone-300 text-stone-400'
                  }`}
                >
                  {pin[idx] ? '•' : ''}
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Keypad for low-literacy friction-free PIN entry */}
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mt-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePinClick(String(num))}
              className="py-3 bg-white border border-stone-200 rounded-2xl text-lg font-bold text-stone-800 hover:bg-emerald-50 active:scale-95 transition shadow-2xs"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handlePinDelete}
            className="py-3 bg-stone-100 border border-stone-200 rounded-2xl text-xs font-bold text-stone-600 hover:bg-stone-200 active:scale-95 transition"
          >
            Delete
          </button>
          <button
            onClick={() => handlePinClick('0')}
            className="py-3 bg-white border border-stone-200 rounded-2xl text-lg font-bold text-stone-800 hover:bg-emerald-50 active:scale-95 transition shadow-2xs"
          >
            0
          </button>
          <button
            onClick={() => setPin('')}
            className="py-3 bg-stone-100 border border-stone-200 rounded-2xl text-xs font-bold text-stone-600 hover:bg-stone-200 active:scale-95 transition"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="pt-4 pb-2">
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white rounded-2xl font-bold text-base shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition"
        >
          <span>{mode === 'login' ? 'Login' : 'Complete Registration'}</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
