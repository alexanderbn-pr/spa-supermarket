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
  onEditOption?: (id: number, value: string) => Promise<{ value: number; label: string }>;
}

export default function ComboboxField({
  field,
  control,
  errors,
  onCreateOption,
  onEditOption,
}: ComboboxFieldProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
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

  const handleEdit = (option: Option) => {
    setEditValue(option.label);
    setIsEditing(true);
    setValidationError(null);
    setTimeout(() => editInputRef.current?.select(), 0);
  };

  const handleSaveEdit = async (optionId: number, onChange: (value: number) => void) => {
    const trimmed = editValue.trim();
    
    if (!trimmed) {
      setValidationError('El valor no puede estar vacío');
      return;
    }
    
    if (!onEditOption) return;
    
    setIsSaving(true);
    setValidationError(null);
    try {
      const updatedOption = await onEditOption(optionId, trimmed);
      onChange(updatedOption.value);
      setIsEditing(false);
      setEditValue('');
    } catch (error) {
      console.error('Error updating option:', error);
      setValidationError('Error al guardar los cambios');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValue('');
    setValidationError(null);
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
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editValue}
                      onChange={(e) => {
                        setEditValue(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && selectedOption) {
                          handleSaveEdit(selectedOption.value, controllerField.onChange);
                        } else if (e.key === 'Escape') {
                          handleCancelEdit();
                        }
                      }}
                      className="flex-1 h-12 rounded-xl border border-gray-200 bg-white px-4 text-[#1d1d1f] 
                        focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20"
                      disabled={isSaving}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => selectedOption && handleSaveEdit(selectedOption.value, controllerField.onChange)}
                      disabled={isSaving || !editValue.trim()}
                      className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-50"
                      title="Guardar"
                    >
                      {isSaving ? (
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      title="Cancelar"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {validationError && (
                    <span className="text-sm text-red-500">{validationError}</span>
                  )}
                </div>
              ) : (
                <>
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
                    className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 pr-20 text-[#1d1d1f] 
                      focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20
                      placeholder:text-gray-400"
                    disabled={isCreating}
                    autoComplete="off"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {selectedOption && onEditOption && !isCreating && (
                      <button
                        type="button"
                        onClick={() => handleEdit(selectedOption)}
                        className="flex items-center justify-center p-1 text-gray-400 hover:text-[#0071e3] transition-colors"
                        title="Editar opción"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    )}
                    <div 
                      className="pointer-events-none"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
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
                </>
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