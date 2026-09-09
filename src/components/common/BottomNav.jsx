import React from 'react';
import { Home, Package, MessageSquare, User, Compass, Heart, ShoppingCart, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppData } from '../../context/AppDataContext';

export const BottomNav = ({ activeTab, setActiveTab }) => {
  const { role } = useAuth();
  const { t } = useLanguage();
  const { cart } = useAppData();

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (role === 'artisan') {
    const artisanTabs = [
      { id: 'home', label: t('nav_home'), icon: Home },
      { id: 'orders', label: t('nav_orders'), icon: Package },
      { id: 'requests', label: t('nav_requests'), icon: MessageSquare },
      { id: 'me', label: t('nav_me'), icon: User }
    ];

    return (
      <nav className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 px-3 py-2 flex items-center justify-around shadow-lg">
        {artisanTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 transition-all px-3 py-1 rounded-xl ${
                isActive 
                  ? 'text-emerald-700 font-bold bg-emerald-50 scale-105' 
                  : 'text-stone-500 font-medium hover:text-stone-800'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[11px] leading-none">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    );
  }

  // Customer Navigation (6 tabs: Home, Explore, Artisans, Favorites, Cart, Profile)
  const customerTabs = [
    { id: 'home', label: t('nav_home'), icon: Home },
    { id: 'explore', label: t('nav_explore'), icon: Compass },
    { id: 'artisans', label: t('nav_artisans'), icon: Users },
    { id: 'favorites', label: t('nav_favorites'), icon: Heart },
    { id: 'cart', label: t('nav_cart'), icon: ShoppingCart, badge: cartItemsCount },
    { id: 'profile', label: t('nav_profile'), icon: User }
  ];

  return (
    <nav className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-2 flex items-center justify-around shadow-lg">
      {customerTabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all px-2.5 py-1 rounded-xl relative ${
              isActive 
                ? 'text-emerald-700 font-bold bg-emerald-50 scale-105' 
                : 'text-stone-500 font-medium hover:text-stone-800'
            }`}
          >
            <div className="relative">
              <Icon size={21} strokeWidth={isActive ? 2.5 : 1.8} />
              {tab.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] leading-none">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
