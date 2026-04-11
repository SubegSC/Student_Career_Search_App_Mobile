// PhoneFrame.tsx
// Wrap your app content with this to simulate a phone shell in the browser.
// Usage in App.tsx:
//   import { PhoneFrame } from './components/PhoneFrame';
//   <PhoneFrame><RouterProvider router={router} /></PhoneFrame>

import { ReactNode } from 'react';

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-700 flex items-center justify-center p-0">
      {/* Phone shell */}
      <div
        className="relative bg-black rounded-[3rem] shadow-2xl"
        style={{ width: 410, height: 844 }}
      >
        {/* Outer border highlight */}
        <div className="absolute inset-0 rounded-[3rem] ring-1 ring-white/10 pointer-events-none z-20" />

        {/* Notch / Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20 flex items-center justify-center gap-2">
          <div className="w-2.5 h-2.5 bg-gray-800 rounded-full" />
          <div className="w-4 h-4 bg-gray-800 rounded-full" />
        </div>

        {/* Side buttons */}
        <div className="absolute -left-1 top-24 w-1 h-8 bg-gray-600 rounded-l-sm" />
        <div className="absolute -left-1 top-36 w-1 h-12 bg-gray-600 rounded-l-sm" />
        <div className="absolute -left-1 top-52 w-1 h-12 bg-gray-600 rounded-l-sm" />
        <div className="absolute -right-1 top-36 w-1 h-16 bg-gray-600 rounded-r-sm" />

        {/* Screen area */}
        <div
          className="absolute inset-[3px] rounded-[2.7rem] overflow-hidden"
          style={{ top: 3, bottom: 3, left: 3, right: 3 }}
        >
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pt-3 pb-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-semibold z-10 relative">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
                <rect x="0" y="3" width="3" height="9" rx="0.5" opacity="0.4"/>
                <rect x="4.5" y="2" width="3" height="10" rx="0.5" opacity="0.6"/>
                <rect x="9" y="0.5" width="3" height="11.5" rx="0.5" opacity="0.8"/>
                <rect x="13.5" y="0" width="2.5" height="12" rx="0.5"/>
              </svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
                <path d="M8 2.4C10.5 2.4 12.7 3.5 14.2 5.2L15.5 3.9C13.6 1.8 10.9 0.5 8 0.5C5.1 0.5 2.4 1.8 0.5 3.9L1.8 5.2C3.3 3.5 5.5 2.4 8 2.4Z" opacity="0.4"/>
                <path d="M8 5.5C9.7 5.5 11.2 6.2 12.3 7.3L13.6 6C12.1 4.5 10.2 3.6 8 3.6C5.8 3.6 3.9 4.5 2.4 6L3.7 7.3C4.8 6.2 6.3 5.5 8 5.5Z" opacity="0.7"/>
                <circle cx="8" cy="10" r="1.5"/>
              </svg>
              <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor">
                <rect x="0" y="1" width="21" height="10" rx="2" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.35"/>
                <rect x="22" y="3.5" width="2" height="5" rx="1" opacity="0.4"/>
                <rect x="1.5" y="2.5" width="16" height="7" rx="1.5"/>
              </svg>
            </div>
          </div>

          {/* App content */}
          <div className="absolute inset-0 top-0 bottom-0 overflow-hidden flex flex-col">
            {children}
          </div>
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-20" />
      </div>
    </div>
  );
}