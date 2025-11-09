import { Fragment, useMemo } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Alert, cn } from '..';

const panelStyles =
  'z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white py-2 shadow-xl shadow-slate-900/15 focus:outline-none';

type Props = {
  value?: string;
  onChange: (value: string) => void;
};

type Group = {
  label: string;
  options: { value: string; label: string }[];
};

const groups: Group[] = [
  {
    label: 'Default',
    options: [{ value: '', label: 'Use backend default (Gemini or configured provider)' }],
  },
  {
    label: 'Providers',
    options: [
      { value: 'gemini', label: 'Gemini (Google AI) — cloud provider' },
      { value: 'lmstudio', label: 'LM Studio — local server (via backend)' },
    ],
  },
];

export default function ProviderSelect({ value, onChange }: Props) {
  const selected = useMemo(() => {
    for (const group of groups) {
      const match = group.options.find((option) => option.value === (value ?? ''));
      if (match) return match;
    }
    return groups[0].options[0];
  }, [value]);

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-slate-800" id="provider-select-label">
          Provider (Backend)
        </label>
        <span className="text-xs text-slate-500">Optional</span>
      </div>
      <Listbox value={value ?? ''} onChange={onChange}>
        {({ open }) => (
          <div className="relative">
            <Listbox.Button
              className={cn(
                'flex w-full items-center justify-between rounded-2xl border border-slate-300/70 bg-white px-4 py-2.5 text-left text-sm shadow-inner transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400',
                open ? 'ring-brand-400' : '',
              )}
              aria-labelledby="provider-select-label"
            >
              <span className="block truncate text-slate-700">{selected.label}</span>
              <ChevronUpDownIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className={panelStyles}>
                {groups.map((group) => (
                  <div key={group.label}>
                    <div className="px-4 pb-2 pt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {group.label}
                    </div>
                    {group.options.map((option) => (
                      <Listbox.Option
                        key={option.value || 'default'}
                        value={option.value}
                        className={({ active, selected: isSelected }) =>
                          cn(
                            'mx-2 flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm transition',
                            active ? 'bg-brand-50 text-brand-700' : 'text-slate-600',
                            isSelected ? 'bg-brand-600/10 text-brand-700' : '',
                          )
                        }
                      >
                        {({ selected: isSelected }) => (
                          <>
                            <span className="flex-1 truncate pr-3">{option.label}</span>
                            {isSelected ? (
                              <CheckIcon className="h-5 w-5 text-brand-600" aria-hidden="true" />
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </div>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
      <Alert tone="info" className="text-xs leading-5">
        Leave Provider blank to use the backend default. Choose LM Studio if your backend supports
        routing requests to a locally running LM Studio server. Choose Gemini to use the Google AI
        provider configured on the backend.
      </Alert>
    </div>
  );
}
