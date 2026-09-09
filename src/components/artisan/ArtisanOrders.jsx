import React, { useState } from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useLanguage } from '../../context/LanguageContext';

export const ArtisanOrders = ({ initialTab = 'active' }) => {
  const { artisanOrders } = useAppData();
  const { t } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState(initialTab); // 'active' | 'completed' | 'requests'

  const filteredOrders = artisanOrders.filter(o => o.tab === activeSubTab);

  return (
    <div className="flex-1 flex flex-col bg-[#FAF7F2] p-4 select-none">
      <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight mb-4">
        {t('nav_orders')}
      </h2>

      {/* 3 Tabs: Active | Completed | Custom Requests */}
      <div className="flex bg-stone-200/80 p-1 rounded-2xl mb-4">
        {[
          { id: 'active', label: t('active') },
          { id: 'completed', label: t('completed') },
          { id: 'requests', label: t('custom_requests') }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === tab.id
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="flex-1 space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-stone-400 font-semibold text-xs">
            No orders in this category yet.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-4 border border-stone-200 shadow-md space-y-3"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <span className="text-xs font-extrabold text-stone-800">
                  {order.orderId}
                </span>
                <span className="text-[11px] font-bold text-stone-500">
                  Customer: {order.customerName}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={order.productImage}
                  alt={order.productName}
                  className="w-14 h-14 rounded-2xl object-cover border border-stone-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-extrabold text-stone-900 truncate">
                    {order.productName}
                  </h4>
                  <p className="text-xs font-semibold text-stone-500 mt-0.5">
                    Qty: {order.quantity} • Total: <span className="text-emerald-800 font-extrabold">₹{order.totalPrice.toLocaleString()}</span>
                  </p>
                </div>
              </div>

              {/* Status Section */}
              {activeSubTab === 'active' && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-700 flex items-center gap-1">
                      {order.statusIcon} {order.status}
                    </span>
                    <span className="text-stone-400 font-medium">{order.progressPercent}%</span>
                  </div>

                  {/* Slim Progress Bar */}
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${order.progressPercent}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-stone-400 font-medium text-right">
                    {order.deliveryDate}
                  </p>
                </div>
              )}

              {activeSubTab === 'completed' && (
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-2xl">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={16} /> {order.status}
                  </span>
                  <span className="text-[11px] text-stone-500 font-normal">{order.deliveryDate}</span>
                </div>
              )}

              {activeSubTab === 'requests' && (
                <div className="flex items-center justify-between text-xs font-bold text-amber-900 bg-amber-50 p-2.5 rounded-2xl">
                  <span className="flex items-center gap-1.5">
                    <Clock size={16} /> {order.status}
                  </span>
                  <span className="text-[11px] font-bold text-amber-800">{order.dueDate}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
