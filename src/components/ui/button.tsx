import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-[11px] md:text-sm md:font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#333] text-[#fff] md:hover:bg-secondary/90",
        destructive:
          "bg-destructive text-destructive-foreground md:hover:bg-destructive/90",
        outline:
          "border border-input bg-background md:hover:bg-accent md:hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground md:hover:bg-secondary/90",
        ghost: "md:hover:bg-accent md:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 md:hover:underline",
      },
      size: {
        default: "md:h-10 h-8 px-4 py-2",
        xsm: "h-8 rounded-sm px-3",
        sm: "h-9 rounded-md px-4",
        lg: "h-11 rounded-md px-8 md:py-6",
        xl: "h-12 md:h-14 rounded-none md:rounded-md px-6 md:px-10",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
