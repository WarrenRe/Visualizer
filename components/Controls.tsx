import React, { useState } from 'react';
import { Settings2, X, Palette, Type, Info, Menu, Copy, Eye, Activity, Waves, Zap, Droplets, ChevronDown, ChevronUp, LayoutGrid, CircleDot, Highlighter, Instagram, MessageCircle, Square, Layers, FileText, Brush } from 'lucide-react';
import { VisualizerSettings, AudioReactionMode, LayoutMode } from '../types';
import { ControlInput } from './ControlInput';
import { POPULAR_FONTS } from '../constants';

interface ControlsProps {
  settings: VisualizerSettings;
  setSettings: React.Dispatch<React.SetStateAction<VisualizerSettings>>;
  uiVisible: boolean;
}

interface ControlSectionProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  headerColorClass?: string;
}

const ControlSection: React.FC<ControlSectionProps> = ({ 
  title, 
  icon, 
  isOpen, 
  onToggle, 
  children,
  headerColorClass = "text-gray-400"
}) => {
  return (
    <div className="border border-gray-800 bg-black/40 rounded-lg overflow-hidden transition-all duration-300">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-gray-900/60 hover:bg-gray-800/80 transition-colors"
      >
        <div className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wide ${headerColorClass}`}>
          {icon}
          <span>{title}</span>
        </div>
        {isOpen ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1200px] opacity-100 p-4' : 'max-h-0 opacity-0 p-0 overflow-hidden'}`}
      >
        {children}
      </div>
    </div>
  );
};

export const Controls: React.FC<ControlsProps> = ({ settings, setSettings, uiVisible }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Directions starts open, others closed
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    layout: false,
    reaction: false,
    color: false,
    textContent: false,
    textStyle: false,
    textHighlight: false,
    shadowMirror: false,
    directions: true,
    sayHi: false
  });

  const toggleSection = (key: string) => {
    setOpenSections(prev => {
      // Directions behaves independently
      if (key === 'directions') {
        return { ...prev, directions: !prev.directions };
      }

      // If we are closing the currently open section, just close it
      if (prev[key]) {
        return { ...prev, [key]: false };
      }

      // Enforce the "one at a time" rule outside of directions
      const newState = Object.keys(prev).reduce((acc, k) => {
        if (k === 'directions') {
          acc[k] = prev[k];
        } else if (k === key) {
          acc[k] = true;
        } else {
          acc[k] = false;
        }
        return acc;
      }, {} as Record<string, boolean>);
      
      return newState;
    });
  };

  const updateSetting = <K extends keyof VisualizerSettings>(key: K, value: VisualizerSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 rounded-full transition-all hover:scale-110 flex items-center justify-center duration-1000 ${uiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{
          backgroundColor: `hsl(${settings.baseHue}, 40%, 35%)`,
          width: '40px', 
          height: '40px',
          boxShadow: '-2px 2px 2px rgba(0, 0, 0, 0.5)', 
          border: '5px solid white'
        }}
        aria-label="Open Controls"
      >
        <Menu size={20} className="text-white/80" />
      </button>
    );
  }

  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-black/95 backdrop-blur-xl border-l border-gray-800 z-50 overflow-y-auto transform transition-all duration-1000 ease-in-out shadow-2xl ${uiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-black/50 sticky top-0 z-10 backdrop-blur-lg">
        <h2 className="text-xl text-white font-['Orbitron'] tracking-wider">CONTROLS</h2>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-4 space-y-4 pb-20">
        
        {/* Layout */}
        <ControlSection 
          title="Layout" 
          icon={<LayoutGrid size={16} />}
          isOpen={openSections.layout}
          onToggle={() => toggleSection('layout')}
          headerColorClass="text-purple-400"
        >
          <div className="grid grid-cols-2 gap-2">
            {(['Grid', 'Vector'] as LayoutMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => updateSetting('layoutMode', mode)}
                className={`flex flex-col items-center justify-center p-3 rounded-md border transition-all duration-300 ${
                  settings.layoutMode === mode 
                    ? 'bg-purple-900/50 border-purple-500 text-purple-400' 
                    : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600'
                }`}
              >
                {mode === 'Grid' && <LayoutGrid size={20} className="mb-1" />}
                {mode === 'Vector' && <CircleDot size={20} className="mb-1" />}
                <span className="text-[10px] uppercase font-bold tracking-wider">{mode}</span>
              </button>
            ))}
          </div>
        </ControlSection>

        {/* Reaction Style */}
        <ControlSection 
          title="Reaction Style" 
          icon={<Activity size={16} />}
          isOpen={openSections.reaction}
          onToggle={() => toggleSection('reaction')}
          headerColorClass="text-cyan-500"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {(['Ripple', 'Wave', 'Immerse'] as AudioReactionMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateSetting('audioReactionMode', mode)}
                  className={`flex flex-col items-center justify-center p-2 rounded-md border transition-all duration-300 ${
                    settings.audioReactionMode === mode 
                      ? 'bg-cyan-900/50 border-cyan-500 text-cyan-400' 
                      : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600'
                  }`}
                >
                  {mode === 'Ripple' && <Droplets size={18} className="mb-1" />}
                  {mode === 'Wave' && <Waves size={18} className="mb-1" />}
                  {mode === 'Immerse' && <Zap size={18} className="mb-1" />}
                  <span className="text-[10px] uppercase font-bold tracking-wider">{mode}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-800/50">
              <ControlInput 
                label="Mic Sensitivity" 
                value={settings.audioGain} 
                min={0.1} max={10.0} step={0.1} 
                onChange={(v) => updateSetting('audioGain', v)} 
                gradient="linear-gradient(to right, #004d40, #00acc1, #e0f7fa)"
              />
            </div>
          </div>
        </ControlSection>

        {/* Color & Light */}
        <ControlSection
          title="Color & Light"
          icon={<Palette size={16} />}
          isOpen={openSections.color}
          onToggle={() => toggleSection('color')}
          headerColorClass="text-fuchsia-500"
        >
          <div className="space-y-6">
            <ControlInput 
              label="Object Hue" 
              value={settings.baseHue} 
              min={0} max={360} step={1} 
              onChange={(v) => updateSetting('baseHue', v)} 
              gradient="linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)"
            />
            <ControlInput 
              label="Object Saturation" 
              value={settings.objectSaturation} 
              min={0} max={100} step={1} 
              onChange={(v) => updateSetting('objectSaturation', v)} 
              gradient="linear-gradient(to right, #444, #f0f)"
            />
            
            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                 <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Custom Effect Color</span>
                 <button 
                  onClick={() => updateSetting('customEffectColor', !settings.customEffectColor)}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${settings.customEffectColor ? 'bg-fuchsia-500' : 'bg-gray-700'}`}
                 >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${settings.customEffectColor ? 'left-6' : 'left-1'}`} />
                 </button>
              </div>

              {settings.customEffectColor ? (
                <div className="animate-in fade-in duration-300">
                   <ControlInput 
                    label="Effect Hue" 
                    value={settings.effectHue} 
                    min={0} max={360} step={1} 
                    onChange={(v) => updateSetting('effectHue', v)} 
                    gradient="linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)"
                  />
                </div>
              ) : (
                <ControlInput 
                  label="Audio Hue Shift" 
                  value={settings.audioHueShift} 
                  min={0} max={360} step={1} 
                  onChange={(v) => updateSetting('audioHueShift', v)} 
                  gradient="linear-gradient(to right, #333, #666)"
                />
              )}
              
               <ControlInput 
                label="Brightness Boost" 
                value={settings.audioBrightnessBoost} 
                min={0} max={100} step={1} 
                onChange={(v) => updateSetting('audioBrightnessBoost', v)} 
                gradient="linear-gradient(to right, #000, #fff)"
              />
            </div>
            
            <ControlInput 
              label="Background Hue" 
              value={settings.backgroundColor} 
              min={0} max={360} step={1} 
              onChange={(v) => updateSetting('backgroundColor', v)} 
              gradient="linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)"
            />

            <ControlInput 
              label="Background Brightness" 
              value={settings.backgroundBrightness} 
              min={0} max={100} step={1} 
              onChange={(v) => updateSetting('backgroundBrightness', v)} 
              gradient="linear-gradient(to right, #000000, #ffffff)"
            />
          </div>
        </ControlSection>

        {/* Text Content */}
        <ControlSection
          title="Text Content"
          icon={<FileText size={16} />}
          isOpen={openSections.textContent}
          onToggle={() => toggleSection('textContent')}
          headerColorClass="text-emerald-500"
        >
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-400 text-xs uppercase tracking-widest mb-2 font-bold">Main Projection</label>
              <input 
                type="text"
                value={settings.textOverlay}
                onChange={(e) => updateSetting('textOverlay', e.target.value.toUpperCase())}
                placeholder="ENTER WORD..."
                maxLength={12}
                className="bg-gray-900 border border-gray-700 text-white px-3 py-3 rounded-md focus:outline-none focus:border-cyan-500 font-['Orbitron'] tracking-widest text-center uppercase"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-400 text-xs uppercase tracking-widest mb-2 font-bold">Secondary Text</label>
              <input 
                type="text"
                value={settings.subTextOverlay}
                onChange={(e) => updateSetting('subTextOverlay', e.target.value.toUpperCase())}
                placeholder="SUBTITLE..."
                maxLength={20}
                className="bg-gray-900 border border-gray-700 text-white px-3 py-3 rounded-md focus:outline-none focus:border-cyan-500 font-['Orbitron'] tracking-widest text-center uppercase"
              />
            </div>
          </div>
        </ControlSection>

        {/* Text Style & Typography */}
        <ControlSection
          title="Text Style"
          icon={<Brush size={16} />}
          isOpen={openSections.textStyle}
          onToggle={() => toggleSection('textStyle')}
          headerColorClass="text-amber-500"
        >
          <div className="space-y-6">
            <div className="bg-gray-900/40 rounded-lg p-3 border border-gray-800">
              <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center gap-2">
                    <Palette size={14} className="text-amber-400" />
                    <label className="text-gray-400 text-xs uppercase tracking-widest font-bold">Custom Text Color</label>
                 </div>
                 <button 
                  onClick={() => updateSetting('customTextOverlayColor', !settings.customTextOverlayColor)}
                  className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${settings.customTextOverlayColor ? 'bg-amber-500' : 'bg-gray-700'}`}
                 >
                  <div 
                    className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${settings.customTextOverlayColor ? 'left-6' : 'left-1'}`}
                  />
                </button>
              </div>
              
              {settings.customTextOverlayColor && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 pt-2 border-t border-gray-700/50">
                  <ControlInput 
                    label="Text Hue" 
                    value={settings.textOverlayHue} 
                    min={0} max={360} step={1} 
                    onChange={(v) => updateSetting('textOverlayHue', v)} 
                    gradient="linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)"
                  />
                  <ControlInput 
                    label="Text Brightness" 
                    value={settings.textOverlayBrightness} 
                    min={0} max={100} step={1} 
                    onChange={(v) => updateSetting('textOverlayBrightness', v)} 
                    gradient="linear-gradient(to right, black, white)"
                  />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-gray-400 text-xs uppercase tracking-widest font-bold">Font Family</label>
              <div className="grid grid-cols-2 gap-2">
                {POPULAR_FONTS.map((font) => (
                  <button
                    key={font}
                    onClick={() => updateSetting('fontFamily', font)}
                    className={`p-2 text-xs rounded-md border transition-all ${
                      settings.fontFamily === font
                        ? 'bg-amber-900/40 border-amber-500 text-amber-400'
                        : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600'
                    }`}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ControlSection>

        {/* Text Highlight */}
        <ControlSection
          title="Text Highlight"
          icon={<Highlighter size={16} />}
          isOpen={openSections.textHighlight}
          onToggle={() => toggleSection('textHighlight')}
          headerColorClass="text-yellow-500"
        >
          <div className="bg-gray-900/40 rounded-lg p-3 border border-gray-800">
              <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center gap-2">
                    <Highlighter size={14} className="text-yellow-400" />
                    <label className="text-gray-400 text-xs uppercase tracking-widest font-bold">Enable Highlight</label>
                 </div>
                 <button 
                  onClick={() => updateSetting('textHighlight', !settings.textHighlight)}
                  className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${settings.textHighlight ? 'bg-yellow-500' : 'bg-gray-700'}`}
                 >
                  <div 
                    className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${settings.textHighlight ? 'left-6' : 'left-1'}`}
                  />
                </button>
              </div>
              
              {settings.textHighlight && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 pt-2 border-t border-gray-700/50">
                   <ControlInput 
                    label="Height / Padding" 
                    value={settings.textHighlightPadding} 
                    min={0} max={100} step={1} 
                    onChange={(v) => updateSetting('textHighlightPadding', v)} 
                  />
                   <ControlInput 
                    label="Vertical Position" 
                    value={settings.textHighlightYOffset} 
                    min={-100} max={100} step={1} 
                    onChange={(v) => updateSetting('textHighlightYOffset', v)} 
                  />

                   <div className="grid grid-cols-2 gap-2 mb-4">
                    {(['Default', 'Custom'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => updateSetting('textHighlightMode', mode)}
                        className={`p-2 text-[10px] uppercase font-bold tracking-wider rounded-md border transition-all ${
                          settings.textHighlightMode === mode
                            ? 'bg-yellow-900/40 border-yellow-500 text-yellow-400'
                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>

                  {settings.textHighlightMode === 'Custom' && (
                    <div className="space-y-4">
                      <ControlInput 
                        label="Highlight Hue" 
                        value={settings.textHighlightHue} 
                        min={0} max={360} step={1} 
                        onChange={(v) => updateSetting('textHighlightHue', v)} 
                        gradient="linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)"
                      />
                      <ControlInput 
                        label="Highlight Brightness" 
                        value={settings.textHighlightBrightness} 
                        min={0} max={100} step={1} 
                        onChange={(v) => updateSetting('textHighlightBrightness', v)} 
                      />
                      <ControlInput 
                        label="Highlight Opacity" 
                        value={settings.textHighlightOpacity} 
                        min={0} max={100} step={1} 
                        onChange={(v) => updateSetting('textHighlightOpacity', v)} 
                      />
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-gray-400 text-xs uppercase tracking-widest font-bold">Border</label>
                      <button 
                        onClick={() => updateSetting('textHighlightBorder', !settings.textHighlightBorder)}
                        className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${settings.textHighlightBorder ? 'bg-orange-500' : 'bg-gray-700'}`}
                      >
                        <div 
                          className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${settings.textHighlightBorder ? 'left-6' : 'left-1'}`}
                        />
                      </button>
                    </div>

                    {settings.textHighlightBorder && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        <ControlInput 
                          label="Border Hue" 
                          value={settings.textHighlightBorderHue} 
                          min={0} max={360} step={1} 
                          onChange={(v) => updateSetting('textHighlightBorderHue', v)} 
                          gradient="linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)"
                        />
                         <ControlInput 
                          label="Border Brightness" 
                          value={settings.textHighlightBorderBrightness} 
                          min={0} max={100} step={1} 
                          onChange={(v) => updateSetting('textHighlightBorderBrightness', v)} 
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
        </ControlSection>

        {/* Shadow & Mirror */}
        <ControlSection
          title="Shadow & Mirror"
          icon={<Layers size={16} />}
          isOpen={openSections.shadowMirror}
          onToggle={() => toggleSection('shadowMirror')}
          headerColorClass="text-cyan-400"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-900 p-3 rounded-md border border-gray-800">
              <label className="text-gray-400 text-xs uppercase tracking-widest font-bold">Mirror Shadow</label>
              <button 
                onClick={() => updateSetting('mirrorShadow', !settings.mirrorShadow)}
                className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${settings.mirrorShadow ? 'bg-cyan-500' : 'bg-gray-700'}`}
              >
                <div 
                  className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${settings.mirrorShadow ? 'left-6' : 'left-1'}`}
                />
              </button>
            </div>

            {settings.mirrorShadow && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4 bg-gray-900/30 p-3 rounded-lg border border-gray-800">
                 <ControlInput 
                  label="Distance" 
                  value={settings.mirrorDistance} 
                  min={0} max={50} step={1} 
                  onChange={(v) => updateSetting('mirrorDistance', v)} 
                />
                <ControlInput 
                  label="Angle" 
                  value={settings.mirrorAngle} 
                  min={0} max={360} step={1} 
                  onChange={(v) => updateSetting('mirrorAngle', v)} 
                />
                <ControlInput 
                  label="Shadow Hue" 
                  value={settings.mirrorHue} 
                  min={0} max={360} step={1} 
                  onChange={(v) => updateSetting('mirrorHue', v)} 
                  gradient="linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)"
                />
                <ControlInput 
                  label="Shadow Brightness" 
                  value={settings.mirrorBrightness} 
                  min={0} max={100} step={1} 
                  onChange={(v) => updateSetting('mirrorBrightness', v)} 
                />
                <ControlInput 
                  label="Shadow Opacity" 
                  value={settings.mirrorOpacity} 
                  min={0} max={100} step={1} 
                  onChange={(v) => updateSetting('mirrorOpacity', v)} 
                />
                <div className="flex items-center justify-between p-1">
                   <label className="text-gray-400 text-xs uppercase tracking-widest font-bold">Fixed Opacity</label>
                   <button 
                    onClick={() => updateSetting('mirrorFixedOpacity', !settings.mirrorFixedOpacity)}
                    className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${settings.mirrorFixedOpacity ? 'bg-cyan-500' : 'bg-gray-700'}`}
                   >
                    <div 
                      className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${settings.mirrorFixedOpacity ? 'left-6' : 'left-1'}`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </ControlSection>

        {/* Directions */}
        <ControlSection
          title="Directions"
          icon={<Info size={16} />}
          isOpen={openSections.directions}
          onToggle={() => toggleSection('directions')}
          headerColorClass="text-blue-500"
        >
          <div className="text-gray-300 text-xs leading-relaxed font-mono flex flex-col gap-2">
            <p>- Interactive to Audio Inputs.</p>
            <p>- Text tries to cover window width.</p>
            <p>- Use "Text Content" to change words.</p>
            <p>- Use "Text Style" for fonts and colors.</p>
            <p>- Enjoy!</p>
          </div>
        </ControlSection>
        
        {/* Say Hi! */}
        <ControlSection
          title="Say Hi!"
          icon={<MessageCircle size={16} />}
          isOpen={openSections.sayHi}
          onToggle={() => toggleSection('sayHi')}
          headerColorClass="text-pink-500"
        >
          <a 
            href="https://www.instagram.com/urbanmasque.tv/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 p-4 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-pink-500/50 hover:bg-pink-900/10 transition-all group"
          >
            <Instagram size={24} className="text-pink-500 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-bold tracking-widest text-sm text-gray-300 group-hover:text-pink-400 transition-colors">urbanmasque.tv</span>
          </a>
        </ControlSection>

      </div>
    </div>
  );
};