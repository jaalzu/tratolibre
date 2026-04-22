"use client";

import { useState, useEffect, useRef } from "react";

interface Option {
  id: string;
  label: string;
}

export function useFilterSelect(value: string, options: Option[]) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((opt) => opt.id === value);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        close();
      }
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
    selected,
    toggle,
    close,
  };
}
