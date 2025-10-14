import * as React from "react";
import { cn } from "./utils";

interface TooltipProps {
  children: React.ReactNode;
}

function TooltipProvider({ children }: TooltipProps) {
  return <>{children}</>;
}

interface TooltipRootProps {
  children: React.ReactNode;
}

function Tooltip({ children }: TooltipRootProps) {
  return <div className="relative">{children}</div>;
}

interface TooltipTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

function TooltipTrigger({ asChild, children }: TooltipTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      className: cn(
        (children as React.ReactElement).props.className,
        "relative group"
      ),
    });
  }
  return <div className="relative group">{children}</div>;
}

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
  children: React.ReactNode;
}

function TooltipContent({ 
  side = "top", 
  className, 
  children, 
  ...props 
}: TooltipContentProps) {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2", 
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className={cn(
        "absolute z-50 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100",
        "transition-all duration-150 ease-out pointer-events-none",
        "px-2 py-1 text-xs rounded-md shadow-lg",
        "bg-gray-900 text-white whitespace-nowrap",
        positionClasses[side],
        className,
      )}
      {...props}
    >
      {children}
      {/* Arrow */}
      <div 
        className={cn(
          "absolute w-2 h-2 bg-gray-900 rotate-45",
          side === "top" && "top-full left-1/2 -translate-x-1/2 -translate-y-1/2",
          side === "bottom" && "bottom-full left-1/2 -translate-x-1/2 translate-y-1/2",
          side === "left" && "left-full top-1/2 -translate-x-1/2 -translate-y-1/2",
          side === "right" && "right-full top-1/2 translate-x-1/2 -translate-y-1/2"
        )}
      />
    </div>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
