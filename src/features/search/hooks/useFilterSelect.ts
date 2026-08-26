"use client";

import { useState, useEffect, useRef } from "react";

interface Option {
  id: string;
  label: string;
}

export function useFilterSelect(value: string, options: Option[]) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = options.find((opt) => opt.id === value);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (ref.current?.contains(target) || dropdownRef.current?.contains(target)) return;
      close();
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return {
    open,
    ref,
    dropdownRef,
    selected,
    toggle,
    close,
  };
}
