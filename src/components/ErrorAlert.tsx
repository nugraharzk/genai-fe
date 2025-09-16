import React from 'react';

type Props = {
  message: string;
};

export default function ErrorAlert({ message }: Props) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 text-red-800 p-3 flex items-start gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mt-0.5">
        <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm1 14h-2v-2h2v2Zm0-4h-2V6h2v6Z" />
      </svg>
      <div className="text-sm">
        <div className="font-medium">Something went wrong</div>
        <div className="mt-0.5">{message}</div>
      </div>
    </div>
  );
}

