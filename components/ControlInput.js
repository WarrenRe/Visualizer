import React from 'react';

export const ControlInput = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  gradient
}) => {
  const handleChange = (e) => {
    onChange(Number(e.target.value));
  };

  return React.createElement("div", { className: "flex flex-col mb-4" },
    React.createElement("div", { className: "flex justify-between items-end mb-2" },
      React.createElement("label", { className: "text-gray-400 text-xs uppercase tracking-widest font-bold" }, label),
      React.createElement("span", { className: "text-cyan-400 font-mono text-xs font-bold" },
        format ? format(value) : value
      )
    ),
    React.createElement("div", { className: "relative h-6 flex items-center" },
      React.createElement("input", {
        type: "range",
        min: min,
        max: max,
        step: step,
        value: value,
        onChange: handleChange,
        className: "w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-500/50",
        style: {
          background: gradient || '#1f2937'
        }
      }),
      React.createElement("style", null, `
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #22d3ee; /* cyan-400 */
          cursor: pointer;
          border: 2px solid #000;
          box-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
          margin-top: -4px;
        }
        input[type=range]::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #22d3ee;
          cursor: pointer;
          border: 2px solid #000;
          box-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
        }
      `)
    )
  );
};
