"use client";

import { useState } from "react";
import Link from "next/link";

const modes = [
  { id: "classic", name: "The Classic" },
  { id: "pirate", name: "Pirate Mode" },
  { id: "chill", name: "2009 Chill" },
  { id: "chaos", name: "Absolute Chaos" },
];

export default function RumRituals() {
  const [selectedMode, setSelectedMode] = useState("classic");

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-8 md:py-16">
      {/* Header */}
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-yellow-400 mb-4">
          RUM RITUALS
        </h1>
        <p className="text-base md:text-lg text-white max-w-2xl mx-auto">
          Generate a custom brew fit for El Capitán Takács.
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-3xl bg-gray-900 rounded-xl border-2 border-orange-500 border-glow-orange p-6 md:p-8 lg:p-10">
        {/* Mode Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`px-4 py-3 md:py-4 rounded-lg text-sm md:text-base font-semibold transition-all ${
                selectedMode === mode.id
                  ? "bg-orange-800 border-2 border-orange-500 text-white"
                  : "bg-gray-800 border-2 border-gray-600 text-white hover:border-gray-500"
              }`}
            >
              {mode.name}
            </button>
          ))}
        </div>

        {/* Generate Button */}
        <button className="w-full bg-orange-800 border-2 border-orange-500 rounded-lg px-6 md:px-8 py-4 md:py-5 flex items-center justify-center gap-3 md:gap-4 hover:bg-orange-700 transition-colors group">
          <svg 
            className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span className="text-yellow-400 font-bold text-base md:text-lg uppercase tracking-wider">
            GENERATE CAPTAIN&apos;S RESERVE
          </span>
        </button>
      </div>

      {/* Navigation */}
      <div className="mt-8 md:mt-12">
        <Link 
          href="/"
          className="text-yellow-400 hover:text-yellow-300 text-sm md:text-base transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

