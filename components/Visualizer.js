import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

export const Visualizer = ({ settings, uiVisible }) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [micPermission, setMicPermission] = useState('unknown');

  const objects = useRef([]);
  const ripples = useRef([]);
  const waves = useRef([]);
  const globalTime = useRef(0);
  const lastAudioTimeRef = useRef(Date.now());
  
  const GRID_SPACING = 27.5; 
  const SPHERE_RADIUS = 9; 

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const startAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      
      analyser.fftSize = 256; 
      analyser.smoothingTimeConstant = 0.5;
      source.connect(analyser);
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
      
      setAudioEnabled(true);
      setMicPermission('granted');
      lastAudioTimeRef.current = Date.now();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setMicPermission('denied');
    }
  };

  const stopAudio = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setAudioEnabled(false);
  };

  const initGrid = (w, h) => {
    const arr = [];
    let id = 0;

    if (settings.layoutMode === 'Vector') {
      const cx = w / 2;
      const cy = h / 2;
      const maxRadius = Math.sqrt(cx * cx + cy * cy);
      const numRays = 30; 
      let r = 30; 
      while (r < maxRadius) {
        const calculatedSize = Math.max(2, r * 0.05);
        const tangentialLimit = ((Math.PI * 2 * r) / numRays) / 2 * 0.85;
        const size = Math.min(calculatedSize, tangentialLimit);
        for (let i = 0; i < numRays; i++) {
          const theta = (i * Math.PI * 2) / numRays;
          const bx = cx + Math.cos(theta) * r;
          const by = cy + Math.sin(theta) * r;
          arr.push({id: id++, baseX: bx, baseY: by, x: bx, y: by, vx: 0, vy: 0, size: size, hop: 0, hopVel: 0, currentRadius: size});
        }
        r += (size * 2) + 10;
      }
    } else {
      const cols = Math.ceil(w / GRID_SPACING) + 2; 
      const rows = Math.ceil(h / GRID_SPACING) + 2;
      const totalW = cols * GRID_SPACING;
      const totalH = rows * GRID_SPACING;
      const offsetX = (w - totalW) / 2;
      const offsetY = (h - totalH) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = c * GRID_SPACING + offsetX;
          const by = r * GRID_SPACING + offsetY;
          arr.push({id: id++, baseX: bx, baseY: by, x: bx, y: by, vx: 0, vy: 0, size: SPHERE_RADIUS, hop: 0, hopVel: 0, currentRadius: SPHERE_RADIUS});
        }
      }
    }
    objects.current = arr;
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        initGrid(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    initGrid(window.innerWidth, window.innerHeight);
    return () => window.removeEventListener('resize', handleResize);
  }, [settings.layoutMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); 
    if (!ctx) return;
    
    const SPRING_STIFFNESS = 0.03;
    const SPRING_DAMPING = isMobile ? 0.05 : 0.08; 
    const DRAG = isMobile ? 0.94 : 0.90; 
    const RIPPLE_SPEED_BASE = 22.5; 
    const RIPPLE_WIDTH = 40; 
    const ANCHOR_STRENGTH = 0.05;
    const COLLISION_STIFFNESS = 0.08;
    const RIPPLE_PUSH_FORCE = 0.075;

    const animate = () => {
      let volume = 0;
      let isLoud = false;
      let normalizedVol = 0;
      
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        const avg = dataArrayRef.current.reduce((a, b) => a + b, 0) / dataArrayRef.current.length;
        const sensitivity = settings.audioGain;
        volume = Math.min(avg * sensitivity, 255); 
        normalizedVol = volume / 255;
        if (volume > 25) isLoud = true;
      }

      if (isLoud) {
        lastAudioTimeRef.current = Date.now();
      }

      const timeSinceAudio = Date.now() - lastAudioTimeRef.current;
      const shrinkDuration = 8000;
      const shrinkProgress = Math.min(timeSinceAudio / shrinkDuration, 1);
      const idleSizeScale = 1 - (0.5 * shrinkProgress);

      globalTime.current += 0.01;
      
      const w = canvas.width = window.innerWidth;
      const h = canvas.height = window.innerHeight;
      const cx = w / 2;
      const cy = h / 2;
      const maxDist = Math.sqrt(cx*cx + cy*cy);

      // DEBUGGING CHANGE: Force background to red
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, w, h);

      const isWaveMode = settings.audioReactionMode === 'Wave';
      
      if (isWaveMode) {
        if (isLoud && Math.random() > 0.92) waves.current.push({ x: 0, strength: normalizedVol, active: true });
        for (let i = waves.current.length - 1; i >= 0; i--) {
            const wv = waves.current[i];
            wv.x += RIPPLE_SPEED_BASE;
            if (wv.x > w + 200) waves.current.splice(i, 1);
        }
      } else {
        if (isLoud && Math.random() > 0.85) ripples.current.push({ r: 0, strength: normalizedVol, active: true });
        for (let i = ripples.current.length - 1; i >= 0; i--) {
            const r = ripples.current[i];
            r.r += RIPPLE_SPEED_BASE + (r.strength * 10); 
            if (r.r > maxDist * 1.5) ripples.current.splice(i, 1);
        }
      }

      const hasRipples = ripples.current.length > 0;
      const hasWaves = waves.current.length > 0;
      const objCount = objects.current.length;
      const baseHue = settings.baseHue;
      const audioHueShift = settings.audioHueShift;

      for (let i = 0; i < objCount; i++) {
        const obj = objects.current[i];
        const springForce = -SPRING_STIFFNESS * obj.hop - SPRING_DAMPING * obj.hopVel;
        obj.hopVel += springForce;
        if (isWaveMode && hasWaves) {
            for (const wv of waves.current) {
                const waveX = wv.x + Math.sin(obj.y * 0.01 + globalTime.current) * 50;
                const dist = Math.abs(obj.baseX - waveX);
                if (dist < RIPPLE_WIDTH) {
                    obj.hopVel += wv.strength * 0.08;
                    const push = wv.strength * RIPPLE_PUSH_FORCE;
                    obj.vx += push; 
                }
            }
        } else if (!isWaveMode && hasRipples) {
            const dx = obj.baseX - cx;
            const dy = obj.baseY - cy;
            const distFromCenter = Math.sqrt(dx * dx + dy * dy);
            const dirX = distFromCenter > 0 ? dx / distFromCenter : 0;
            const dirY = distFromCenter > 0 ? dy / distFromCenter : 0;
            for (const rip of ripples.current) {
                if (Math.abs(distFromCenter - rip.r) < RIPPLE_WIDTH) {
                    obj.hopVel += rip.strength * 0.08; 
                    const push = rip.strength * RIPPLE_PUSH_FORCE;
                    obj.vx += dirX * push;
                    obj.vy += dirY * push;
                }
            }
        }
        obj.hop += obj.hopVel;
        if (obj.hop < 0) { obj.hop = 0; obj.hopVel *= -0.5; }
        const safeHop = Math.min(obj.hop, 8); 
        const bounceScale = 1 + (safeHop * 0.2); 
        obj.currentRadius = obj.size * idleSizeScale * bounceScale;
      }

      for (let i = 0; i < objCount; i++) {
        const obj = objects.current[i];
        const ax = (obj.baseX - obj.x) * ANCHOR_STRENGTH;
        const ay = (obj.baseY - obj.y) * ANCHOR_STRENGTH;
        obj.vx += ax; obj.vy += ay;
        obj.vx *= DRAG; obj.vy *= DRAG;
      }

      for (let i = 0; i < objCount; i++) {
        const o1 = objects.current[i];
        for (let j = i + 1; j < objCount; j++) {
            const o2 = objects.current[j];
            if (Math.abs(o2.x - o1.x) > 40 || Math.abs(o2.y - o1.y) > 40) continue;
            const dx = o2.x - o1.x; const dy = o2.y - o1.y;
            const distSq = dx*dx + dy*dy; const minDist = o1.currentRadius + o2.currentRadius;
            if (distSq < minDist * minDist && distSq > 0.001) {
                const dist = Math.sqrt(distSq); const overlap = minDist - dist;
                const force = overlap * COLLISION_STIFFNESS;
                const fx = (dx / dist) * force; const fy = (dy / dist) * force;
                o1.vx -= fx; o1.vy -= fy; o2.vx += fx; o2.vy += fy;
            }
        }
      }

      const drawCircle = (obj) => {
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.currentRadius, 0, Math.PI * 2);
        ctx.shadowOffsetX = -3; ctx.shadowOffsetY = 3;
        ctx.shadowColor = 'rgba(0, 0, 0, 1)'; ctx.shadowBlur = 2;
        const hopFactor = Math.min(obj.hop / 2, 1);
        let fillStyle = '';
        if (settings.audioReactionMode === 'Immerse') {
            const t = Math.min(hopFactor * 1.5, 1);
            const h1 = baseHue, s1 = settings.objectSaturation, l1 = 35;
            const h2 = settings.backgroundColor, s2 = 50, l2 = settings.backgroundBrightness;
            const h = h1 + (h2 - h1) * t, s = s1 + (s2 - s1) * t, l = l1 + (l2 - l1) * t;
            fillStyle = `hsl(${h}, ${s}%, ${l}%)`;
        } else {
            let saturation = settings.objectSaturation, lightness = 35, currentHue = baseHue;
            if (settings.customEffectColor) {
               const h1 = baseHue, h2 = settings.effectHue;
               let diff = h2 - h1;
               while (diff < -180) diff += 360; while (diff > 180) diff -= 360;
               const t = Math.min(hopFactor * 1.5, 1);
               currentHue = (h1 + (diff * t) + 360) % 360;
            } else {
               const hueShift = audioHueShift * hopFactor;
               currentHue = (baseHue + hueShift) % 360;
            }
            if (hopFactor > 0.01) {
                saturation = Math.min(settings.objectSaturation + (hopFactor * 60), 100);
                lightness = 35 + (hopFactor * settings.audioBrightnessBoost);
            }
            fillStyle = `hsl(${currentHue}, ${saturation}%, ${lightness}%)`;
        }
        ctx.fillStyle = fillStyle; ctx.fill();
        ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
      };

      for (let i = 0; i < objCount; i++) {
        const obj = objects.current[i];
        obj.x += obj.vx; obj.y += obj.vy;
        drawCircle(obj);
      }

      if (settings.textOverlay || settings.subTextOverlay) {
        ctx.save();
        const bg = settings.backgroundBrightness;
        let finalOpacity = 1; let textFillStyle = '';
        if (settings.customTextOverlayColor) {
           let alpha = 1;
           if (settings.audioReactionMode === 'Immerse') {
             const sampleHop = objects.current[Math.floor(objCount/2)]?.hop || 0;
             alpha = 1 - Math.min(sampleHop / 2, 1);
           }
           textFillStyle = `hsla(${settings.textOverlayHue}, ${settings.textOverlaySaturation}%, ${settings.textOverlayBrightness}%, ${alpha})`;
           finalOpacity = alpha;
        } else {
            const contrastOpacity = Math.abs(bg - 50) / 50; 
            if (settings.audioReactionMode === 'Immerse') {
                const sampleHop = objects.current[Math.floor(objCount/2)]?.hop || 0;
                finalOpacity = contrastOpacity * (1 - Math.min(sampleHop / 2, 1));
            } else {
                finalOpacity = contrastOpacity;
            }
            const val = bg < 50 ? 255 : 0;
            textFillStyle = `rgba(${val}, ${val}, ${val}, ${finalOpacity})`;
        }
        ctx.translate(cx, cy);
        const mainText = settings.textOverlay;
        let mainFontSize = h; 
        const font = settings.fontFamily;
        ctx.font = `900 ${mainFontSize}px '${font}'`;
        const width = ctx.measureText(mainText).width;
        if (width > w) mainFontSize = mainFontSize * (w / width);
        mainFontSize *= 0.95;
        if (settings.textHighlight) {
            ctx.save();
            const highlightHeight = mainFontSize + settings.textHighlightPadding; 
            const rectY = -(highlightHeight / 2) + settings.textHighlightYOffset;
            let fillAlpha = 1;
            if (settings.textHighlightMode === 'Custom') {
                fillAlpha = settings.textHighlightOpacity / 100;
                ctx.fillStyle = `hsla(${settings.textHighlightHue}, ${settings.textHighlightSaturation}%, ${settings.textHighlightBrightness}%, ${fillAlpha})`;
            } else {
                ctx.fillStyle = 'rgba(0, 0, 0, 1)';
            }
            ctx.fillRect(-cx, rectY, w, highlightHeight);
            if (settings.textHighlightBorder) {
                 ctx.lineWidth = 14;
                 ctx.strokeStyle = `hsl(${settings.textHighlightBorderHue}, ${settings.textHighlightBorderSaturation}%, ${settings.textHighlightBorderBrightness}%)`;
                 ctx.beginPath();
                 ctx.moveTo(-cx, rectY); ctx.lineTo(w - cx, rectY);
                 const bottomY = rectY + highlightHeight - 8;
                 ctx.moveTo(-cx, bottomY); ctx.lineTo(w - cx, bottomY);
                 ctx.stroke();
            }
            ctx.restore();
        }
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        if (settings.mirrorShadow && mainText) {
          ctx.save();
          const rad = settings.mirrorAngle * (Math.PI / 180);
          const dist = settings.mirrorDistance; 
          const offX = Math.cos(rad) * dist; const offY = Math.sin(rad) * dist;
          let shadowAlpha = settings.mirrorOpacity / 100;
          if (!settings.mirrorFixedOpacity) {
            shadowAlpha *= finalOpacity;
          } else if (settings.audioReactionMode === 'Immerse') {
             const sampleHop = objects.current[Math.floor(objCount/2)]?.hop || 0;
             shadowAlpha *= (1 - Math.min(sampleHop / 2, 1));
          }
          ctx.fillStyle = `hsla(${settings.mirrorHue}, ${settings.mirrorSaturation}%, ${settings.mirrorBrightness}%, ${shadowAlpha})`;
          ctx.font = `900 ${mainFontSize}px '${font}'`;
          ctx.fillText(mainText, offX, offY);
          ctx.restore();
        }
        ctx.fillStyle = textFillStyle;
        if (mainText) {
          ctx.font = `900 ${mainFontSize}px '${font}'`;
          ctx.fillText(mainText, 0, 0);
        }
        if (settings.subTextOverlay) {
          const subFontSize = mainFontSize * 0.1;
          const subY = (mainFontSize * 0.55) + 10; 
          ctx.font = `700 ${subFontSize}px '${font}'`;
          ctx.fillText(settings.subTextOverlay, 0, subY);
        }
        ctx.restore();
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [settings, isMobile]);

  return React.createElement("div", { className: "relative w-full h-full" },
    React.createElement("canvas", {
      ref: canvasRef,
      className: "block w-full h-full touch-none"
    }),
    React.createElement("div", {
      className: `absolute top-6 left-6 z-40 transition-opacity duration-1000 ${uiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`
    },
      !audioEnabled ?
        React.createElement("button", {
          onClick: startAudio,
          className: "flex items-center gap-2 px-4 py-2 bg-red-900/80 hover:bg-red-800 text-red-100 rounded-full border border-red-500 backdrop-blur-md transition-all animate-pulse"
        },
          React.createElement(MicOff, { size: 18 }),
          React.createElement("span", { className: "text-sm font-bold tracking-wider" }, "ENABLE MIC")
        ) :
        React.createElement("button", {
          onClick: stopAudio,
          className: "flex items-center gap-2 px-4 py-2 bg-emerald-900/50 hover:bg-emerald-800/50 text-emerald-400 rounded-full border border-emerald-500/50 backdrop-blur-md transition-all"
        },
          React.createElement(Mic, { size: 18 }),
          React.createElement("span", { className: "text-sm font-bold tracking-wider" }, "LISTENING"),
          React.createElement("div", { className: "flex gap-0.5 items-end h-4" },
            React.createElement("div", { className: "w-1 bg-emerald-400 h-2 animate-[bounce_1s_infinite]" }),
            React.createElement("div", { className: "w-1 bg-emerald-400 h-3 animate-[bounce_1.2s_infinite]" }),
            React.createElement("div", { className: "w-1 bg-emerald-400 h-1 animate-[bounce_0.8s_infinite]" })
          )
        )
    ),
    micPermission === 'denied' && React.createElement("div", { className: `absolute top-20 left-6 z-40 max-w-xs bg-red-900/90 border border-red-500 p-4 rounded-lg text-white text-xs transition-opacity duration-1000 ${uiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}` },
      "Please allow microphone access to enable visuals."
    )
  );
};