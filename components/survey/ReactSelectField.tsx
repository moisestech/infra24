'use client'

import React from 'react'
import Select from 'react-select'
import { Controller, useFormContext } from 'react-hook-form'
import { EnhancedFormField } from './EnhancedFormField'
import { cn } from '@/lib/utils'
import { useOrganizationTheme } from '@/components/carousel/OrganizationThemeContext'

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
  const formContext = useFormContext()
  
  // Handle case where form context is not available
  if (!formContext) {
    return (
      <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
        <p className="text-sm text-gray-500">Form not available</p>
      </div>
    )
  }
  
  const { control, watch } = formContext
  const currentValue = watch(name)

  // Get organization theme colors with fallback
  let themeColors
  try {
    const orgTheme = useOrganizationTheme()
    themeColors = orgTheme?.themeColors
  } catch (error) {
    console.warn('OrganizationTheme not available, using fallback colors')
  }

  // Fallback colors if themeColors is not available
  const fallbackColors = {
    primary: '#3b82f6',
    primaryLight: '#dbeafe',
    primaryDark: '#1e40af',
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    cardBackground: '#ffffff'
  }

  const colors = themeColors || fallbackColors

  // Determine if we're in dark mode
  const isDarkMode = document.documentElement.classList.contains('dark')

  const getStyles = () => {
    // Create organization-themed styles
    const orgStyles = {
      control: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: isDarkMode ? colors.cardBackground : '#ffffff',
        borderColor: state.isFocused ? colors.primary : (isDarkMode ? '#374151' : '#d1d5db'),
        borderWidth: '1px',
        boxShadow: state.isFocused ? `0 0 0 1px ${colors.primary}` : 'none',
        '&:hover': {
          borderColor: colors.primary
        }
      }),
      placeholder: (provided: any) => ({
        ...provided,
        color: isDarkMode ? '#9ca3af' : '#6b7280'
      }),
      singleValue: (provided: any) => ({
        ...provided,
        color: isDarkMode ? colors.textPrimary : '#111827'
      }),
      multiValue: (provided: any) => ({
        ...provided,
        backgroundColor: colors.primaryLight
      }),
      multiValueLabel: (provided: any) => ({
        ...provided,
        color: colors.primaryDark
      }),
      multiValueRemove: (provided: any) => ({
        ...provided,
        color: colors.primary,
        '&:hover': {
          backgroundColor: colors.primary,
          color: '#ffffff'
        }
      }),
      menu: (provided: any) => ({
        ...provided,
        backgroundColor: isDarkMode ? colors.cardBackground : '#ffffff',
        border: `1px solid ${colors.primary}`,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }),
      option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected 
          ? colors.primary 
          : state.isFocused 
            ? colors.primaryLight 
            : 'transparent',
        color: state.isSelected 
          ? '#ffffff' 
          : isDarkMode 
            ? colors.textPrimary 
            : '#111827',
        '&:hover': {
          backgroundColor: state.isSelected ? colors.primary : colors.primaryLight
        }
      }),
      indicatorSeparator: (provided: any) => ({
        ...provided,
        backgroundColor: isDarkMode ? '#374151' : '#d1d5db'
      }),
      dropdownIndicator: (provided: any) => ({
        ...provided,
        color: isDarkMode ? '#9ca3af' : '#6b7280',
        '&:hover': {
          color: colors.primary
        }
      }),
      clearIndicator: (provided: any) => ({
        ...provided,
        color: isDarkMode ? '#9ca3af' : '#6b7280',
        '&:hover': {
          color: colors.primary
        }
      }),
      valueContainer: (provided: any) => ({
        ...provided,
        padding: '2px 8px'
      }),
      input: (provided: any) => ({
        ...provided,
        color: isDarkMode ? colors.textPrimary : '#111827'
      }),
      menuList: (provided: any) => ({
        ...provided,
        maxHeight: '200px'
      })
    }

    return orgStyles
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
