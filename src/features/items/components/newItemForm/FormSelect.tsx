"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import "boxicons/css/boxicons.min.css";

interface Option {
  id: string;
  label: string;
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
          border: `1px solid ${invalid ? "var(--chakra-colors-feedback-error)" : open ? "var(--chakra-colors-brand-default)" : "var(--chakra-colors-neutral-500)"}`,
          borderRadius: "8px",
          background: "neutral.50",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          transition: "border-color 0.15s",
        }}
      >
        <Text
          fontSize="sm"
          color={selected ? "neutral.900" : "neutral.400"}
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          flex={1}
          textAlign="left"
        >
          {selected ? selected.label : placeholder}
        </Text>
        <i
          className={open ? "bx bx-chevron-up" : "bx bx-chevron-down"}
          style={{
            fontSize: "18px",
            color: "var(--chakra-colors-neutral-400)",
            flexShrink: 0,
          }}
        />
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
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onChange(opt.id);
                setOpen(false);
              }}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "8px 12px",
                background:
                  value === opt.id
                    ? "var(--chakra-colors-brand-50)"
                    : "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onMouseEnter={(e) => {
                if (value !== opt.id)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "var(--chakra-colors-neutral-50)";
              }}
              onMouseLeave={(e) => {
                if (value !== opt.id)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
              }}
            >
              <Text
                fontSize="sm"
                color={value === opt.id ? "brand.default" : "neutral.700"}
                fontWeight={value === opt.id ? "bold" : "normal"}
              >
                {opt.label}
              </Text>
              {value === opt.id && (
                <i
                  className="bx bx-check"
                  style={{
                    fontSize: "16px",
                    color: "var(--chakra-colors-brand-default)",
                  }}
                />
              )}
            </button>
          ))}
        </Box>
      )}
    </Box>
  );
}
