import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick,
  href,
  ...props 
}) => {
  const baseStyles = 'inline-block font-medium uppercase tracking-wider transition-all duration-300 text-center';
  
  const variants = {
    primary: 'bg-neutral-900 text-white hover:bg-neutral-800',
    secondary: 'border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white',
    outline: 'border border-neutral-300 text-neutral-900 hover:border-neutral-900',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };
  
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
  
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  
  return (
    <button onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
