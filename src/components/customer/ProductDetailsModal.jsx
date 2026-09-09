import React from 'react';
import { X, Heart, ShoppingBag, ShieldCheck, MapPin, Star } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useVoice } from '../../context/VoiceContext';
import { useLanguage } from '../../context/LanguageContext';

export const ProductDetailsModal = ({ product, isOpen, onClose }) => {
  const { favorites, toggleFavorite, addToCart } = useAppData();
  const { speakPrompt } = useVoice();
  const { language } = useLanguage();

  if (!isOpen || !product) return null;

  const isFav = favorites.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    speakPrompt(`Added ${product.name} to your cart.`);
  };

  const displayDescription = language === 'hi' && product.descriptionHi 
    ? product.descriptionHi 
    : (product.descriptionEn || product.description || 'Authentic Indian handcrafted product.');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center">
      <div className="w-full max-w-md bg-[#FAF7F2] rounded-t-[36px] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        {/* Sticky Header Bar */}
        <div className="px-5 py-3 bg-white border-b border-stone-200 flex items-center justify-between z-10">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Product Details</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
          {/* Main Image */}
          <div className="w-full h-64 rounded-3xl overflow-hidden bg-stone-100 relative shadow-md">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            
            <button
              onClick={() => toggleFavorite(product.id)}
              className={`absolute top-3 right-3 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center shadow-md ${
                isFav ? 'bg-red-50 text-red-500 border border-red-200' : 'bg-white/80 text-stone-600'
              }`}
            >
              <Heart size={20} fill={isFav ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Title & Artisan */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <MapPin size={14} />
              <span>{product.artisanLocation}</span>
              <span className="text-stone-300">•</span>
              <span className="flex items-center text-amber-600 font-bold">
                <Star size={12} fill="currentColor" className="mr-0.5" /> {product.rating} ({product.reviewsCount} reviews)
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-stone-900 mt-1">
              {product.name}
            </h2>

            <p className="text-xs font-bold text-stone-600 mt-1">
              Crafted by <span className="text-emerald-800 font-extrabold">{product.artisanName}</span>
            </p>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-3 p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-2xl font-extrabold text-stone-900">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-stone-400 line-through font-semibold">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
            {product.discountPercent && (
              <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Authenticity Guarantee Callout */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
            <ShieldCheck size={24} className="text-emerald-700 shrink-0" />
            <div className="text-xs font-semibold text-emerald-950">
              100% GI-Tagged Authenticity & Direct Artisan Fair Compensation Guarantee
            </div>
          </div>

          {/* Description & Story */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
              Craft Story & Materials
            </h4>
            <p className="text-xs text-stone-700 font-medium leading-relaxed bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
              {displayDescription}
            </p>
          </div>
        </div>

        {/* Bottom Pinned Action Bar */}
        <div className="p-4 bg-white border-t border-stone-200 flex gap-3 z-10">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition"
          >
            <ShoppingBag size={18} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
