import React from 'react';

type Props = {
  value?: string;
  onChange: (value: string) => void;
};

type Group = {
  label: string;
  options: { value: string; label: string }[];
};

// Grouped Gemini models: keep free/standard separate from paid ones
const groups: Group[] = [
  {
    label: 'Default',
    options: [{ value: '', label: 'Use backend default (gemini-1.5-flash)' }],
  },
  {
    label: 'Recommended (Free/Standard)',
    options: [
      { value: 'gemini-1.5-flash', label: 'gemini-1.5-flash — fast, multimodal' },
      { value: 'gemini-1.5-flash-8b', label: 'gemini-1.5-flash-8b — smallest, cost‑efficient' },
    ],
  },
  {
    label: 'Paid (Billing required)',
    options: [
      { value: 'gemini-1.5-pro', label: 'gemini-1.5-pro — higher quality reasoning' },
      { value: 'gemini-2.0-flash', label: 'gemini-2.0-flash — latest multimodal (if enabled)' },
      { value: 'gemini-2.0-pro', label: 'gemini-2.0-pro — advanced reasoning (if enabled)' },
    ],
  },
];

export default function ModelSelect({ value, onChange }: Props) {
  return (
    <div>
      <label className="label">Model (Gemini)</label>
      <select className="select" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        {groups.map((g) => (
          <optgroup key={g.label} label={g.label}>
            {g.options.map((o) => (
              <option key={o.value || 'default'} value={o.value}>
                {o.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <p className="mt-1 text-xs text-gray-500">
        Paid models may require access and billing on your Google Cloud project. Leave Default to use the server configuration.
      </p>
    </div>
  );
}
