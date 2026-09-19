import React from "react";

interface InputProps {
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export default function Input({
  name,
  type = "text",
  placeholder,
  value,
  className = "",
  onChange,
  required = false,
}: InputProps) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={ `w-full border border-gray-300 rounded-lg p-2 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
      required={required}
    />
  );
}