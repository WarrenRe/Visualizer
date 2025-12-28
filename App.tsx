import React, { useState, useEffect } from 'react';
import { Visualizer } from './components/Visualizer';
import { Controls } from './components/Controls';
import { DEFAULT_SETTINGS } from './constants';
import { VisualizerSettings } from './types';

const App: React.FC = () => {
  const [settings, setSettings] = useState<VisualizerSettings>(DEFAULT_SETTINGS);
  const [uiVisible, setUiVisible] = useState(true);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleMouseMove = () => {
      setUiVisible(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setUiVisible(false);
      }, 5000);
    };

    // Initial timer
    timeoutId = setTimeout(() => {
      setUiVisible(false);
    }, 5000);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white">
      {/* Background/Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <Visualizer settings={settings} uiVisible={uiVisible} />
      </div>

      {/* UI Overlay Layer */}
      <Controls settings={settings} setSettings={setSettings} uiVisible={uiVisible} />

      {/* Title / Info (Optional, hidden on small screens) */}
      <div className={`absolute bottom-6 left-6 z-10 pointer-events-none opacity-50 hidden md:block transition-opacity duration-1000 ${uiVisible ? 'opacity-50' : 'opacity-0'}`}>
        <p className="text-xs font-mono text-cyan-300/60 mt-1">INTERACTIVE AUDIO VISUALIZER</p>
      </div>
    </div>
  );
};

export default App;