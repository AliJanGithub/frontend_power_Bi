import React, { useState, useContext, useRef, forwardRef, cloneElement, isValidElement } from "react";

const DialogContext = React.createContext(null);

const Dialog = ({ children, open, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = open !== undefined ? open : internalOpen;

  const setIsOpen = (newOpen) => {
    if (open === undefined) {
      setInternalOpen(newOpen);
    }
    if (onOpenChange) onOpenChange(newOpen);
  };

  return (
    <DialogContext.Provider value={{ open: isOpen, setOpen: setIsOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger = forwardRef(({ className = "", children, onClick, asChild = false, ...props }, ref) => {
  const context = useContext(DialogContext);

  const handleClick = (e) => {
    context?.setOpen(true);
    if (onClick) onClick(e);
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      ...props,
      onClick: (e) => {
        handleClick(e);
        if (children.props.onClick) children.props.onClick(e);
      },
    });
  }

  return (
    <div ref={ref} className={className} onClick={handleClick} {...props}>
      {children}
    </div>
  );
});
DialogTrigger.displayName = "DialogTrigger";

const DialogContent = forwardRef(({ className = "", children, ...props }, ref) => {
  const context = useContext(DialogContext);

  if (!context?.open) return null;

  return (
    <div id="legacy-design-wrapper" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        ref={ref}
        className={`relative bg-background border rounded-lg shadow-lg max-w-lg w-full max-h-screen overflow-auto ${className}`}
        {...props}
      >
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onClick={() => context?.setOpen(false)}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
});
DialogContent.displayName = "DialogContent";

const DialogHeader = forwardRef(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 text-center sm:text-left p-6 pb-2 ${className}`}
    {...props}
  />
));
DialogHeader.displayName = "DialogHeader";

const DialogTitle = forwardRef(({ className = "", ...props }, ref) => (
  <h2
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger };
