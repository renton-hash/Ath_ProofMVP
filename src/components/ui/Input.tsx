import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
export function Input({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || props.name || Math.random().toString(36).substr(2, 9);
  return (
    <div className="w-full">
      {label &&
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 mb-1">

          {label}
        </label>
      }
      <input
        id={inputId}
        className={`
          w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold
          disabled:bg-gray-50 disabled:text-gray-500
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props} />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error &&
      <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      }
    </div>);

}