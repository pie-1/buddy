import {twMerge} from 'tailwind-merge';

export function Card({children, className}){
    return(
    <div 
      className={twMerge(
        "bg-white/[0.03] border border-border backdrop-blur-md rounded-card shadow-card p-6",
        className
      )}
    >
      {children}
    </div>
    );
}