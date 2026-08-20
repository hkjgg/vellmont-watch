"use client";

import { motion } from "framer-motion";
import HeroScene from "@/components/HeroScene";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <HeroScene />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-sm uppercase tracking-[0.3em] text-zinc-400"
          >
            Independent Swiss Atelier
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="text-5xl font-semibold tracking-tight sm:text-7xl"
          >
            VELLMONT
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-lg text-zinc-400"
          >
            The Obscura
          </motion.p>
        </div>
      </section>

      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
          Limited Edition
        </p>
        <h2 className="text-4xl font-semibold tracking-tight">The Obscura</h2>
        <p className="text-zinc-400">One of one hundred.</p>
      </section>
    </main>
  );
}
