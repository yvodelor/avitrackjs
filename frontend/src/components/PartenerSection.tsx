import React from "react";

// Types TypeScript
interface Partner {
  id: number;
  name: string;
  logo: string;
  url: string; // Ajout du champ d'URL
}

export default function PartnersSection(): React.JSX.Element {
  const partners: Partner[] = [
    { id: 1, name: "AgriTech Solutions", logo: "https://placehold.co/180x60/e2e8f0/475569?text=AgriTech", url: "https://example.com/agritech", },
    { id: 2, name: "EcoFarm Group", logo: "https://placehold.co/180x60/e2e8f0/475569?text=EcoFarm", url: "https://example.com/agritech", },
    { id: 3, name: "IoT Connect", logo: "https://placehold.co/180x60/e2e8f0/475569?text=IoT+Connect", url: "https://example.com/agritech", },
    { id: 4, name: "Avian Health", logo: "https://placehold.co/180x60/e2e8f0/475569?text=Avian+Health", url: "https://example.com/agritech", },
    { id: 5, name: "Smart Poultry", logo: "https://placehold.co/180x60/e2e8f0/475569?text=Smart+Poultry", url: "https://example.com/agritech", },
    { id: 6, name: "Data Agri", logo: "https://placehold.co/180x60/e2e8f0/475569?text=Data+Agri", url: "https://example.com/agritech", },
  ];

  // Duplication de la liste pour alimenter le défilement infini sans coupure
  const extendedPartners: Partner[] = [...partners, ...partners];

  return (
    <section className="py-16 bg-white border-y border-slate-200/60 overflow-hidden">
      {/* Configuration CSS de l'animation de défilement */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre de la section */}
        <div className="text-center mb-10">
          <span className="text-emerald-600 font-semibold text-xs sm:text-sm uppercase tracking-widest">
            Ils nous font confiance
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Nos partenaires
          </h2>
          <div className="w-12 h-1 bg-emerald-500 mx-auto mt-3 rounded-full" />
        </div>

        {/* Cadre de défilement horizontal */}
        <div className="relative w-full overflow-hidden">
          {/* Masques de dégradé sur les bords gauche et droit (Fade Effect) */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Conteneur animé */}
          <div className="animate-marquee gap-6 sm:gap-8 py-4">
            {extendedPartners.map((partner: Partner, index: number) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex-shrink-0 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-6 w-44 sm:w-56 h-24 sm:h-28 flex items-center justify-center hover:bg-emerald-50/50 hover:border-emerald-300 transition-all duration-300 grayscale hover:grayscale-0 shadow-sm hover:shadow-md cursor-pointer"
              >
                <a
                  key={`${partner.id}-${index}`}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Visiter le site de ${partner.name}`}
                  className="flex-shrink-0 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-6 w-44 sm:w-56 h-24 sm:h-28 flex items-center justify-center hover:bg-emerald-50/50 hover:border-emerald-400 hover:scale-105 transition-all duration-300 grayscale hover:grayscale-0 shadow-sm hover:shadow-md cursor-pointer group"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-12 max-w-full object-contain filter opacity-80 hover:opacity-100 transition-opacity"
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}