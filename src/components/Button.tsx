import React, { Children, MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  operator?: string;
  className?: string;
  ariaLabel?: string;
  buttonLabel?: ReactNode;
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

interface ChildType {
  name: string;
}

const Button: React.FC<ButtonProps> = ({ 
  operator,
  className = "", 
  ariaLabel,
  buttonLabel,
  children,
  onClick,
}) => {
    
  return (
    <div className="flex flex-col justify-end">

      {buttonLabel && (
        <span className="text-yellow-600 text-xs self-center">
          {buttonLabel}
        </span>
      )}

      <button 
        type="button" 
        data-operator={operator} 
        className={`flex justify-center items-center ${buttonLabel ? "h-full" : ""} ${className}`} 
        aria-label={ariaLabel} 
        onClick={onClick}
      >
        {children}
      </button>

    </div>
  );
};

export default Button;
