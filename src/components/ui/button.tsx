// components/ui/button.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils"; // ensure this exists and works

type Variant = "default" | "outline" | "secondary";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  outline: "border border-gray-300 text-gray-800 bg-white hover:bg-gray-50",
  secondary: "bg-gray-700 text-white hover:bg-gray-800",
};

// ✅ THIS LINE IS FIXED ↓↓↓
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = "", variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={cn(
          "px-6 py-3 rounded-lg font-semibold shadow-md transition focus:outline-none focus:ring-2 focus:ring-offset-2",
          variantClasses[variant],
          className
        )}
      >
        {children}
      </button>
    );
  }
);

// Optional: makes debugging easier in DevTools
Button.displayName = "Button";
