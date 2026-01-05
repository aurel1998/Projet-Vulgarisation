"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Heart, Share2, RotateCcw, Pause } from "lucide-react";

interface Slide {
  t: number;
  text: string;
}

interface ShortVideoCardProps {
  id: string;
  title: string;
  durationSec: number;
  slides: Slide[];
}

export default function ShortVideoCard({
  id,
  title,
  durationSec,
  slides,
}: ShortVideoCardProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Trouver le slide actuel basé sur le temps
  const currentSlide = slides.find(
    (slide, index) =>
      currentTime >= slide.t &&
      (index === slides.length - 1 || currentTime < slides[index + 1].t)
  ) || slides[0];

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.1;
          if (next >= durationSec) {
            setIsPlaying(false);
            return durationSec;
          }
          return next;
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, durationSec]);

  // Mettre à jour l'index du slide
  useEffect(() => {
    const newIndex = slides.findIndex(
      (slide, index) =>
        currentTime >= slide.t &&
        (index === slides.length - 1 || currentTime < slides[index + 1].t)
    );
    if (newIndex !== -1 && newIndex !== currentSlideIndex) {
      setCurrentSlideIndex(newIndex);
    }
  }, [currentTime, slides, currentSlideIndex]);

  const handlePlay = () => {
    if (currentTime >= durationSec) {
      // Rejouer depuis le début
      setCurrentTime(0);
      setCurrentSlideIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReplay = () => {
    setCurrentTime(0);
    setCurrentSlideIndex(0);
    setIsPlaying(true);
  };

  const progress = (currentTime / durationSec) * 100;

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative bg-background-secondary rounded-2xl overflow-hidden border border-border">
        {/* Faux écran vidéo avec gradient et bruit */}
        <div className="relative aspect-[9/16] bg-gradient-to-br from-accent-cyan/20 via-accent-violet/20 to-background-tertiary overflow-hidden">
          {/* Bruit léger en CSS */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Contenu du centre */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10">
            <motion.div
              key={currentSlideIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-2xl font-bold text-foreground leading-tight px-4">
                {currentSlide.text}
              </p>
            </motion.div>
          </div>

          {/* Barre de progression en haut */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-background/50 z-20">
            <motion.div
              className="h-full bg-accent-cyan"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>

          {/* Bouton play/pause au centre */}
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
              onClick={handlePlay}
            >
              <div className="w-20 h-20 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center border-2 border-foreground/20 hover:border-accent-cyan transition-colors">
                <Play className="text-foreground ml-1" size={32} fill="currentColor" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Contrôles en bas */}
        <div className="p-4 bg-background-secondary">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full transition-colors ${
                  isLiked
                    ? "bg-red-500/20 text-red-500"
                    : "bg-background-tertiary text-foreground-muted hover:text-red-500"
                }`}
              >
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              </button>
              <button className="p-2 rounded-full bg-background-tertiary text-foreground-muted hover:text-accent-cyan transition-colors">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* Barre de progression et temps */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-background-tertiary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-accent-cyan rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
            <span className="text-xs text-foreground-muted min-w-[3rem] text-right">
              {Math.floor(currentTime)}s / {durationSec}s
            </span>
          </div>

          {/* Boutons de contrôle */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={handlePlay}
              className="px-4 py-2 bg-accent-cyan text-background rounded-lg hover:bg-accent-cyan-dark transition-colors flex items-center gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause size={16} fill="currentColor" />
                  Pause
                </>
              ) : (
                <>
                  <Play size={16} fill="currentColor" />
                  Lecture
                </>
              )}
            </button>
            <button
              onClick={handleReplay}
              className="px-4 py-2 bg-background-tertiary text-foreground rounded-lg hover:bg-border transition-colors flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Rejouer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

