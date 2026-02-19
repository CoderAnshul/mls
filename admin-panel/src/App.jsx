import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Plus, 
  Search, 
  Bell,
  BarChart3,
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
  Palette,
  Sparkles,
  Layout,
  ShoppingBag
} from 'lucide-react';
import { ToastProvider } from './components/common/Toast';

const JournalView = React.lazy(() => import('./components/views/JournalView'));
const FAQView = React.lazy(() => import('./components/views/FAQView'));
const NavigationView = React.lazy(() => import('./components/views/NavigationView'));
const AppearanceView = React.lazy(() => import('./components/views/AppearanceView'));
const BannersView = React.lazy(() => import('./components/views/BannersView'));
const CategoriesView = React.lazy(() => import('./components/views/CategoriesView'));
const ShopHijabView = React.lazy(() => import('./components/views/ShopHijabView'));
const NotificationsView = React.lazy(() => import('./components/views/NotificationsView'));

const RecommendationsView = React.lazy(() => import('./components/views/RecommendationsView'));

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

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState('all'); 
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [expandedTabs, setExpandedTabs] = useState(['catalog']);

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { 
      id: 'catalog', 
      icon: Package, 
      label: 'Products',
      subTabs: [
        { id: 'all', label: 'All Products' },
        { id: 'add', label: 'Add New' },
        { id: 'categories', label: 'Categories' },
        { id: 'attributes', label: 'Attributes' },
        { id: 'inventory', label: 'Inventory' }
      ]
    },
    { id: 'orders', icon: ShoppingCart, label: 'Orders' },
    { id: 'customers', icon: Users, label: 'Customers' },
    { id: 'payments', icon: CreditCard, label: 'Payments' },
    { id: 'shipping', icon: Truck, label: 'Shipping' },
    { id: 'discounts', icon: Ticket, label: 'Discounts' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'reviews', icon: MessageSquare, label: 'Reviews' },
    { id: 'journal', icon: BookOpen, label: 'Journal' },
    { id: 'faq', icon: HelpCircle, label: 'FAQ' },
    { id: 'navigation', icon: Compass, label: 'Navigation' },
    { id: 'banners', icon: Layout, label: 'Banners' },
    { id: 'categories', icon: Layers, label: 'Categories' },
    { id: 'shop-hijab', icon: ShoppingBag, label: 'Shop Hijab' },
    { 
      id: 'recommendations', 
      icon: Sparkles, 
      label: 'Recommends',
      subTabs: [
        { id: 'cart', label: 'Cart Recommendation' },
        { id: 'checkout', label: 'Checkout Recommendation' }
      ]
    },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'admins', icon: ShieldCheck, label: 'Admins' },
  ];

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-admin-bg text-admin-text selection:bg-admin-accent selection:text-white">
        {/* Sidebar */}
        <aside className="w-56 border-r border-admin-border flex flex-col bg-[#0C0C0E] sticky top-0 h-screen overflow-y-auto scrollbar-hide">
          <div className="p-6">
            <div className="flex items-center gap-2">
              <img 
                src="/brand_logo.png" 
                alt="MLS Logo" 
                className="h-10 w-auto object-contain"
              />
            </div>
          </div>

          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => (
              <div key={item.id}>
                 <button
                  onClick={() => {
                    if (activeTab === item.id && item.subTabs) {
                      setExpandedTabs(prev => 
                        prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id]
                      );
                    } else {
                      setActiveTab(item.id);
                      if (item.subTabs) {
                        setActiveSubTab(item.subTabs[0].id);
                        if (!expandedTabs.includes(item.id)) {
                          setExpandedTabs(prev => [...prev, item.id]);
                        }
                      } else {
                        setIsAddingProduct(false);
                      }
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-300 group ${
                    activeTab === item.id 
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

                {/* Sub-tabs for Catalog */}
                {item.subTabs && expandedTabs.includes(item.id) && (
                  <div className="mt-1 ml-4 pl-3 border-l border-admin-border space-y-1 py-1 animate-in slide-in-from-top-2 duration-300">
                    {item.subTabs.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setActiveTab(item.id); // Ensure parent tab becomes active
                          setActiveSubTab(sub.id);
                          if (sub.id === 'add') setIsAddingProduct(true);
                          else setIsAddingProduct(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all ${
                          activeSubTab === sub.id && !isAddingProduct
                            ? 'text-white' 
                            : isAddingProduct && sub.id === 'add' ? 'text-white' : 'text-admin-muted hover:text-white'
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
            <div className="bg-admin-card/40 border border-admin-border rounded-xl p-3 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-admin-accent to-purple-500 flex items-center justify-center text-white font-black text-sm">AS</div>
              <div className="min-w-0">
                <p className="text-[13px] font-black truncate">Anshul Sharma</p>
                <p className="text-[10px] font-bold text-admin-muted tracking-widest uppercase truncate font-mono">ROOT</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-[#09090B]">
          {/* Header */}
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
              <button className="bg-admin-accent hover:bg-admin-accent/90 text-white px-5 py-2 rounded-xl font-bold text-[14px] flex items-center gap-2 shadow-lg shadow-admin-accent/20 transition-all active:scale-95 group">
                <Plus size={18} />
                NEW
              </button>
            </div>
          </header>

          <div className="p-8">
            <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-700">
              <React.Suspense fallback={<div className="p-10 text-center text-admin-muted font-black uppercase overflow-hidden">Initializing Matrix...</div>}>
                {activeTab === 'dashboard' && <DashboardView />}
                
                {activeTab === 'catalog' && (
                <>
                  {isAddingProduct ? (
                     <ProductForm onCancel={() => { setIsAddingProduct(false); setActiveSubTab('all'); }} />
                  ) : (
                    <>
                      {(activeSubTab === 'all' || activeSubTab === 'inventory') && <InventoryView onEdit={() => { setActiveSubTab('add'); setIsAddingProduct(true); }} />}
                      {activeSubTab === 'categories' && <CategoriesView />}
                      {activeSubTab === 'attributes' && <AttributesView />}
                    </>
                  )}
                </>
              )}

              {activeTab === 'orders' && <OrdersView />}
              {activeTab === 'customers' && <CustomersView />}
              {activeTab === 'payments' && <PaymentsView />}
              {activeTab === 'shipping' && <ShippingView />}
              {activeTab === 'discounts' && <DiscountsView />}
              {activeTab === 'analytics' && <AnalyticsView />}
              {activeTab === 'reviews' && <ReviewsView />}
              {activeTab === 'journal' && <JournalView />}
              {activeTab === 'faq' && <FAQView />}
              {activeTab === 'navigation' && <NavigationView />}
              {activeTab === 'banners' && <BannersView />}
              {activeTab === 'categories' && <CategoriesView />}
              {activeTab === 'shop-hijab' && <ShopHijabView />}
              {activeTab === 'notifications' && <NotificationsView />}
              {activeTab === 'recommendations' && <RecommendationsView type={activeSubTab} />}
              {activeTab === 'admins' && <AdminsView />}
              </React.Suspense>
            </div>
          </div>
        </main>
      </div>
    </ToastProvider>
  );
};

export default App;
