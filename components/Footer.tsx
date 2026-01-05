import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-foreground mb-4">
              BUT Science des Données
            </h3>
            <p className="text-foreground-muted mb-4">
              Découvre la science des données en t&apos;amusant avec des missions interactives 
              et un chatbot étudiant.
            </p>
            <p className="text-sm text-foreground-muted">
              Projet de valorisation pédagogique
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/missions" className="text-foreground-muted hover:text-accent-cyan transition-colors">
                  Missions
                </Link>
              </li>
              <li>
                <Link href="/chat" className="text-foreground-muted hover:text-accent-cyan transition-colors">
                  Chatbot
                </Link>
              </li>
              <li>
                <Link href="/shorts" className="text-foreground-muted hover:text-accent-cyan transition-colors">
                  Shorts
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-foreground-muted hover:text-accent-cyan transition-colors">
                  Débouchés
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-foreground-muted hover:text-accent-cyan transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/simulator" className="text-foreground-muted hover:text-accent-cyan transition-colors">
                  Simulateur
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Liens</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/program" className="text-foreground-muted hover:text-accent-cyan transition-colors">
                  La Formation
                </Link>
              </li>
              <li>
                <Link href="/apply" className="text-foreground-muted hover:text-accent-cyan transition-colors">
                  Candidater
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          {/* Section Auteurs */}
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-3 text-center">Équipe de développement</h4>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-foreground-muted">
              <span>Aurel SOUSSOUKPO</span>
              <span>•</span>
              <span>Mell-Florda OBISSA</span>
              <span>•</span>
              <span>Faste-Remède MOUANIA</span>
              <span>•</span>
              <span>God-Louange THOMBET</span>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="text-center text-sm text-foreground-muted">
            <p>© 2026 BUT Science des Données - Projet pédagogique</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

