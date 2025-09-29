'use client'

import { useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { GlobeIcon } from 'lucide-react'

interface LanguageSelectorProps {
  className?: string
  buttonSize?: string
}

const languageOptions = [
  { value: 'en' as const, label: 'EN', flag: '🇺🇸' },
  { value: 'es' as const, label: 'ES', flag: '🇪🇸' },
  { value: 'ht' as const, label: 'HT', flag: '🇭🇹' },
  { value: 'fr' as const, label: 'FR', flag: '🇫🇷' }
];

export function LanguageSelector({ 
  className = '', 
  buttonSize = 'px-3 py-1' 
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Get current language from URL params
  const currentLanguage = (searchParams.get('lang') as 'en' | 'es' | 'ht' | 'fr') || 'en';
  
  const handleLanguageChange = (newLanguage: 'en' | 'es' | 'ht' | 'fr') => {
    // Create new URL with updated language parameter
    const params = new URLSearchParams(searchParams.toString());
    
    if (newLanguage === 'en') {
      // Remove lang param for English (default)
      params.delete('lang');
    } else {
      // Set the new language
      params.set('lang', newLanguage);
    }
    
    // Build the new URL
    const newUrl = params.toString() 
      ? `${pathname}?${params.toString()}`
      : pathname;
    
    // Navigate to the new URL (this will trigger a page refresh)
    router.push(newUrl);
    setIsOpen(false);
  };
  
  return (
    <div className={`relative ${className}`}>
      <button
        className={`flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all duration-300 ${buttonSize}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
      >
        <GlobeIcon className="w-5 h-5 text-[#00ff00]" />
        <span className="font-bold text-lg">
          {languageOptions.find(l => l.value === currentLanguage)?.flag}
        </span>
        <span className="ml-1 text-sm">
          {languageOptions.find(l => l.value === currentLanguage)?.label}
        </span>
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg z-[9999] min-w-[120px]">
          {languageOptions.map((option) => (
            <button
              key={option.value}
              className={`w-full px-4 py-2 text-left hover:bg-zinc-800 transition-colors flex items-center gap-2 ${
                currentLanguage === option.value ? 'bg-[#00ff00]/20 text-[#00ff00]' : 'text-white'
              }`}
              onClick={() => handleLanguageChange(option.value)}
            >
              <span className="text-lg">{option.flag}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
