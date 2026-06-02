import {
  CARD_IMAGE_MAX_HEIGHT,
  CARD_IMAGE_MAX_HEIGHT_SCALE,
  cardImageUsesFullWidth,
  cardImageUsesNaturalLandscapeWidth,
  isSmartSignViewport,
  LANDSCAPE_CARD_IMAGE_CLASS,
  resolveLandscapeCardImageMaxHeight,
} from '@/lib/display/announcement-image-frame';

describe('announcement-image-frame', () => {
  it('uses natural width for landscape card images except film posters', () => {
    expect(cardImageUsesNaturalLandscapeWidth('landscape', false)).toBe(true);
    expect(cardImageUsesNaturalLandscapeWidth('portrait', false)).toBe(false);
    expect(cardImageUsesNaturalLandscapeWidth('landscape', true)).toBe(false);
  });

  it('landscape card image classes preserve ratio', () => {
    expect(LANDSCAPE_CARD_IMAGE_CLASS).toContain('w-full');
    expect(LANDSCAPE_CARD_IMAGE_CLASS).toContain('object-contain');
    expect(LANDSCAPE_CARD_IMAGE_CLASS).toContain('h-auto');
  });

  it('scales card max heights by 40%', () => {
    expect(CARD_IMAGE_MAX_HEIGHT_SCALE).toBe(1.4);
    expect(CARD_IMAGE_MAX_HEIGHT.landscapeNatural).toBe('min(78.4vh, 1176px)');
    expect(CARD_IMAGE_MAX_HEIGHT.portrait).toBe('min(61.6vh, 756px)');
  });

  it('uses full-width card images on smart-sign viewport width', () => {
    expect(isSmartSignViewport({ width: 1080 })).toBe(true);
    expect(cardImageUsesFullWidth('portrait', false, { width: 1080 }, false)).toBe(true);
    expect(cardImageUsesFullWidth('portrait', true, { width: 1080 }, false)).toBe(false);
  });

  it('caps landscape card image height on portrait kiosks', () => {
    expect(resolveLandscapeCardImageMaxHeight({ width: 1080, height: 1920, orientation: 'portrait' })).toBe(
      'min(44vh, 845px)'
    );
    expect(resolveLandscapeCardImageMaxHeight({ width: 1080, height: 720, orientation: 'landscape' })).toBe(
      'min(52vh, 374px)'
    );
  });
});
