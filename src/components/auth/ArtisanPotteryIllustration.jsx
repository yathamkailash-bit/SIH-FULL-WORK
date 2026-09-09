import React from 'react';

export const ArtisanPotteryIllustration = ({ className = "w-full h-full" }) => {
  return (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background Soft Circle */}
      <circle cx="200" cy="200" r="180" fill="#FEF3C7" opacity="0.6" />

      {/* Background House and Plants */}
      <path d="M70 230 L110 180 L150 230 V290 H70 Z" fill="#FDBA74" opacity="0.7" />
      <path d="M95 230 H125 V290 H95 Z" fill="#78350F" opacity="0.6" />
      <path d="M120 200 L150 160 L180 200 Z" fill="#FB923C" opacity="0.6" />

      {/* Decorative Foliage & Plants */}
      <path d="M40 280 Q60 220 80 280 Q100 230 110 290 Z" fill="#15803D" opacity="0.8" />
      <path d="M290 280 Q320 200 340 290 Q360 210 380 300 Z" fill="#166534" opacity="0.8" />

      {/* Pottery Wheel & Table */}
      <ellipse cx="200" cy="330" rx="140" ry="25" fill="#D97706" />
      <ellipse cx="200" cy="320" rx="110" ry="18" fill="#B45309" />
      <ellipse cx="200" cy="305" rx="70" ry="12" fill="#78350F" />

      {/* Artisan Pottery Terracotta Pot */}
      <path d="M170 305 C160 260 160 240 180 220 C190 210 210 210 220 220 C240 240 240 260 230 305 Z" fill="#EA580C" />
      <ellipse cx="200" cy="220" rx="20" ry="6" fill="#C2410C" />
      <path d="M175 255 Q200 270 225 255" stroke="#FDE68A" strokeWidth="4" strokeLinecap="round" />

      {/* Artisan Woman Figure */}
      {/* Hair & Head */}
      <circle cx="200" cy="120" r="32" fill="#1C1917" />
      <circle cx="230" cy="130" r="16" fill="#1C1917" /> {/* Bun */}
      <ellipse cx="195" cy="125" rx="20" ry="22" fill="#A16207" /> {/* Face Skin Tone */}

      {/* Traditional Bindi and Smile */}
      <circle cx="184" cy="122" r="2.5" fill="#DC2626" />
      <path d="M180 134 Q186 138 192 134" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />

      {/* Saree Outfit */}
      <path d="M150 170 C160 145 230 145 240 170 L260 280 H130 Z" fill="#047857" />
      <path d="M165 170 L210 280 H235 L190 170 Z" fill="#F59E0B" /> {/* Saree Pallu Accent */}

      {/* Arms Shaping Pottery */}
      <path d="M160 180 Q165 240 182 235" stroke="#A16207" strokeWidth="12" strokeLinecap="round" />
      <path d="M230 180 Q225 240 218 235" stroke="#A16207" strokeWidth="12" strokeLinecap="round" />

      {/* Bangles */}
      <circle cx="178" cy="228" r="7" fill="none" stroke="#F59E0B" strokeWidth="3" />
      <circle cx="222" cy="228" r="7" fill="none" stroke="#F59E0B" strokeWidth="3" />
    </svg>
  );
};
