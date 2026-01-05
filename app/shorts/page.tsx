"use client";

import { motion } from "framer-motion";
import ShortVideoCard from "@/components/ShortVideoCard";
import shortsData from "@/data/shorts.json";
import { Video } from "lucide-react";

export default function ShortsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Video className="text-accent-cyan" size={40} />
          <h1 className="text-5xl font-bold text-foreground">Shorts</h1>
        </div>
        <p className="text-xl text-foreground-muted">
          Découvre le BUT SD en vidéos courtes
        </p>
      </motion.div>

      {/* Grille de vidéos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {shortsData.map((short, idx) => (
          <motion.div
            key={short.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <ShortVideoCard
              id={short.id}
              title={short.title}
              durationSec={short.durationSec}
              slides={short.slides}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}



