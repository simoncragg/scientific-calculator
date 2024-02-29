import React, { MouseEventHandler, ReactNode } from "react";
import findChildNode from "../utils/findChildNode";

interface ButtonProps {
  operator?: string;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({ 
  operator,
  className, 
  ariaLabel, 
  children,
  onClick,
}) => {
  
  const { match, mismatches } = findChildNode("ButtonLabel", children);
  const buttonLabel = match;
  const buttonContent = mismatches;
  
  const height = buttonLabel ? "h-full" : "";
  const customClasses = className ? className : "";
  const buttonClass = `flex justify-center items-center ${height} ${customClasses}`;

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
        className={buttonClass} 
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
