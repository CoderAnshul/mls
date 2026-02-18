import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import BrandStatement from '../components/sections/BrandStatement';
import ShopByCategory from '../components/sections/ShopByCategory';
import FeatureHighlights from '../components/sections/FeatureHighlights';
import ReviewsSection from '../components/sections/ReviewsSection';
import SignatureEmbroideries from '../components/sections/SignatureEmbroideries';
import RamadanEssentials from '../components/sections/RamadanEssentials';
import DualBannerSection from '../components/sections/DualBannerSection';
import ShopHijabs from '../components/sections/ShopHijabs';
import DiscoverMore from '../components/sections/DiscoverMore';
import EditorialSection from '../components/sections/EditorialSection';

const Home = () => {
  return (
    <main className="flex-1">
      <HeroSection />
      <BrandStatement />
      <ShopByCategory />
      <FeatureHighlights />
      <SignatureEmbroideries />
      <RamadanEssentials />
      <DualBannerSection />
      <ShopHijabs />
      <ReviewsSection />
      <DiscoverMore />
      <EditorialSection />
    </main>
  );
};

export default Home;
