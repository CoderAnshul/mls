export const productsData = [
  { 
    id: 1, 
    name: 'JOURI ABAYA', 
    category: 'ABAYAS', 
    price: 165.00, 
    totalStock: 100,
    stockLeft: 42, 
    status: 'In Stock', 
    img: 'https://images.unsplash.com/photo-1581413816003-88ec0c5a3964?q=80&w=200',
    colors: ['#000000', '#2D2D2D', '#4A4A4A'],
    variants: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 17 }
    ]
  },
  { 
    id: 2, 
    name: 'CRISS CROSS HIJAB', 
    category: 'ACCESSORIES', 
    price: 9.00, 
    totalStock: 200,
    stockLeft: 124, 
    status: 'In Stock', 
    img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=200',
    colors: ['#F5F5DC', '#D2B48C', '#8B4513'],
    variants: [
      { size: 'One Size', stock: 124 }
    ]
  },
  { 
    id: 3, 
    name: 'MATTE GREY MAGNET', 
    category: 'ACCESSORIES', 
    price: 8.00, 
    totalStock: 50,
    stockLeft: 12, 
    status: 'Low Stock', 
    img: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=200',
    colors: ['#808080'],
    variants: []
  },
  { 
    id: 4, 
    name: 'PREMIUM JERSEY', 
    category: 'HIJABS', 
    price: 15.00, 
    totalStock: 150,
    stockLeft: 0, 
    status: 'Out of Stock', 
    img: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=200',
    colors: ['#000000', '#1A1A1A'],
    variants: []
  },
];

export const categoriesData = [
  { id: 1, name: 'ABAYAS', products: 24, status: 'Active', slug: 'abayas', img: 'https://images.unsplash.com/photo-1581413816003-88ec0c5a3964?q=80&w=100' },
  { id: 2, name: 'HIJABS', products: 48, status: 'Active', slug: 'hijabs', img: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=100' },
  { id: 3, name: 'ACCESSORIES', products: 12, status: 'Active', slug: 'accessories', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=100' },
  { id: 4, name: 'E-BOOKS', products: 5, status: 'Draft', slug: 'e-books', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=100' },
];

export const ordersData = [
  { 
    id: '#AAB-1284', 
    customer: 'Sarah Jenkins', 
    email: 'sarah.j@example.com',
    date: '2026-02-13T11:20:00Z', 
    amount: 165.00, 
    status: 'Delivered',
    method: 'Credit Card (Total: £165.00)',
    items: [{ name: 'Jouri Abaya', qty: 1, price: 165.00 }]
  },
  { 
    id: '#AAB-1285', 
    customer: 'Aisha Omar', 
    email: 'aisha.o@example.com',
    date: '2026-02-13T10:45:00Z', 
    amount: 24.00, 
    status: 'Confirmed',
    method: 'PayPal (Total: £24.00)',
    items: [
      { name: 'Criss Cross Hijab', qty: 1, price: 9.00 },
      { name: 'Black Premium Jersey', qty: 1, price: 15.00 }
    ]
  },
  { 
    id: '#AAB-1286', 
    customer: 'Emily Taylor', 
    email: 'emily.t@example.com',
    date: '2026-02-13T09:12:00Z', 
    amount: 165.00, 
    status: 'Pending',
    method: 'Pending Payment',
    items: [{ name: 'Jouri Abaya', qty: 1, price: 165.00 }]
  },
  { 
    id: '#AAB-1287', 
    customer: 'Mariam Khan', 
    email: 'mariam.k@example.com',
    date: '2026-02-12T16:20:00Z', 
    amount: 8.00, 
    status: 'Canceled',
    method: 'Refunded (Total: £8.00)',
    items: [{ name: 'Matte Grey Magnet', qty: 1, price: 8.00 }]
  },
];

export const customersData = [
  { id: 1, name: 'Sarah Jenkins', email: 'sarah.j@example.com', location: 'London, UK', orders: 12, totalSpent: 2450.00, joinDate: '2025-08-12' },
  { id: 2, name: 'Aisha Omar', email: 'aisha.o@example.com', location: 'Dubai, UAE', orders: 5, totalSpent: 890.00, joinDate: '2025-11-20' },
  { id: 3, name: 'Emily Taylor', email: 'emily.t@example.com', location: 'New York, USA', orders: 2, totalSpent: 330.00, joinDate: '2026-01-05' },
  { id: 4, name: 'Mariam Khan', email: 'mariam.k@example.com', location: 'Toronto, CA', orders: 8, totalSpent: 1120.00, joinDate: '2025-09-30' },
];

export const analyticsData = [
  { name: 'Mon', revenue: 4200, orders: 120 },
  { name: 'Tue', revenue: 3800, orders: 110 },
  { name: 'Wed', revenue: 5100, orders: 140 },
  { name: 'Thu', revenue: 4600, orders: 130 },
  { name: 'Fri', revenue: 6200, orders: 180 },
  { name: 'Sat', revenue: 7500, orders: 220 },
  { name: 'Sun', revenue: 6800, orders: 200 },
];

export const paymentsData = [
  { id: 'TX-9012', customer: 'Sarah Jenkins', method: 'Stripe (Visa)', amount: 165.00, status: 'Success', date: '2026-02-13T11:20:00Z' },
  { id: 'TX-9013', customer: 'Aisha Omar', method: 'PayPal', amount: 24.00, status: 'Success', date: '2026-02-13T10:45:00Z' },
  { id: 'TX-9014', customer: 'Emily Taylor', method: 'Stripe (Mastercard)', amount: 165.00, status: 'Failed', date: '2026-02-13T09:12:00Z' },
  { id: 'TX-9015', customer: 'Mariam Khan', method: 'Stripe (Visa)', amount: 8.00, status: 'Refunded', date: '2026-02-12T16:20:00Z' },
];

export const shippingData = [
  { id: 'SH-501', orderId: '#AAB-1284', zone: 'United Kingdom', rate: 'Standard (£0.00)', carrier: 'DHL', tracking: 'DHL774921', status: 'In Transit' },
  { id: 'SH-502', orderId: '#AAB-1285', zone: 'United Arab Emirates', rate: 'Express (£15.00)', carrier: 'Aramex', tracking: 'ARX-990-12', status: 'Pending' },
];

export const reviewsData = [
  { id: 1, product: 'Jouri Abaya', customer: 'Fatima R.', rating: 5, comment: 'Absolutely Stunning abaya. The fabric quality is top notch!', status: 'Approved', date: '2026-02-10' },
  { id: 2, product: 'Premium Jersey', customer: 'Sarah L.', rating: 4, comment: 'Very comfortable but the color was slightly different.', status: 'Pending', date: '2026-02-12' },
];

export const couponsData = [
  { id: 1, code: 'WELCOME10', type: 'Percentage', value: 10, expiry: '2026-12-31', usage: '124', limit: '500', status: 'Active' },
  { id: 2, code: 'FREESHIP', type: 'Flat', value: 0, expiry: '2026-06-30', usage: '45', limit: '100', status: 'Active' },
];

export const adminsData = [
  { id: 1, name: 'Anshul Sharma', role: 'Super Admin', lastLogin: '2 mins ago', email: 'anshul@mls.com' },
  { id: 2, name: 'Content Manager', role: 'Editor', lastLogin: '5 hours ago', email: 'editor@mls.com' },
];

export const activityLogs = [
  { id: 1, user: 'Anshul Sharma', action: 'Created new category "Modest Wear"', time: '10 mins ago' },
  { id: 2, user: 'Anshul Sharma', action: 'Updated stock for "Jouri Abaya"', time: '25 mins ago' },
  { id: 3, user: 'System', action: 'Payment failed for Order #1286', time: '1 hour ago' },
];
