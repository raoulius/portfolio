import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl w-full grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  logo,
  logoBgColor,
  id,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  logo?: React.ReactNode;
  logoBgColor?: string;
  id: number,
}) => {
  return (
    <div
      className={cn(
        "group/bento relative shadow-input rounded-3xl bg-[rgb(26,26,26)] hover:bg-[rgb(40,40,40)] border-2 border-transparent transition duration-200 hover:shadow-xl hover:border-gray-300 dark:border-transparent dark:bg-[rgb(26,26,26)] dark:shadow-none",
        // Mobile: minimal padding and square aspect, Desktop: original layout
        "flex items-center justify-center p-2 aspect-square sm:flex-col sm:p-4 sm:aspect-auto",
        className,
      )}
    >
      {/* Mobile layout: centered logo only */}
      <div className="flex sm:hidden items-center justify-center">
        {logo && (
          <div className={`p-3 rounded-lg flex items-center justify-center ${logoBgColor || 'bg-[#3178C6]/20'}`}>
            {typeof logo === 'string' ? (
              <img 
                src={logo} 
                alt="Logo" 
                className="w-12 h-12 object-contain"
              />
            ) : (
              logo
            )}
          </div>
        )}
      </div>

      {/* Desktop layout: original layout with text */}
      <div className="hidden sm:flex transition duration-200 items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {logo && (
            <div className={`p-3 rounded-lg w-fit flex items-center justify-center ${logoBgColor || 'bg-[#3178C6]/20'}`}>
              {typeof logo === 'string' ? (
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="w-8 h-8 object-contain"
                />
              ) : (
                logo
              )}
            </div>
          )}
          <div className="flex-1">
            <div className="mb-1 font-sans font-bold text-neutral-600 dark:text-neutral-200">
              {title}
            </div>
            <div className="font-sans text-xs font-normal text-neutral-600 dark:text-neutral-300">
              {description}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {icon}
        </div>
      </div>
    </div>
  );
};
