'use client';

import { useState, useRef, useEffect } from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { RecipeFormData } from '@/app/recipe/new/config/schema';

interface Option {
  value: number;
  label: string;
}

interface ComboboxFieldProps {
  field: {
    name: keyof RecipeFormData;
    label: string;
    placeholder?: string;
    options?: Option[];
  };
  control: Control<RecipeFormData>;
  errors: FieldErrors<RecipeFormData>;
  onCreateOption?: (value: string) => Promise<{ value: number; label: string }>;
}

export default function ComboboxField({
  field,
  control,
  errors,
  onCreateOption,
}: ComboboxFieldProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const options = field.options ?? [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && 
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search
  const filteredOptions = inputValue
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    : options;

  const handleSelect = (optionValue: number, onChange: (value: number) => void) => {
    onChange(optionValue);
    setShowDropdown(false);
    setActiveIndex(-1);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, onChange: (value: number) => void) => {
    if (!showDropdown && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setShowDropdown(true);
      return;
    }
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => prev < filteredOptions.length - 1 ? prev + 1 : 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => prev > 0 ? prev - 1 : filteredOptions.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && filteredOptions[activeIndex]) {
          handleSelect(filteredOptions[activeIndex].value, onChange);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setActiveIndex(-1);
        break;
    }
  };

  const handleCreate = async (onChange: (value: number) => void) => {
    if (!inputValue.trim() || !onCreateOption) return;
    setIsCreating(true);
    try {
      const newOption = await onCreateOption(inputValue.trim());
      onChange(newOption.value);
      setInputValue('');
      setShowDropdown(false);
      setActiveIndex(-1);
    } catch (error) {
      console.error('Error creating option:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-2" ref={dropdownRef}>
      <label className="text-sm font-medium text-[#1d1d1f]">{field.label}</label>
      <Controller
        name={field.name}
        control={control}
        render={({ field: controllerField }) => {
          const selectedOption = options.find(o => o.value === controllerField.value);

          return (
            <div className="relative">
              <input
                {...controllerField}
                ref={inputRef}
                type="text"
                value={inputValue || selectedOption?.label || ''}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setShowDropdown(true);
                  setActiveIndex(-1);
                  const selected = options.find(
                    opt => opt.label.toLowerCase() === e.target.value.toLowerCase()
                  );
                  if (selected) {
                    controllerField.onChange(selected.value);
                  }
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onKeyDown={(e) => handleKeyDown(e, controllerField.onChange)}
                placeholder={field.placeholder || 'Escribe o selecciona...'}
                className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 pr-10 text-[#1d1d1f] 
                  focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20
                  placeholder:text-gray-400"
                disabled={isCreating}
                autoComplete="off"
              />
              <div 
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {showDropdown && (
                <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
                  {filteredOptions.length === 0 && !inputValue.trim() ? (
                    <div className="px-4 py-3 text-sm text-gray-400">
                      Escribe para buscar...
                    </div>
                  ) : (
                    filteredOptions.map((option, index) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSelect(option.value, controllerField.onChange)}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 
                          ${index === activeIndex ? 'bg-gray-100' : ''}
                          ${controllerField.value === option.value ? 'bg-[#0071e3]/10 text-[#0071e3] font-medium' : 'text-[#1d1d1f]'}`}
                      >
                        {option.label}
                      </button>
                    ))
                  )}
                  
                  {inputValue.trim() &&
                    !options.some(opt => opt.label.toLowerCase() === inputValue.toLowerCase()) && (
                      <button
                        type="button"
                        onClick={() => handleCreate(controllerField.onChange)}
                        disabled={isCreating}
                        className="w-full px-4 py-3 text-left text-sm text-[#0071e3] hover:bg-gray-50 border-t border-gray-100 font-medium"
                      >
                        {isCreating ? 'Creando...' : `+ Crear "${inputValue.trim()}"`}
                      </button>
                  )}
                </div>
              )}
            </div>
          );
        }}
      />
      {errors[field.name] && (
        <span className="text-sm text-red-500">{errors[field.name]?.message}</span>
      )}
    </div>
  );
}