import React, { Children, MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  operator?: string;
  className?: string;
  ariaLabel?: string;
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
  children,
  onClick,
}) => {
    
  let buttonLabel: ReactNode;
  let buttonContent: ReactNode;

  Children.forEach(children, (child) => {
    if (React.isValidElement(child) && (child.type as ChildType).name === "ButtonLabel") {
      buttonLabel = child.props.children;
    } else {
      buttonContent = child;
    }
  });

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
        {buttonContent}
      </button>

    </div>
  );
};

interface ButtonLabelProps {
  children: React.ReactNode;
}

const ButtonLabel: React.FC<ButtonLabelProps> = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};

export default Button;
export { ButtonLabel };
