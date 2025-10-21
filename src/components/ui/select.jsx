import React, { useState, useEffect, useRef, useContext, createContext, forwardRef } from "react";

const SelectContext = createContext(null);

const Select = ({ children, value, onValueChange, defaultValue }) => {
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const [open, setOpen] = useState(false);
  const selectRef = useRef(null);

  const currentValue = value !== undefined ? value : internalValue;

  const handleValueChange = (newValue) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    if (onValueChange) onValueChange(newValue);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div ref={selectRef} className="relative">
      <SelectContext.Provider value={{ value: currentValue, onValueChange: handleValueChange, open, setOpen }}>
        {children}
      </SelectContext.Provider>
    </div>
  );
};

const SelectTrigger = forwardRef(({ className = "", children, ...props }, ref) => {
  const context = useContext(SelectContext);

  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={context?.open}
      className={`flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={() => context?.setOpen(!context.open)}
      {...props}
    >
      {children}
      <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = forwardRef(({ className = "", placeholder, ...props }, ref) => {
  const context = useContext(SelectContext);
  return (
    <span ref={ref} className={className} {...props}>
      {context?.value || placeholder}
    </span>
  );
});
SelectValue.displayName = "SelectValue";

const SelectContent = forwardRef(({ className = "", children, ...props }, ref) => {
  const context = useContext(SelectContext);

  if (!context?.open) return null;

  return (
    <div
      ref={ref}
      className={`absolute top-full left-0 z-50 mt-1 min-w-full max-h-60 overflow-auto rounded-md border bg-white text-popover-foreground shadow-xl animate-in fade-in-80 slide-in-from-top-2 ${className}`}
      style={{
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
      {...props}
    >
      <div className="p-1">{children}</div>
    </div>
  );
});
SelectContent.displayName = "SelectContent";

const SelectItem = forwardRef(({ className = "", children, value, ...props }, ref) => {
  const context = useContext(SelectContext);
  const isSelected = context?.value === value;

  return (
    <div
      ref={ref}
      className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-3 pr-8 text-sm outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary ${
        isSelected ? "bg-primary/5 text-primary font-medium" : ""
      } ${className}`}
      onClick={() => context?.onValueChange(value)}
      {...props}
    >
      {children}
      {isSelected && (
        <span className="absolute right-2 flex h-4 w-4 items-center justify-center">
          <svg className="h-3 w-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polyline points="20,6 9,17 4,12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
        </span>
      )}
    </div>
  );
});
SelectItem.displayName = "SelectItem";

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
