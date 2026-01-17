"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, ExternalLink, PanelRight } from "lucide-react";
import * as React from "react";
import { useContext } from "react";
import {SidePanelContext} from "../src/context/SidePanelContext";





export type NavigationTarget = "popup" | "newtab" | "sidepanel"

export interface NavButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Button>, "onClick"> {
  /**
   * The target page to navigate to
   */
  target: NavigationTarget
  /**
   * Optional custom label for the button
   */
  label?: string
  /**
   * Show icon in the button
   * @default true
   */
  showIcon?: boolean
  /**
   * Icon position
   * @default "right"
   */
  iconPosition?: "left" | "right"
  /**
   * Callback fired after navigation is initiated
   */
  onNavigate?: (target: NavigationTarget) => void
}

const navigationConfig: Record<
  NavigationTarget,
  {
    label: string
    icon: React.ComponentType<{ className?: string }>
    action: () => void | Promise<void>
  }
> = {
  popup: {
    label: "Open Popup",
    icon: ExternalLink,
    action: async () => {
      // For popup, we can open it programmatically
      if (typeof chrome !== "undefined" && chrome.action) {
        await chrome.action.openPopup()
      }
    }
  },
  newtab: {
    label: "Open New Tab",
    icon: ArrowRight,
    action: async () => {
      // Open the extension's new tab page
      if (typeof chrome !== "undefined" && chrome.tabs) {
        const url = chrome.runtime.getURL("tabs/user-form.html")
        await chrome.tabs.create({ url })
      }
      
    }
  },
  sidepanel: {
    label: "Open Side Panel",
    icon: PanelRight,
    action: async () => {
      // Handled by SidePanelContext toggle
    }
  }
}

/**
 * NavButton component for navigating between different extension pages
 *
 * @example
 * ```tsx
 * <NavButton target="newtab" variant="default" />
 * <NavButton target="sidepanel" label="View in Panel" variant="outline" />
 * <NavButton target="popup" showIcon={false} />
 * ```
 */
export const NavButton = React.forwardRef<HTMLButtonElement, NavButtonProps>(
  (
    {
      target,
      label,
      showIcon = true,
      iconPosition = "right",
      variant = "default",
      size = "default",
      className,
      onNavigate,
      disabled,
      ...props
    },
    ref
  ) => {
    const config = navigationConfig[target]
    const Icon = config.icon
    const sidePanelContext = useContext(SidePanelContext)
    const isOpen = sidePanelContext?.isOpen || false

    const buttonLabel = label || config.label
    const displayLabel = target === "sidepanel" && isOpen
      ? "Close Side Panel"
      : buttonLabel

    const handleClick = React.useCallback(async () => {
      try {
        if (target === "sidepanel" && sidePanelContext) {
          await sidePanelContext.toggle()
        } else {
          await config.action()
        }
        onNavigate?.(target)
      } catch (error) {
        console.error(`Failed to navigate to ${target}:`, error)
      }
    }, [target, onNavigate, sidePanelContext])

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn("gap-2", className)}
        onClick={handleClick}
        disabled={disabled}
        {...props}>
        {showIcon && iconPosition === "left" && (
          <Icon className="h-4 w-4" aria-hidden="true" />
        )}
        <span>{displayLabel}</span>
        {showIcon && iconPosition === "right" && (
          <Icon className="h-4 w-4" aria-hidden="true" />
        )}
      </Button>
    )
  }
)

NavButton.displayName = "NavButton"