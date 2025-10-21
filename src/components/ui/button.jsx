import * as React from "react"



const Button = React.forwardRef(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
    
    const variantClasses = {
      default: "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all duration-200",
      destructive: "bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90 hover:shadow-xl transition-all duration-200",
      success: "bg-success text-success-foreground shadow-lg hover:bg-success/90 hover:shadow-xl transition-all duration-200",
      outline: "border-2 border-primary/20 bg-background shadow-sm hover:bg-primary/5 hover:border-primary/30 hover:shadow-md transition-all duration-200",
      secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md transition-all duration-200",
      ghost: "hover:bg-primary/10 hover:text-primary transition-all duration-200",
      link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 transition-colors duration-200",
    }
    
    const sizeClasses = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9",
    }
    
    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
    
    return (
      <button
        className={classes}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }