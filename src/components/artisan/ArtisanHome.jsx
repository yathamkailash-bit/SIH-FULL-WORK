import React, { useState } from 'react';
import { Camera, Package, Mic, ChevronRight, HelpCircle, Settings, User } from 'lucide-react';
import { HeaderBar } from '../common/HeaderBar';
import { BottomNav } from '../common/BottomNav';
import { AddProductStepper } from './AddProductStepper';
import { ArtisanOrders } from './ArtisanOrders';
import { VoiceAssistantModal } from './VoiceAssistantModal';
import { BigOrderAlertModal } from './BigOrderAlertModal';
import { NotificationsView } from './NotificationsView';
import { BulkOrderTracker } from '../admin/BulkOrderTracker';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppData } from '../../context/AppDataContext';

export const ArtisanHome = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { products, showBigOrderAlert, setShowBigOrderAlert, acceptBulkShare } = useAppData();

  const [activeTab, setActiveTab] = useState('home');
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'add_product' | 'notifications' | 'bulk_tracker'
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const displayName = user?.name || t('artisan_title') || 'Artisan';
  const myProductsCount = products.filter(
    p => p.artisanId === user?.id || (p.artisanName && user?.name && p.artisanName.toLowerCase() === user.name.toLowerCase())
  ).length;

  const handleActionClick = (action) => {
    if (action === 'add_product') {
      setCurrentView('add_product');
    } else if (action === 'my_products') {
      setActiveTab('orders');
    } else if (action === 'speak_app') {
      setIsVoiceModalOpen(true);
    }
  };

  const handleVoiceActionTrigger = (action) => {
    if (action === 'add_product' || action === 'enhance_image' || action === 'create_description') {
      setCurrentView('add_product');
    } else if (action === 'view_orders') {
      setCurrentView('dashboard');
      setActiveTab('orders');
    } else if (action === 'view_products') {
      setCurrentView('dashboard');
      setActiveTab('orders');
    } else if (action === 'view_earnings' || action === 'view_sales') {
      setCurrentView('dashboard');
      setActiveTab('me');
    } else if (action === 'view_notifications') {
      setCurrentView('notifications');
    } else if (action === 'go_home') {
      setCurrentView('dashboard');
      setActiveTab('home');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FAF7F2] select-none min-h-full">
      <HeaderBar onOpenNotifications={() => setCurrentView('notifications')} />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col">
        {currentView === 'add_product' ? (
          <AddProductStepper
            onComplete={() => setCurrentView('dashboard')}
            onCancel={() => setCurrentView('dashboard')}
          />
        ) : currentView === 'notifications' ? (
          <NotificationsView
            onBack={() => setCurrentView('dashboard')}
            onNavigateBulkTracker={() => setCurrentView('bulk_tracker')}
          />
        ) : currentView === 'bulk_tracker' ? (
          <BulkOrderTracker onBack={() => setCurrentView('dashboard')} />
        ) : (
          /* TAB ROUTING */
          <div className="flex-1 flex flex-col">
            {activeTab === 'home' && (
              <div className="p-4 space-y-4">
                {/* Green Hero Card */}
                <div className="bg-emerald-800 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden flex items-center justify-between">
                  <div className="max-w-[210px] z-10">
                    <span className="text-[10px] font-bold tracking-widest text-emerald-200 uppercase block mb-1">
                      {t('welcome') || 'Welcome'}, {displayName}
                    </span>
                    <h2 className="text-xl font-extrabold leading-tight">
                      {t('grow_business')}
                    </h2>
                  </div>

                  <div className="w-20 h-20 rounded-full bg-emerald-700/60 border-2 border-emerald-400/30 flex items-center justify-center text-4xl shrink-0">
                    👨‍🌾
                  </div>
                </div>

                {/* Big Order Alert Trigger Banner */}
                <div
                  onClick={() => setShowBigOrderAlert(true)}
                  className="bg-amber-500 text-white rounded-2xl p-3.5 shadow-md flex items-center justify-between cursor-pointer hover:bg-amber-600 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-white animate-ping"></span>
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider block text-amber-100">
                        {t('new_big_order') || 'New Order Opportunity'}
                      </span>
                      <span className="text-sm font-extrabold">500 Wooden Toys Request</span>
                    </div>
                  </div>
                  <ChevronRight size={20} />
                </div>

                {/* Vertical Large Action Rows */}
                <div className="space-y-3 pt-2">
                  {/* Action 1: Add Product */}
                  <button
                    onClick={() => handleActionClick('add_product')}
                    className="w-full p-4 bg-white border border-stone-200 rounded-3xl shadow-md hover:border-emerald-600 flex items-center justify-between group active:scale-[0.99] transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Camera size={28} />
                      </div>
                      <div className="text-left">
                        <h3 className="text-base font-extrabold text-stone-900 group-hover:text-emerald-800">
                          {t('add_product')}
                        </h3>
                        <p className="text-xs font-semibold text-stone-500 mt-0.5">
                          {t('add_product_sub')}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={22} className="text-stone-400 group-hover:text-emerald-700 transition" />
                  </button>

                  {/* Action 2: My Products */}
                  <button
                    onClick={() => handleActionClick('my_products')}
                    className="w-full p-4 bg-white border border-stone-200 rounded-3xl shadow-md hover:border-emerald-600 flex items-center justify-between group active:scale-[0.99] transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                        <Package size={28} />
                      </div>
                      <div className="text-left">
                        <h3 className="text-base font-extrabold text-stone-900 group-hover:text-emerald-800">
                          {t('my_products')} ({myProductsCount})
                        </h3>
                        <p className="text-xs font-semibold text-stone-500 mt-0.5">
                          {t('my_products_sub')}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={22} className="text-stone-400 group-hover:text-emerald-700 transition" />
                  </button>

                  {/* Action 3: Speak to App */}
                  <button
                    onClick={() => handleActionClick('speak_app')}
                    className="w-full p-4 bg-white border-2 border-emerald-600/30 rounded-3xl shadow-md hover:border-emerald-600 flex items-center justify-between group active:scale-[0.99] transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md mic-pulse">
                        <Mic size={28} />
                      </div>
                      <div className="text-left">
                        <h3 className="text-base font-extrabold text-stone-900 group-hover:text-emerald-800">
                          {t('speak_app')}
                        </h3>
                        <p className="text-xs font-semibold text-stone-500 mt-0.5">
                          {t('speak_app_sub')}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={22} className="text-emerald-700 transition" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'orders' && <ArtisanOrders initialTab="active" />}
            {activeTab === 'requests' && <ArtisanOrders initialTab="requests" />}

            {/* "ME" TAB: Contains Profile, Earnings, Inventory, Help & Settings */}
            {activeTab === 'me' && (
              <div className="p-4 space-y-4">
                <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-md flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl font-extrabold shrink-0 border-2 border-emerald-300">
                    👨‍🌾
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-stone-900">{displayName}</h3>
                    <p className="text-xs font-semibold text-stone-500">Master Artisan • {user?.state || 'Andhra Pradesh'}</p>
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md mt-1">
                      Handcraft Specialist
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm text-center">
                    <span className="text-stone-400 text-xs font-bold block">Total Revenue</span>
                    <span className="text-xl font-extrabold text-emerald-800 mt-1 block">₹42,500</span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm text-center">
                    <span className="text-stone-400 text-xs font-bold block">Items Sold</span>
                    <span className="text-xl font-extrabold text-stone-900 mt-1 block">142 pcs</span>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-stone-200 shadow-md divide-y divide-stone-100 text-xs font-bold text-stone-700">
                  <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-stone-50">
                    <span className="flex items-center gap-3"><User size={18} className="text-emerald-700" /> Artisan Profile Details</span>
                    <ChevronRight size={18} className="text-stone-400" />
                  </div>
                  <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-stone-50">
                    <span className="flex items-center gap-3"><Package size={18} className="text-amber-700" /> Inventory & Craft Stock</span>
                    <ChevronRight size={18} className="text-stone-400" />
                  </div>
                  <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-stone-50">
                    <span className="flex items-center gap-3"><HelpCircle size={18} className="text-emerald-700" /> Help & Support</span>
                    <ChevronRight size={18} className="text-stone-400" />
                  </div>
                  <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-stone-50">
                    <span className="flex items-center gap-3"><Settings size={18} className="text-stone-500" /> App Settings</span>
                    <ChevronRight size={18} className="text-stone-400" />
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="w-full py-3 bg-red-50 text-red-700 hover:bg-red-100 rounded-2xl font-bold text-xs transition"
                >
                  Switch Role / Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      {currentView === 'dashboard' && (
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      {/* Modals */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onActionTrigger={handleVoiceActionTrigger}
      />

      <BigOrderAlertModal
        isOpen={showBigOrderAlert}
        onClose={() => setShowBigOrderAlert(false)}
        onAccept={() => acceptBulkShare(user?.id || 'art-1')}
      />
    </div>
  );
};
