import React from "react";

interface RadioProps {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  label: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  variant?: "radio" | "button";
}

const Radio: React.FC<RadioProps> = ({
  id,
  name,
  value,
  checked,
  label,
  onChange,
  className = "",
  disabled = false,
  variant = "radio",
}) => {
  return (
    <label
      htmlFor={id}
      className={`${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      <input
        id={id}
        name={name}
        type="radio"
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => !disabled && onChange(value)}
        className="sr-only"
      />

      {variant === "button" ? (
        <span
          className={`
            inline-flex items-center justify-center
            rounded-lg px-2 py-1
            border text-sm font-medium
            transition-all duration-200
            ${
              checked
                ? "bg-brand-500 border-brand-500 text-white"
                : "bg-white text-gray-700 border-gray-300 hover:border-brand-500 hover:text-brand-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            }
            ${
              disabled
                ? "opacity-50 pointer-events-none"
                : ""
            }
          `}
        >
          {label}
        </span>
      ) : (
        <span
          className={`relative flex select-none items-center gap-3 text-sm font-medium ${
            disabled
              ? "text-gray-300 dark:text-gray-600"
              : "text-gray-700 dark:text-gray-400"
          }`}
        >
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full border-[1.25px] ${
              checked
                ? "border-brand-500 bg-brand-500"
                : "border-gray-300 bg-transparent dark:border-gray-700"
            } ${
              disabled
                ? "border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700"
                : ""
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full bg-white ${
                checked ? "block" : "hidden"
              }`}
            />
          </span>

          <span>{label}</span>
        </span>
      )}
    </label>
  );
};

export default Radio;