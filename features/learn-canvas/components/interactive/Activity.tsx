import React from 'react';

interface ActivityProps {
  description: string;
  link?: string;
}

export function Activity({ description, link }: ActivityProps) {
  return (
    <div className="my-6 p-4 rounded-lg border border-l-4 border-[#00ff00] bg-black/60">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-block w-6 h-6 rounded-full bg-[#00ff00]/20 flex items-center justify-center text-[#00ff00] font-bold">A</span>
        <span className="font-semibold text-[#00ff00]">Activity</span>
      </div>
      <div className="text-white text-base mb-2">{description}</div>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-sm text-[#00ff00] underline hover:text-white transition"
        >
          Open Resource
        </a>
      )}
    </div>
  );
} 