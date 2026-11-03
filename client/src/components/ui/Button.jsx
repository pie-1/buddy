import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ children, variant = 'primary', className, ...props }) {
  const baseStyles = "px-6 py-3 rounded-btn font-semibold text-sm transition-all duration-150 ease-out";
  
  const variants = {
    primary: "bg-brand-orange text-black hover:shadow-glow-orange hover:scale-[1.02]",
    secondary: "bg-white/5 text-text-primary border border-border hover:bg-white/10",
    ghost: "text-text-secondary hover:text-text-primary hover:bg-white/5",
  };

  return (
    <button 
      className={twMerge(baseStyles, variants[variant], className)} 
      {...props}
    >
      {children}
    </button>
  );
}