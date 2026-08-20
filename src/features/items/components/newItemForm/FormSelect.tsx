"use client";

import { Box, Text, Portal } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown } from "@boxicons/react";
import styles from "./FormSelect.module.css";

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
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const selected = options.find((o) => o.id === value);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent, optId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(optId);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        ref.current &&
        !ref.current.contains(target) &&
        !target.closest("[data-formselect-dropdown]")
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    updateCoords();
    const handle = () => updateCoords();
    window.addEventListener("scroll", handle, true);
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("scroll", handle, true);
      window.removeEventListener("resize", handle);
    };
  }, [open]);

  const toggleOpen = () => {
    if (disabled) return;
    if (!open) updateCoords();
    setOpen((o) => !o);
  };

  return (
    <div className={styles.container} ref={ref}>
      <button
        ref={btnRef}
        type="button"
        data-testid={`select-${placeholder?.toLowerCase().replace(/\s/g, "-")}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        aria-disabled={disabled}
        onKeyDown={handleKeyDown}
        onClick={() => {
          if (!disabled) setOpen((o) => !o);
        }}
        className={buttonClassName}
      >
        <div className={styles.contentWrapper}>
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
          <p
            className={`${styles.text} ${
              selected ? styles.textSelected : styles.textPlaceholder
            }`}
          >
            {selected ? selected.label : placeholder}
          </p>
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
        <div className={styles.dropdown} role="listbox">
          {options.map((opt) => {
            const Icon = opt.iconClass;
            const isSelected = value === opt.id;

            return (
              <button
                key={opt.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                onKeyDown={(e) => handleOptionKeyDown(e, opt.id)}
                data-testid={`option-${opt.id}`}
                onClick={() => {
                  onChange(opt.id);
                  setOpen(false);
                }}
                className={`${styles.optionButton} ${
                  isSelected ? styles.optionSelected : ""
                }`}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
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
        </Portal>
      )}
    </div>
  );
}

export default FormSelect;
