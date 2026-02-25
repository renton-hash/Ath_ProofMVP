import React from 'react';
interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  footer?: React.ReactNode;
  noPadding?: boolean;
}
export function Card({
  children,
  className = '',
  title,
  footer,
  noPadding = false
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden ${className}`}>

      {title &&
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-navy">{title}</h3>
        </div>
      }
      <div className={noPadding ? '' : 'p-6'}>{children}</div>
      {footer &&
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      }
    </div>);

}