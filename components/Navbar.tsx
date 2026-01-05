"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/missions", label: "Missions" },
    { href: "/chat", label: "Chatbot" },
    { href: "/shorts", label: "Shorts" },
    { href: "/careers", label: "Débouchés" },
    { href: "/program", label: "La Formation" },
    { href: "/faq", label: "FAQ" },
    { href: "/simulator", label: "Simulateur" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-foreground hover:text-accent-cyan transition-colors">
            BUT Science des Données
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground-muted hover:text-accent-cyan transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/apply"
              className="px-4 py-2 bg-accent-cyan text-background rounded-lg hover:bg-accent-cyan-dark transition-colors font-medium"
            >
              Candidater
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background-secondary"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-foreground-muted hover:text-accent-cyan transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/apply"
                className="block px-4 py-2 bg-accent-cyan text-background rounded-lg hover:bg-accent-cyan-dark transition-colors font-medium text-center"
                onClick={() => setIsOpen(false)}
              >
                Candidater
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

