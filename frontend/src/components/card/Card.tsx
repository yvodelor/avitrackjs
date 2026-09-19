import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'shadow' | 'ghost';
  padding?: string;
  align?: 'left' | 'center' | 'right';
}

function Card({
  title,
  subtitle,
  icon: Icon,
  children,
  actions,
  className = '',
  variant = 'default',
  padding = 'p-4',
  align = 'left',
}: Props) {
  const variants = {
    default: 'bg-white border border-gray-200',
    bordered: 'bg-white border-2 border-gray-300',
    shadow: 'bg-white shadow-lg border border-gray-100',
    ghost: 'bg-gray-50',
  };

  const alignMap = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const justifyMap = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div
      className={[
        'rounded-xl',
        variants[variant],
        padding,
        className,
      ].join(' ')}
    >
      {/* HEADER */}
      {(title || subtitle || Icon || actions) && (
        <div className="flex items-center justify-between mb-4">
          
          {/* espace pour équilibrer si besoin */}
          <div className="w-10" />

          {/* TITLE BLOCK */}
          <div className={`flex-1 flex ${justifyMap[align]}`}>
            <div className={alignMap[align]}>
              
              <div className="flex items-center gap-2">
                {Icon && (
                  <Icon className="w-5 h-5 text-blue-600" />
                )}

                {title && (
                  <h3 className="text-lg font-semibold text-gray-900">
                    {title}
                  </h3>
                )}
              </div>

              {subtitle && (
                <p className="text-sm text-gray-600 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            {actions}
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div>{children}</div>
    </div>
  );
}

export default Card;