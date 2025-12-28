import React, { useState } from 'react';
import { Settings2, X, Palette, Type, Info, Menu, Copy, Eye, Activity, Waves, Zap, Droplets, ChevronDown, ChevronUp, LayoutGrid, CircleDot, Highlighter, Square, Layers, FileText, Brush } from 'lucide-react';
import { ControlInput } from './ControlInput.js';
import { POPULAR_FONTS } from '../constants.js';

const ControlSection = ({
  title,
  icon,
  isOpen,
  onToggle,
  children,
  headerColorClass = "text-gray-400"
}) => {
  return React.createElement("div", { className: "border border-gray-800 bg-black/40 rounded-lg overflow-hidden transition-all duration-300" },
    React.createElement("button", {
      onClick: onToggle,
      className: "w-full flex items-center justify-between p-3 bg-gray-900/60 hover:bg-gray-800/80 transition-colors"
    },
      React.createElement("div", { className: `flex items-center gap-2 text-sm font-bold uppercase tracking-wide ${headerColorClass}` },
        icon,
        React.createElement("span", null, title)
      ),
      isOpen ? React.createElement(ChevronUp, { size: 16, className: "text-gray-500" }) : React.createElement(ChevronDown, { size: 16, className: "text-gray-500" })
    ),
    React.createElement("div", {
      className: `transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1200px] opacity-100 p-4' : 'max-h-0 opacity-0 p-0 overflow-hidden'}`
    },
      children
    )
  );
};

export const Controls = ({ settings, setSettings, uiVisible }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    layout: false,
    reaction: false,
    color: false,
    textContent: false,
    textStyle: false,
    textHighlight: false,
    shadowMirror: false,
    directions: true
  });

  const toggleSection = (key) => {
    setOpenSections(prev => {
      if (key === 'directions') {
        return { ...prev, directions: !prev.directions };
      }
      if (prev[key]) {
        return { ...prev, [key]: false };
      }
      const newState = Object.keys(prev).reduce((acc, k) => {
        if (k === 'directions') {
          acc[k] = prev[k];
        } else if (k === key) {
          acc[k] = true;
        } else {
          acc[k] = false;
        }
        return acc;
      }, {});
      return newState;
    });
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const updateSettingEvent = (key) => (e) => {
    updateSetting(key, e.target.value);
  };
  
  const updateSettingCheckbox = (key) => (e) => {
    updateSetting(key, e.target.checked);
  };

  if (!isOpen) {
    return React.createElement("button", {
      onClick: () => setIsOpen(true),
      className: `fixed bottom-6 right-6 z-50 rounded-full transition-all hover:scale-110 flex items-center justify-center duration-1000 ${uiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`,
      style: {
        backgroundColor: `hsl(${settings.baseHue}, 40%, 35%)`,
        width: '40px',
        height: '40px',
        boxShadow: '-2px 2px 2px rgba(0, 0, 0, 0.5)',
        border: '5px solid white'
      },
      "aria-label": "Open Controls"
    },
      React.createElement(Menu, { size: 20, className: "text-white/80" })
    );
  }

  return React.createElement("div", { className: `fixed top-0 right-0 h-full w-80 bg-black/95 backdrop-blur-xl border-l border-gray-800 z-50 overflow-y-auto transform transition-all duration-1000 ease-in-out shadow-2xl ${uiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}` },
    React.createElement("div", { className: "flex justify-between items-center p-6 border-b border-gray-800 bg-black/50 sticky top-0 z-10 backdrop-blur-lg" },
      React.createElement("h2", { className: "text-xl text-white font-['Orbitron'] tracking-wider" }, "CONTROLS"),
      React.createElement("button", {
        onClick: () => setIsOpen(false),
        className: "text-gray-500 hover:text-white transition-colors"
      },
        React.createElement(X, { size: 20 })
      )
    ),
    React.createElement("div", { className: "p-4 space-y-4 pb-20" },
      React.createElement(ControlSection, {
        title: "Directions",
        icon: React.createElement(Info, { size: 16 }),
        isOpen: openSections.directions,
        onToggle: () => toggleSection('directions'),
        headerColorClass: "text-cyan-400"
      },
        React.createElement("p", { className: "text-gray-400 text-xs leading-relaxed" },
          "Enable your microphone to activate the visuals. Explore different settings to craft your unique audio-visual experience. The interface will hide after 5 seconds of inactivity."
        )
      ),
      React.createElement(ControlSection, {
        title: "Layout",
        icon: React.createElement(LayoutGrid, { size: 16 }),
        isOpen: openSections.layout,
        onToggle: () => toggleSection('layout')
      },
        React.createElement("select", { value: settings.layoutMode, onChange: updateSettingEvent('layoutMode'), className: "w-full p-2 bg-gray-800 text-white rounded border border-gray-700 text-sm" },
          React.createElement("option", { value: "Grid" }, "Grid"),
          React.createElement("option", { value: "Vector" }, "Vector")
        )
      ),
      React.createElement(ControlSection, {
        title: "Audio Reaction",
        icon: React.createElement(Activity, { size: 16 }),
        isOpen: openSections.reaction,
        onToggle: () => toggleSection('reaction')
      },
        React.createElement("select", { value: settings.audioReactionMode, onChange: updateSettingEvent('audioReactionMode'), className: "w-full p-2 bg-gray-800 text-white rounded border border-gray-700 text-sm mb-4" },
          React.createElement("option", { value: "Ripple" }, "Ripple"),
          React.createElement("option", { value: "Wave" }, "Wave"),
          React.createElement("option", { value: "Immerse" }, "Immerse")
        ),
        React.createElement(ControlInput, {
          label: "Audio Gain",
          value: settings.audioGain,
          min: 0.1,
          max: 10,
          step: 0.1,
          onChange: (v) => updateSetting('audioGain', v)
        })
      ),
      React.createElement(ControlSection, {
        title: "Color Palette",
        icon: React.createElement(Palette, { size: 16 }),
        isOpen: openSections.color,
        onToggle: () => toggleSection('color')
      },
        React.createElement(ControlInput, {
          label: "Object Hue",
          value: settings.baseHue,
          min: 0,
          max: 360,
          step: 1,
          onChange: (v) => updateSetting('baseHue', v),
          gradient: `linear-gradient(90deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))`
        }),
        React.createElement(ControlInput, {
          label: "Object Saturation",
          value: settings.objectSaturation,
          min: 0,
          max: 100,
          step: 1,
          onChange: (v) => updateSetting('objectSaturation', v),
          gradient: `linear-gradient(90deg, hsl(${settings.baseHue}, 0%, 50%), hsl(${settings.baseHue}, 100%, 50%))`
        }),
        React.createElement(ControlInput, {
          label: "Background Hue",
          value: settings.backgroundColor,
          min: 0,
          max: 360,
          step: 1,
          onChange: (v) => updateSetting('backgroundColor', v),
          gradient: `linear-gradient(90deg, hsl(0, 50%, 22%), hsl(60, 50%, 22%), hsl(120, 50%, 22%), hsl(180, 50%, 22%), hsl(240, 50%, 22%), hsl(300, 50%, 22%), hsl(360, 50%, 22%))`
        }),
        React.createElement(ControlInput, {
          label: "Background Brightness",
          value: settings.backgroundBrightness,
          min: 0,
          max: 100,
          step: 1,
          onChange: (v) => updateSetting('backgroundBrightness', v),
          gradient: `linear-gradient(90deg, hsl(${settings.backgroundColor}, 50%, 0%), hsl(${settings.backgroundColor}, 50%, 100%))`
        })
      ),
      React.createElement(ControlSection, {
        title: "Text Content",
        icon: React.createElement(FileText, { size: 16 }),
        isOpen: openSections.textContent,
        onToggle: () => toggleSection('textContent')
      },
        React.createElement("input", { type: "text", placeholder: "Main Text", value: settings.textOverlay, onChange: updateSettingEvent('textOverlay'), className: "w-full p-2 bg-gray-800 text-white rounded border border-gray-700 text-sm mb-2" }),
        React.createElement("input", { type: "text", placeholder: "Sub Text", value: settings.subTextOverlay, onChange: updateSettingEvent('subTextOverlay'), className: "w-full p-2 bg-gray-800 text-white rounded border border-gray-700 text-sm" })
      ),
      React.createElement(ControlSection, {
        title: "Text Style",
        icon: React.createElement(Type, { size: 16 }),
        isOpen: openSections.textStyle,
        onToggle: () => toggleSection('textStyle')
      },
        React.createElement("select", { value: settings.fontFamily, onChange: updateSettingEvent('fontFamily'), className: "w-full p-2 bg-gray-800 text-white rounded border border-gray-700 text-sm mb-4" },
          POPULAR_FONTS.map(font => React.createElement("option", { key: font, value: font }, font))
        ),
        React.createElement("div", { className: "flex items-center gap-2 text-sm text-gray-300 mb-4" },
            React.createElement("input", { type: "checkbox", id: "customTextColor", checked: settings.customTextOverlayColor, onChange: updateSettingCheckbox('customTextOverlayColor'), className: "accent-cyan-500" }),
            React.createElement("label", { htmlFor: "customTextColor" }, "Custom Color")
        ),
        settings.customTextOverlayColor && React.createElement("div", null,
          React.createElement(ControlInput, { label: "Text Hue", value: settings.textOverlayHue, min: 0, max: 360, step: 1, onChange: v => updateSetting('textOverlayHue', v) }),
          React.createElement(ControlInput, { label: "Text Saturation", value: settings.textOverlaySaturation, min: 0, max: 100, step: 1, onChange: v => updateSetting('textOverlaySaturation', v) }),
          React.createElement(ControlInput, { label: "Text Brightness", value: settings.textOverlayBrightness, min: 0, max: 100, step: 1, onChange: v => updateSetting('textOverlayBrightness', v) })
        )
      ),
      React.createElement(ControlSection, {
        title: "Text Highlight",
        icon: React.createElement(Highlighter, { size: 16 }),
        isOpen: openSections.textHighlight,
        onToggle: () => toggleSection('textHighlight')
      },
        React.createElement("div", { className: "flex items-center gap-2 text-sm text-gray-300 mb-4" },
          React.createElement("input", { type: "checkbox", id: "textHighlight", checked: settings.textHighlight, onChange: updateSettingCheckbox('textHighlight'), className: "accent-cyan-500" }),
          React.createElement("label", { htmlFor: "textHighlight" }, "Enable Highlight")
        ),
        settings.textHighlight && React.createElement("div", null,
          React.createElement("select", { value: settings.textHighlightMode, onChange: updateSettingEvent('textHighlightMode'), className: "w-full p-2 bg-gray-800 text-white rounded border border-gray-700 text-sm mb-4" },
            React.createElement("option", { value: "Default" }, "Default (Black)"),
            React.createElement("option", { value: "Custom" }, "Custom Color")
          ),
          settings.textHighlightMode === 'Custom' && React.createElement("div", null,
            React.createElement(ControlInput, { label: "Highlight Hue", value: settings.textHighlightHue, min: 0, max: 360, step: 1, onChange: v => updateSetting('textHighlightHue', v) }),
            React.createElement(ControlInput, { label: "Highlight Saturation", value: settings.textHighlightSaturation, min: 0, max: 100, step: 1, onChange: v => updateSetting('textHighlightSaturation', v) }),
            React.createElement(ControlInput, { label: "Highlight Brightness", value: settings.textHighlightBrightness, min: 0, max: 100, step: 1, onChange: v => updateSetting('textHighlightBrightness', v) }),
            React.createElement(ControlInput, { label: "Highlight Opacity", value: settings.textHighlightOpacity, min: 0, max: 100, step: 1, onChange: v => updateSetting('textHighlightOpacity', v) })
          ),
          React.createElement(ControlInput, { label: "Padding", value: settings.textHighlightPadding, min: 0, max: 100, step: 1, onChange: v => updateSetting('textHighlightPadding', v) }),
          React.createElement(ControlInput, { label: "Y-Offset", value: settings.textHighlightYOffset, min: -100, max: 100, step: 1, onChange: v => updateSetting('textHighlightYOffset', v) }),
          React.createElement("div", { className: "flex items-center gap-2 text-sm text-gray-300 my-4" },
            React.createElement("input", { type: "checkbox", id: "textHighlightBorder", checked: settings.textHighlightBorder, onChange: updateSettingCheckbox('textHighlightBorder'), className: "accent-cyan-500" }),
            React.createElement("label", { htmlFor: "textHighlightBorder" }, "Enable Border")
          ),
          settings.textHighlightBorder && React.createElement("div", null,
            React.createElement(ControlInput, { label: "Border Hue", value: settings.textHighlightBorderHue, min: 0, max: 360, step: 1, onChange: v => updateSetting('textHighlightBorderHue', v) }),
            React.createElement(ControlInput, { label: "Border Saturation", value: settings.textHighlightBorderSaturation, min: 0, max: 100, step: 1, onChange: v => updateSetting('textHighlightBorderSaturation', v) }),
            React.createElement(ControlInput, { label: "Border Brightness", value: settings.textHighlightBorderBrightness, min: 0, max: 100, step: 1, onChange: v => updateSetting('textHighlightBorderBrightness', v) })
          )
        )
      ),
      React.createElement(ControlSection, {
        title: "Shadow / Mirror",
        icon: React.createElement(Layers, { size: 16 }),
        isOpen: openSections.shadowMirror,
        onToggle: () => toggleSection('shadowMirror')
      },
        React.createElement("div", { className: "flex items-center gap-2 text-sm text-gray-300 mb-4" },
          React.createElement("input", { type: "checkbox", id: "mirrorShadow", checked: settings.mirrorShadow, onChange: updateSettingCheckbox('mirrorShadow'), className: "accent-cyan-500" }),
          React.createElement("label", { htmlFor: "mirrorShadow" }, "Enable Mirror")
        ),
        settings.mirrorShadow && React.createElement("div", null,
          React.createElement(ControlInput, { label: "Angle", value: settings.mirrorAngle, min: 0, max: 360, step: 1, onChange: v => updateSetting('mirrorAngle', v) }),
          React.createElement(ControlInput, { label: "Distance", value: settings.mirrorDistance, min: 0, max: 50, step: 1, onChange: v => updateSetting('mirrorDistance', v) }),
          React.createElement(ControlInput, { label: "Hue", value: settings.mirrorHue, min: 0, max: 360, step: 1, onChange: v => updateSetting('mirrorHue', v) }),
          React.createElement(ControlInput, { label: "Saturation", value: settings.mirrorSaturation, min: 0, max: 100, step: 1, onChange: v => updateSetting('mirrorSaturation', v) }),
          React.createElement(ControlInput, { label: "Brightness", value: settings.mirrorBrightness, min: 0, max: 100, step: 1, onChange: v => updateSetting('mirrorBrightness', v) }),
          React.createElement(ControlInput, { label: "Opacity", value: settings.mirrorOpacity, min: 0, max: 100, step: 1, onChange: v => updateSetting('mirrorOpacity', v) }),
          React.createElement("div", { className: "flex items-center gap-2 text-sm text-gray-300 my-4" },
            React.createElement("input", { type: "checkbox", id: "mirrorFixedOpacity", checked: settings.mirrorFixedOpacity, onChange: updateSettingCheckbox('mirrorFixedOpacity'), className: "accent-cyan-500" }),
            React.createElement("label", { htmlFor: "mirrorFixedOpacity" }, "Fixed Opacity")
          )
        )
      )
    )
  );
};