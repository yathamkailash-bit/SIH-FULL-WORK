import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ARTISANS, 
  INITIAL_ARTISAN_ORDERS, 
  BULK_ORDER_DATA, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';
import { subscribeToRealtimeCollection, broadcastDataUpdate } from '../services/firebase';
import { storeProductImage } from '../services/storageService';

const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('kalakriti_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [artisanOrders, _setArtisanOrders] = useState(() => {
    const saved = localStorage.getItem('kalakriti_artisan_orders');
    return saved ? JSON.parse(saved) : INITIAL_ARTISAN_ORDERS;
  });

  const [bulkOrder, setBulkOrder] = useState(() => {
    const saved = localStorage.getItem('kalakriti_bulk_order');
    return saved ? JSON.parse(saved) : BULK_ORDER_DATA;
  });

  const [notifications, _setNotifications] = useState(() => {
    const saved = localStorage.getItem('kalakriti_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('kalakriti_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('kalakriti_favorites');
    return saved ? JSON.parse(saved) : ['prod-1', 'prod-3'];
  });

  const [customerOrders, setCustomerOrders] = useState(() => {
    const saved = localStorage.getItem('kalakriti_customer_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'cust-ord-1',
        orderNumber: 'KK-CUST-8812',
        date: '2026-09-02',
        items: [INITIAL_PRODUCTS[0]],
        totalAmount: 3450,
        status: 'In Production',
        trackingSteps: [
          { label: 'Order Placed', done: true, date: 'Sep 2' },
          { label: 'Confirmed', done: true, date: 'Sep 2' },
          { label: 'In Production', active: true, date: 'Sep 3' },
          { label: 'Shipped', done: false },
          { label: 'Delivered', done: false }
        ]
      }
    ];
  });

  const [showBigOrderAlert, setShowBigOrderAlert] = useState(false);

  // Sync state to local storage and cross-device/tab Firestore
  useEffect(() => {
    localStorage.setItem('kalakriti_products', JSON.stringify(products));
    broadcastDataUpdate('products', products);
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kalakriti_artisan_orders', JSON.stringify(artisanOrders));
    broadcastDataUpdate('artisan_orders', artisanOrders);
  }, [artisanOrders]);

  useEffect(() => {
    localStorage.setItem('kalakriti_bulk_order', JSON.stringify(bulkOrder));
  }, [bulkOrder]);

  useEffect(() => {
    localStorage.setItem('kalakriti_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('kalakriti_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('kalakriti_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('kalakriti_customer_orders', JSON.stringify(customerOrders));
    broadcastDataUpdate('customer_orders', customerOrders);
  }, [customerOrders]);

  // Firestore Realtime Subscription Listeners
  useEffect(() => {
    const unsubProducts = subscribeToRealtimeCollection('products', (updatedProducts) => {
      setProducts(updatedProducts);
    });

    const unsubOrders = subscribeToRealtimeCollection('customer_orders', (updatedOrders) => {
      setCustomerOrders(updatedOrders);
    });

    return () => {
      if (unsubProducts) unsubProducts();
      if (unsubOrders) unsubOrders();
    };
  }, []);

  const addProduct = async (newProd) => {
    const prodId = 'prod-' + Date.now();
    // Convert base64 data URLs to Firebase Storage URL or Blob URL to prevent localStorage quota crashes
    const imageUrl = await storeProductImage(newProd.image, prodId);

    const created = {
      id: prodId,
      ...newProd,
      image: imageUrl,
      descriptionEn: newProd.descriptionEn || newProd.description || '',
      descriptionHi: newProd.descriptionHi || newProd.description || ''
    };

    setProducts(prev => [created, ...prev]);
    return created;
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const increaseQuantity = (productId) => {
    setCart(prev => 
      prev.map(item => 
        item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCart(prev => 
      prev
        .map(item => 
          item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const placeCustomerOrder = () => {
    if (cart.length === 0) return null;
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const newOrder = {
      id: 'cust-ord-' + Date.now(),
      orderNumber: 'KK-CUST-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString().split('T')[0],
      items: cart.map(c => c.product),
      totalAmount: total,
      status: 'Order Placed',
      trackingSteps: [
        { label: 'Order Placed', active: true, date: 'Just now' },
        { label: 'Confirmed', done: false },
        { label: 'In Production', done: false },
        { label: 'Shipped', done: false },
        { label: 'Delivered', done: false }
      ]
    };
    setCustomerOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const acceptBulkShare = (artisanId = 'art-1') => {
    setBulkOrder(prev => ({
      ...prev,
      artisans: prev.artisans.map(a => a.id === artisanId ? { ...a, status: 'Accepted & In Progress' } : a)
    }));
    setShowBigOrderAlert(false);
  };

  return (
    <AppDataContext.Provider
      value={{
        products,
        artisanOrders,
        bulkOrder,
        notifications,
        cart,
        favorites,
        customerOrders,
        showBigOrderAlert,
        setShowBigOrderAlert,
        addProduct,
        toggleFavorite,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        placeCustomerOrder,
        acceptBulkShare,
        artisans: INITIAL_ARTISANS
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppData = () => useContext(AppDataContext);
