import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-[#232A2A]/25 bg-[#F7F5EE]/60 px-3 py-2 font-editorial text-[15px] text-[#232A2A] placeholder:text-[#232A2A]/40 focus:border-[#F19020] focus:outline-none focus:ring-1 focus:ring-[#F19020] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
