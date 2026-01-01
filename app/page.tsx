"use client";

import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { time: "21:00", energy: 100, cumulative: 100 },
  { time: "22:00", energy: 120, cumulative: 120 },
  { time: "23:00", energy: 140, cumulative: 140 },
  { time: "00:00", energy: 110, cumulative: 150 },
  { time: "01:00", energy: 100, cumulative: 140 },
  { time: "02:00", energy: 90, cumulative: 130 },
  { time: "03:00", energy: 70, cumulative: 110 },
  { time: "04:00", energy: 50, cumulative: 110 },
];

const modes = [
  { id: "classic", name: "The Classic" },
  { id: "pirate", name: "Pirate Mode" },
  { id: "chill", name: "2009 Chill" },
  { id: "chaos", name: "Absolute Chaos" },
];

const songs = [
  { id: 1, title: "Neon Nights", artist: "Takács & The Kraken", bpm: 128, src: "/audio/neon-nights.mp3" },
  { id: 2, title: "Rum Runner's Delight", artist: "Captain's Mix", bpm: 132, src: "/audio/rum-runners-delight.mp3" },
  { id: 3, title: "2009 Basement Rave", artist: "EDM Legends", bpm: 140, src: "/audio/2009-basement-rave.mp3" },
  { id: 4, title: "Pirate's Anthem", artist: "The High Seas", bpm: 125, src: "/audio/pirates-anthem.mp3" },
  { id: 5, title: "Turbo Charged", artist: "Absolute Chaos", bpm: 145, src: "/audio/turbo-charged.mp3" },
];

const recipes = {
  classic: {
    title: "THE TAKÁCS CLASSIC",
    vibe: "Just the usual please.",
    ingredients: [
      "7 oz Spiced Gold Rum",
      "7 oz Cola"
    ],
    instructions: "\"Just pour them together and you have the best drink\""
  },
  pirate: {
    title: "THE TAKÁCS BASS CANNON GROG",
    vibe: "A neon-soaked pirate rave where the bass drops harder than a ship's anchor in a 2009 EDM club.",
    ingredients: [
      "2 oz Dark Spiced Rum",
      "1 oz Blue Curacao",
      "0.75 oz Fresh Lime Juice",
      "2 oz Pineapple Juice",
      "3 oz Ginger Beer",
      "Edible Gold Luster Dust",
      "1 Pineapple Wedge garnish"
    ],
    instructions: "In a cocktail shaker filled with ice, combine the spiced rum, blue curacao, lime juice, and pineapple juice. Shake vigorously like you are front row at a 2009 music festival. Strain into a large glass or mug over fresh ice. Top with ginger beer for a fizzy explosion. Stir in the edible gold luster dust to create a swirling treasure-map effect. Garnish with a pineapple wedge and serve with a loud 'Yo-ho-ho' over a heavy synth drop."
  },
  chill: {
    title: "TAKÁCS KRAKEN WAVE",
    vibe: "A 2009 EDM basement rave meets a high-seas pirate raid; high-voltage energy with a smooth, chilled tropical finish.",
    ingredients: [
      "2 oz Spiced Rum",
      "1 oz Blue Curaçao",
      "2 oz Pineapple Juice",
      "2 oz Coconut Water",
      "1 oz Energy Drink topper",
      "Lime wedge for garnish"
    ],
    instructions: "Shake the spiced rum, blue curaçao, pineapple juice, and coconut water with ice until chilled. Strain into a highball glass filled with fresh ice. Top with the energy drink for that high-energy kick. Garnish with a lime wedge and serve with a glow stick."
  },
  chaos: {
    title: "TAKÁCS' TURBO-CHARGED KRAKEN CHAOS",
    vibe: "A sweaty 2009 warehouse rave hosted on a hijacked pirate galleon during a Category 5 hurricane. Pure neon-drenched EDM mayhem.",
    ingredients: [
      "2 oz Overproof Dark Rum",
      "1 oz Blue Curacao",
      "4 oz Neon Green Energy Drink",
      "0.5 oz Spiced Hibiscus Syrup",
      "2 dashes Fire Bitters",
      "1 squeeze of Lime Juice",
      "Garnish: A single pickled jalapeño and a neon glow stick"
    ],
    instructions: "In a shaker filled with crushed ice and pure adrenaline, combine the rum, curacao, syrup, and lime. Shake violently for 15 seconds to the rhythm of a 2009 electro-house drop. Pour the mixture—unstrained—into a skull-shaped mug. Top with the energy drink and fire bitters. Ignite a sugar cube on top if you want to risk the eyebrows. Serve immediately in the middle of a mosh pit."
  }
};

export default function Home() {
  // Deck A states
  const [currentSongIndexA, setCurrentSongIndexA] = useState(0);
  const [isPlayingA, setIsPlayingA] = useState(false);
  const [audioReadyA, setAudioReadyA] = useState(false);
  const audioRefA = useRef<HTMLAudioElement | null>(null);
  
  // Deck B states
  const [currentSongIndexB, setCurrentSongIndexB] = useState(1);
  const [isPlayingB, setIsPlayingB] = useState(false);
  const [audioReadyB, setAudioReadyB] = useState(false);
  const audioRefB = useRef<HTMLAudioElement | null>(null);
  
  // Shared states
  const [deckAVolume, setDeckAVolume] = useState(66);
  const [deckBVolume, setDeckBVolume] = useState(75);
  const [masterVolume, setMasterVolume] = useState(75);
  const [selectedMode, setSelectedMode] = useState("classic");
  const [showRecipe, setShowRecipe] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelResult, setWheelResult] = useState<string | null>(null);
  
  const currentSongA = songs[currentSongIndexA];
  const currentSongB = songs[currentSongIndexB];
  // Show average BPM or Deck A's BPM
  const bpm = currentSongA.bpm;

  // Helper function to create audio error handler
  const createErrorHandler = (deck: 'A' | 'B', song: typeof songs[0]) => {
    return (e: Event) => {
      const audioElement = e.target as HTMLAudioElement;
      const errorCode = audioElement.error;
      let errorMessage = 'Unknown error';
      
      if (errorCode) {
        switch (errorCode.code) {
          case 1:
            errorMessage = 'Audio loading was aborted';
            break;
          case 2:
            errorMessage = 'Network error while loading audio';
            break;
          case 3:
            errorMessage = 'Audio decoding error (file may be corrupted or unsupported format)';
            break;
          case 4:
            errorMessage = 'Audio format not supported or file not found';
            break;
          default:
            errorMessage = `Error code: ${errorCode.code}`;
        }
      }
      
      console.error(`Error loading audio file (Deck ${deck}):`, song.src);
      console.error('Error message:', errorMessage);
      
      if (deck === 'A') {
        setAudioReadyA(false);
        setIsPlayingA(false);
      } else {
        setAudioReadyB(false);
        setIsPlayingB(false);
      }
      
      if (errorCode && errorCode.code !== 1) {
        alert(`Unable to load audio (Deck ${deck}): ${song.title}\n\n${errorMessage}\n\nFile path: ${song.src}`);
      }
    };
  };

  // Initialize Deck A audio when song changes
  useEffect(() => {
    setAudioReadyA(false);
    
    if (audioRefA.current) {
      audioRefA.current.pause();
      audioRefA.current.removeEventListener('canplaythrough', () => {});
      audioRefA.current.removeEventListener('error', () => {});
      audioRefA.current = null;
    }

    const newAudio = new Audio(currentSongA.src);
    newAudio.loop = true;
    newAudio.volume = (masterVolume / 100) * (deckAVolume / 100);
    newAudio.preload = 'auto';
    
    const handleCanPlay = () => {
      setAudioReadyA(true);
      if (isPlayingA) {
        newAudio.play().catch((error) => {
          console.error('Error playing audio (Deck A):', error);
          setIsPlayingA(false);
        });
      }
    };

    const handleError = createErrorHandler('A', currentSongA);
    newAudio.addEventListener('canplaythrough', handleCanPlay);
    newAudio.addEventListener('error', handleError);
    newAudio.load();
    
    audioRefA.current = newAudio;

    return () => {
      if (audioRefA.current) {
        audioRefA.current.removeEventListener('canplaythrough', handleCanPlay);
        audioRefA.current.removeEventListener('error', handleError);
        audioRefA.current.pause();
        audioRefA.current = null;
      }
    };
  }, [currentSongIndexA, currentSongA.src, currentSongA.title]);

  // Initialize Deck B audio when song changes
  useEffect(() => {
    setAudioReadyB(false);
    
    if (audioRefB.current) {
      audioRefB.current.pause();
      audioRefB.current.removeEventListener('canplaythrough', () => {});
      audioRefB.current.removeEventListener('error', () => {});
      audioRefB.current = null;
    }

    const newAudio = new Audio(currentSongB.src);
    newAudio.loop = true;
    newAudio.volume = (masterVolume / 100) * (deckBVolume / 100);
    newAudio.preload = 'auto';
    
    const handleCanPlay = () => {
      setAudioReadyB(true);
      if (isPlayingB) {
        newAudio.play().catch((error) => {
          console.error('Error playing audio (Deck B):', error);
          setIsPlayingB(false);
        });
      }
    };

    const handleError = createErrorHandler('B', currentSongB);
    newAudio.addEventListener('canplaythrough', handleCanPlay);
    newAudio.addEventListener('error', handleError);
    newAudio.load();
    
    audioRefB.current = newAudio;

    return () => {
      if (audioRefB.current) {
        audioRefB.current.removeEventListener('canplaythrough', handleCanPlay);
        audioRefB.current.removeEventListener('error', handleError);
        audioRefB.current.pause();
        audioRefB.current = null;
      }
    };
  }, [currentSongIndexB, currentSongB.src, currentSongB.title]);

  // Handle Deck A play/pause
  useEffect(() => {
    if (audioRefA.current && audioReadyA) {
      if (isPlayingA) {
        const playPromise = audioRefA.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('Error playing audio (Deck A):', error);
            setIsPlayingA(false);
            if (error.name === 'NotAllowedError') {
              alert('Please click the play button to start audio playback.');
            }
          });
        }
      } else {
        audioRefA.current.pause();
      }
    }
  }, [isPlayingA, audioReadyA]);

  // Handle Deck B play/pause
  useEffect(() => {
    if (audioRefB.current && audioReadyB) {
      if (isPlayingB) {
        const playPromise = audioRefB.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('Error playing audio (Deck B):', error);
            setIsPlayingB(false);
            if (error.name === 'NotAllowedError') {
              alert('Please click the play button to start audio playback.');
            }
          });
        }
      } else {
        audioRefB.current.pause();
      }
    }
  }, [isPlayingB, audioReadyB]);

  // Update volumes when they change
  useEffect(() => {
    if (audioRefA.current) {
      audioRefA.current.volume = (masterVolume / 100) * (deckAVolume / 100);
    }
  }, [masterVolume, deckAVolume]);

  useEffect(() => {
    if (audioRefB.current) {
      audioRefB.current.volume = (masterVolume / 100) * (deckBVolume / 100);
    }
  }, [masterVolume, deckBVolume]);

  const handlePreviousA = () => {
    const wasPlaying = isPlayingA;
    if (audioRefA.current) {
      audioRefA.current.pause();
    }
    setCurrentSongIndexA((prev) => (prev === 0 ? songs.length - 1 : prev - 1));
    if (wasPlaying) {
      setTimeout(() => setIsPlayingA(true), 100);
    }
  };

  const handleNextA = () => {
    const wasPlaying = isPlayingA;
    if (audioRefA.current) {
      audioRefA.current.pause();
    }
    setCurrentSongIndexA((prev) => (prev === songs.length - 1 ? 0 : prev + 1));
    if (wasPlaying) {
      setTimeout(() => setIsPlayingA(true), 100);
    }
  };

  const handlePreviousB = () => {
    const wasPlaying = isPlayingB;
    if (audioRefB.current) {
      audioRefB.current.pause();
    }
    setCurrentSongIndexB((prev) => (prev === 0 ? songs.length - 1 : prev - 1));
    if (wasPlaying) {
      setTimeout(() => setIsPlayingB(true), 100);
    }
  };

  const handleNextB = () => {
    const wasPlaying = isPlayingB;
    if (audioRefB.current) {
      audioRefB.current.pause();
    }
    setCurrentSongIndexB((prev) => (prev === songs.length - 1 ? 0 : prev + 1));
    if (wasPlaying) {
      setTimeout(() => setIsPlayingB(true), 100);
    }
  };

  const handleVolumeChange = (type: 'deckA' | 'deckB' | 'master', value: number) => {
    if (type === 'deckA') setDeckAVolume(value);
    else if (type === 'deckB') setDeckBVolume(value);
    else setMasterVolume(value);
  };

  const handleSongSelectA = (index: number) => {
    const wasPlaying = isPlayingA;
    if (audioRefA.current) {
      audioRefA.current.pause();
    }
    setCurrentSongIndexA(index);
    if (wasPlaying) {
      setTimeout(() => setIsPlayingA(true), 100);
    }
  };

  const handleSongSelectB = (index: number) => {
    const wasPlaying = isPlayingB;
    if (audioRefB.current) {
      audioRefB.current.pause();
    }
    setCurrentSongIndexB(index);
    if (wasPlaying) {
      setTimeout(() => setIsPlayingB(true), 100);
    }
  };

  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setWheelResult(null);
    
    // Generate random result: 50% YES, 50% NO
    const random = Math.random();
    const isYes = random < 0.5; // 50% chance for YES
    
    // Calculate target angle for full circle (360 degrees total)
    // NO (red): 0-180 degrees (50%, top half)
    // YES (green): 180-360 degrees (50%, bottom half)
    let targetAngle: number;
    if (isYes) {
      // Random angle in YES range (180-360 degrees, bottom half - green)
      targetAngle = 180 + Math.random() * 180;
    } else {
      // Random angle in NO range (0-180 degrees, top half - red)
      targetAngle = Math.random() * 180;
    }
    
    // Add multiple full rotations (5-10 rotations) for spinning effect
    const fullRotations = 5 + Math.random() * 5; // 5-10 rotations
    const totalRotation = wheelRotation + (fullRotations * 360) + (360 - targetAngle);
    
    setWheelRotation(totalRotation);
    
    // Wait for animation to complete (5 seconds)
    setTimeout(() => {
      setIsSpinning(false);
      if (isYes) {
        setWheelResult('NA AZÉ');
      } else {
        setWheelResult('Há hülye vagy?');
      }
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-diagonal-pattern relative overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-10 p-4 md:p-6 lg:p-8 bg-black/90 backdrop-blur-md border-b border-orange-500/30 shadow-lg shadow-orange-500/10">
        <div className="flex justify-between items-center">
          <p className="text-xs md:text-sm lg:text-base text-yellow-300 font-[var(--font-trade-winds)] tracking-wider leading-relaxed">
            EL CAPITAN TAKÁCS - PRESIDENT OF CAPTAIN MORGAN CO.
          </p>
          <div className="flex gap-3 md:gap-4">
            {/* Skull Icon */}
            <svg className="w-5 h-5 md:w-6 md:h-6 text-orange-400 hover:text-orange-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 7c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-2 5c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4z"/>
            </svg>
            {/* Lightning Bolt Icon */}
            <svg className="w-5 h-5 md:w-6 md:h-6 text-orange-400 hover:text-orange-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
            </svg>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 py-16 md:py-24 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {/* Pirate crossbones */}
          <div className="absolute top-20 left-10 w-16 h-16 md:w-24 md:h-24 rotate-45">
            <svg viewBox="0 0 100 100" className="w-full h-full text-orange-500">
              <path d="M20 50 L80 50 M50 20 L50 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="absolute bottom-20 right-10 w-16 h-16 md:w-24 md:h-24 -rotate-45">
            <svg viewBox="0 0 100 100" className="w-full h-full text-orange-500">
              <path d="M20 50 L80 50 M50 20 L50 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <div className="text-center space-y-6 md:space-y-8 lg:space-y-12 relative z-10">
          {/* The Legend Returns */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-orange-300 font-[var(--font-bebas-neue)] uppercase tracking-[0.2em] text-glow-orange leading-tight">
            THE LEGEND RETURNS
          </h2>

          {/* TAKACS Main Title */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl xl:text-[12rem] 2xl:text-[14rem] font-[var(--font-bebas-neue)] text-red-500 text-glow-orange uppercase tracking-tight leading-[0.85] mb-4 transform hover:scale-105 transition-transform duration-300" style={{ letterSpacing: '0.08em', textShadow: '0 0 20px rgba(255, 140, 0, 0.8), 0 0 40px rgba(255, 140, 0, 0.6), 0 0 60px rgba(255, 140, 0, 0.4)' }}>
            TAKACS
          </h1>

          {/* Tagline */}
          <p className="text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-yellow-300 font-[var(--font-montserrat-bold-italic)] max-w-4xl mx-auto leading-relaxed px-4 text-glow-yellow">
            &quot;DJing, Partying and Fifing at the same time.&quot;
          </p>

          {/* EST. 1999 PARTY KING */}
          <div className="flex items-center justify-center gap-6 md:gap-8 lg:gap-10 mt-12 md:mt-16 lg:mt-20">
            <div className="h-0.5 md:h-1 w-24 md:w-32 lg:w-40 bg-gradient-to-r from-transparent via-yellow-400 to-yellow-400 shadow-lg shadow-yellow-400/50"></div>
            
            <p className="text-sm md:text-base lg:text-lg xl:text-xl text-yellow-300 uppercase tracking-wider font-[var(--font-trade-winds)] px-3 md:px-4 text-glow-yellow">
              EST. 1999 PARTY KING
            </p>
            
            <div className="h-0.5 md:h-1 w-24 md:w-32 lg:w-40 bg-gradient-to-l from-transparent via-yellow-400 to-yellow-400 shadow-lg shadow-yellow-400/50"></div>
          </div>
        </div>
      </section>

      {/* Control Room Section */}
      <section id="control-room" className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-16 md:py-24">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-[var(--font-bebas-neue)] text-white mb-3 tracking-wide leading-tight" style={{ letterSpacing: '0.05em' }}>
            THE CONTROL ROOM
          </h2>
          <p className="text-xs md:text-sm lg:text-base xl:text-lg text-yellow-300 font-[var(--font-montserrat-bold-italic)] tracking-wider leading-relaxed">
            WHERE THE BEAT MEETS THE BOTTLE
          </p>
        </div>

        {/* DJ Mixer Interface */}
        <div className="w-full max-w-5xl bg-gray-900 rounded-xl border-2 border-orange-500 border-glow-orange p-6 md:p-8 lg:p-10 shadow-2xl shadow-orange-500/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Deck A */}
            <div className="flex flex-col items-center">
              {/* Deck A Song Display */}
              <div className="text-center mb-5 w-full px-2">
                <p className="text-red-400 text-xs md:text-sm font-[var(--font-montserrat-bold-italic)] mb-1.5 truncate leading-snug">
                  {currentSongA.title}
                </p>
                <p className="text-gray-400 text-xs font-[var(--font-trade-winds)] mb-1.5 truncate leading-snug">
                  {currentSongA.artist}
                </p>
                {!audioReadyA && (
                  <p className="text-orange-400 text-xs font-[var(--font-trade-winds)] leading-snug">Loading...</p>
                )}
              </div>

              <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mb-4">
                <div className="absolute inset-0 rounded-full bg-gray-800 border-2 border-gray-700"></div>
                <div className="absolute inset-4 md:inset-6 lg:inset-8 rounded-full bg-gray-700"></div>
                <div className={`absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-yellow-400 rounded-full border-2 border-orange-500 ${isPlayingA ? 'animate-spin' : ''}`} style={{ transition: 'transform 0.1s' }}></div>
              </div>
              <p className="text-white text-sm md:text-base lg:text-lg uppercase tracking-wider font-[var(--font-trade-winds)] mb-3 leading-tight">DECK A</p>
              
              {/* Deck A Controls */}
              <div className="flex items-center gap-2 mb-3">
                <button 
                  onClick={handlePreviousA}
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
                  aria-label="Previous song Deck A"
                >
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                  </svg>
                </button>
                <button 
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-red-500 flex items-center justify-center transition-colors ${
                    audioReadyA 
                      ? 'hover:bg-red-500/20 cursor-pointer' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => {
                    if (audioReadyA) {
                      setIsPlayingA(!isPlayingA);
                    }
                  }}
                  disabled={!audioReadyA}
                  title={audioReadyA ? 'Play/Pause Deck A' : 'Loading audio...'}
                >
                  {isPlayingA ? (
                    <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-0.5"></div>
                  ) : (
                    <div className="w-0 h-0 border-l-[8px] md:border-l-[10px] border-l-red-500 border-y-[6px] md:border-y-[8px] border-y-transparent ml-0.5"></div>
                  )}
                </button>
                <button 
                  onClick={handleNextA}
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
                  aria-label="Next song Deck A"
                >
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                  </svg>
                </button>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={deckAVolume}
                onChange={(e) => handleVolumeChange('deckA', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500 mb-1"
              />
              <p className="text-gray-400 text-xs mt-1.5 leading-tight">{deckAVolume}%</p>
            </div>

            {/* Central Controls */}
            <div className="flex flex-col items-center space-y-4 md:space-y-6">
              {/* Faders */}
              <div className="flex gap-4 md:gap-6 w-full">
                <div className="flex-1">
                  <div className="h-32 md:h-40 bg-gray-800 rounded relative cursor-pointer" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const y = e.clientY - rect.top;
                    const percentage = 100 - (y / rect.height) * 100;
                    handleVolumeChange('deckA', Math.max(0, Math.min(100, percentage)));
                  }}>
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-red-500 rounded transition-all"
                      style={{ height: `${deckAVolume}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="h-32 md:h-40 bg-gray-800 rounded relative cursor-pointer" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const y = e.clientY - rect.top;
                    const percentage = 100 - (y / rect.height) * 100;
                    handleVolumeChange('deckB', Math.max(0, Math.min(100, percentage)));
                  }}>
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-yellow-400 rounded transition-all"
                      style={{ height: `${deckBVolume}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* BPM Display */}
              <div className="text-center">
                <p className="text-gray-300 text-xs md:text-sm lg:text-base mb-3 font-[var(--font-trade-winds)] uppercase tracking-wider leading-tight">MASTER BPM</p>
                <div className="bg-gray-800 border-2 border-orange-500 border-glow-orange rounded-lg px-6 md:px-8 py-3 md:py-4 shadow-lg">
                  <p className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-[var(--font-cinzel-decorative)] text-yellow-300 leading-none" style={{ fontWeight: 700 }}>{bpm}</p>
                </div>
              </div>

            </div>

            {/* Deck B */}
            <div className="flex flex-col items-center">
              {/* Deck B Song Display */}
              <div className="text-center mb-5 w-full px-2">
                <p className="text-yellow-400 text-xs md:text-sm font-[var(--font-montserrat-bold-italic)] mb-1.5 truncate leading-snug">
                  {currentSongB.title}
                </p>
                <p className="text-gray-400 text-xs font-[var(--font-trade-winds)] mb-1.5 truncate leading-snug">
                  {currentSongB.artist}
                </p>
                {!audioReadyB && (
                  <p className="text-orange-400 text-xs font-[var(--font-trade-winds)] leading-snug">Loading...</p>
                )}
              </div>

              <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mb-4">
                <div className="absolute inset-0 rounded-full bg-gray-800 border-2 border-gray-700"></div>
                <div className="absolute inset-4 md:inset-6 lg:inset-8 rounded-full bg-gray-700"></div>
                <div className={`absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-yellow-400 rounded-full border-2 border-orange-500 ${isPlayingB ? 'animate-spin' : ''}`} style={{ transition: 'transform 0.1s' }}></div>
              </div>
              <p className="text-white text-sm md:text-base lg:text-lg uppercase tracking-wider font-[var(--font-trade-winds)] mb-3 leading-tight">DECK B</p>
              
              {/* Deck B Controls */}
              <div className="flex items-center gap-2 mb-3">
                <button 
                  onClick={handlePreviousB}
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
                  aria-label="Previous song Deck B"
                >
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                  </svg>
                </button>
                <button 
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-yellow-500 flex items-center justify-center transition-colors ${
                    audioReadyB 
                      ? 'hover:bg-yellow-500/20 cursor-pointer' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => {
                    if (audioReadyB) {
                      setIsPlayingB(!isPlayingB);
                    }
                  }}
                  disabled={!audioReadyB}
                  title={audioReadyB ? 'Play/Pause Deck B' : 'Loading audio...'}
                >
                  {isPlayingB ? (
                    <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-0.5"></div>
                  ) : (
                    <div className="w-0 h-0 border-l-[8px] md:border-l-[10px] border-l-yellow-500 border-y-[6px] md:border-y-[8px] border-y-transparent ml-0.5"></div>
                  )}
                </button>
                <button 
                  onClick={handleNextB}
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
                  aria-label="Next song Deck B"
                >
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                  </svg>
                </button>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={deckBVolume}
                onChange={(e) => handleVolumeChange('deckB', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500 mb-1"
              />
              <p className="text-gray-400 text-xs mt-1.5 leading-tight">{deckBVolume}%</p>
            </div>
          </div>

          {/* Volume Control */}
          <div className="mt-6 md:mt-8 flex items-center gap-3 md:gap-4">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
            <input
              type="range"
              min="0"
              max="100"
              value={masterVolume}
              onChange={(e) => handleVolumeChange('master', parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <span className="text-white text-xs md:text-sm w-10 text-right">{masterVolume}%</span>
          </div>

          {/* Playlist */}
          <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-700">
            <p className="text-gray-300 text-xs md:text-sm mb-4 font-[var(--font-trade-winds)] uppercase tracking-wider leading-tight">PLAYLIST</p>
            <div className="space-y-3">
              {songs.map((song, index) => {
                const isDeckA = index === currentSongIndexA;
                const isDeckB = index === currentSongIndexB;
                const isActive = isDeckA || isDeckB;
                
                return (
                  <div
                    key={song.id}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-orange-800/50 border-2 border-orange-500 shadow-lg shadow-orange-500/20'
                        : 'bg-gray-800 border-2 border-gray-700 hover:border-gray-600 hover:bg-gray-750'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm md:text-base font-[var(--font-montserrat-bold-italic)] truncate leading-snug ${isActive ? 'text-yellow-300' : 'text-white'}`}>
                          {song.title}
                        </p>
                        <p className="text-xs md:text-sm text-gray-400 font-[var(--font-trade-winds)] truncate leading-snug mt-0.5">
                          {song.artist}
                        </p>
                      </div>
                      <div className="ml-4 flex items-center gap-3">
                        <span className="text-xs md:text-sm text-gray-400 font-[var(--font-trade-winds)] leading-tight">
                          {song.bpm} BPM
                        </span>
                        {isDeckA && isPlayingA && (
                          <span className="text-xs px-2 py-1 bg-red-500/30 text-red-300 rounded font-[var(--font-trade-winds)] leading-tight">DECK A</span>
                        )}
                        {isDeckB && isPlayingB && (
                          <span className="text-xs px-2 py-1 bg-yellow-500/30 text-yellow-300 rounded font-[var(--font-trade-winds)] leading-tight">DECK B</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2.5">
                      <button
                        onClick={() => handleSongSelectA(index)}
                        className={`flex-1 px-3 py-1.5 text-xs rounded transition-colors font-[var(--font-trade-winds)] leading-tight ${
                          isDeckA
                            ? 'bg-red-600 text-white border border-red-400'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                        }`}
                      >
                        Load to Deck A
                      </button>
                      <button
                        onClick={() => handleSongSelectB(index)}
                        className={`flex-1 px-3 py-1.5 text-xs rounded transition-colors font-[var(--font-trade-winds)] leading-tight ${
                          isDeckB
                            ? 'bg-yellow-600 text-white border border-yellow-400'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                        }`}
                      >
                        Load to Deck B
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Energy Metrics Section */}
      <section id="energy-metrics" className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-7xl border-4 border-orange-500 border-glow-orange rounded-2xl p-6 md:p-8 lg:p-10 shadow-2xl shadow-orange-500/30 bg-gradient-to-br from-gray-900/50 to-black">
          <div className="w-full max-w-7xl">
          {/* Header with Title on Left and KPIs on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-10">
            {/* Left Side - Title and Subtitle */}
            <div className="flex flex-col justify-start">
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-[var(--font-bebas-neue)] text-yellow-300 mb-3 tracking-wide leading-tight" style={{ letterSpacing: '0.05em' }}>
                ENERGY METRICS
              </h2>
              <p className="text-xs md:text-sm lg:text-base text-gray-400 font-[var(--font-montserrat-bold-italic)] leading-relaxed">
                Night of the Century Monitoring System
              </p>
            </div>

            {/* Right Side - KPI Boxes */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="bg-gray-900 border-2 border-orange-500 border-glow-orange rounded-lg p-4 md:p-6 shadow-lg">
                <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider font-[var(--font-trade-winds)] leading-tight">PEAK BPM</p>
                <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-[var(--font-bebas-neue)] text-red-500 leading-none" style={{ letterSpacing: '0.05em' }}>145</p>
              </div>
              <div className="bg-gray-900 border-2 border-orange-500 border-glow-orange rounded-lg p-4 md:p-6 shadow-lg">
                <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider font-[var(--font-trade-winds)] leading-tight">RUM CAPACITY</p>
                <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-[var(--font-bebas-neue)] text-yellow-400 leading-none" style={{ letterSpacing: '0.05em' }}>MAX</p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="w-full bg-gray-900 rounded-xl border-2 border-orange-500 border-glow-orange p-4 md:p-6 lg:p-8 mb-4">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFD700" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  stroke="#888888"
                  tick={{ fill: '#888888', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#888888"
                  tick={{ fill: '#888888', fontSize: 12 }}
                  domain={[0, 160]}
                  ticks={[0, 40, 80, 120, 160]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #ff8c00',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="energy" 
                  stroke="#FFD700" 
                  fillOpacity={1} 
                  fill="url(#colorEnergy)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#FF6B35" 
                  fillOpacity={1} 
                  fill="url(#colorCumulative)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Footer Disclaimer */}
          <p className="text-xs md:text-sm text-gray-500 text-center font-[var(--font-montserrat-bold-italic)] italic leading-relaxed mt-3">
            *Data generated by real-time party sensors at Takács HQ
          </p>
          </div>
        </div>
      </section>

      {/* Rum Rituals Section */}
      <section id="rum-rituals" className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-5xl border-4 border-orange-500 border-glow-orange rounded-2xl p-6 md:p-8 lg:p-10 shadow-2xl shadow-orange-500/30 bg-gradient-to-br from-gray-900/50 to-black">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-[var(--font-bebas-neue)] text-yellow-300 mb-4 tracking-wide leading-tight" style={{ letterSpacing: '0.05em' }}>
              RUM RITUALS
            </h2>
            <p className="text-sm md:text-base lg:text-lg xl:text-xl text-gray-200 max-w-3xl mx-auto font-[var(--font-montserrat-bold-italic)] leading-relaxed px-4">
              Generate a custom brew fit for El Capitán Takács.
            </p>
          </div>

          {/* Mode Selection and Generate Button */}
          <div className="mb-6 md:mb-8">
            {/* Mode Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-5 md:mb-6">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setSelectedMode(mode.id);
                    setShowRecipe(false);
                  }}
                  className={`px-3 py-2.5 md:py-3 rounded-lg text-xs md:text-sm font-[var(--font-montserrat-bold-italic)] transition-all uppercase leading-tight ${
                    selectedMode === mode.id
                      ? "bg-orange-800 border-2 border-orange-500 border-glow-orange text-white shadow-lg shadow-orange-500/20"
                      : "bg-gray-800 border-2 border-gray-600 text-white hover:border-gray-500 hover:bg-gray-750"
                  }`}
                >
                  {mode.name}
                </button>
              ))}
            </div>

            {/* Generate Button */}
            <button 
              onClick={() => setShowRecipe(true)}
              className="w-full bg-orange-800 border-2 border-orange-500 border-glow-orange rounded-lg px-5 md:px-6 py-3 md:py-4 flex items-center justify-center gap-2 md:gap-3 hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/20"
            >
              <svg 
                className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
              </svg>
              <span className="text-white font-[var(--font-montserrat-bold-italic)] text-sm md:text-base lg:text-lg uppercase tracking-wider leading-tight">
                GENERATE CAPTAIN&apos;S RESERVE
              </span>
            </button>
          </div>

          {/* Recipe Display */}
          {showRecipe && (
            <div className="w-full bg-gray-900 rounded-xl border-2 border-orange-500 border-glow-orange p-6 md:p-8 lg:p-10 shadow-2xl shadow-orange-500/20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Left Column - Title, Vibe, Ingredients */}
                <div>
                  {/* Recipe Title */}
                  <h3 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-[var(--font-bebas-neue)] text-yellow-400 mb-4 tracking-wide leading-tight" style={{ letterSpacing: '0.05em' }}>
                    {recipes[selectedMode as keyof typeof recipes].title}
                  </h3>
                  
                  {/* Vibe Description */}
                  <p className="text-sm md:text-base lg:text-lg text-orange-400 font-[var(--font-montserrat-bold-italic)] mb-6 italic leading-relaxed">
                    Vibe: {recipes[selectedMode as keyof typeof recipes].vibe}
                  </p>

                  {/* Ingredients Heading */}
                  <h4 className="text-base md:text-lg lg:text-xl font-[var(--font-bebas-neue)] text-yellow-400 mb-3 uppercase tracking-wide leading-tight" style={{ letterSpacing: '0.05em' }}>
                    INGREDIENTS
                  </h4>

                  {/* Ingredients List */}
                  <ul className="space-y-2 mb-5">
                    {recipes[selectedMode as keyof typeof recipes].ingredients.map((ingredient, index) => (
                      <li key={index} className="text-white text-xs md:text-sm lg:text-base font-[var(--font-montserrat-bold-italic)] leading-relaxed">
                        • {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Column - Instructions */}
                <div>
                  {/* Instructions Heading */}
                  <div className="flex items-center gap-2 mb-5">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h4 className="text-base md:text-lg lg:text-xl font-[var(--font-bebas-neue)] text-yellow-400 uppercase tracking-wide leading-tight" style={{ letterSpacing: '0.05em' }}>
                      INSTRUCTIONS
                    </h4>
                  </div>

                  {/* Instructions Box */}
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 md:p-5 mb-5 shadow-inner">
                    <p className="text-white text-xs md:text-sm lg:text-base font-[var(--font-montserrat-bold-italic)] italic leading-relaxed">
                      {recipes[selectedMode as keyof typeof recipes].instructions}
                    </p>
                  </div>

                  {/* Certification */}
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <p className="text-yellow-400 text-xs md:text-sm font-[var(--font-trade-winds)] uppercase tracking-wide leading-tight">
                      CERTIFIED TAKÁCS RECIPE
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Spinning Wheel */}
          <div className="mt-10 md:mt-12 flex flex-col items-center">
            <h3 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-[var(--font-bebas-neue)] text-yellow-300 mb-3 md:mb-4 tracking-wide leading-tight" style={{ letterSpacing: '0.05em' }}>
              MOMENT OF TRUTH
            </h3>
            <p className="text-sm md:text-base lg:text-lg text-orange-400 font-[var(--font-montserrat-bold-italic)] mb-6 md:mb-8 text-center max-w-2xl italic leading-relaxed px-4">
              &quot;The wheel decides your fate, but the rum decides your fun.&quot;
            </p>
            
            <div className="relative w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80">
              {/* Wheel Container */}
              <div className="relative w-full h-full">
                {/* Spinning Wheel - Full Circle */}
                <svg
                  className={`w-full h-full transition-transform duration-[5000ms] ease-out ${isSpinning ? 'pointer-events-none' : ''}`}
                  style={{
                    transform: `rotate(${wheelRotation}deg)`,
                  }}
                  viewBox="0 0 200 200"
                >
                  <defs>
                    <filter id="shadow">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                    </filter>
                  </defs>
                  
                  {/* NO section (50% = 180 degrees, top half - red) */}
                  <path
                    d="M 100,100 L 100,0 A 100,100 0 1,1 100,200 Z"
                    fill="#dc2626"
                    stroke="#fff"
                    strokeWidth="4"
                    filter="url(#shadow)"
                  />
                  
                  {/* YES section (50% = 180 degrees, bottom half - green) */}
                  <path
                    d="M 100,100 L 100,200 A 100,100 0 1,1 100,0 Z"
                    fill="#22c55e"
                    stroke="#fff"
                    strokeWidth="4"
                    filter="url(#shadow)"
                  />
                </svg>

                {/* Center Circle with Result */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-black rounded-full border-4 border-orange-500 flex items-center justify-center shadow-lg">
                    {wheelResult ? (
                      <p className="text-yellow-400 text-xs md:text-sm lg:text-base font-[var(--font-montserrat-bold-italic)] text-center px-2 leading-tight">
                        {wheelResult}
                      </p>
                    ) : (
                      <div className="w-0 h-0 border-t-[12px] md:border-t-[16px] border-t-orange-500 border-l-[8px] md:border-l-[12px] border-l-transparent border-r-[8px] md:border-r-[12px] border-r-transparent -mt-2"></div>
                    )}
                  </div>
                </div>

                {/* Pointer at top center */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 pointer-events-none">
                  <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-orange-500 drop-shadow-lg"></div>
                </div>
              </div>
            </div>

            {/* Spin Button */}
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className={`mt-5 md:mt-6 px-6 md:px-8 py-2.5 md:py-3 bg-orange-800 border-2 border-orange-500 border-glow-orange rounded-lg text-white font-[var(--font-trade-winds)] uppercase tracking-wider text-sm md:text-base transition-all leading-tight shadow-lg shadow-orange-500/20 ${
                isSpinning
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-orange-700 hover:shadow-orange-500/30 cursor-pointer'
              }`}
            >
              {isSpinning ? 'SPINNING...' : 'SPIN THE WHEEL'}
            </button>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section id="quote" className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center px-4 py-12 md:py-16">
        {/* Quote Box */}
        <div className="w-full max-w-4xl border-2 border-yellow-400 border-glow-yellow rounded-xl p-6 md:p-8 lg:p-10 bg-black/60 shadow-2xl shadow-yellow-400/20">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-[var(--font-bebas-neue)] text-yellow-300 text-center mb-8 md:mb-10 tracking-wide leading-tight" style={{ letterSpacing: '0.05em' }}>
            QUOTE OF THE DAY
          </h2>

          {/* Author */}
          <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-[var(--font-trade-winds)] text-yellow-200 text-center mb-8 md:mb-10 tracking-wider leading-tight border-t border-yellow-400/30 pt-6 md:pt-8">
            EL CAPITÁN TAKÁCS
          </p>

          {/* Quote */}
          <blockquote className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-yellow-300 text-center leading-relaxed font-[var(--font-montserrat-bold-italic)] px-4 md:px-6">
            &quot;May your bass be deep, your rum be dark, and your
            dance floor never empty. Keep making history like it&apos;s
            1999.&quot;
          </blockquote>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 p-6 md:p-8 lg:p-10">
        <p className="text-xs md:text-sm lg:text-base text-gray-400 text-center font-[var(--font-trade-winds)] tracking-wide leading-relaxed">
          COPYRIGHT © 2026 • BUILT FOR THE LEGEND • NO RUM SPILLED
        </p>
      </footer>
    </div>
  );
}
