import type { ReactNode } from 'react';

export interface SliderConfig {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}

export interface SelectConfig {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}

interface ControlPanelProps {
  sliders?: SliderConfig[];
  selects?: SelectConfig[];
  buttons?: { label: string; active?: boolean; onClick: () => void }[];
  children?: ReactNode;
  title?: string;
}

export default function ControlPanel({ sliders, selects, buttons, children, title }: ControlPanelProps) {
  return (
    <div className="control-panel">
      {title && <h3 className="control-title">{title}</h3>}
      {selects && selects.map((s, i) => (
        <div className="control-row" key={`sel-${i}`}>
          <label>{s.label}</label>
          <select value={s.value} onChange={(e) => s.onChange(e.target.value)}>
            {s.options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      ))}
      {sliders && sliders.map((s, i) => (
        <div className="control-row" key={`slider-${i}`}>
          <label>{s.label}: <span className="slider-value">
            {s.format ? s.format(s.value) : (s.step < 1 ? s.value.toFixed(2) : s.value.toString())}
          </span></label>
          <input
            type="range"
            min={s.min}
            max={s.max}
            step={s.step}
            value={s.value}
            onChange={(e) => s.onChange(parseFloat(e.target.value))}
          />
        </div>
      ))}
      {buttons && (
        <div className="control-row button-row">
          {buttons.map((b, i) => (
            <button
              key={`btn-${i}`}
              className={b.active ? 'active' : ''}
              onClick={b.onClick}
            >
              {b.label}
            </button>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}

// Grid-style matrix input for 2x2
export function MatrixInput2x2({
  values,
  onChange,
  labels = ['a', 'b', 'c', 'd'],
}: {
  values: [number, number, number, number]; // row-major: a,b,c,d
  onChange: (v: [number, number, number, number]) => void;
  labels?: string[];
}) {
  const set = (i: number, val: number) => {
    const next = [...values] as [number, number, number, number];
    next[i] = val;
    onChange(next);
  };

  return (
    <div className="matrix-input-2x2">
      <div className="matrix-bracket">[</div>
      <div className="matrix-grid">
        {[0, 1, 2, 3].map((i) => (
          <div className="matrix-cell" key={i}>
            <label>{labels[i]}</label>
            <input
              type="number"
              step="0.1"
              value={values[i]}
              onChange={(e) => set(i, parseFloat(e.target.value) || 0)}
            />
          </div>
        ))}
      </div>
      <div className="matrix-bracket">]</div>
    </div>
  );
}
