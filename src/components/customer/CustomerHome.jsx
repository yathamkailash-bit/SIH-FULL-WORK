import React, { useState } from 'react';
import { Search, Filter, Sparkles, Heart, Compass, Users, ShoppingCart, User, MapPin, ChevronRight, Package, HelpCircle, Settings, LogOut } from 'lucide-react';
import { HeaderBar } from '../common/HeaderBar';
import { BottomNav } from '../common/BottomNav';
import { CustomerProductCard } from './CustomerProductCard';
import { ProductDetailsModal } from './ProductDetailsModal';
import { CartView } from './CartView';
import { CustomerOrders } from './CustomerOrders';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const CustomerHome = () => {
  const { products, artisans, favorites, customerOrders, cart } = useAppData();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'explore' | 'artisans' | 'favorites' | 'cart' | 'profile' | 'orders'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = ['All', 'Kalamkari', 'Blue Pottery', 'Pashmina Weaving', 'Wooden Toys', 'Banarasi Silk', 'Pichwai'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.craft.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.artisanName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.craft.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div className="flex-1 flex flex-col bg-[#FAF7F2] select-none min-h-full">
      <HeaderBar />

      {/* Main Tab View Router */}
      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
        {activeTab === 'home' && (
          <div className="p-4 space-y-5">
            {/* Search Bar */}
            <div className="relative">
              <Search size={18} className="absolute left-4 top-3.5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200 rounded-2xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-emerald-600 shadow-sm"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-emerald-700 text-white shadow-md'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Hero Marketplace Banner */}
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
              <div className="max-w-[220px]">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200 block mb-1">
                  Direct From Master Artisans
                </span>
                <h2 className="text-xl font-extrabold leading-tight">
                  Every craft has a soul. Every thread tells a history.
                </h2>
                <p className="text-xs text-emerald-100 font-medium mt-1">
                  100% GI-Tagged Authenticity & Direct Artisan Support
                </p>
              </div>
            </div>

            {/* "Handcrafted For You" Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-extrabold text-stone-900 tracking-tight flex items-center gap-1.5">
                  <Sparkles size={18} className="text-amber-500" />
                  <span>{t('handcrafted_for_you')}</span>
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-emerald-800 hover:underline"
                >
                  My Orders
                </button>
              </div>

              {/* Product Cards Feed matching uploaded reference screenshots */}
              <div className="grid grid-cols-1 gap-4">
                {filteredProducts.map((prod) => (
                  <CustomerProductCard
                    key={prod.id}
                    product={prod}
                    onClick={() => setSelectedProduct(prod)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EXPLORE TAB */}
        {activeTab === 'explore' && (
          <div className="p-4 space-y-4">
            <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">Explore Crafts</h2>
            <div className="grid grid-cols-1 gap-4">
              {products.map((prod) => (
                <CustomerProductCard
                  key={prod.id}
                  product={prod}
                  onClick={() => setSelectedProduct(prod)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ARTISANS TAB */}
        {activeTab === 'artisans' && (
          <div className="p-4 space-y-4">
            <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">Master Artisans</h2>
            <div className="space-y-3">
              {artisans.map((artisan) => (
                <div key={artisan.id} className="bg-white rounded-3xl p-4 border border-stone-200 shadow-md flex items-center gap-4">
                  <img src={artisan.avatar} alt={artisan.name} className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-extrabold text-stone-900">{artisan.name}</h4>
                    <p className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                      <MapPin size={12} /> {artisan.location}
                    </p>
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md mt-1">
                      {artisan.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAVORITES TAB */}
        {activeTab === 'favorites' && (
          <div className="p-4 space-y-4">
            <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
              <Heart size={24} className="text-red-500 fill-current" />
              <span>Favorites ({favoriteProducts.length})</span>
            </h2>
            {favoriteProducts.length === 0 ? (
              <div className="py-16 text-center text-stone-400 font-semibold text-xs">
                No favorites saved yet. Tap ♡ on any product to save it here.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {favoriteProducts.map((prod) => (
                  <CustomerProductCard key={prod.id} product={prod} onClick={() => setSelectedProduct(prod)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* CART TAB */}
        {activeTab === 'cart' && <CartView onOrderPlaced={() => setActiveTab('orders')} />}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && <CustomerOrders />}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="p-4 space-y-4">
            {/* Customer Profile Card */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-md flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl font-extrabold shrink-0 border-2 border-emerald-300">
                🛍️
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-extrabold text-stone-900 truncate">
                  {user?.name || 'Samyuktha R.'}
                </h3>
                <p className="text-xs font-semibold text-stone-500">
                  {user?.identifier || '+91 9876543210'} • Customer
                </p>
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md mt-1">
                  Artisan Heritage Patron
                </span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              <div 
                onClick={() => setActiveTab('orders')}
                className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-xs text-center cursor-pointer hover:bg-stone-50 transition"
              >
                <span className="text-stone-400 text-[11px] font-bold block">Orders</span>
                <span className="text-lg font-extrabold text-emerald-800 mt-0.5 block">{customerOrders.length}</span>
              </div>
              <div 
                onClick={() => setActiveTab('favorites')}
                className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-xs text-center cursor-pointer hover:bg-stone-50 transition"
              >
                <span className="text-stone-400 text-[11px] font-bold block">Favorites</span>
                <span className="text-lg font-extrabold text-red-600 mt-0.5 block">{favorites.length}</span>
              </div>
              <div 
                onClick={() => setActiveTab('cart')}
                className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-xs text-center cursor-pointer hover:bg-stone-50 transition"
              >
                <span className="text-stone-400 text-[11px] font-bold block">In Cart</span>
                <span className="text-lg font-extrabold text-stone-900 mt-0.5 block">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
              </div>
            </div>

            {/* Customer Settings & Help Menu */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-md divide-y divide-stone-100 text-xs font-bold text-stone-700">
              <div 
                onClick={() => setActiveTab('orders')}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-stone-50"
              >
                <span className="flex items-center gap-3">
                  <Package size={18} className="text-emerald-700" />
                  <span>My Orders & Live Tracking</span>
                </span>
                <ChevronRight size={18} className="text-stone-400" />
              </div>
              <div 
                onClick={() => setActiveTab('favorites')}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-stone-50"
              >
                <span className="flex items-center gap-3">
                  <Heart size={18} className="text-red-500" />
                  <span>Saved Handicrafts</span>
                </span>
                <ChevronRight size={18} className="text-stone-400" />
              </div>
              <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-stone-50">
                <span className="flex items-center gap-3">
                  <HelpCircle size={18} className="text-emerald-700" />
                  <span>Customer Support & Fair Trade Policy</span>
                </span>
                <ChevronRight size={18} className="text-stone-400" />
              </div>
              <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-stone-50">
                <span className="flex items-center gap-3">
                  <Settings size={18} className="text-stone-500" />
                  <span>Preferences & Delivery Addresses</span>
                </span>
                <ChevronRight size={18} className="text-stone-400" />
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="w-full py-3.5 bg-red-50 text-red-700 hover:bg-red-100 active:scale-[0.99] rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              <span>Switch Role / Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Product Detail Drawer */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};
