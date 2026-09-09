export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Hand-Painted Tree of Life Kalamkari Wall Hanging',
    artisanName: 'Venkat Rao',
    artisanId: 'art-1',
    artisanLocation: 'Andhra Pradesh',
    craft: 'Kalamkari',
    tags: ['Kalamkari', 'Organic Khadi Cotton & Veg Dyes', 'Andhra Pradesh'],
    price: 3450,
    originalPrice: 4200,
    discountPercent: 18,
    rating: 4.9,
    reviewsCount: 34,
    image: 'https://images.unsplash.com/photo-1606744888344-493238951221?auto=format&fit=crop&w=800&q=80',
    description: 'Masterwork hand-painted with tamarind twig bamboo pen using 100% natural vegetable dyes on unbleached organic Khadi cotton.',
    material: 'Organic Khadi Cotton & Natural Dyes',
    inStock: true,
    isFeatured: true
  },
  {
    id: 'prod-2',
    name: 'Traditional Floral Motifs Blue Pottery Serving Bowl',
    artisanName: 'Kripal Singh Kripal',
    artisanId: 'art-2',
    artisanLocation: 'Rajasthan',
    craft: 'Blue Pottery',
    tags: ['Blue Pottery', 'Quartz & Fuller Earth', 'Rajasthan'],
    price: 1850,
    originalPrice: 2200,
    discountPercent: 16,
    rating: 4.8,
    reviewsCount: 28,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
    description: 'Hand-moulded low-fire quartz glaze bowl featuring classic cobalt floral motifs passed down through generational masters.',
    material: 'Quartz Powder, Multani Mitti, Glaze',
    inStock: true,
    isFeatured: true
  },
  {
    id: 'prod-3',
    name: 'Pure Cashmere Sozni Embroidered Floral Stole',
    artisanName: 'Rashida Begum',
    artisanId: 'art-3',
    artisanLocation: 'Jammu & Kashmir',
    craft: 'Pashmina Weaving',
    tags: ['Pashmina Weaving', 'Fine Sozni Needlework', 'Kashmir'],
    price: 12500,
    originalPrice: 15000,
    discountPercent: 17,
    rating: 5.0,
    reviewsCount: 52,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    description: 'Woven from authentic Changthangi goat Pashmina, hand-embroidered with dense Sozni needlework across 90 days.',
    material: '100% Pure Pashmina Cashmere Wool',
    inStock: true,
    isFeatured: true
  },
  {
    id: 'prod-4',
    name: 'Kondapalli Wooden Dancing Doll & Elephant Set',
    artisanName: 'Venkat Rao',
    artisanId: 'art-1',
    artisanLocation: 'Andhra Pradesh',
    craft: 'Wooden Toys',
    tags: ['Handmade', 'Kondapalli', 'Andhra Pradesh'],
    price: 650,
    originalPrice: 800,
    discountPercent: 19,
    rating: 4.7,
    reviewsCount: 19,
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    description: 'Crafted from lightweight Tella Poniki wood, painted with non-toxic natural colors depicting classic Indian folklore.',
    material: 'Tella Poniki Softwood & Natural Pigments',
    inStock: true,
    isFeatured: false
  },
  {
    id: 'prod-5',
    name: 'Handwoven Banarasi Pure Zari Silk Brocade Saree',
    artisanName: 'Rameshwar Prasad',
    artisanId: 'art-4',
    artisanLocation: 'Uttar Pradesh',
    craft: 'Varanasi Weaving',
    tags: ['Banarasi Silk', 'Gold Zari', 'Uttar Pradesh'],
    price: 8900,
    originalPrice: 11000,
    discountPercent: 19,
    rating: 4.9,
    reviewsCount: 41,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    description: 'Heritage handloom Banarasi silk saree with intricate Kadwa gold zari floral motifs woven by master weavers.',
    material: 'Pure Mulberry Silk & Gold Tested Zari',
    inStock: true,
    isFeatured: true
  }
];

export const INITIAL_ARTISANS = [
  {
    id: 'art-1',
    name: 'Venkat Rao',
    location: 'Kondapalli, Andhra Pradesh',
    craft: 'Wooden Toys & Kalamkari Art',
    experience: '28 years',
    bio: 'Preserving ancestral wooden toy carving and tamarind pen Kalamkari painting in Krishna District.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    badge: 'Master Craftsman'
  },
  {
    id: 'art-2',
    name: 'Kripal Singh Kripal',
    location: 'Jaipur, Rajasthan',
    craft: 'Jaipur Blue Pottery',
    experience: '35 years',
    bio: 'Renowned revivalist of low-fire quartz blue pottery with natural cobalt indigo glazes.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    badge: 'National Awardee'
  },
  {
    id: 'art-3',
    name: 'Rashida Begum',
    location: 'Srinagar, Jammu & Kashmir',
    craft: 'Pashmina & Sozni Needlework',
    experience: '22 years',
    bio: 'Leading a cooperative of 15 women artisans creating fine Sozni needlework on hand-spun cashmere.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    badge: 'State Heritage Fellow'
  }
];

export const INITIAL_ARTISAN_ORDERS = [
  {
    id: 'ord-101',
    orderId: '#KK-9842',
    customerName: 'Samyuktha R.',
    productName: 'Kondapalli Wooden Toys (100 pieces)',
    productImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80',
    quantity: 100,
    totalPrice: 30000,
    status: 'In Production',
    statusIcon: '🟢',
    progressPercent: 60,
    deliveryDate: '20 days remaining',
    tab: 'active'
  },
  {
    id: 'ord-102',
    orderId: '#KK-9710',
    customerName: 'Anita Sharma',
    productName: 'Tree of Life Kalamkari Hanging',
    productImage: 'https://images.unsplash.com/photo-1606744888344-493238951221?auto=format&fit=crop&w=400&q=80',
    quantity: 2,
    totalPrice: 6900,
    status: 'Delivered',
    statusIcon: '✓',
    progressPercent: 100,
    deliveryDate: 'Delivered on Aug 28',
    tab: 'completed'
  },
  {
    id: 'req-201',
    orderId: '#REQ-502',
    customerName: 'Hotel Heritage Crafts',
    productName: 'Custom Blue Wooden Toys (20 pieces)',
    productImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80',
    quantity: 20,
    totalPrice: 7000,
    status: 'Pending Acceptance',
    statusIcon: '🕒',
    dueDate: 'Due in 5 days',
    tab: 'requests'
  }
];

export const BULK_ORDER_DATA = {
  id: 'bulk-500',
  title: 'Bulk Order: 500 Wooden Toys',
  totalQuantity: 500,
  completedQuantity: 450,
  progressPercent: 90,
  status: 'Sample Approved — In Production',
  buyer: 'Sanskriti Cultural Foundation',
  deadline: 'Sept 30, 2026',
  pricePerPiece: 300,
  artisans: [
    { id: 'art-1', name: 'Venkat Rao', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', assigned: 100, completed: 80, status: 'In Progress' },
    { id: 'art-2', name: 'Rameshwar K.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', assigned: 100, completed: 100, status: 'Completed' },
    { id: 'art-3', name: 'Srinivasulu M.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', assigned: 100, completed: 100, status: 'Completed' },
    { id: 'art-4', name: 'Lakshmi Prasad', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80', assigned: 100, completed: 90, status: 'In Progress' },
    { id: 'art-5', name: 'Ramanathan K.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', assigned: 100, completed: 80, status: 'In Progress' }
  ]
};

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'bulk_order',
    title: 'New Big Order — 500 Wooden Toys',
    message: 'A customer requires 500 wooden toys. Your assigned share is 100 pieces at ₹300/piece.',
    timestamp: '10 mins ago',
    unread: true,
    deepLink: 'bulk_order_tracking'
  },
  {
    id: 'notif-2',
    type: 'price_suggestion',
    title: 'Suggested Price Ready',
    message: 'AI analyzed material cost & AP state labour rate: ₹650 recommended for Kondapalli toy set.',
    timestamp: '2 hours ago',
    unread: false
  },
  {
    id: 'notif-3',
    type: 'order_status',
    title: 'Order Payment Confirmed',
    message: 'Payment received for Order #KK-9842 (₹30,000).',
    timestamp: '1 day ago',
    unread: false
  }
];
