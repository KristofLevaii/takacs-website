"use client";

import { useState } from "react";
import Link from "next/link";

export default function ControlRoom() {
  const [bpm, setBpm] = useState(128);
  const [deckAVolume, setDeckAVolume] = useState(66);
  const [deckBVolume, setDeckBVolume] = useState(75);
  const [masterVolume, setMasterVolume] = useState(75);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-8 md:py-16">
      {/* Header */}
      <div className="text-center mb-8 md:mb-12">
        <div className="flex justify-center mb-4">
          <svg className="w-8 h-8 md:w-10 md:h-10 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white mb-2">
          THE CONTROL ROOM
        </h1>
        <p className="text-sm md:text-base lg:text-lg text-yellow-400">
          WHERE THE BEAT MEETS THE BOTTLE
        </p>
      </div>

      {/* DJ Mixer Interface */}
      <div className="w-full max-w-4xl bg-gray-900 rounded-xl border-2 border-orange-500 p-6 md:p-8 lg:p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Deck A */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mb-4">
              <div className="absolute inset-0 rounded-full bg-gray-800 border-2 border-gray-700"></div>
              <div className="absolute inset-4 md:inset-6 lg:inset-8 rounded-full bg-gray-700"></div>
              <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-yellow-400 rounded-full border-2 border-orange-500"></div>
            </div>
            <p className="text-white text-sm md:text-base uppercase tracking-wider">DECK A</p>
          </div>

          {/* Central Controls */}
          <div className="flex flex-col items-center space-y-4 md:space-y-6">
            {/* Faders */}
            <div className="flex gap-4 md:gap-6 w-full">
              <div className="flex-1">
                <div className="h-32 md:h-40 bg-gray-800 rounded relative">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-red-500 rounded transition-all"
                    style={{ height: `${deckAVolume}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="h-32 md:h-40 bg-gray-800 rounded relative">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-yellow-400 rounded transition-all"
                    style={{ height: `${deckBVolume}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* BPM Display */}
            <div className="text-center">
              <p className="text-gray-400 text-xs md:text-sm mb-2">MASTER BPM</p>
              <div className="bg-gray-800 border-2 border-orange-500 rounded-lg px-6 md:px-8 py-3 md:py-4">
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400">{bpm}</p>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-3 md:gap-4">
              <button 
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-orange-500 flex items-center justify-center hover:bg-orange-500/20 transition-colors"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[6px] border-y-transparent ml-1"></div>
                ) : (
                  <div className="w-0 h-0 border-l-[10px] md:border-l-[12px] border-l-orange-500 border-y-[8px] md:border-y-[10px] border-y-transparent ml-1"></div>
                )}
              </button>
              <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>
              <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Deck B */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mb-4">
              <div className="absolute inset-0 rounded-full bg-gray-800 border-2 border-gray-700"></div>
              <div className="absolute inset-4 md:inset-6 lg:inset-8 rounded-full bg-gray-700"></div>
              <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-yellow-400 rounded-full border-2 border-orange-500"></div>
            </div>
            <p className="text-white text-sm md:text-base uppercase tracking-wider">DECK B</p>
          </div>
        </div>

        {/* Volume Control */}
        <div className="mt-6 md:mt-8 flex items-center gap-3 md:gap-4">
          <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
          <div className="flex-1 h-2 bg-gray-700 rounded-full relative">
            <div 
              className="absolute left-0 top-0 h-full bg-red-500 rounded-full transition-all"
              style={{ width: `${masterVolume}%` }}
            ></div>
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full cursor-pointer"
              style={{ left: `calc(${masterVolume}% - 8px)` }}
            ></div>
          </div>
        </div>
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

