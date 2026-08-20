"use client";

import { chakra, HTMLChakraProps, Spinner } from "@chakra-ui/react";

export interface ButtonProps extends HTMLChakraProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "amber" | "blue" | "danger";
  size?: "sm" | "md" | "lg";
  width?: "full";
  loading?: boolean;
  loadingText?: string;
  asChild?: boolean;
}

const StyledButton = chakra("button", {
  base: {
    display: "inline-flex",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    borderRadius: "md",
    transition: "all 0.2s",
    cursor: "pointer",
    gap: "2",
    _disabled: {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  },
  variants: {
    variant: {
      primary: {
        bg: "accent.default",
        color: "white",
        _hover: { bg: "accent.hover" },
      },
      secondary: {
        border: "1.5px solid",
        borderColor: "neutral.300",
        color: "neutral.900",
        bg: "transparent",
        _hover: { bg: "neutral.50" },
      },
      ghost: {
        color: "neutral.700",
        _hover: { bg: "neutral.50" },
      },
      amber: {
        bg: "secondary.default",
        color: "white",
        _hover: { bg: "secondary.hover" },
      },
      blue: {
        bg: "accent.default",
        color: "white",
        _hover: { bg: "accent.hover" },
      },
      danger: {
        border: "1px solid",
        borderColor: "red.400",
        color: "red.600",
        bg: "transparent",
        _hover: { bg: "red.50" },
      },
    },
    size: {
      sm: { px: 3, py: 2, fontSize: "sm" },
      md: { px: 4, py: 3, fontSize: "md" },
      lg: { px: 6, py: 4, fontSize: "lg" },
    },
    width: {
      full: { w: "full" },
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export function Button({
  loading,
  loadingText,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const spinnerSize =
    props.size === "sm" ? "xs" : props.size === "lg" ? "md" : "sm";

  return (
    <StyledButton
      disabled={loading || disabled}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <Spinner
            size={spinnerSize}
            flexShrink={0}
            position="absolute"
            zIndex={1}
          />
          <span style={{ visibility: "hidden" }}>
            {loadingText ?? children}
          </span>
        </>
      ) : (
        children
      )}
    </StyledButton>
  );
}
