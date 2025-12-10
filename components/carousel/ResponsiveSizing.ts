/**
 * Responsive Sizing System
 * 
 * Provides a holistic approach to sizing text, images, and spacing
 * that adapts to different screen sizes, orientations, and pixel ratios.
 * 
 * Designed for:
 * - Large vertical displays (portrait, high resolution)
 * - Laptop fullscreen (landscape, standard resolution)
 * - Laptop half-screen (landscape, constrained width)
 * - Different pixel ratios (1x, 2x, Retina, etc.)
 */

export interface ScreenMetrics {
  width: number;
  height: number;
  pixelRatio: number;
  orientation: 'portrait' | 'landscape';
  isLargeDisplay: boolean;
  isConstrained: boolean;
}

export interface ResponsiveSizes {
  // Text sizes
  title: string;
  description: string;
  location: string;
  date: string;
  type: string;
  metadata: string;
  
  // Spacing
  padding: string;
  gap: string;
  spaceY: string;
  
  // Image settings
  imageScale: number;
  imageCardWidth: string;
  imageCardHeight: string;
  splitPercentage: number;
  
  // Icon sizes
  iconMultiplier: number;
  avatarMultiplier: number;
}

/**
 * Calculate screen metrics from window dimensions
 */
export function calculateScreenMetrics(): ScreenMetrics {
  if (typeof window === 'undefined') {
    return {
      width: 1920,
      height: 1080,
      pixelRatio: 1,
      orientation: 'landscape',
      isLargeDisplay: false,
      isConstrained: false
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const pixelRatio = window.devicePixelRatio || 1;
  const orientation = width / height >= 1.37 ? 'landscape' : 'portrait';
  
  // Large display: typically 4K or high-res vertical displays
  // Consider displays with height > 2000px or width > 3000px as large
  const isLargeDisplay = height > 2000 || width > 3000;
  
  // Constrained: width < 1400px (half-screen laptop or smaller)
  const isConstrained = width < 1400;

  return {
    width,
    height,
    pixelRatio,
    orientation,
    isLargeDisplay,
    isConstrained
  };
}

/**
 * Get responsive text sizes based on screen metrics
 */
export function getResponsiveTextSizes(metrics: ScreenMetrics): ResponsiveSizes {
  const { orientation, isLargeDisplay, isConstrained, pixelRatio, width, height } = metrics;
  
  // Base size multiplier based on pixel ratio
  // Higher pixel ratio = slightly smaller base sizes (since pixels are denser)
  const pixelRatioAdjustment = pixelRatio > 2 ? 0.9 : pixelRatio > 1.5 ? 0.95 : 1;
  
  // Orientation-based adjustments
  const isPortrait = orientation === 'portrait';
  
  // Calculate base scale
  // For large displays, we want larger text
  // For constrained screens, we want smaller text
  let baseScale = 1;
  if (isLargeDisplay) {
    baseScale = isPortrait ? 1.4 : 1.2;
  } else if (isConstrained) {
    baseScale = isPortrait ? 0.85 : 0.75;
  } else {
    baseScale = isPortrait ? 1.1 : 1.0;
  }
  
  // Apply pixel ratio adjustment
  baseScale *= pixelRatioAdjustment;
  
  // Calculate responsive sizes
  const sizes: ResponsiveSizes = {
    // Title: Largest text, most important
    title: getTextSizeClass(9, baseScale, isPortrait, isLargeDisplay),
    
    // Description: Secondary text, readable but not overwhelming
    description: getTextSizeClass(5, baseScale, isPortrait, isLargeDisplay),
    
    // Location: Important but secondary
    location: getTextSizeClass(4, baseScale, isPortrait, isLargeDisplay),
    
    // Date: Can be smaller
    date: getTextSizeClass(5, baseScale, isPortrait, isLargeDisplay),
    
    // Type badge: Medium size
    type: getTextSizeClass(6, baseScale, isPortrait, isLargeDisplay),
    
    // Metadata: Smallest, for details
    metadata: 'text-sm',
    
    // Spacing
    padding: getPaddingClass(baseScale, isPortrait, isConstrained),
    gap: getGapClass(baseScale, isPortrait),
    spaceY: getSpaceYClass(baseScale, isPortrait),
    
    // Image settings
    imageScale: getImageScale(baseScale, isConstrained),
    imageCardWidth: getImageCardWidth(isPortrait, isConstrained, width),
    imageCardHeight: getImageCardHeight(isPortrait, isConstrained, height),
    splitPercentage: getSplitPercentage(isConstrained),
    
    // Icon and avatar multipliers
    iconMultiplier: getIconMultiplier(isPortrait, isLargeDisplay, width, height),
    avatarMultiplier: getAvatarMultiplier(isPortrait, isLargeDisplay)
  };
  
  return sizes;
}

/**
 * Get Tailwind text size class based on scale
 */
function getTextSizeClass(
  baseSize: number, 
  scale: number, 
  isPortrait: boolean, 
  isLargeDisplay: boolean
): string {
  // Base sizes: text-xs (0.75rem) to text-9xl (8rem)
  // We'll use a scale that maps to Tailwind classes
  
  // Calculate effective size
  let effectiveSize = baseSize * scale;
  
  // For portrait, slightly increase
  if (isPortrait) {
    effectiveSize *= 1.1;
  }
  
  // Clamp to reasonable range
  effectiveSize = Math.max(2, Math.min(9, effectiveSize));
  
  // Map to Tailwind classes
  const sizeMap: { [key: number]: string } = {
    2: 'text-2xl',
    3: 'text-3xl',
    4: 'text-4xl',
    5: 'text-5xl',
    6: 'text-6xl',
    7: 'text-7xl',
    8: 'text-8xl',
    9: 'text-9xl'
  };
  
  // Round to nearest
  const rounded = Math.round(effectiveSize);
  return sizeMap[rounded] || sizeMap[Math.floor(effectiveSize)] || 'text-4xl';
}

/**
 * Get responsive padding class
 */
function getPaddingClass(scale: number, isPortrait: boolean, isConstrained: boolean): string {
  if (isConstrained) {
    return isPortrait ? 'p-8 md:p-12' : 'p-6 md:p-10';
  }
  return isPortrait ? 'p-16 md:p-24 xl:p-32 2xl:p-40' : 'p-12 md:p-20 xl:p-28 2xl:p-36';
}

/**
 * Get responsive gap class
 */
function getGapClass(scale: number, isPortrait: boolean): string {
  return isPortrait ? 'gap-8 md:gap-12 xl:gap-16' : 'gap-6 md:gap-10 xl:gap-14';
}

/**
 * Get responsive vertical spacing class
 */
function getSpaceYClass(scale: number, isPortrait: boolean): string {
  if (isPortrait) {
    return 'space-y-12 md:space-y-16 xl:space-y-20 2xl:space-y-24';
  }
  return 'space-y-8 md:space-y-12 xl:space-y-16 2xl:space-y-20';
}

/**
 * Get image scale based on screen constraints
 */
function getImageScale(baseScale: number, isConstrained: boolean): number {
  if (isConstrained) {
    return Math.max(0.8, baseScale * 0.9);
  }
  return Math.min(1.2, baseScale);
}

/**
 * Get image card width
 */
function getImageCardWidth(isPortrait: boolean, isConstrained: boolean, width: number): string {
  if (isConstrained) {
    // Use percentage of screen width for constrained screens
    const percentage = isPortrait ? 35 : 30;
    return `${Math.floor(width * (percentage / 100))}px`;
  }
  
  // Fixed sizes for larger screens
  if (isPortrait) {
    return 'w-64 xl:w-80 2xl:w-96';
  }
  return 'w-80 xl:w-96 2xl:w-[28rem]';
}

/**
 * Get image card height
 */
function getImageCardHeight(isPortrait: boolean, isConstrained: boolean, height: number): string {
  if (isConstrained) {
    // Use percentage of screen height
    const percentage = isPortrait ? 40 : 35;
    return `${Math.floor(height * (percentage / 100))}px`;
  }
  
  // Fixed sizes for larger screens
  if (isPortrait) {
    return 'h-80 xl:h-96 2xl:h-[28rem]';
  }
  return 'h-96 xl:h-[28rem] 2xl:h-[32rem]';
}

/**
 * Get split percentage for split layouts
 */
function getSplitPercentage(isConstrained: boolean): number {
  // Constrained screens: give more space to content
  return isConstrained ? 35 : 40;
}

/**
 * Get icon size multiplier
 */
function getIconMultiplier(isPortrait: boolean, isLargeDisplay: boolean, width?: number, height?: number): number {
  // Check for specific ratio: 1080px x 1808px (approximately 0.597 aspect ratio) - use 2.0x
  if (width && height) {
    const aspectRatio = width / height;
    
    // Check if it's close to 1080/1808 ≈ 0.597
    if (Math.abs(aspectRatio - (1080/1808)) < 0.05 && width >= 1050 && width <= 1110 && height >= 1750 && height <= 1850) {
      return 2.0;
    }
    
    // Check for specific ratio: 1028px x 1998px (approximately 0.51 aspect ratio) - use 2.0x
    if (Math.abs(aspectRatio - (1028/1998)) < 0.05 && width >= 1000 && width <= 1100 && height >= 1900 && height <= 2100) {
      return 2.0;
    }
  }
  
  // Check for width 1028px or less (but not the specific ratios above) - use 1.5x
  if (width && width <= 1028) {
    return 1.5;
  }
  
  const defaultMultiplier = isLargeDisplay 
    ? (isPortrait ? 6 : 4)
    : (isPortrait ? 5 : 3);
  return defaultMultiplier;
}

/**
 * Get avatar size multiplier
 */
function getAvatarMultiplier(isPortrait: boolean, isLargeDisplay: boolean): number {
  if (isLargeDisplay) {
    return isPortrait ? 10 : 8;
  }
  return isPortrait ? 8 : 6;
}

/**
 * Get card layout specific padding
 */
export function getCardLayoutPadding(metrics: ScreenMetrics): string {
  const { isConstrained, orientation } = metrics;
  
  if (isConstrained) {
    return orientation === 'portrait' ? 'p-3 md:p-4' : 'p-2 md:p-3';
  }
  return orientation === 'portrait' ? 'p-4 md:p-6 xl:p-8' : 'p-3 md:p-5 xl:p-6';
}

/**
 * Get split layout specific padding
 */
export function getSplitLayoutPadding(metrics: ScreenMetrics): string {
  const { isConstrained, orientation } = metrics;
  
  if (isConstrained) {
    return orientation === 'portrait' ? 'p-6 md:p-10' : 'p-4 md:p-8';
  }
  return orientation === 'portrait' ? 'p-8 md:p-12 xl:p-16' : 'p-6 md:p-10 xl:p-14';
}

