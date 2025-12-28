
import { VisualizerSettings } from "./types";

export const DEFAULT_SETTINGS: VisualizerSettings = {
  layoutMode: 'Grid',
  audioReactionMode: 'Ripple',
  audioGain: 2.5, // Default sensitivity
  audioHueShift: 60, // Default 60 degree shift on beat
  baseHue: 11, // Updated default
  objectSaturation: 100, // Updated default
  audioBrightnessBoost: 55, // Default brightness jump on beat
  backgroundColor: 225, // Updated default
  backgroundBrightness: 22, // Updated default
  textOverlay: "URBAN",
  customTextOverlayColor: false,
  textOverlayHue: 0,
  textOverlaySaturation: 100,
  textOverlayBrightness: 50,
  subTextOverlay: "SPEAK",
  mirrorShadow: true, // Toggled ON by default
  mirrorAngle: 45, // Defaults to roughly 2px down/right direction
  mirrorDistance: 4,
  mirrorHue: 0,
  mirrorSaturation: 100, // Default saturation
  mirrorBrightness: 50,
  mirrorOpacity: 100,
  mirrorFixedOpacity: false,
  customEffectColor: false,
  effectHue: 180,
  fontFamily: 'Orbitron',
  // Text Highlight Defaults
  textHighlight: false,
  textHighlightMode: 'Default',
  textHighlightHue: 0,
  textHighlightSaturation: 100,
  textHighlightBrightness: 50,
  textHighlightOpacity: 100,
  textHighlightPadding: 12,
  textHighlightYOffset: 0,
  textHighlightBorder: false,
  textHighlightBorderHue: 0,
  textHighlightBorderSaturation: 100,
  textHighlightBorderBrightness: 50,
};

export const POPULAR_FONTS = [
  'Orbitron', // Keep original as an option
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Lato',
  'Poppins',
  'Inter',
  'Nunito',
  'Playfair Display',
  'Rubik',
  'Oswald'
];