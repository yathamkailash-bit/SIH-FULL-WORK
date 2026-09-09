import React, { useState } from 'react';
import { ShieldCheck, Users, Package, LogOut } from 'lucide-react';
import { BulkOrderTracker } from './BulkOrderTracker';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';

export const AdminDashboard = () => {
  const { logout } = useAuth();
  const { artisans, products } = useAppData();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'bulk_order' | 'artisans' | 'reports'

  return (
    <div className="flex-1 flex flex-col bg-[#FAF7F2] select-none min-h-full">
      {/* Admin Header Bar */}
      <header className="sticky top-0 z-30 bg-stone-900 text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight">KalaKriti Platform Admin</h1>
            <p className="text-[9px] font-semibold text-stone-400 uppercase">COORDINATOR CONTROL</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="text-xs font-bold text-stone-300 hover:text-white flex items-center gap-1 bg-stone-800 px-2.5 py-1 rounded-lg"
        >
          <LogOut size={14} /> Exit Admin
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto no-scrollbar">
        {activeTab === 'bulk_order' ? (
          <BulkOrderTracker onBack={() => setActiveTab('dashboard')} />
        ) : (
          <div className="space-y-4">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-white rounded-3xl border border-stone-200 shadow-md">
                <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
                  <Users size={18} />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block">Registered Artisans</span>
                <span className="text-2xl font-extrabold text-stone-900 mt-0.5 block">{artisans.length + 12}</span>
              </div>

              <div className="p-4 bg-white rounded-3xl border border-stone-200 shadow-md">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mb-2">
                  <Package size={18} />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block">Listed Handicrafts</span>
                <span className="text-2xl font-extrabold text-stone-900 mt-0.5 block">{products.length}</span>
              </div>
            </div>

            {/* Bulk Order Splitting Spotlight */}
            <div
              onClick={() => setActiveTab('bulk_order')}
              className="bg-emerald-800 text-white rounded-3xl p-5 shadow-xl cursor-pointer hover:bg-emerald-900 transition flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200 block mb-1">
                  Active Multi-Artisan Order
                </span>
                <h3 className="text-lg font-extrabold">Bulk Order: 500 Wooden Toys</h3>
                <p className="text-xs text-emerald-100 font-medium mt-0.5">
                  Split across 5 master artisans in Andhra Pradesh (90% completed)
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold shrink-0">
                →
              </div>
            </div>

            {/* Admin Management Section */}
            <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-md space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-400 border-b border-stone-100 pb-2">
                Platform Management Capabilities
              </h3>

              <div className="space-y-2 text-xs font-bold text-stone-700">
                <div className="p-3 bg-stone-50 rounded-2xl flex justify-between items-center">
                  <span>Artisan Verification & Onboarding</span>
                  <span className="text-emerald-700 font-extrabold">Active</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-2xl flex justify-between items-center">
                  <span>State Labour Rate Index Database</span>
                  <span className="text-emerald-700 font-extrabold">10 States Configured</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-2xl flex justify-between items-center">
                  <span>Bulk Order Splitter Engine</span>
                  <span className="text-emerald-700 font-extrabold">Ready</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
