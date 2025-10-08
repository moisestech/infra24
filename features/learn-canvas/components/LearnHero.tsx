'use client'

import React, { useState, useEffect, useRef } from 'react';
import type { Workshop } from '@/types/workshop';

import { useRouter } from 'next/navigation';

// CLERK
import { useAuth, useUser } from '@clerk/nextjs';

// HOOKS
// useSubscriptionStore not available
// useLanguage not available

// SERVICE
import { workshopClientService } from '../services/workshop.client.service';

// THIRD PARTY
import { motion, useMotionValue } from 'framer-motion';
import Masonry from 'react-masonry-css';
import masonryStyles from './LearnHeroMasonry.module.css';
import { useWorkshops } from '../hooks/useWorkshops';
import { useOnboarding } from '../hooks/useOnboarding';
import { TypeAnimation } from 'react-type-animation';
// ASCIIAnimation component not available

export default function LearnHero() {
  // Simple fallback for language support
  const t = (key: string) => key;
  const language: string = 'en';
  
  const CREATIVE_TECH_OPTIONS = [
    t('learn.hero.questionnaire.options.ai_tools'),
    t('learn.hero.questionnaire.options.generative_art'),
    t('learn.hero.questionnaire.options.interactive'),
    t('learn.hero.questionnaire.options.creative_coding'),
    t('learn.hero.questionnaire.options.prompt_engineering'),
    t('learn.hero.questionnaire.options.ai_music'),
    t('learn.hero.questionnaire.options.ar_vr'),
    t('learn.hero.questionnaire.options.other'),
  ];

  const [selected, setSelected] = useState<string[]>([]);
  const { workshops, loading: workshopsLoading, error: workshopsError } = useWorkshops();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showQuestionnaireHighlight, setShowQuestionnaireHighlight] = useState(false);
  const { submitOnboarding, isSubmitting, error: onboardingError } = useOnboarding();

  const handleCheckbox = (option: string) => {
    setSelected(sel => sel.includes(option) ? sel.filter(o => o !== option) : [...sel, option]);
  };

  const handleContinue = async () => {
    if (selected.length === 0) return;

    try {
      await submitOnboarding({
        selectedInterests: selected,
      });

      // Redirect based on user state
      if (isSignedIn) {
        // Show personalized workshop recommendations
        router.push('/learn?onboarding=complete');
      } else {
        // Redirect to signup with onboarding data
        router.push('/sign-up?onboarding=complete');
      }

    } catch (err) {
      console.error('Onboarding submission failed:', err);
      // Show error message to user
    }
  };

  const handleWorkshopClick = (workshopSlug: string) => {
    // If user hasn't selected any interests, highlight the questionnaire
    if (selected.length === 0) {
      setShowQuestionnaireHighlight(true);
      
      // Add a visual highlight effect
      const questionnaireSection = document.querySelector('.questionnaire-section');
      if (questionnaireSection) {
        questionnaireSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        questionnaireSection.classList.add('highlight-pulse');
        setTimeout(() => {
          questionnaireSection.classList.remove('highlight-pulse');
        }, 3000);
      }
      
      return; // Prevent navigation
    }
    
    // If user has selected interests, allow navigation
    if (isSignedIn) {
      router.push(`/learn/${workshopSlug}`);
    } else {
      router.push('/sign-up');
    }
  };

  // Animation settings
  const ITEM_HEIGHT = 350; // px
  const VISIBLE_ROWS = 3;
  const ANIMATION_DURATION = 12; // seconds for a full loop
  const SPEED = (ITEM_HEIGHT * VISIBLE_ROWS) / ANIMATION_DURATION; // px per second

  // Duplicate workshops to create a seamless loop
  const animatedWorkshops = [...workshops, ...workshops];

  // Calculate total height to animate
  const totalHeight = ITEM_HEIGHT * VISIBLE_ROWS;

  // Masonry breakpoints - 2 columns on mobile, 2 on desktop
  const breakpointColumnsObj = {
    default: 2,
    640: 2,  // Small screens: 2 columns
    480: 2,  // Extra small screens: 2 columns
  };

  // Marquee animation with manual rAF
  const y = useMotionValue(0);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying || isPaused) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      lastTimeRef.current = null;
      return;
    }
    function animate(now: number) {
      if (lastTimeRef.current == null) lastTimeRef.current = now;
      const elapsed = (now - lastTimeRef.current) / 1000; // seconds
      lastTimeRef.current = now;
      let currentY = y.get();
      currentY -= SPEED * elapsed;
      if (currentY <= -totalHeight) {
        currentY += totalHeight;
      }
      y.set(currentY);
      frameRef.current = requestAnimationFrame(animate);
    }
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      lastTimeRef.current = null;
    };
  }, [isPlaying, isPaused, totalHeight, SPEED, y]);

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  // Simple fallback for subscription support
  const canAccessWorkshop = true; // Allow access by default
  const hasActiveSubscription = true; // Assume active subscription

  // Log user and subscription state on mount and when relevant values change
  useEffect(() => {
    console.log('[LearnHero] User/Access State:', {
      isSignedIn,
      user,
      hasActiveSubscription: hasActiveSubscription,
      canAccessWorkshop: typeof canAccessWorkshop === 'function' ? '[Function]' : canAccessWorkshop
    });
  }, [isSignedIn, user, hasActiveSubscription, canAccessWorkshop]);

  return (
    <div className="w-full min-h-[calc(100vh-200px)] flex flex-col lg:flex-row bg-black text-white relative overflow-hidden">
      {/* Left Column */}
      <div className="flex-1 flex flex-col justify-center lg:pr-12 pt-24 pb-12 px-4 lg:px-0 max-w-xl mx-auto relative z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-none learn-heading">
          <div className="type-animation-container">
            <TypeAnimation
              key={language} // Force re-render when language changes
              sequence={[
                t('learn.hero.title'),
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="block"
            />
          </div>
        </h1>
        <p className="text-lg text-gray-200 mb-6 learn-body">
          {t('learn.hero.subtitle')}
        </p>
        <div className="mb-2 text-base font-semibold learn-body">{t('learn.hero.questionnaire.title')}</div>
        <div className={`flex flex-col gap-1 mb-6 questionnaire-section ${showQuestionnaireHighlight ? 'highlight-pulse' : ''}`}>
          {CREATIVE_TECH_OPTIONS.map(option => (
            <label key={option} className="flex items-center gap-2 sm:gap-3 bg-zinc-800 rounded-lg px-3 sm:px-4 py-2 sm:py-3 cursor-pointer hover:bg-zinc-700 transition">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => handleCheckbox(option)}
                className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 text-lime-500 rounded focus:ring-0 border-zinc-600 bg-zinc-900"
              />
              <span className="text-sm sm:text-base text-white learn-body leading-tight">{option}</span>
            </label>
          ))}
        </div>
        <button
          onClick={handleContinue}
          disabled={!selected.length || isSubmitting}
          className={`mt-2 py-2 sm:py-3 px-4 sm:px-6 rounded-lg text-base sm:text-lg font-bold transition-all duration-200 ${
            selected.length && !isSubmitting 
              ? 'text-black cursor-pointer' 
              : 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
          }`}
          style={{ 
            width: 'auto', 
            minWidth: 'unset',
            backgroundColor: selected.length && !isSubmitting ? '#00ff00' : undefined,
            border: selected.length && !isSubmitting ? '1px solid #00ff00' : undefined
          }}
        >
          <span className="min-w-[60px] sm:min-w-[80px] inline-block">
            {isSubmitting ? t('learn.hero.questionnaire.saving') : t('learn.hero.questionnaire.continue')}
          </span>
        </button>
        {onboardingError && (
          <p className="text-red-400 text-sm mt-2">{onboardingError}</p>
        )}
      </div>
      {/* Right Column: Animated Masonry Grid */}
      <div className="flex-1 flex items-center justify-center relative min-h-[60vh] lg:min-h-screen px-4 lg:px-8">
        {/* Fade Gradients */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-24 z-10"
             style={{background: 'linear-gradient(to bottom, #000 0%, transparent 80%)'}} />
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-24 z-10"
             style={{background: 'linear-gradient(to top, #000 0%, transparent 80%)'}} />
        {/* Animated Masonry Container */}
        <motion.div
          className="relative w-full max-w-2xl h-[50vh] sm:h-[60vh] md:h-[80vh] lg:h-[100vh] overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            style={{ y }}
          >
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex w-full gap-2 sm:gap-3 lg:gap-4"
              columnClassName={`masonry-column flex flex-col gap-2 sm:gap-3 lg:gap-4 ${masonryStyles.staggeredColumn}`}
            >
              {animatedWorkshops.map((workshop, i) => {
                const isGlowing = hoveredIndex === i || (isPaused && hoveredIndex === i);
                const canAccess = canAccessWorkshop || hasActiveSubscription;
                return (
                  <div
                    key={i + '-' + workshop.id}
                    className={`relative rounded-lg sm:rounded-xl overflow-hidden aspect-[4/5] bg-zinc-900 border border-zinc-800 shadow-lg group transition-all duration-300 ${isGlowing ? 'glow' : ''}`}
                    style={{ minHeight: ITEM_HEIGHT, cursor: 'pointer' }}
                    onMouseEnter={() => { setHoveredIndex(i); setIsPaused(true); }}
                    onMouseLeave={() => { setHoveredIndex(null); setIsPaused(false); }}
                    onClick={() => handleWorkshopClick(workshop.id)}
                  >
                    <img src={workshop.image_url || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=400&q=80'} alt={workshop.title} className="object-cover w-full h-full" loading="lazy" />
                    {hoveredIndex === i && (
                      <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center p-3 sm:p-6 transition-opacity duration-300 opacity-100">
                        <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2 text-lime-400 text-center leading-tight">{workshop.title}</h3>
                        {workshop.description && <div className="text-xs sm:text-md text-gray-200 mb-1 sm:mb-2 text-center leading-tight">{workshop.description}</div>}
                        {workshop.description && <div className="text-xs sm:text-sm text-gray-300 text-center leading-tight line-clamp-3">{workshop.description}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </Masonry>
          </motion.div>
          {/* Play/Pause Button */}
          <button
            className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 bg-black/70 rounded-full p-2 sm:p-3 border border-white/20 hover:bg-black/90 transition"
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-7 sm:h-7 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 5.25v13.5m10.5-13.5v13.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-7 sm:h-7 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.25l13.5 6.75-13.5 6.75V5.25z" />
              </svg>
            )}
          </button>
        </motion.div>
      </div>
      <style jsx>{`
        .glow {
          box-shadow: 0 0 32px 8px #00ff99, 0 0 0 4px #00ff99;
          border-color: #00ff99;
          z-index: 2;
        }
        
        .type-animation-container {
          height: 2em;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        
        .type-animation-container span {
          display: block;
          min-height: 1.2em;
          line-height: 1.2em;
          white-space: nowrap;
        }
        
        .highlight-pulse {
          animation: highlightPulse 2s ease-in-out;
          border: 2px solid #00ff99;
          border-radius: 8px;
          box-shadow: 0 0 20px rgba(0, 255, 153, 0.5);
        }
        
        @keyframes highlightPulse {
          0% {
            border-color: #00ff99;
            box-shadow: 0 0 20px rgba(0, 255, 153, 0.5);
          }
          50% {
            border-color: #00ff99;
            box-shadow: 0 0 30px rgba(0, 255, 153, 0.8);
          }
          100% {
            border-color: transparent;
            box-shadow: none;
          }
        }
        
        /* Mobile-specific masonry improvements */
        @media (max-width: 640px) {
          .masonry-column {
            margin-top: 0 !important;
          }
          
          .masonry-column:first-child {
            margin-top: 0 !important;
          }
        }
        
        /* Ensure proper touch targets on mobile */
        @media (max-width: 768px) {
          .masonry-column > div {
            min-height: 200px;
          }
        }
      `}</style>
    </div>
  );
} 