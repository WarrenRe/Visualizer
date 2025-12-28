
export type AudioReactionMode = 'Ripple' | 'Wave' | 'Immerse';
export type LayoutMode = 'Grid' | 'Vector';

export interface VisualizerSettings {
  layoutMode: LayoutMode;
  audioReactionMode: AudioReactionMode;
  audioGain: number; // Microphone input sensitivity multiplier
  audioHueShift: number; // 0-360 Range of hue change on audio impact
  baseHue: number; // 0-360 Hue
  objectSaturation: number; // 0-100 Saturation
  audioBrightnessBoost: number; // 0-100 How much brightness increases on beat
  backgroundColor: number; // 0-360 Hue
  backgroundBrightness: number; // 0-100 Lightness
  textOverlay: string;
  customTextOverlayColor: boolean; // Toggle for manual text color
  textOverlayHue: number; // 0-360
  textOverlaySaturation: number; // 0-100
  textOverlayBrightness: number; // 0-100
  subTextOverlay: string;
  mirrorShadow: boolean;
  mirrorAngle: number; // 0-360 degrees
  mirrorDistance: number; // 0-50 px
  mirrorHue: number; // 0-360 Hue
  mirrorSaturation: number; // 0-100 Saturation
  mirrorBrightness: number; // 0-100 Lightness
  mirrorOpacity: number; // 0-100 Opacity
  mirrorFixedOpacity: boolean; // true = constant, false = dynamic (mirrors text behavior)
  customEffectColor: boolean; // Override relative shift with specific target color
  effectHue: number; // 0-360 Target hue for effect
  fontFamily: string;
  // Text Highlight Settings
  textHighlight: boolean;
  textHighlightMode: 'Default' | 'Custom';
  textHighlightHue: number;
  textHighlightSaturation: number;
  textHighlightBrightness: number;
  textHighlightOpacity: number;
  textHighlightPadding: number; // Controls height/size
  textHighlightYOffset: number; // Controls vertical position
  textHighlightBorder: boolean;
  textHighlightBorderHue: number;
  textHighlightBorderSaturation: number;
  textHighlightBorderBrightness: number;
}

export interface AudioData {
  volume: number;      // 0 - 255 avg
  frequencyData: Uint8Array;
}