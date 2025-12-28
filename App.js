import React, { useState, useEffect } from 'react';
import { Visualizer } from './components/Visualizer.js';
import { Controls } from './components/Controls.js';
import { DEFAULT_SETTINGS } from './constants.js';

const App = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [uiVisible, setUiVisible] = useState(true);

  useEffect(() => {
    let timeoutId;

    const handleMouseMove = () => {
      setUiVisible(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setUiVisible(false);
      }, 5000);
    };

    timeoutId = setTimeout(() => {
      setUiVisible(false);
    }, 5000);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);

  return React.createElement("div", { className: "relative w-screen h-screen overflow-hidden bg-black text-white" },
    React.createElement("div", { className: "absolute inset-0 z-0" },
      React.createElement(Visualizer, { settings: settings, uiVisible: uiVisible })
    ),
    React.createElement(Controls, { settings: settings, setSettings: setSettings, uiVisible: uiVisible }),
    React.createElement("div", { className: `absolute bottom-6 left-6 z-10 opacity-50 hidden md:block transition-opacity duration-1000 ${uiVisible ? 'opacity-50' : 'opacity-0'}` },
      React.createElement("p", { className: "text-xs font-mono text-cyan-300/60 mt-1 pointer-events-none" }, "INTERACTIVE AUDIO VISUALIZER"),
      React.createElement("a", {
        href: "https://www.instagram.com/urbanmasque.tv",
        target: "_blank",
        rel: "noopener noreferrer",
        className: "text-xs font-mono text-cyan-300/60 mt-1 block hover:text-cyan-200/80 transition-colors"
      }, "INSTAGRAM.COM/URBANMASQUE.TV")
    )
  );
};

export default App;