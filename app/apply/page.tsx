"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { CheckCircle } from "lucide-react";

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler l'envoi (en démo, on ne fait rien)
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ nom: "", email: "", message: "" });
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Comment candidater
        </h1>
        <p className="text-xl text-foreground-muted mb-12">
          Tout ce qu&apos;il faut savoir pour postuler en BUT Science des Données
        </p>

        {/* Comment venir */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Comment candidater ?</h2>
          <div className="space-y-4 text-foreground-muted">
            <p>
              Pour candidater en BUT Science des Données, tu dois passer par Parcoursup 
              (si tu es en terminale) ou directement auprès de l&apos;IUT qui t&apos;intéresse.
            </p>
            <div className="bg-background-tertiary rounded-lg p-4 mt-4">
              <h3 className="font-bold text-foreground mb-2">Les prérequis :</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Avoir le bac (ou être en terminale)</li>
                <li>Montrer ton intérêt pour les données dans ta lettre de motivation</li>
                <li>Un bon dossier scolaire est un plus, mais la motivation compte beaucoup !</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Portes ouvertes */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Portes ouvertes</h2>
          <p className="text-foreground-muted mb-4">
            Les IUT organisent des journées portes ouvertes où tu peux rencontrer les profs, 
            voir les locaux, parler avec des étudiants. C&apos;est l&apos;occasion parfaite 
            pour poser tes questions !
          </p>
          <p className="text-foreground-muted">
            <strong className="text-foreground">Conseil :</strong> Renseigne-toi sur le site 
            de l&apos;IUT qui t&apos;intéresse pour connaître les dates des portes ouvertes.
          </p>
        </Card>

        {/* Contact */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Contact</h2>
          <p className="text-foreground-muted mb-4">
            Tu as des questions spécifiques ? Contacte directement l&apos;IUT qui t&apos;intéresse.
            Les secrétariats pédagogiques sont là pour répondre à tes questions.
          </p>
        </Card>

        {/* Formulaire de contact */}
        <Card>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Je veux être recontacté (démo)
          </h2>
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-accent-cyan/20 border border-accent-cyan/30 rounded-lg p-6 text-center"
            >
              <CheckCircle className="text-accent-cyan mx-auto mb-4" size={48} />
              <p className="text-foreground font-medium">
                Merci ! En démo, ton message n&apos;a pas été envoyé.
              </p>
              <p className="text-foreground-muted text-sm mt-2">
                Dans une vraie version, on enverrait un email à l&apos;IUT.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-foreground font-medium mb-2">Nom</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full bg-background-tertiary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent-cyan"
                  required
                />
              </div>
              <div>
                <label className="block text-foreground font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-background-tertiary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent-cyan"
                  required
                />
              </div>
              <div>
                <label className="block text-foreground font-medium mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full bg-background-tertiary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent-cyan"
                  required
                />
              </div>
              <Button type="submit" variant="primary" className="w-full">
                Envoyer (démo)
              </Button>
            </form>
          )}
        </Card>

        {/* Brochure et QR code (mock) */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card>
            <h3 className="text-xl font-bold text-foreground mb-3">Télécharger la brochure</h3>
            <p className="text-foreground-muted mb-4 text-sm">
              En démo, pas de brochure réelle. Dans une vraie version, tu pourrais télécharger un PDF.
            </p>
            <Button variant="outline" className="w-full" disabled>
              Télécharger (démo)
            </Button>
          </Card>
          <Card>
            <h3 className="text-xl font-bold text-foreground mb-3">Scanner le QR code</h3>
            <p className="text-foreground-muted mb-4 text-sm">
              En démo, pas de QR code réel. Dans une vraie version, tu pourrais scanner pour accéder rapidement au site.
            </p>
            <div className="w-32 h-32 bg-background-tertiary border border-border rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-foreground-muted text-xs">QR Code</span>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}



