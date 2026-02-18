import React from 'react';

import { featuresData } from '../../data/categories';

const FeatureHighlights = () => {
  return (
    <section className="margin" >
      <div className="w-full mx-auto px-2 sm:px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {featuresData.map((feature, index) => (
            <div 
              key={feature.id} 
              className={`text-center px-4 ${
                index !== featuresData.length - 1 ? 'md:border-r md:border-neutral-400' : ''
              }`}
            >
              <h4 className="text-base font-medium uppercase tracking-[0.1em] text-neutral-900 mb-2">
                {feature.title}
              </h4>
              <p className="text-md text-neutral-600 font-normal">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
