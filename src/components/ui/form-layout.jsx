import * as React from "react";
import { cn } from "@/lib/utils";

function FullscreenContent({ className, style, ...props }) {
  return <div className={cn("fullscreen-content", className)} style={style} {...props} />;
}

function FormCard({ className, style, ...props }) {
  return (
    <div
      className={cn("rounded-lg border bg-card text-card-foreground", className)}
      style={style}
      {...props}
    />
  );
}

function FormRow({ className, style, ...props }) {
  return (
    <div className={cn("flex flex-wrap gap-x-3 gap-y-4", className)} style={style} {...props} />
  );
}

export { FullscreenContent, FormCard, FormRow };

