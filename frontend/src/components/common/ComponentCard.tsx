interface ComponentCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title="",
  children,
  className = "",
  desc = "",
}) => {
  return (
    <div
      className={`rounded-md border border-gray-300 bg-white dark:border-gray-300 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      {title &&(
        <div className="px-2 py-2 bg-gray">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 p-0 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>
      )}

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
