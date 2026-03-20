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
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import StaticPage from './pages/StaticPage';
import { ToastProvider } from './components/common/Toast';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

import Login from './pages/Account/Login';
import Register from './pages/Account/Register';
import ForgotPassword from './pages/Account/ForgotPassword';
import Orders from './pages/Account/Orders';
import Details from './pages/Account/Details';
import Loyalty from './pages/Account/Loyalty';
import SmoothScroll from './components/common/SmoothScroll';

function App() {
  const location = useLocation();
  const isCheckoutPage = location.pathname === '/checkout';

  return (
    <ToastProvider>
      <SmoothScroll>
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
            <Route path="/account/login" element={<Login />} />
            <Route path="/account/register" element={<Register />} />
            <Route path="/account/forgot-password" element={<ForgotPassword />} />
            <Route path="/account/orders" element={<Orders />} />
            <Route path="/account/details" element={<Details />} />
            <Route path="/account/loyalty" element={<Loyalty />} />
            
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/privacy-policy" element={<StaticPage slug="privacy-policy" title="Privacy Policy" />} />
            <Route path="/terms-conditions" element={<StaticPage slug="terms-conditions" title="Terms & Conditions" />} />
            <Route path="/shipping-info" element={<StaticPage slug="shipping-info" title="Shipping Information" />} />
            <Route path="/delivery" element={<StaticPage slug="delivery" title="Delivery" />} />
            <Route path="/returns-exchanges" element={<StaticPage slug="returns-exchanges" title="Returns & Exchanges" />} />
            
            {/* Auth routes */}
          </Routes>
          
          {!isCheckoutPage && <Footer />}
        </div>
      </SmoothScroll>
    </ToastProvider>
  );
}

export default App;
