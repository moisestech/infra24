'use client'

import React from 'react'
import Select from 'react-select'
import { Controller, useFormContext } from 'react-hook-form'
import { EnhancedFormField } from './EnhancedFormField'
import { cn } from '@/lib/utils'

interface ReactSelectFieldProps {
  name: string
  label: string
  description?: string
  helpText?: string
  required?: boolean
  error?: string
  options: Array<{ value: string; label: string; isDisabled?: boolean }>
  placeholder?: string
  isMulti?: boolean
  isSearchable?: boolean
  isClearable?: boolean
  isDisabled?: boolean
  className?: string
  characterLimit?: number
  wordLimit?: number
  examples?: string[]
}

const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    minHeight: '48px',
    borderColor: state.isFocused 
      ? '#3b82f6' 
      : state.hasValue 
        ? '#10b981' 
        : '#d1d5db',
    borderWidth: '2px',
    boxShadow: state.isFocused 
      ? '0 0 0 3px rgba(59, 130, 246, 0.1)' 
      : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#3b82f6' : '#9ca3af'
    },
    backgroundColor: 'white',
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'inherit'
  }),
  controlDark: (provided: any, state: any) => ({
    ...provided,
    minHeight: '48px',
    borderColor: state.isFocused 
      ? '#3b82f6' 
      : state.hasValue 
        ? '#10b981' 
        : '#4b5563',
    borderWidth: '2px',
    boxShadow: state.isFocused 
      ? '0 0 0 3px rgba(59, 130, 246, 0.1)' 
      : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#3b82f6' : '#6b7280'
    },
    backgroundColor: '#1f2937',
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'inherit'
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '8px 12px'
  }),
  input: (provided: any) => ({
    ...provided,
    margin: '0',
    padding: '0',
    color: 'inherit'
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#9ca3af',
    fontSize: '16px'
  }),
  placeholderDark: (provided: any) => ({
    ...provided,
    color: '#6b7280',
    fontSize: '16px'
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#111827',
    fontSize: '16px'
  }),
  singleValueDark: (provided: any) => ({
    ...provided,
    color: '#f9fafb',
    fontSize: '16px'
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: '#dbeafe',
    borderRadius: '6px',
    margin: '2px'
  }),
  multiValueDark: (provided: any) => ({
    ...provided,
    backgroundColor: '#1e40af',
    borderRadius: '6px',
    margin: '2px'
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: '#1e40af',
    fontSize: '14px',
    fontWeight: '500'
  }),
  multiValueLabelDark: (provided: any) => ({
    ...provided,
    color: '#dbeafe',
    fontSize: '14px',
    fontWeight: '500'
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: '#1e40af',
    '&:hover': {
      backgroundColor: '#bfdbfe',
      color: '#1e3a8a'
    }
  }),
  multiValueRemoveDark: (provided: any) => ({
    ...provided,
    color: '#dbeafe',
    '&:hover': {
      backgroundColor: '#1d4ed8',
      color: '#f0f9ff'
    }
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    zIndex: 9999
  }),
  menuDark: (provided: any) => ({
    ...provided,
    borderRadius: '8px',
    border: '1px solid #4b5563',
    backgroundColor: '#1f2937',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
    zIndex: 9999
  }),
  menuList: (provided: any) => ({
    ...provided,
    padding: '4px',
    maxHeight: '200px'
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#3b82f6'
      : state.isFocused
        ? '#dbeafe'
        : 'transparent',
    color: state.isSelected
      ? 'white'
      : state.isFocused
        ? '#1e40af'
        : '#374151',
    borderRadius: '6px',
    margin: '2px 0',
    padding: '8px 12px',
    fontSize: '16px',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: state.isSelected ? '#3b82f6' : '#bfdbfe'
    }
  }),
  optionDark: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#3b82f6'
      : state.isFocused
        ? '#1e40af'
        : 'transparent',
    color: state.isSelected
      ? 'white'
      : state.isFocused
        ? '#dbeafe'
        : '#d1d5db',
    borderRadius: '6px',
    margin: '2px 0',
    padding: '8px 12px',
    fontSize: '16px',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: state.isSelected ? '#3b82f6' : '#1d4ed8'
    }
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    backgroundColor: '#d1d5db'
  }),
  indicatorSeparatorDark: (provided: any) => ({
    ...provided,
    backgroundColor: '#4b5563'
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: '#6b7280',
    '&:hover': {
      color: '#374151'
    }
  }),
  dropdownIndicatorDark: (provided: any) => ({
    ...provided,
    color: '#9ca3af',
    '&:hover': {
      color: '#d1d5db'
    }
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    color: '#6b7280',
    '&:hover': {
      color: '#374151'
    }
  }),
  clearIndicatorDark: (provided: any) => ({
    ...provided,
    color: '#9ca3af',
    '&:hover': {
      color: '#d1d5db'
    }
  })
}

export function ReactSelectField({
  name,
  label,
  description,
  helpText,
  required,
  error,
  options,
  placeholder,
  isMulti = false,
  isSearchable = true,
  isClearable = true,
  isDisabled = false,
  className,
  characterLimit,
  wordLimit,
  examples
}: ReactSelectFieldProps) {
  const { control, watch } = useFormContext()
  const currentValue = watch(name)

  // Determine if we're in dark mode
  const isDarkMode = document.documentElement.classList.contains('dark')

  const getStyles = () => {
    if (isDarkMode) {
      return {
        control: customSelectStyles.controlDark,
        placeholder: customSelectStyles.placeholderDark,
        singleValue: customSelectStyles.singleValueDark,
        multiValue: customSelectStyles.multiValueDark,
        multiValueLabel: customSelectStyles.multiValueLabelDark,
        multiValueRemove: customSelectStyles.multiValueRemoveDark,
        menu: customSelectStyles.menuDark,
        option: customSelectStyles.optionDark,
        indicatorSeparator: customSelectStyles.indicatorSeparatorDark,
        dropdownIndicator: customSelectStyles.dropdownIndicatorDark,
        clearIndicator: customSelectStyles.clearIndicatorDark,
        valueContainer: customSelectStyles.valueContainer,
        input: customSelectStyles.input,
        menuList: customSelectStyles.menuList
      }
    }
    return {
      control: customSelectStyles.control,
      placeholder: customSelectStyles.placeholder,
      singleValue: customSelectStyles.singleValue,
      multiValue: customSelectStyles.multiValue,
      multiValueLabel: customSelectStyles.multiValueLabel,
      multiValueRemove: customSelectStyles.multiValueRemove,
      menu: customSelectStyles.menu,
      option: customSelectStyles.option,
      indicatorSeparator: customSelectStyles.indicatorSeparator,
      dropdownIndicator: customSelectStyles.dropdownIndicator,
      clearIndicator: customSelectStyles.clearIndicator,
      valueContainer: customSelectStyles.valueContainer,
      input: customSelectStyles.input,
      menuList: customSelectStyles.menuList
    }
  }

  return (
    <EnhancedFormField
      label={label}
      description={description}
      helpText={helpText}
      required={required}
      error={error}
      characterLimit={characterLimit}
      wordLimit={wordLimit}
      currentValue={isMulti ? (currentValue || []).map((v: any) => v.label).join(', ') : currentValue?.label || ''}
      examples={examples}
      className={className}
    >
      <Controller
        name={name}
        control={control}
        rules={{ required: required ? `${label} is required` : false }}
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            placeholder={placeholder}
            isMulti={isMulti}
            isSearchable={isSearchable}
            isClearable={isClearable}
            isDisabled={isDisabled}
            styles={getStyles()}
            className={cn("react-select-container", className)}
            classNamePrefix="react-select"
            menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
            menuPosition="fixed"
            value={field.value}
            onChange={(selectedOption) => {
              field.onChange(selectedOption)
            }}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
          />
        )}
      />
    </EnhancedFormField>
  )
}
