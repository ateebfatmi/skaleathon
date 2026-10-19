'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, MapPin, X } from 'lucide-react';

interface LocationInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<string | { name: string; subtitle?: string; state?: string }>;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  onSelectOption?: (item: string | { name?: string; label?: string; value: string; subtitle?: string; state?: string }) => void;
  helperText?: string;
}

export function LocationInput({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  disabled = false,
  onSelectOption,
  helperText,
}: LocationInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Normalize options into uniform { name, label, value, subtitle, state }
  const normalizedOptions = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'string') {
        return { name: opt, label: opt, value: opt, subtitle: undefined, state: undefined };
      }
      return {
        name: opt.name,
        label: opt.name,
        value: opt.name,
        subtitle: opt.subtitle || opt.state,
        state: opt.state,
      };
    });
  }, [options]);

  // Filter based on input value
  const filteredOptions = useMemo(() => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) {
      return normalizedOptions;
    }
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(trimmed) ||
        (opt.subtitle && opt.subtitle.toLowerCase().includes(trimmed))
    );
  }, [normalizedOptions, value]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && highlightIndex >= 0 && listRef.current) {
      const activeElement = listRef.current.children[highlightIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightIndex, isOpen]);

  const handleSelect = (item: (typeof normalizedOptions)[0]) => {
    onChange(item.value);
    if (onSelectOption) {
      onSelectOption(item);
    }
    setIsOpen(false);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightIndex(0);
      } else {
        setHighlightIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightIndex(filteredOptions.length - 1);
      } else {
        setHighlightIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
      }
    } else if (e.key === 'Enter') {
      if (isOpen && highlightIndex >= 0 && highlightIndex < filteredOptions.length) {
        e.preventDefault();
        handleSelect(filteredOptions[highlightIndex]);
      } else if (isOpen && filteredOptions.length === 1) {
        e.preventDefault();
        handleSelect(filteredOptions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
        <span>
          {label} {required && <span className="text-red-400">*</span>}
        </span>
        {helperText && (
          <span className="text-[10px] text-neutral-500 font-normal">{helperText}</span>
        )}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          required={required}
          disabled={disabled}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
            setHighlightIndex(0);
          }}
          onFocus={() => {
            setIsOpen(true);
            setHighlightIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full rounded-xl border border-white/10 bg-[#141414] pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-[#c19a88] focus:ring-1 focus:ring-[#c19a88]/30 focus:outline-none transition-colors"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && (
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
                setIsOpen(true);
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-neutral-500 hover:text-white hover:bg-white/5 transition-colors"
              title="Clear"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          <button
            type="button"
            tabIndex={-1}
            onClick={() => {
              if (!disabled) {
                setIsOpen(!isOpen);
                inputRef.current?.focus();
              }
            }}
            className="p-1 rounded-md text-neutral-400 hover:text-white transition-colors"
          >
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-[#c19a88]' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Floating Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl border border-white/10 bg-[#141414] shadow-2xl shadow-black/90 backdrop-blur-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <ul
            ref={listRef}
            className="max-h-56 overflow-y-auto py-1 divide-y divide-white/[0.04] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item, idx) => {
                const isSelected =
                  value.trim().toLowerCase() === item.value.toLowerCase();
                const isHighlighted = idx === highlightIndex;

                return (
                  <li
                    key={`${item.value}-${idx}`}
                    onMouseEnter={() => setHighlightIndex(idx)}
                    onClick={() => handleSelect(item)}
                    className={`px-3.5 py-2 text-xs cursor-pointer flex items-center justify-between transition-colors ${
                      isHighlighted
                        ? 'bg-[#805948]/25 text-white'
                        : isSelected
                        ? 'bg-white/[0.04] text-[#e8c5b4]'
                        : 'text-neutral-300 hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MapPin
                        className={`h-3 w-3 flex-shrink-0 ${
                          isSelected ? 'text-[#c19a88]' : 'text-neutral-500'
                        }`}
                      />
                      <span className="font-medium truncate">{item.label}</span>
                      {item.subtitle && (
                        <span className="text-[10px] text-neutral-500 font-mono">
                          • {item.subtitle}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="h-3 w-3 text-[#c19a88] flex-shrink-0 ml-2" />
                    )}
                  </li>
                );
              })
            ) : (
              <li className="px-3.5 py-3 text-center">
                <p className="text-[11px] text-neutral-400">No matching preset found</p>
                {value.trim() && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    className="mt-1.5 inline-block text-[10px] font-mono text-[#c19a88] hover:underline"
                  >
                    Use &ldquo;{value.trim()}&rdquo; as custom entry
                  </button>
                )}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
