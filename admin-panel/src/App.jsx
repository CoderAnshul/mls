import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Plus,
  Search,
  Bell,
  Layers,
  CreditCard,
  Truck,
  Ticket,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  BookOpen,
  HelpCircle,
  Compass,
  Sparkles,
  Layout,
  ShoppingBag,
  Camera,
  LogOut,
  Settings
} from 'lucide-react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ToastProvider, useToast } from './components/common/Toast';

const JournalView = React.lazy(() => import('./components/views/JournalView'));
const FAQView = React.lazy(() => import('./components/views/FAQView'));
const NavigationView = React.lazy(() => import('./components/views/NavigationView'));
const AppearanceView = React.lazy(() => import('./components/views/AppearanceView'));
const BannersView = React.lazy(() => import('./components/views/BannersView'));
const CategoriesView = React.lazy(() => import('./components/views/CategoriesView'));
const ShopHijabView = React.lazy(() => import('./components/views/ShopHijabView'));
const NotificationsView = React.lazy(() => import('./components/views/NotificationsView'));

const RecommendationsView = React.lazy(() => import('./components/views/RecommendationsView'));
const LookbookView = React.lazy(() => import('./components/views/LookbookView'));

// Views
import DashboardView from './components/views/DashboardView';
import { InventoryView, ProductForm } from './components/views/InventoryView';
import OrdersView from './components/views/OrdersView';
import CustomersView from './components/views/CustomersView';
import AnalyticsView from './components/views/AnalyticsView';
import PaymentsView from './components/views/PaymentsView';
import ShippingView from './components/views/ShippingView';
import DiscountsView from './components/views/DiscountsView';
import ReviewsView from './components/views/ReviewsView';
import AdminsView from './components/views/AdminsView';
import AttributesView from './components/views/AttributesView';
import LoginView from './components/views/LoginView';
import RegisterView from './components/views/RegisterView';

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [expandedTabs, setExpandedTabs] = useState(['catalog', 'recommendations']);

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    {
      id: 'catalog',
      icon: Package,
      label: 'Products',
      path: '/products',
      subTabs: [
        { id: 'all', label: 'All Products', path: '/products' },
        { id: 'add', label: 'Add New', path: '/products/add' },
        { id: 'categories', label: 'Categories', path: '/products/categories' },
        { id: 'attributes', label: 'Attributes', path: '/products/attributes' },
        { id: 'inventory', label: 'Inventory', path: '/products/inventory' }
      ]
    },
    { id: 'orders', icon: ShoppingCart, label: 'Orders', path: '/orders' },
    { id: 'customers', icon: Users, label: 'Customers', path: '/customers' },
    { id: 'payments', icon: CreditCard, label: 'Payments', path: '/payments' },
    { id: 'shipping', icon: Truck, label: 'Shipping', path: '/shipping' },
    { id: 'discounts', icon: Ticket, label: 'Discounts', path: '/discounts' },

    { id: 'reviews', icon: MessageSquare, label: 'Reviews', path: '/reviews' },
    { id: 'journal', icon: BookOpen, label: 'Journal', path: '/journal' },
    { id: 'faq', icon: HelpCircle, label: 'FAQ', path: '/faq' },
    { id: 'navigation', icon: Compass, label: 'Navigation', path: '/navigation' },
    { id: 'banners', icon: Layout, label: 'Banners', path: '/banners' },
    { id: 'shop-hijab', icon: ShoppingBag, label: 'Shop Hijab', path: '/shop-hijab' },
    {
      id: 'recommendations',
      icon: Sparkles,
      label: 'Recommends',
      path: '/recommendations',
      subTabs: [
        { id: 'cart', label: 'Cart Recommendation', path: '/recommendations/cart' },
        { id: 'checkout', label: 'Checkout Recommendation', path: '/recommendations/checkout' }
      ]
    },
    { id: 'notifications', icon: Bell, label: 'Notifications', path: '/notifications' },
    { id: 'lookbook', icon: Camera, label: 'Lookbook', path: '/lookbook' },
    { id: 'admins', icon: ShieldCheck, label: 'Admins', path: '/admins' },
  ];

  const activeTab = useMemo(() => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    const item = navItems.find(item => path.startsWith(item.path) && item.path !== '/');
    return item ? item.id : 'dashboard';
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    addToast('Logged out successfully', 'info');
    navigate('/login');
  };

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginView setAuth={setUser} />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex min-h-screen bg-admin-bg text-admin-text selection:bg-admin-accent selection:text-white">
      {/* Sidebar */}
      <aside className="w-56 border-r border-admin-border flex flex-col bg-[#0C0C0E] sticky top-0 h-screen overflow-y-auto scrollbar-hide shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <img
              src="/brand_logo.png"
              alt="MLS Logo"
              className="h-10 w-auto object-contain cursor-pointer"
              onClick={() => navigate('/')}
            />
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.subTabs) {
                    if (activeTab === item.id) {
                      setExpandedTabs(prev =>
                        prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id]
                      );
                    } else {
                      navigate(item.path);
                      if (!expandedTabs.includes(item.id)) {
                        setExpandedTabs(prev => [...prev, item.id]);
                      }
                    }
                  } else {
                    navigate(item.path);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-300 group ${activeTab === item.id
                  ? 'bg-admin-accent/10 text-admin-accent'
                  : 'text-admin-muted hover:bg-admin-card hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon size={18} className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="font-bold text-[14px] tracking-tight">{item.label}</span>
                </div>
                {item.subTabs && <ChevronDown size={12} className={`transition-transform duration-300 ${expandedTabs.includes(item.id) ? 'rotate-180' : ''}`} />}
              </button>

              {item.subTabs && expandedTabs.includes(item.id) && (
                <div className="mt-1 ml-4 pl-3 border-l border-admin-border space-y-1 py-1 animate-in slide-in-from-top-2 duration-300">
                  {item.subTabs.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => navigate(sub.path)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all ${location.pathname === sub.path
                        ? 'text-white'
                        : 'text-admin-muted hover:text-white'
                        }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-admin-border">
          <div className="bg-admin-card/40 border border-admin-border rounded-xl p-3 flex items-center justify-between group/user">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-admin-accent to-purple-500 flex items-center justify-center text-white font-black text-sm shrink-0 uppercase">
                {user.name?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-black truncate">{user.name || 'Admin'}</p>
                <p className="text-[10px] font-bold text-admin-muted tracking-widest uppercase truncate font-mono">ROOT</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-8 h-8 rounded-lg hover:bg-admin-accent/10 hover:text-admin-accent text-admin-muted flex items-center justify-center transition-all opacity-0 group-hover/user:opacity-100"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#09090B] min-w-0">
        <header className="h-16 border-b border-admin-border flex items-center justify-between px-8 bg-admin-bg/40 backdrop-blur-xl sticky top-0 z-50">
          <div className="flex items-center gap-3 bg-admin-card/50 px-4 py-2 rounded-xl border border-admin-border w-96 shadow-inner">
            <Search size={14} className="text-admin-muted" />
            <input
              type="text"
              placeholder="Search catalog, orders, users..."
              className="bg-transparent border-none outline-none text-[14px] w-full placeholder:text-admin-muted font-medium"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-xl border border-admin-border flex items-center justify-center hover:bg-admin-card transition-all relative group">
              <Bell size={15} className="text-admin-muted group-hover:text-white" />
              <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-admin-accent rounded-full border-2 border-admin-bg" />
            </button>
            <button 
              onClick={() => navigate('/products/add')}
              className="bg-admin-accent hover:bg-admin-accent/90 text-white px-5 py-2 rounded-xl font-bold text-[14px] flex items-center gap-2 shadow-lg shadow-admin-accent/20 transition-all active:scale-95 group"
            >
              <Plus size={18} />
              NEW
            </button>
          </div>
        </header>

        <div className="p-8 h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            <React.Suspense fallback={<div className="p-10 text-center text-admin-muted font-black uppercase overflow-hidden">Initializing Matrix...</div>}>
              <Routes>
                <Route path="/" element={<DashboardView />} />
                <Route path="/orders" element={<OrdersView />} />
                <Route path="/customers" element={<CustomersView />} />
                <Route path="/payments" element={<PaymentsView />} />
                <Route path="/shipping" element={<ShippingView />} />
                <Route path="/discounts" element={<DiscountsView />} />
                <Route path="/analytics" element={<AnalyticsView />} />
                <Route path="/reviews" element={<ReviewsView />} />
                <Route path="/journal" element={<JournalView />} />
                <Route path="/faq" element={<FAQView />} />
                <Route path="/navigation" element={<NavigationView />} />
                <Route path="/banners" element={<BannersView />} />
                <Route path="/categories" element={<CategoriesView />} />
                <Route path="/shop-hijab" element={<ShopHijabView />} />
                <Route path="/notifications" element={<NotificationsView />} />
                <Route path="/lookbook" element={<LookbookView />} />
                <Route path="/admins" element={<AdminsView />} />
                
                {/* Catalog Routes */}
                <Route path="/products" element={<InventoryView onEdit={() => navigate('/products/add')} />} />
                <Route path="/products/add" element={<ProductForm onCancel={() => navigate('/products')} />} />
                <Route path="/products/categories" element={<CategoriesView />} />
                <Route path="/products/attributes" element={<AttributesView />} />
                <Route path="/products/inventory" element={<InventoryView onEdit={() => navigate('/products/add')} />} />

                {/* Recommendations */}
                <Route path="/recommendations/cart" element={<RecommendationsView type="cart" />} />
                <Route path="/recommendations/checkout" element={<RecommendationsView type="checkout" />} />
                
                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </React.Suspense>
          </div>
        </div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
