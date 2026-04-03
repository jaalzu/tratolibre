"use client";

import { Box, Text } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown } from "@boxicons/react";

interface Option {
  id: string;
  label: string;
  iconClass?: React.ElementType;
}

interface FormSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
}

export function FormSelect({
  value,
  onChange,
  options,
  placeholder,
  invalid,
  disabled,
}: FormSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.id === value);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <Box position="relative" ref={ref} w="full">
      <button
        type="button"
        data-testid={`select-${placeholder?.toLowerCase().replace(/\s/g, "-")}`}
        onClick={() => {
          if (!disabled) setOpen((o) => !o);
        }}
        style={{
          width: "100%",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          border: `1px solid ${
            invalid
              ? "var(--chakra-colors-feedback-error)"
              : open
                ? "var(--chakra-colors-brand-default)"
                : "var(--chakra-colors-neutral-500)"
          }`,
          borderRadius: "8px",
          background: "var(--chakra-colors-neutral-50)",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          transition: "border-color 0.15s",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flex: 1,
            overflow: "hidden",
          }}
        >
          {selected?.iconClass &&
            (() => {
              const Icon = selected.iconClass;
              return (
                <Icon
                  width="16px"
                  height="16px"
                  fill="currentColor"
                  style={{ flexShrink: 0 }}
                />
              );
            })()}
          <Text
            fontSize="sm"
            color={selected ? "neutral.900" : "neutral.400"}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            textAlign="left"
          >
            {selected ? selected.label : placeholder}
          </Text>
        </div>

        {open ? (
          <ChevronUp
            width="18px"
            height="18px"
            fill="var(--chakra-colors-neutral-400)"
          />
        ) : (
          <ChevronDown
            width="18px"
            height="18px"
            fill="var(--chakra-colors-neutral-400)"
          />
        )}
      </button>

      {open && (
        <Box
          position="absolute"
          top="calc(100% + 4px)"
          left={0}
          right={0}
          bg="neutral.50"
          border="1px solid"
          borderColor="neutral.200"
          borderRadius="lg"
          boxShadow="md"
          zIndex={50}
          maxH="220px"
          overflowY="auto"
          css={{
            "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: "100px",
              background: "#c1c1c1",
            },
          }}
        >
          {options.map((opt) => {
            const Icon = opt.iconClass;
            const isSelected = value === opt.id;

            return (
              <button
                key={opt.id}
                type="button"
                data-testid={`option-${opt.id}`}
                onClick={() => {
                  onChange(opt.id);
                  setOpen(false);
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 12px",
                  background: isSelected
                    ? "var(--chakra-colors-brand-50)"
                    : "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "var(--chakra-colors-neutral-50)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {Icon && (
                    <Icon width="18px" height="18px" fill="currentColor" />
                  )}
                  <Text
                    fontSize="sm"
                    color={isSelected ? "brand.default" : "neutral.700"}
                    fontWeight={isSelected ? "bold" : "normal"}
                  >
                    {opt.label}
                  </Text>
                </div>
              </button>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
