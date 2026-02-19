import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AnnouncementBar from './components/layout/AnnouncementBar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Collections from './pages/Collections';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Journal from './pages/Journal';
import Lookbook from './pages/Lookbook';
import JournalDetail from './pages/JournalDetail';
import { ToastProvider } from './components/common/Toast';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const location = useLocation();
  const isCheckoutPage = location.pathname === '/checkout';

  return (
    <ToastProvider>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        {!isCheckoutPage && <AnnouncementBar />}
        {!isCheckoutPage && <Header />}
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections/:category" element={<Collections />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/:slug" element={<JournalDetail />} />
          <Route path="/lookbook" element={<Lookbook />} />
        </Routes>
        
        {!isCheckoutPage && <Footer />}
      </div>
    </ToastProvider>
  );
}

export default App;
