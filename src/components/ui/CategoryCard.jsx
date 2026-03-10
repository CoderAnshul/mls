import React from 'react';
import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../../utils/imageUrl';

const CategoryCard = ({ title, image, href, className = '' }) => {
  return (
    <Link
      to={href}
      className={`group relative overflow-hidden block ${className}`}
    >
      <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
        <img
          src={resolveImageUrl(image)}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 text-center">
        <h4 className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-800">
          {title}
        </h4>
      </div>
    </Link>
  );
};

export default CategoryCard;
