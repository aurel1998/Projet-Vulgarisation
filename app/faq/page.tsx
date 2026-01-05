"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@/components/Card";
import faqsData from "@/data/faqs.json";
import { ChevronDown } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Questions fréquentes
          </h1>
          <p className="text-xl text-foreground-muted">
            Tout ce que tu veux savoir sur le BUT Science des Données
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqsData.map((faq, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="text-lg font-bold text-foreground pr-8">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`text-accent-cyan flex-shrink-0 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                    size={24}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-border">
                        <p className="text-foreground-muted leading-relaxed">
                          {faq.reponse}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants} className="mt-12 text-center">
          <Card className="bg-accent-cyan/20 border-accent-cyan/30">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Tu as d&apos;autres questions ?
            </h2>
            <p className="text-foreground-muted mb-6">
              Parle avec notre chatbot étudiant ou consulte la formation en détail !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/chat"
                className="px-6 py-3 bg-accent-cyan text-background rounded-lg hover:bg-accent-cyan-dark transition-colors font-medium inline-block"
              >
                Parler au chatbot
              </a>
              <a
                href="/program"
                className="px-6 py-3 border-2 border-accent-cyan text-accent-cyan rounded-lg hover:bg-accent-cyan hover:text-background transition-colors font-medium inline-block"
              >
                Voir la formation
              </a>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}



