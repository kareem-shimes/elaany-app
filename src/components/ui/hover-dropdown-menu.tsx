"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Root hover dropdown component
function HoverDropdown({
  children,
  trigger,
  width,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  trigger?: React.ReactNode;
  width?: string;
}) {
  return (
    <div
      className={cn("group relative", className)}
      data-slot="hover-dropdown"
      {...props}
    >
      {trigger && <HoverDropdownTrigger>{trigger}</HoverDropdownTrigger>}
      <HoverDropdownContent className={width}>{children}</HoverDropdownContent>
    </div>
  );
}

// Trigger component that activates hover
function HoverDropdownTrigger({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="hover-dropdown-trigger"
      className={cn(
        "element-center cursor-pointer touch-manipulation",
        className
      )}
      tabIndex={0}
      {...props}
    />
  );
}

// Content component that appears on hover
function HoverDropdownContent({
  className,
  align = "start",
  sideOffset = 8,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  align?: "start" | "center" | "end";
  sideOffset?: number;
}) {
  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  };

  return (
    <div
      data-slot="hover-dropdown-content"
      className={cn(
        "absolute top-full z-50 opacity-0 invisible transition-all duration-200",
        // Desktop hover
        "group-hover:opacity-100 group-hover:visible",
        // Mobile/Touch support - focus-within for keyboard navigation and active for touch
        "group-focus-within:opacity-100 group-focus-within:visible",
        // Additional mobile touch support using active state
        "group-active:opacity-100 group-active:visible",
        alignmentClasses[align]
      )}
      style={{ paddingTop: `${sideOffset}px` }}
    >
      <div
        className={cn(
          "bg-popover text-popover-foreground min-w-[8rem] overflow-hidden rounded-md border border-border p-1 shadow-sm",
          className
        )}
        {...props}
      />
    </div>
  );
}

// Group component for organizing items
function HoverDropdownGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="hover-dropdown-group" className={className} {...props} />
  );
}

// Individual dropdown item
function HoverDropdownItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <div
      data-slot="hover-dropdown-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 dark:data-[variant=destructive]:hover:bg-destructive/20 data-[variant=destructive]:hover:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground transition-colors data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

// Label component for sections
function HoverDropdownLabel({
  className,
  inset,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  inset?: boolean;
}) {
  return (
    <div
      data-slot="hover-dropdown-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  );
}

// Separator component
function HoverDropdownSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="hover-dropdown-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

// Shortcut text component
function HoverDropdownShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="hover-dropdown-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  );
}

export default HoverDropdown;
export {
  HoverDropdownTrigger,
  HoverDropdownContent,
  HoverDropdownGroup,
  HoverDropdownItem,
  HoverDropdownLabel,
  HoverDropdownSeparator,
  HoverDropdownShortcut,
};
