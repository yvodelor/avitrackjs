import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

import {
  ShieldCheck,
  Clock3,
  TrendingUp,
  Smartphone,
  AlertTriangle,
  BarChart3,
  Menu,
  X,

  Bot,
  Activity,
  Layers,
  ArrowRight
} from "lucide-react";
import PartnersSection from "@/components/PartenerSection";

export default function HomePage() {
  const { userId } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const advantages = [
    {
      icon: <Clock3 className="w-7 h-7" />,
      title: "Surveillance 24/7",
      description:
        "Suivez en permanence les conditions de votre élevage grâce aux capteurs connectés Avitrack."
    },
    {
      icon: <AlertTriangle className="w-7 h-7" />,
      title: "Alertes intelligentes",
      description:
        "Soyez immédiatement informé par notification lorsqu'un paramètre dépasse les seuils définis."
    },
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: "Analyse des données",
      description:
        "Transformez vos mesures de température, humidité et poids en informations exploitables."
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      title: "Optimisation de la ponte",
      description:
        "Suivez les courbes de production et réduisez la mortalité pour maximiser votre rendement."
    },
    {
      icon: <Smartphone className="w-7 h-7" />,
      title: "Accès multi-plateforme",
      description:
        "Consultez l'état de vos fermes depuis votre smartphone, tablette ou ordinateur."
    },
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: "Données sécurisées",
      description:
        "Vos données d'exploitation sont centralisées, chiffrées et hautement disponibles."
    }
  ];

  const features = [
    {
      icon: <Clock3 className="w-6 h-6 text-emerald-600" />,
      title: "Disponible 24h/24",
      description: "Supervision continue et alertes automatiques en temps réel."
    },
    {
      icon: <Bot className="w-6 h-6 text-emerald-600" />,
      title: "Assistant IA Intelligente",
      description: "Analyse prédictive et conseils de gestion sanitaire personnalisés."
    },
    {
      icon: <Layers className="w-6 h-6 text-emerald-600" />,
      title: "Multi-bâtiments",
      description: "Gérez et comparez les lots de plusieurs sites sur une interface."
    },
    {
      icon: <Activity className="w-6 h-6 text-emerald-600" />,
      title: "Tableau de Bord IoT",
      description: "Visualisez en temps réel les courbes de température, gaz et poids."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                Avi<span className="text-emerald-600">track</span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <ul className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
              <li>
                <a href="#accueil" className="hover:text-emerald-600 transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#fonctionnalites" className="hover:text-emerald-600 transition-colors">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a href="#advantages" className="hover:text-emerald-600 transition-colors">
                  Avantages
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-emerald-600 transition-colors">
                  À propos
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-emerald-600 transition-colors">
                  Contact
                </a>
              </li>
            </ul>

            {/* Auth Action Button (Desktop) */}
            <div className="hidden md:flex items-center">
              {userId ? (
                <Link
                  to="/Dashboard"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-xl transition duration-200 shadow-sm hover:shadow-md"
                >
                  Tableau de bord
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-xl transition duration-200 shadow-sm hover:shadow-md"
                >
                  Se connecter
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
            <a
              href="#accueil"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
            >
              Accueil
            </a>
            <a
              href="#fonctionnalites"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
            >
              Fonctionnalités
            </a>
            <a
              href="#advantages"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
            >
              Avantages
            </a>
            <a
              href="#about"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
            >
              À propos
            </a>
            <a
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
            >
              Contact
            </a>
            <div className="pt-2">
              {userId ? (
                <Link
                  to="/Dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center bg-emerald-600 text-white px-5 py-3 rounded-xl font-medium"
                >
                  Tableau de bord
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center bg-emerald-600 text-white px-5 py-3 rounded-xl font-medium"
                >
                  Se connecter
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="accueil" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Solution IoT & IA pour Aviculture
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mt-6 leading-tight tracking-tight">
                L'intelligence connectée au service de vos{" "}
                <span className="text-emerald-600">élevages avicoles</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg mt-6 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Automatisez la gestion sanitaire, environnementale et productive de vos fermes. 
                Collectez en temps réel les données de vos capteurs IoT, planifiez la vaccination 
                et anticipez les chûtes de ponte grâce à des analyses intelligentes.
              </p>
              {/*
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="#contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-7 py-3.5 rounded-xl transition duration-200 shadow-lg shadow-emerald-600/20"
                >
                  Essayer gratuitement
                  <ArrowRight className="w-5 h-5" />
                </a>

                <a
                  href="#advantages"
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold px-7 py-3.5 rounded-xl transition duration-200"
                >
                  Découvrir la démo
                </a>
              </div>
              */}
            </div>

            <div className="flex-1 w-full max-w-xl lg:max-w-none">
              <div className="relative mx-auto">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 opacity-20 blur-xl"></div>
                <img
                  src="https://images.unsplash.com/photo-1588597989061-b60ad0eefdbf?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dauto=format&fit=crop&w=1200&q=80"
                  alt="Monitoring Avitrack Dashboard"
                  className="relative rounded-2xl shadow-2xl border border-slate-200/50 object-cover w-full h-[320px] sm:h-[420px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="fonctionnalites" className="bg-white py-16 sm:py-24 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
              Une plateforme complète de supervision
            </h2>
            <p className="text-slate-600 mt-4 text-base sm:text-lg">
              Conçue sur-mesure pour répondre aux besoins d'exploitation avicole moderne.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-100 p-6 rounded-2xl hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100/70 flex items-center justify-center mb-5">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Light Section: Advantages */}
      <section id="advantages" className="py-20 sm:py-28 bg-slate-50 border-y border-slate-200/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-emerald-600 font-semibold text-xs sm:text-sm uppercase tracking-widest">
              Avitrack Solution
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Pourquoi choisir <span className="text-emerald-600">Avitrack</span> ?
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
              Une infrastructure IoT et logicielle complète pour connecter, surveiller et piloter vos bâtiments d'élevage en temps réel.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="mt-14 sm:mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {advantages.map((item, index) => (
              <div
                key={index}
                className="group rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5"
              >
                <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {item.title}
                </h3>

                <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insère la section juste après les fonctionnalités ou avantages */}
      <PartnersSection />

      {/* About Section */}
{/* About Section */}
<section id="about" className="bg-white border-b border-slate-200">
  {/* Intro */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
    <div className="max-w-4xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold mb-6">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        AVITRACK SOLUTIONS
      </div>

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
        La technologie au service d’un élevage avicole
        <span className="text-emerald-600"> plus performant, préventif et durable</span>
      </h2>

      <p className="mt-6 text-base sm:text-lg leading-8 text-slate-600">
        Avitrack Solutions est une solution numérique dédiée au suivi, au pilotage
        et à la gestion sanitaire des exploitations avicoles.
      </p>

      <p className="mt-4 text-base sm:text-lg leading-8 text-slate-600">
        Conçue pour répondre aux réalités des élevages modernes, notamment en Afrique,
        Avitrack permet à l’éleveur et au vétérinaire de disposer de données fiables
        sur les principaux paramètres de production et d’environnement afin de détecter
        rapidement les anomalies, anticiper les risques et améliorer les performances
        des fermes.
      </p>
    </div>
  </div>

  {/* Mission */}
  <div className="bg-slate-50 border-y border-slate-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="text-sm font-bold uppercase tracking-wider text-emerald-600">
            Notre mission
          </span>

          <h3 className="mt-3 text-3xl font-bold text-slate-900">
            Transformer les données en décisions utiles
          </h3>

          <p className="mt-5 text-slate-600 leading-7">
            Transformer les données de l’élevage en informations utiles à la décision,
            afin d'améliorer la productivité, la santé et la rentabilité des
            exploitations avicoles.
          </p>

          <p className="mt-4 text-slate-600 leading-7">
            Avitrack Solutions place ainsi la technologie au cœur d'une approche
            préventive fondée sur trois principes essentiels.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          {[
            { number: "01", title: "Surveiller", icon: "👁️" },
            { number: "02", title: "Alerter", icon: "🚨" },
            { number: "03", title: "Intervenir", icon: "⚡" },
          ].map((item) => (
            <div
              key={item.number}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 text-center shadow-sm hover:shadow-md transition"
            >
              <div className="text-2xl sm:text-3xl mb-3">{item.icon}</div>

              <div className="text-xs font-bold text-emerald-600 mb-1">
                {item.number}
              </div>

              <div className="font-bold text-slate-900 text-sm sm:text-base">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>

  {/* Fonctionnalités */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
    <div className="max-w-3xl mb-12">
      <span className="text-sm font-bold uppercase tracking-wider text-emerald-600">
        Fonctionnalités
      </span>

      <h3 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">
        Les données essentielles de votre ferme, au même endroit
      </h3>

      <p className="mt-4 text-slate-600 leading-7">
        Avitrack centralise les principaux paramètres permettant de mieux comprendre
        l’évolution de l’élevage et d’agir rapidement en cas d’anomalie.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      {/* Température / Humidité */}
      <div className="group rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 hover:border-emerald-200 hover:shadow-lg transition-all">
        <div className="flex items-start justify-between gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-2xl">
            🌡️
          </div>

          <span className="text-xs font-semibold text-slate-400">
            01
          </span>
        </div>

        <h4 className="mt-6 text-xl font-bold text-slate-900">
          Température & humidité
        </h4>

        <p className="mt-3 text-slate-600 leading-7">
          Surveillez les conditions environnementales à l’intérieur des bâtiments
          avicoles et identifiez rapidement les valeurs anormales.
        </p>

        <ul className="mt-5 space-y-2 text-sm text-slate-600">
          <li>✓ Suivi de la température</li>
          <li>✓ Suivi de l’humidité</li>
          <li>✓ Détection des valeurs anormales</li>
          <li>✓ Réception d’alertes</li>
          <li>✓ Intervention rapide</li>
        </ul>
      </div>

      {/* Poids */}
      <div className="group rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 hover:border-emerald-200 hover:shadow-lg transition-all">
        <div className="flex items-start justify-between gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl">
            ⚖️
          </div>

          <span className="text-xs font-semibold text-slate-400">
            02
          </span>
        </div>

        <h4 className="mt-6 text-xl font-bold text-slate-900">
          Gestion du poids
        </h4>

        <p className="mt-3 text-slate-600 leading-7">
          Suivez la croissance des animaux et comparez les performances réelles
          aux objectifs du lot.
        </p>

        <ul className="mt-5 space-y-2 text-sm text-slate-600">
          <li>✓ Enregistrement des poids</li>
          <li>✓ Suivi de la croissance</li>
          <li>✓ Analyse de l’évolution pondérale</li>
          <li>✓ Détection des écarts</li>
          <li>✓ Aide à la décision</li>
        </ul>
      </div>

      {/* Ammoniac */}
      <div className="group rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 hover:border-emerald-200 hover:shadow-lg transition-all">
        <div className="flex items-start justify-between gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-2xl">
            🧪
          </div>

          <span className="text-xs font-semibold text-slate-400">
            03
          </span>
        </div>

        <h4 className="mt-6 text-xl font-bold text-slate-900">
          Gestion de l’ammoniac
        </h4>

        <p className="mt-3 text-slate-600 leading-7">
          Surveillez la qualité de l’air afin d’identifier les situations pouvant
          présenter un risque pour le confort des volailles.
        </p>

        <ul className="mt-5 space-y-2 text-sm text-slate-600">
          <li>✓ Surveillance du niveau d’ammoniac</li>
          <li>✓ Détection des situations à risque</li>
          <li>✓ Déclenchement d’alertes</li>
          <li>✓ Identification des anomalies</li>
          <li>✓ Actions correctives facilitées</li>
        </ul>
      </div>

      {/* Alertes */}
      <div className="group rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 hover:border-emerald-200 hover:shadow-lg transition-all">
        <div className="flex items-start justify-between gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-2xl">
            🚨
          </div>

          <span className="text-xs font-semibold text-slate-400">
            04
          </span>
        </div>

        <h4 className="mt-6 text-xl font-bold text-slate-900">
          Alertes & intervention sanitaire
        </h4>

        <p className="mt-3 text-slate-600 leading-7">
          Avitrack ne se limite pas à enregistrer les données. La solution vise
          à transformer une anomalie détectée en action.
        </p>

        <ul className="mt-5 space-y-2 text-sm text-slate-600">
          <li>✓ Identification d’une situation anormale</li>
          <li>✓ Génération d’alertes</li>
          <li>✓ Information des responsables</li>
          <li>✓ Analyse de la situation</li>
          <li>✓ Suivi des interventions réalisées</li>
        </ul>
      </div>
    </div>
  </div>

  {/* Vision globale */}
  <div className="bg-slate-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="max-w-3xl mx-auto text-center">
        <span className="text-sm font-bold uppercase tracking-wider text-emerald-400">
          Une vision globale de la ferme
        </span>

        <h3 className="mt-3 text-3xl sm:text-4xl font-bold">
          Toutes les informations essentielles réunies
        </h3>

        <p className="mt-5 text-slate-300 leading-7">
          Avitrack Solutions permet de centraliser les informations essentielles
          relatives au fonctionnement de l’élevage afin de donner à l’éleveur
          une vision plus claire de son exploitation.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[
          "Environnement",
          "Poids",
          "Santé",
          "Alertes",
          "Interventions",
          "Performances",
        ].map((item, index) => (
          <div
            key={item}
            className="relative rounded-2xl bg-white/10 border border-white/10 p-5 text-center backdrop-blur-sm"
          >
            <div className="text-emerald-400 text-xs font-bold mb-2">
              0{index + 1}
            </div>

            <div className="font-semibold text-sm">
              {item}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-lg font-semibold text-emerald-400">
          Environnement → Poids → Santé → Alertes → Interventions → Performances
        </p>
      </div>
    </div>
  </div>

  {/* Utilisateurs */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <span className="text-sm font-bold uppercase tracking-wider text-emerald-600">
          Pour les professionnels
        </span>

        <h3 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">
          Une solution pensée pour l’éleveur et le vétérinaire
        </h3>

        <p className="mt-5 text-slate-600 leading-7">
          Avitrack accompagne les différents acteurs de la filière avicole dans
          leur transition vers une gestion numérique basée sur les données.
        </p>
      </div>

  
    </div>
  </div>

  {/* Afrique */}
  <div className="bg-emerald-50 border-y border-emerald-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="max-w-4xl mx-auto text-center">
        

        <h3 className="text-3xl sm:text-4xl font-bold text-slate-900">
          Une solution conçue pour les réalités africaines
        </h3>

        <p className="mt-5 text-slate-600 leading-7">
          Avitrack Solutions ambitionne de proposer une technologie adaptée
          aux conditions des élevages africains et aux besoins des professionnels
          de terrain.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {[
            "Digitalisation",
            "Données",
            "Prévention sanitaire",
            "Décision rapide",
            "Performance",
          ].map((item) => (
            <span
              key={item}
              className="px-4 py-2 rounded-full bg-white border border-emerald-200 text-emerald-700 text-sm font-semibold"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>

  {/* Vision + slogan */}
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
    <span className="text-sm font-bold uppercase tracking-wider text-emerald-600">
      Notre vision
    </span>

    <h3 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">
      Faire d’Avitrack Solutions un outil de référence
    </h3>

    <p className="mt-5 text-slate-600 leading-8 max-w-3xl mx-auto">
      Faire d’Avitrack Solutions un outil de référence pour la gestion numérique
      et sanitaire des exploitations avicoles en Afrique, en rapprochant la
      technologie des réalités quotidiennes des éleveurs et des vétérinaires.
    </p>

    <div className="mt-12 rounded-3xl bg-slate-900 px-6 py-10 sm:px-10">
      <p className="text-emerald-400 text-sm font-bold tracking-widest uppercase">
        AVITRACK SOLUTIONS
      </p>

      <h4 className="mt-4 text-2xl sm:text-3xl font-bold text-white">
        Observer. Alerter. Intervenir. Améliorer.
      </h4>

      <p className="mt-4 text-slate-300 max-w-2xl mx-auto leading-7">
        Une ferme mieux suivie est une ferme où les décisions peuvent être
        prises plus rapidement et sur la base de données objectives.
      </p>
    </div>
  </div>
</section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Contactez-nous</h2>
            <p className="text-slate-600 mt-3">Une question ou besoin d'une démonstration personnalisée ? Laissez-nous un message.</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nom complet</label>
                <input
                  type="text"
                  placeholder="Jean Dupont"
                  className="w-full border border-slate-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Adresse email</label>
                <input
                  type="email"
                  placeholder="jean@exemple.com"
                  className="w-full border border-slate-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
              <textarea
                rows={5}
                placeholder="Expliquez-nous votre besoin ou projet d'élevage..."
                className="w-full border border-slate-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl transition duration-200 shadow-md shadow-emerald-600/20"
            >
              Envoyer le message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-800 text-center text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Avitrack. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}