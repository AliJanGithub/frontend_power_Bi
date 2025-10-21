import * as React from "react"



const Checkbox = React.forwardRef(
  ({ className = "", onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (event) => {
      onCheckedChange?.(event.target.checked)
      onChange?.(event)
    }
    
    return (
      <input
        type="checkbox"
        className={`h-4 w-4 rounded border border-primary text-primary focus:ring-2 focus:ring-primary ${className}`}
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }