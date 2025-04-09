import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({ className, variant = "default", ...props }: any) {
  const base = "px-4 py-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 transition";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
  };

  return <button className={cn(base, variants[variant], className)} {...props} />;
}
