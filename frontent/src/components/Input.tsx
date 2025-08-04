import React, { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errors?: string[];
  helperText?: string;
  variant?: "default" | "search";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      label,
      errors,
      helperText,
      variant = "default",
      icon,
      iconPosition = "right",
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      "w-full px-4 py-3 text-base rounded-md focus:outline-none focus:ring-2 border-0";

    const variantClasses = {
      default:
        "text-gray-900 placeholder-gray-400 focus:ring-blue-200 bg-white border border-gray-300",
      search:
        "text-gray-600 placeholder-gray-400 focus:ring-green-200 bg-white",
    };

    const errorClasses = errors ? "border-red-300 focus:ring-red-200" : "";

    const iconPaddingClasses = icon
      ? iconPosition === "left"
        ? "pl-10"
        : "pr-10"
      : "";

    const inputClasses = `${baseClasses} ${variantClasses[variant]} ${errorClasses} ${iconPaddingClasses} ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          <input ref={ref} className={inputClasses} {...props} />

          {icon && (
            <div
              className={`absolute top-1/2 transform -translate-y-1/2 ${
                iconPosition === "left" ? "left-3" : "right-3"
              } pointer-events-none`}
            >
              {icon}
            </div>
          )}
        </div>

        {errors && <p className="mt-1 text-sm text-red-600">{errors}</p>}

        {helperText && !errors && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
