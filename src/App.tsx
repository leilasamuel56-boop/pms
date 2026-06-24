/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, 
  Shield, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  Calendar, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  Droplet, 
  Star, 
  MessageSquare, 
  Clock, 
  Compass, 
  ArrowRight,
  Map,
  BadgePercent
} from 'lucide-react';
import { VEHICLES, WASH_PACKAGES, FAQS } from './data';
import { BookingFormData, Vehicle } from './types';

export default function App() {
  // Navigation & Scroll states
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // FAQ state
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  // Accessory details expand state
  const [expandedAccId, setExpandedAccId] = useState<string | null>(null);

  // Interactive Calculator State
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 3);
  const defaultReturnStr = tomorrow.toISOString().split('T')[0];

  const [calcVehicleId, setCalcVehicleId] = useState<string>(VEHICLES[0].id);
  const [calcStartDate, setCalcStartDate] = useState<string>(todayStr);
  const [calcEndDate, setCalcEndDate] = useState<string>(defaultReturnStr);
  const [calcWithDriver, setCalcWithDriver] = useState<boolean>(false);
  const [calcResult, setCalcResult] = useState<{
    days: number;
    dailyRate: number;
    driverCost: number;
    total: number;
  }>({ days: 3, dailyRate: VEHICLES[0].pricePerDay, driverCost: 0, total: VEHICLES[0].pricePerDay * 3 });

  // Form Booking State
  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    fullName: '',
    phone: '',
    email: '',
    vehicleId: VEHICLES[0].id,
    startDate: todayStr,
    endDate: defaultReturnStr,
    pickupLocation: 'Rivera Bonoumin',
    withDriver: false,
    message: ''
  });

  // Validation & feedback
  const [formErrors, setFormErrors] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);

  // References for scrolling
  const vehiclesRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);
  const lavageRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Track scroll position to style header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate dynamic price whenever inputs change
  useEffect(() => {
    const selectedCar = VEHICLES.find(v => v.id === calcVehicleId) || VEHICLES[0];
    const start = new Date(calcStartDate);
    const end = new Date(calcEndDate);
    
    let diffDays = 1;
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      const diffTime = end.getTime() - start.getTime();
      diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) diffDays = 1; // Minimum 1 day
    }

    const dailyRate = selectedCar.pricePerDay;
    const driverCost = calcWithDriver ? 15000 : 0;
    const total = (dailyRate + driverCost) * diffDays;

    setCalcResult({
      days: diffDays,
      dailyRate,
      driverCost: driverCost * diffDays,
      total
    });
  }, [calcVehicleId, calcStartDate, calcEndDate, calcWithDriver]);

  // Handle CTA Booking click from vehicle cards
  const handleSelectVehicleForBooking = (vehicleId: string) => {
    setBookingForm(prev => ({
      ...prev,
      vehicleId
    }));
    // Sync calculator too for a unified experience
    setCalcVehicleId(vehicleId);
    
    // Smooth scroll to form section
    bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Scroll to section helper
  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    setMobileMenuOpen(false);
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Helper to format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  // Generate pre-filled WhatsApp link for dynamic calculation
  const handleCalculatorWhatsApp = () => {
    const selectedCar = VEHICLES.find(v => v.id === calcVehicleId) || VEHICLES[0];
    const dateDeb = new Date(calcStartDate).toLocaleDateString('fr-FR');
    const dateFin = new Date(calcEndDate).toLocaleDateString('fr-FR');
    
    const messageText = `🚗 *PMS Chez MOLO — Estimation Devis*
----------------------------------
🚘 *Véhicule :* ${selectedCar.name}
📅 *Départ :* ${dateDeb}
📅 *Retour :* ${dateFin}
⏱️ *Durée :* ${calcResult.days} jour(s)
👨‍✈️ *Avec Chauffeur :* ${calcWithDriver ? 'Oui (+15 000 FCFA/jour)' : 'Non'}
----------------------------------
💰 *Total Estimé :* ${formatPrice(calcResult.total)}

_Bonjour PMS Chez MOLO, je souhaite confirmer la disponibilité de ce véhicule pour ces dates._`;

    const encodedMessage = encodeURIComponent(messageText);
    window.open(`https://wa.me/2250749575874?text=${encodedMessage}`, '_blank');
  };

  // Generate pre-filled WhatsApp link for wash package
  const handleWashWhatsApp = (packageName: string, price: number | 'Sur devis') => {
    const priceText = typeof price === 'number' ? formatPrice(price) : 'Sur devis';
    const messageText = `🧼 *PMS Chez MOLO — Lavage Automobile*
----------------------------------
💎 *Forfait choisi :* ${packageName}
💰 *Tarif :* ${priceText}

_Bonjour, je souhaite prendre rendez-vous pour ce forfait de lavage automobile de mon véhicule._`;
    const encodedMessage = encodeURIComponent(messageText);
    window.open(`https://wa.me/2250749575874?text=${encodedMessage}`, '_blank');
  };

  // Fragrance WhatsApp CTA
  const handleFragranceWhatsApp = () => {
    const messageText = `✨ *PMS Chez MOLO — Parfums Haute Gamme*
----------------------------------
🌟 _Bonjour, je souhaite découvrir votre collection exclusive de parfums haut de gamme pour l'intérieur de ma voiture._`;
    const encodedMessage = encodeURIComponent(messageText);
    window.open(`https://wa.me/2250749575874?text=${encodedMessage}`, '_blank');
  };

  // Submit main booking form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors(null);

    // Validation
    if (!bookingForm.fullName.trim()) {
      setFormErrors('Le nom complet est obligatoire.');
      return;
    }
    if (!bookingForm.phone.trim()) {
      setFormErrors('Le numéro de téléphone est obligatoire pour vous recontacter.');
      return;
    }
    if (!bookingForm.startDate || !bookingForm.endDate) {
      setFormErrors('Les dates de départ et de retour sont requises.');
      return;
    }

    // Dates validation
    const start = new Date(bookingForm.startDate);
    const end = new Date(bookingForm.endDate);
    if (end.getTime() < start.getTime()) {
      setFormErrors('La date de retour doit être postérieure ou égale à la date de départ.');
      return;
    }

    const selectedCar = VEHICLES.find(v => v.id === bookingForm.vehicleId) || VEHICLES[0];
    const dateDeb = start.toLocaleDateString('fr-FR');
    const dateFin = end.toLocaleDateString('fr-FR');

    // Build WhatsApp message
    const messageText = `🚗 *NOUVELLE RÉSERVATION — PMS Chez MOLO*

👤 *Nom :* ${bookingForm.fullName}
📞 *Téléphone :* ${bookingForm.phone}
📧 *Email :* ${bookingForm.email || 'Non renseigné'}
🚘 *Véhicule :* ${selectedCar.name}
📅 *Départ :* ${dateDeb}
📅 *Retour :* ${dateFin}
📍 *Lieu :* ${bookingForm.pickupLocation}
👨‍✈️ *Avec chauffeur :* ${bookingForm.withDriver ? 'Oui (+15 000 FCFA/jour)' : 'Non'}
💬 *Message :* ${bookingForm.message || 'Aucun message particulier'}`;

    const encodedMessage = encodeURIComponent(messageText);
    setFormSuccess(true);
    
    // Open in new window/tab
    setTimeout(() => {
      window.open(`https://wa.me/2250749575874?text=${encodedMessage}`, '_blank');
      setFormSuccess(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-200 antialiased selection:bg-[#C9A84C] selection:text-[#0A0A0A] flex flex-col">
      
      {/* 1. HEADER FIXE (Sticky Header) */}
      <header 
        id="header"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
          isScrolled 
            ? 'bg-[#0A0A0A]/95 backdrop-blur-md shadow-lg border-neutral-900 py-3' 
            : 'bg-transparent border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-2xl font-bold tracking-wider text-[#C9A84C]">
                P M S
              </span>
              <span className="text-[10px] text-white tracking-[0.25em] font-sans font-medium uppercase mt-0.5">
                Chez MOLO
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm font-medium text-gray-300 hover:text-[#C9A84C] transition-colors cursor-pointer"
            >
              Accueil
            </button>
            <button 
              onClick={() => scrollTo(vehiclesRef)}
              className="text-sm font-medium text-gray-300 hover:text-[#C9A84C] transition-colors cursor-pointer"
            >
              Véhicules
            </button>
            <button 
              onClick={() => scrollTo(lavageRef)}
              className="text-sm font-medium text-gray-300 hover:text-[#C9A84C] transition-colors cursor-pointer"
            >
              Lavage
            </button>
            <button 
              onClick={() => scrollTo(calculatorRef)}
              className="text-sm font-medium text-gray-300 hover:text-[#C9A84C] transition-colors cursor-pointer"
            >
              Tarifs & Devis
            </button>
            <button 
              onClick={() => scrollTo(bookingRef)}
              className="text-sm font-medium text-gray-300 hover:text-[#C9A84C] transition-colors cursor-pointer"
            >
              Réservation
            </button>
            <button 
              onClick={() => scrollTo(contactRef)}
              className="text-sm font-medium text-gray-300 hover:text-[#C9A84C] transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Desktop Call To Action */}
          <div className="hidden md:block">
            <button
              onClick={() => scrollTo(bookingRef)}
              className="bg-[#C9A84C] hover:bg-[#B5943E] text-black font-semibold text-xs py-2.5 px-5 rounded-full transition-all duration-300 transform hover:scale-[1.02] shadow-md shadow-[#C9A84C]/10 inline-flex items-center gap-1.5 cursor-pointer"
              id="cta-header-booking"
            >
              <Zap className="w-3.5 h-3.5" />
              Réserver maintenant
            </button>
          </div>

          {/* Mobile hamburger menu trigger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-[#C9A84C] p-2 focus:outline-none transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[60px] bg-[#0A0A0A]/98 backdrop-blur-lg z-40 md:hidden flex flex-col justify-between p-6 border-t border-neutral-900"
          >
            <div className="flex flex-col space-y-5 pt-8">
              <button 
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileMenuOpen(false); }}
                className="text-left font-serif text-xl text-gray-100 hover:text-[#C9A84C] py-2 border-b border-neutral-900"
              >
                Accueil
              </button>
              <button 
                onClick={() => scrollTo(vehiclesRef)}
                className="text-left font-serif text-xl text-gray-100 hover:text-[#C9A84C] py-2 border-b border-neutral-900"
              >
                Nos Véhicules
              </button>
              <button 
                onClick={() => scrollTo(lavageRef)}
                className="text-left font-serif text-xl text-gray-100 hover:text-[#C9A84C] py-2 border-b border-neutral-900"
              >
                Lavage Automobile
              </button>
              <button 
                onClick={() => scrollTo(calculatorRef)}
                className="text-left font-serif text-xl text-gray-100 hover:text-[#C9A84C] py-2 border-b border-neutral-900"
              >
                Simulateur & Tarifs
              </button>
              <button 
                onClick={() => scrollTo(bookingRef)}
                className="text-left font-serif text-xl text-gray-100 hover:text-[#C9A84C] py-2 border-b border-neutral-900"
              >
                Réservation Express
              </button>
              <button 
                onClick={() => scrollTo(contactRef)}
                className="text-left font-serif text-xl text-gray-100 hover:text-[#C9A84C] py-2"
              >
                Contact & Plan
              </button>
            </div>

            <div className="pb-10">
              <button
                onClick={() => scrollTo(bookingRef)}
                className="w-full bg-[#C9A84C] text-black text-center font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-5 h-5 fill-current" />
                Réserver immédiatement
              </button>
              <div className="text-center text-xs text-neutral-500 mt-4 font-mono">
                ☎ Abidjan · 07 49 57 58 74
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* 2. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-28 pb-16">
        
        {/* Abstract Background Design */}
        <div className="absolute inset-0 z-0">
          {/* Subtle radial gold gradient */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A84C]/5 rounded-full blur-[140px]" />
          <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-neutral-900/40 rounded-full blur-[80px]" />
          
          {/* Visual grid overlay for a high tech & premium architectural structure */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          
          {/* Premium Tag Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-[#C9A84C] mb-6 shadow-inner tracking-wider uppercase font-medium"
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>EXCELLENCE GARANTIE · NOTE GOOGLE ⭐ 5,0</span>
          </motion.div>

          {/* Main Display Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight"
          >
            Roulez avec <span className="text-[#C9A84C] italic font-normal">distinction</span> à Abidjan
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 text-gray-400 text-base sm:text-lg lg:text-xl max-w-3xl leading-relaxed font-sans"
          >
            Location de véhicules récents, lavage expert méticuleux et soins automobiles haut de gamme à <span className="text-white font-medium">Rivera Bonoumin, Abidjan</span>. Un service d'excellence conçu pour les exigences les plus élevées.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <button
              onClick={() => scrollTo(vehiclesRef)}
              className="w-full sm:w-auto bg-[#C9A84C] hover:bg-[#B5943E] text-black font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.01] shadow-xl shadow-[#C9A84C]/10 flex items-center justify-center gap-2 cursor-pointer"
              id="hero-cta-vehicles"
            >
              <Car className="w-5 h-5" />
              Voir les véhicules
            </button>
            <button
              onClick={() => scrollTo(contactRef)}
              className="w-full sm:w-auto bg-transparent hover:bg-neutral-900 border-2 border-white/80 hover:border-white text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              id="hero-cta-contact"
            >
              Nous contacter
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Main Hero Image Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-12 w-full max-w-4xl rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl shadow-[#C9A84C]/5 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-10" />
            <img 
              src="https://i.imgur.com/mz9inr5.jpeg" 
              alt="PMS Chez MOLO Prestige Fleet" 
              className="w-full h-[260px] sm:h-[420px] object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <p className="text-xs uppercase tracking-widest text-[#C9A84C] font-mono font-bold mb-1">Prestige & Performance</p>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white">Notre flotte de véhicules d'exception est prête</h3>
              </div>
              <button 
                onClick={() => scrollTo(vehiclesRef)}
                className="bg-white/10 hover:bg-[#C9A84C] text-white hover:text-black font-semibold text-xs py-2 px-4 rounded-lg backdrop-blur-md transition-all duration-300 border border-white/20 hover:border-[#C9A84C] inline-flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                Parcourir la flotte
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Animated Reassurance Banner */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.65 }}
            className="mt-20 w-full border-t border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-sm py-5 px-6 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="flex items-center justify-center gap-2.5 text-xs sm:text-sm text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-[#C9A84C]" />
              <span className="font-medium">Véhicules récents</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 text-xs sm:text-sm text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-[#C9A84C]" />
              <span className="font-medium">Disponibilité immédiate</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 text-xs sm:text-sm text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-[#C9A84C]" />
              <span className="font-medium">Note 5★ Google</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 text-xs sm:text-sm text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-[#C9A84C]" />
              <span className="font-medium">Satisfaction garantie</span>
            </div>
          </motion.div>

        </div>
      </section>


      {/* 3. SECTION "POURQUOI NOUS CHOISIR ?" */}
      <section className="py-20 bg-neutral-950/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section title */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#C9A84C] font-mono text-xs font-semibold uppercase tracking-widest block mb-3">
              L'Écart de Qualité PMS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Une crédibilité prouvée, une confiance méritée
            </h2>
            <div className="w-12 h-[2px] bg-[#C9A84C] mx-auto mt-4" />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 rounded-2xl p-6 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-neutral-950 flex items-center justify-center border border-neutral-800 group-hover:border-[#C9A84C]/50 transition-colors mb-6 text-[#C9A84C]">
                  <Car className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-2">
                  Flotte récente & impeccable
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Des véhicules modernes, nettoyés en profondeur après chaque location, maintenus selon des standards rigoureux.
                </p>
              </div>
              <div className="text-[11px] font-mono text-neutral-500 mt-6 pt-3 border-t border-neutral-950">
                100% PRÊTS À ROULER
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 rounded-2xl p-6 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-neutral-950 flex items-center justify-center border border-neutral-800 group-hover:border-[#C9A84C]/50 transition-colors mb-6 text-[#C9A84C]">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-2">
                  Réservation rapide
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Réservez en ligne et finalisez via WhatsApp en moins de 2 minutes. Pas de paperasse inutile, processus limpide.
                </p>
              </div>
              <div className="text-[11px] font-mono text-neutral-500 mt-6 pt-3 border-t border-neutral-950">
                PROCESSUS INSTANTANÉ
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 rounded-2xl p-6 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-neutral-950 flex items-center justify-center border border-neutral-800 group-hover:border-[#C9A84C]/50 transition-colors mb-6 text-[#C9A84C]">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-2">
                  Sécurité garantie
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Assistance 24/7 incluse et assurance complète. Voyagez l'esprit tranquille à travers Abidjan et en Côte d'Ivoire.
                </p>
              </div>
              <div className="text-[11px] font-mono text-neutral-500 mt-6 pt-3 border-t border-neutral-950">
                COUVERTURE TOTALE
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 rounded-2xl p-6 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-neutral-950 flex items-center justify-center border border-neutral-800 group-hover:border-[#C9A84C]/50 transition-colors mb-6 text-[#C9A84C]">
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-2">
                  Service 5 étoiles
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Nos clients saluent notre ponctualité, notre courtoisie et le parfumage signature de nos habitacles.
                </p>
              </div>
              <div className="text-[11px] font-mono text-neutral-500 mt-6 pt-3 border-t border-neutral-950">
                NOTE MAXIMALE GOOGLE
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 4. CATALOGUE VÉHICULES */}
      <section ref={vehiclesRef} id="vehicles" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section title */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#C9A84C] font-mono text-xs font-semibold uppercase tracking-widest block mb-3">
              Notre Flotte d'Élite
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Sélectionnez votre prestige
            </h2>
            <p className="text-gray-400 text-sm mt-3">
              Des citadines élégantes, des SUV spacieux et des minibus de transport pour tous vos événements à Abidjan.
            </p>
            <div className="w-12 h-[2px] bg-[#C9A84C] mx-auto mt-4" />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {VEHICLES.map((vehicle) => (
              <div 
                key={vehicle.id}
                className="bg-[#111111]/90 border border-neutral-900 hover:border-[#C9A84C]/50 rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-[#C9A84C]/5 transition-all duration-500 flex flex-col h-full relative"
              >
                {/* Prestation Image en haut - Object-fit cover, hauteur 220px, coins arrondis */}
                <div className="relative h-[220px] w-full overflow-hidden">
                  <img 
                    src={vehicle.imageUrl} 
                    alt={vehicle.name} 
                    className="h-[220px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Category badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] text-gray-300 border border-neutral-800 tracking-wider uppercase font-semibold">
                      {vehicle.category}
                    </span>
                  </div>
                  {/* Note stamp */}
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-black/80 backdrop-blur-sm py-1 px-2.5 rounded-full border border-neutral-800 text-[10px] text-[#C9A84C] font-semibold">
                    <Star className="w-3 h-3 fill-current" />
                    <span>5.0</span>
                  </div>
                </div>

                {/* Content area */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    {/* Header: Name */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-serif text-xl font-bold text-white tracking-wide group-hover:text-[#C9A84C] transition-colors">
                        {vehicle.name}
                      </h3>
                    </div>

                    {/* Bouton Accessoires en haut de la carte content */}
                    <div className="mb-4">
                      <button
                        type="button"
                        onClick={() => setExpandedAccId(expandedAccId === vehicle.id ? null : vehicle.id)}
                        className={`w-full py-2.5 px-4 rounded-xl border transition-all duration-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                          expandedAccId === vehicle.id 
                            ? 'bg-[#C9A84C] border-[#C9A84C] text-black shadow-md' 
                            : 'bg-neutral-950 border-neutral-800 hover:border-[#C9A84C] text-[#C9A84C]'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 fill-current" />
                        <span>{expandedAccId === vehicle.id ? "Masquer les accessoires" : "🛠️ Voir les accessoires inclus"}</span>
                      </button>

                      {/* Animated expandable accessories panel */}
                      <AnimatePresence>
                        {expandedAccId === vehicle.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mt-3"
                          >
                            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 space-y-2">
                              <span className="text-[10px] uppercase font-mono tracking-wider text-[#C9A84C] font-semibold block mb-1">
                                Équipements inclus :
                              </span>
                              <div className="grid grid-cols-2 gap-2">
                                {vehicle.accessories.map((acc, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-gray-300">
                                    <CheckCircle2 className="w-3 h-3 text-[#C9A84C] shrink-0" />
                                    <span>{acc}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Description détaillée */}
                    <p className="text-gray-400 text-xs leading-relaxed mb-4">
                      {vehicle.description}
                    </p>

                    {/* Grille des tarifs et durées */}
                    <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-3.5 mb-5 space-y-2.5">
                      <div className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono text-center border-b border-neutral-900 pb-1.5">
                        Grille tarifaire par durée de location
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <div className="text-[9px] text-gray-500 uppercase font-mono">1 - 6 jours</div>
                          <div className="text-xs font-bold text-white font-mono mt-0.5">{formatPrice(vehicle.priceShortTerm)}<span className="text-[9px] font-normal text-gray-500">/j</span></div>
                        </div>
                        <div className="text-center border-x border-neutral-900">
                          <div className="text-[9px] text-[#C9A84C] uppercase font-mono">+7 jours</div>
                          <div className="text-xs font-bold text-[#C9A84C] font-mono mt-0.5">{formatPrice(vehicle.priceLongTerm)}<span className="text-[9px] font-normal text-[#C9A84C]/70">/j</span></div>
                        </div>
                        <div className="text-center">
                          <div className="text-[9px] text-gray-500 uppercase font-mono">Caution</div>
                          <div className="text-xs font-bold text-gray-300 font-mono mt-0.5">{formatPrice(vehicle.deposit)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Features checklist */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="flex items-center gap-2 text-xs text-gray-300 font-medium">
                        <div className="w-5 h-5 rounded-md bg-neutral-950 flex items-center justify-center text-[#C9A84C] border border-neutral-800">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <span>{vehicle.seats} Places</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-300 font-medium">
                        <div className="w-5 h-5 rounded-md bg-neutral-950 flex items-center justify-center text-[#C9A84C] border border-neutral-800">
                          <Droplet className="w-3.5 h-3.5" />
                        </div>
                        <span>{vehicle.transmission}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-300 font-medium">
                        <div className="w-5 h-5 rounded-md bg-neutral-950 flex items-center justify-center text-[#C9A84C] border border-neutral-800">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <span>Climatisation</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-300 font-medium">
                        <div className="w-5 h-5 rounded-md bg-neutral-950 flex items-center justify-center text-[#C9A84C] border border-neutral-800">
                          <Compass className="w-3.5 h-3.5" />
                        </div>
                        <span>{vehicle.fuel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => handleSelectVehicleForBooking(vehicle.id)}
                    className="w-full bg-[#1F1F1F] hover:bg-[#C9A84C] group-hover:bg-[#C9A84C] text-white group-hover:text-black font-semibold text-xs py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>Réserver ce véhicule</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>

                </div>

              </div>
            ))}
          </div>

        </div>
      </section>


      {/* 5. CALCULATEUR DE PRIX AUTOMATIQUE */}
      <section ref={calculatorRef} id="calculator" className="py-20 bg-neutral-950 relative">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#C9A84C]/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Card container */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-[#C9A84C] font-mono text-xs font-semibold uppercase tracking-widest block mb-2">
                Simulateur en Temps Réel
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Calculez le tarif de votre devis
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Choisissez un véhicule et vos dates pour voir une estimation précise instantanément.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              {/* Inputs */}
              <div className="space-y-5">
                
                {/* Vehicle Selection */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2 font-mono">
                    Sélectionner le Véhicule
                  </label>
                  <select
                    value={calcVehicleId}
                    onChange={(e) => setCalcVehicleId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                  >
                    {VEHICLES.map((car) => (
                      <option key={car.id} value={car.id}>
                        {car.name} ({formatPrice(car.pricePerDay)} / jour)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dates group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2 font-mono">
                      Date de Départ
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="date"
                        min={todayStr}
                        value={calcStartDate}
                        onChange={(e) => setCalcStartDate(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2 font-mono">
                      Date de Retour
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="date"
                        min={calcStartDate}
                        value={calcEndDate}
                        onChange={(e) => setCalcEndDate(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Driver Option */}
                <div className="pt-2">
                  <label className="relative flex items-center gap-3.5 p-4 bg-neutral-950/80 border border-neutral-800/80 rounded-xl cursor-pointer hover:border-neutral-700 transition-colors select-none">
                    <input
                      type="checkbox"
                      checked={calcWithDriver}
                      onChange={(e) => setCalcWithDriver(e.target.checked)}
                      className="w-4.5 h-4.5 rounded text-[#C9A84C] bg-neutral-900 border-neutral-800 focus:ring-[#C9A84C] focus:ring-offset-neutral-950"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">Ajouter l'option Chauffeur</span>
                      <span className="text-xs text-neutral-400 mt-0.5">Assistance de conduite professionnelle (+15 000 FCFA / jour)</span>
                    </div>
                  </label>
                </div>

              </div>

              {/* Dynamic Invoice display */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between h-full">
                
                <div>
                  <h3 className="font-serif text-lg font-bold text-white border-b border-neutral-900 pb-3.5 mb-4 flex items-center gap-2">
                    <BadgePercent className="w-5 h-5 text-[#C9A84C]" />
                    Récapitulatif de l'estimation
                  </h3>

                  <div className="space-y-3 font-sans text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Durée calculée :</span>
                      <span className="text-white font-semibold font-mono">{calcResult.days} {calcResult.days > 1 ? 'jours' : 'jour'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tarif journalier véhicule :</span>
                      <span className="text-white font-mono">{formatPrice(calcResult.dailyRate)}</span>
                    </div>
                    {calcWithDriver && (
                      <div className="flex justify-between text-yellow-500/90">
                        <span className="text-gray-400">Frais chauffeur :</span>
                        <span className="font-mono">+{formatPrice(calcResult.driverCost)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-neutral-900">
                  <div className="flex items-baseline justify-between mb-6">
                    <span className="text-base text-gray-300 font-serif">Total estimé :</span>
                    <span className="text-2xl sm:text-3xl font-bold font-serif text-[#C9A84C] tracking-tight">
                      {formatPrice(calcResult.total)}
                    </span>
                  </div>

                  <button
                    onClick={handleCalculatorWhatsApp}
                    className="w-full bg-[#C9A84C] hover:bg-[#B5943E] text-black font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer shadow-lg shadow-[#C9A84C]/5"
                    id="calculator-confirm-whatsapp"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    Confirmer via WhatsApp
                  </button>

                  <div className="text-center mt-3">
                    <span className="text-[10px] text-neutral-500">
                      *Tarif indicatif hors caution de sécurité. Réservation validée après appel de confirmation.
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>


      {/* 6. SECTION LAVAGE AUTOMOBILE */}
      <section ref={lavageRef} id="lavage" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section title */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#C9A84C] font-mono text-xs font-semibold uppercase tracking-widest block mb-3">
              L'Art du Lavage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Centre de Lavage PMS
            </h2>
            <p className="text-gray-400 text-sm mt-3">
              Restaurez la brillance d'origine de votre voiture grâce à nos techniques de nettoyage minutieuses et nos produits haut de gamme.
            </p>
            <div className="w-12 h-[2px] bg-[#C9A84C] mx-auto mt-4" />
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WASH_PACKAGES.map((pkg) => (
              <div 
                key={pkg.id}
                className={`border rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between relative ${
                  pkg.popular 
                    ? 'bg-neutral-900 border-[#C9A84C] shadow-xl shadow-[#C9A84C]/5' 
                    : 'bg-neutral-900/40 border-neutral-900 hover:border-neutral-800'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#C9A84C] text-black text-[10px] uppercase font-bold tracking-widest py-1 px-3.5 rounded-full shadow">
                    Le Plus Demandé
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <h3 className="font-serif text-lg font-bold text-white mb-2 flex items-center gap-2">
                      {pkg.id === 'express' && <Clock className="w-5 h-5 text-gray-400" />}
                      {pkg.id === 'complet' && <Droplet className="w-5 h-5 text-sky-400" />}
                      {pkg.id === 'grand-nettoyage' && <Sparkles className="w-5 h-5 text-[#C9A84C]" />}
                      {pkg.id === 'canapes-tapis' && <Sparkles className="w-5 h-5 text-yellow-600" />}
                      {pkg.name}
                    </h3>
                    <div className="flex items-baseline gap-1 py-2">
                      <span className="font-serif text-2xl font-bold text-white">
                        {typeof pkg.price === 'number' ? formatPrice(pkg.price) : pkg.price}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 border-t border-neutral-950 pt-4 mt-4">
                    {pkg.includes.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-gray-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A84C] shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => handleWashWhatsApp(pkg.name, pkg.price)}
                    className={`w-full text-xs font-bold py-3 px-4 rounded-xl transition-all duration-300 cursor-pointer ${
                      pkg.popular 
                        ? 'bg-[#C9A84C] hover:bg-[#B5943E] text-black' 
                        : 'bg-neutral-950 hover:bg-neutral-900 text-gray-300 hover:text-white border border-neutral-800'
                    }`}
                  >
                    Prendre RDV
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>


      {/* 7. SECTION PARFUMS VOITURE (Vente additionnelle) */}
      <section className="py-20 bg-neutral-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-10 w-[300px] h-[300px] bg-[#C9A84C] rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 bg-[#C9A84C]/10 border border-[#C9A84C]/25 text-[#C9A84C] text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase mb-4">
                <Sparkles className="w-3 h-3 fill-current" />
                Vente Exclusive en Boutique & Commande
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
                Parfums haut de gamme pour voiture
              </h2>
              <p className="text-gray-400 text-sm sm:text-base mt-4 leading-relaxed">
                Sublimez l'intérieur de votre véhicule avec notre collection rigoureusement sélectionnée de senteurs premium et durables. Des effluves boisés, cuivrés ou fraîches pour une signature olfactive qui impose le respect.
              </p>
              <div className="flex items-center gap-3 mt-6 text-xs text-amber-500 font-mono font-medium">
                <span>✓ Tenue longue durée</span>
                <span>•</span>
                <span>✓ Élimine les mauvaises odeurs</span>
                <span>•</span>
                <span>✓ Design élégant</span>
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto text-center">
              <button
                onClick={handleFragranceWhatsApp}
                className="w-full md:w-auto bg-transparent hover:bg-[#C9A84C] text-[#C9A84C] hover:text-black border border-[#C9A84C] font-semibold text-xs py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                id="fragrance-cta-whatsapp"
              >
                Découvrir la collection
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>


      {/* 7.5 SECTION L'ÉQUIPE PMS CHEZ MOLO */}
      <section id="team" className="py-20 bg-neutral-900/40 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-[#C9A84C]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 left-10 w-[200px] h-[200px] bg-neutral-900/60 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Title */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#C9A84C] font-mono text-xs font-semibold uppercase tracking-widest block mb-3">
              L'Équipe PMS Chez MOLO
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Une équipe professionnelle à votre service
            </h2>
            <div className="w-12 h-[2px] bg-[#C9A84C] mx-auto mt-4" />
          </div>

          {/* Featured Center Image + Accompanying Text */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            
            {/* Elegant Main Frame */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="relative p-2.5 bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl w-full max-w-2xl group">
                
                {/* Decorative corners to match premium brand identity */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-[#C9A84C] rounded-tl-xl" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-[#C9A84C] rounded-br-xl" />
                
                <div className="overflow-hidden rounded-2xl h-[300px] sm:h-[400px] w-full relative">
                  <img 
                    src="https://i.imgur.com/mz9inr5.jpeg" 
                    alt="L'équipe PMS Chez MOLO" 
                    className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Overlay Tag */}
                  <div className="absolute bottom-4 left-4 sm:left-6 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-800 text-xs text-[#C9A84C] font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>Excellence Opérationnelle à Abidjan</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Accompanying Content Column */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
              
              <div className="space-y-4">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#C9A84C] bg-[#C9A84C]/10 py-1 px-3 rounded-full inline-block">
                  NOTRE MISSION
                </span>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed font-sans">
                  "Derrière PMS Chez MOLO, une équipe passionnée, disponible et engagée pour vous offrir une expérience automobile irréprochable à Abidjan."
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Qu'il s'agisse de louer une berline de luxe pour vos déplacements professionnels, de confier votre véhicule pour un nettoyage minutieux dans notre centre de Bonoumin, ou de commander des parfums d'habitacle haut de gamme, notre staff s'assure d'une exécution de premier ordre.
                </p>
              </div>

              {/* Reassurance Badge under the Photo */}
              <div className="pt-4 border-t border-neutral-900">
                <div className="flex flex-col sm:flex-row flex-wrap gap-3.5 text-xs text-gray-300">
                  <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 px-3.5 py-2.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A84C]" />
                    <span className="font-semibold">Disponibles 7j/7</span>
                  </div>
                  <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 px-3.5 py-2.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A84C]" />
                    <span className="font-semibold">Réactifs et professionnels</span>
                  </div>
                  <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 px-3.5 py-2.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A84C]" />
                    <span className="font-semibold">À votre écoute</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Grid of Team Roles / Activities */}
          <div className="text-center mb-8">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2">
              Découvrez nos pôles d'expertise
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm">
              Un personnel spécialisé et hautement qualifié pour chaque aspect de votre expérience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Le dirigeant */}
            <div className="bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden hover:border-[#C9A84C]/50 transition-colors duration-300 group flex flex-col h-full">
              <div className="h-60 w-full overflow-hidden relative">
                <img 
                  src="https://i.imgur.com/oJYo1Kt.jpeg" 
                  alt="Le Dirigeant PMS Chez MOLO" 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="bg-[#C9A84C] text-black text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded">
                    DIRECTION
                  </span>
                </div>
              </div>
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-base font-bold text-white mb-1">
                    Direction Générale
                  </h4>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Le dirigeant à votre écoute pour garantir la charte qualité de l'agence et un service client d'exception.
                  </p>
                </div>
                <div className="text-[10px] text-neutral-500 font-mono mt-4 pt-2.5 border-t border-neutral-900">
                  📍 Riviera Bonoumin
                </div>
              </div>
            </div>

            {/* Card 2: L'administration */}
            <div className="bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden hover:border-[#C9A84C]/50 transition-colors duration-300 group flex flex-col h-full">
              <div className="h-60 w-full overflow-hidden relative">
                <img 
                  src="https://i.imgur.com/XumOvgi.jpeg" 
                  alt="Gestion des dossiers" 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="bg-[#C9A84C] text-black text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded">
                    ADMINISTRATION
                  </span>
                </div>
              </div>
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-base font-bold text-white mb-1">
                    Gestion Administrative
                  </h4>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Contractualisation rigoureuse, transparence absolue des tarifs et suivi minutieux de vos dossiers de location.
                  </p>
                </div>
                <div className="text-[10px] text-neutral-500 font-mono mt-4 pt-2.5 border-t border-neutral-900">
                  ✓ Transparence Totale
                </div>
              </div>
            </div>

            {/* Card 3: Conseiller Clientèle */}
            <div className="bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden hover:border-[#C9A84C]/50 transition-colors duration-300 group flex flex-col h-full">
              <div className="h-60 w-full overflow-hidden relative">
                <img 
                  src="https://i.imgur.com/uasNfbM.jpeg" 
                  alt="Service Client & Suivi" 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="bg-[#C9A84C] text-black text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded">
                    CONSEILLER CLIENT
                  </span>
                </div>
              </div>
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-base font-bold text-white mb-1">
                    Service Client & Réservation
                  </h4>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Traitement instantané de vos demandes, assistance personnalisée et devis détaillés via notre ligne WhatsApp.
                  </p>
                </div>
                <div className="text-[10px] text-neutral-500 font-mono mt-4 pt-2.5 border-t border-neutral-900">
                  ⚡ Réponse sous 10 min
                </div>
              </div>
            </div>

            {/* Card 4: Lavage Auto */}
            <div className="bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden hover:border-[#C9A84C]/50 transition-colors duration-300 group flex flex-col h-full">
              <div className="h-60 w-full overflow-hidden relative">
                <img 
                  src="https://i.imgur.com/LX1t6sG.jpeg" 
                  alt="Toute l'équipe du centre de Lavage Auto" 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="bg-[#C9A84C] text-black text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded">
                    LAVAGE EXPERT
                  </span>
                </div>
              </div>
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-base font-bold text-white mb-1">
                    L'équipe Lavage & Entretien
                  </h4>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Des techniciens qualifiés et dévoués au centre de Riviera Bonoumin pour redonner une propreté concours à vos véhicules.
                  </p>
                </div>
                <div className="text-[10px] text-neutral-500 font-mono mt-4 pt-2.5 border-t border-neutral-900">
                  📍 Cocody Riviera Bonoumin
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* 8. FORMULAIRE DE RÉSERVATION */}
      <section ref={bookingRef} id="booking" className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section title */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#C9A84C] font-mono text-xs font-semibold uppercase tracking-widest block mb-3">
              Réservation Instantanée
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Vérifiez la disponibilité de votre auto
            </h2>
            <p className="text-gray-400 text-sm mt-3">
              Remplissez le formulaire ci-dessous. Vos informations seront encodées de manière sécurisée et envoyées directement à notre équipe via WhatsApp pour une confirmation en moins de 10 minutes.
            </p>
            <div className="w-12 h-[2px] bg-[#C9A84C] mx-auto mt-4" />
          </div>

          {/* Form wrapper */}
          <div className="bg-neutral-900 border border-neutral-900 rounded-3xl p-6 sm:p-10">
            
            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              {formErrors && (
                <div className="bg-red-950/50 border border-red-900 text-red-200 text-xs rounded-xl p-4 flex items-center gap-2">
                  <X className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{formErrors}</span>
                </div>
              )}

              {formSuccess && (
                <div className="bg-green-950/50 border border-green-900 text-green-200 text-xs rounded-xl p-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  <span>Réservation préparée avec succès ! Redirection en cours vers WhatsApp...</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Full name */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2 font-mono">
                    Nom Complet <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Ex: Jean Kouadio"
                      value={bookingForm.fullName}
                      onChange={(e) => setBookingForm({...bookingForm, fullName: e.target.value})}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#C9A84C] transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Phone number */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2 font-mono">
                    Numéro Téléphone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="tel"
                      placeholder="Ex: 07 49 57 58 74"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#C9A84C] transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Email (Optional) */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2 font-mono">
                    Adresse Email <span className="text-neutral-500 font-sans italic">(Optionnel)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      placeholder="Ex: client@email.com"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#C9A84C] transition-colors"
                    />
                  </div>
                </div>

                {/* Vehicle Selection dropdown */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2 font-mono">
                    Véhicule Souhaité <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select
                      value={bookingForm.vehicleId}
                      onChange={(e) => setBookingForm({...bookingForm, vehicleId: e.target.value})}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                      required
                    >
                      {VEHICLES.map((car) => (
                        <option key={car.id} value={car.id}>
                          {car.name} ({formatPrice(car.pricePerDay)}/j)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date de départ */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2 font-mono">
                    Date de Départ <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="date"
                      min={todayStr}
                      value={bookingForm.startDate}
                      onChange={(e) => setBookingForm({...bookingForm, startDate: e.target.value})}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Date de retour */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2 font-mono">
                    Date de Retour <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="date"
                      min={bookingForm.startDate}
                      value={bookingForm.endDate}
                      onChange={(e) => setBookingForm({...bookingForm, endDate: e.target.value})}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Lieu de prise en charge */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2 font-mono">
                    Lieu de prise en charge <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select
                      value={bookingForm.pickupLocation}
                      onChange={(e) => setBookingForm({...bookingForm, pickupLocation: e.target.value as any})}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                      required
                    >
                      <option value="Rivera Bonoumin">Rivera Bonoumin (À l'agence)</option>
                      <option value="A domicile">Livraison à domicile (Abidjan)</option>
                    </select>
                  </div>
                </div>

                {/* Driver select */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2 font-mono">
                    Option avec Chauffeur <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select
                      value={bookingForm.withDriver ? 'oui' : 'non'}
                      onChange={(e) => setBookingForm({...bookingForm, withDriver: e.target.value === 'oui'})}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                      required
                    >
                      <option value="non">Non — Conduite personnelle</option>
                      <option value="oui">Oui — Chauffeur professionnel (+15 000 FCFA/jour)</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Message complémentaire */}
              <div>
                <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2 font-mono">
                  Message Complémentaire <span className="text-neutral-500 font-sans italic">(Optionnel)</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Ex: heure d'arrivée souhaitée, adresse exacte pour livraison, besoins spécifiques..."
                  value={bookingForm.message}
                  onChange={(e) => setBookingForm({...bookingForm, message: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
                />
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#C9A84C] hover:bg-[#B5943E] text-black font-bold py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer shadow-lg shadow-[#C9A84C]/5"
                  id="submit-booking-form"
                >
                  <MessageSquare className="w-5 h-5 fill-current" />
                  Envoyer ma réservation via WhatsApp
                </button>
              </div>

            </form>

          </div>

        </div>
      </section>


      {/* 9. FOIRE AUX QUESTIONS (FAQ Accordion) */}
      <section className="py-20 bg-neutral-950/50 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section title */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#C9A84C] font-mono text-xs font-semibold uppercase tracking-widest block mb-3">
              Questions Fréquentes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Foire Aux Questions
            </h2>
            <div className="w-12 h-[2px] bg-[#C9A84C] mx-auto mt-4" />
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = faqOpenIndex === index;
              return (
                <div 
                  key={index}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setFaqOpenIndex(isOpen ? null : index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 text-white focus:outline-none cursor-pointer"
                  >
                    <span className="font-serif text-base sm:text-lg font-bold">
                      {faq.question}
                    </span>
                    <span className="text-[#C9A84C] shrink-0">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-neutral-950/60 pt-4 font-sans">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* 10. CONTACT + CARTE */}
      <section ref={contactRef} id="contact" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section title */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#C9A84C] font-mono text-xs font-semibold uppercase tracking-widest block mb-3">
              Nous Situer
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Contact & Localisation
            </h2>
            <div className="w-12 h-[2px] bg-[#C9A84C] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            
            {/* Contact details & action buttons */}
            <div className="bg-neutral-900 border border-neutral-900 rounded-3xl p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white mb-6">
                  PMS Chez MOLO
                </h3>
                
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8">
                  Notre équipe vous accueille tous les jours de la semaine à notre agence et centre de lavage de Rivera Bonoumin. Venez inspecter notre parc automobile haut de gamme ou confier votre voiture à nos experts.
                </p>

                {/* Specific details */}
                <div className="space-y-5 mb-10">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-[#C9A84C] shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs text-neutral-400 uppercase font-mono tracking-wider">Adresse Physique</h4>
                      <p className="text-sm text-gray-200 font-semibold mt-0.5">Rivera Bonoumin, Abidjan, Côte d'Ivoire</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-[#C9A84C] shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs text-neutral-400 uppercase font-mono tracking-wider">Téléphone / WhatsApp</h4>
                      <p className="text-sm text-gray-200 font-semibold mt-0.5">07 49 57 58 74 (Format international : +2250749575874)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-[#C9A84C] shrink-0">
                      <Star className="w-5 h-5 fill-[#C9A84C] text-[#C9A84C]" />
                    </div>
                    <div>
                      <h4 className="text-xs text-neutral-400 uppercase font-mono tracking-wider">Note Clients</h4>
                      <p className="text-sm text-gray-200 font-semibold mt-0.5">⭐ 5,0 sur Google — Service d'excellence</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Quick Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-neutral-950">
                <a 
                  href="tel:+2250749575874"
                  className="bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-white font-semibold text-xs py-3 px-4 rounded-xl text-center flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <Phone className="w-4 h-4 text-[#C9A84C]" />
                  Appeler direct
                </a>
                
                <a 
                  href="https://wa.me/2250749575874" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-white font-semibold text-xs py-3 px-4 rounded-xl text-center flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <MessageSquare className="w-4 h-4 text-[#C9A84C]" />
                  Chat WhatsApp
                </a>

                <a 
                  href="https://maps.google.com/?q=Rivera+Bonoumin+Abidjan" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-white font-semibold text-xs py-3 px-4 rounded-xl text-center flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <Map className="w-4 h-4 text-[#C9A84C]" />
                  Voir sur Google Maps
                </a>
              </div>

            </div>

            {/* Google Map Embed Iframe */}
            <div className="bg-neutral-900 border border-neutral-900 rounded-3xl overflow-hidden min-h-[350px] relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15888.751167727181!2d-3.9877478!3d5.3653139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9b7752e850b5%3A0xe72643a758740d58!2sRiviera%20Bonoumin%2C%20Abidjan!5e0!3m2!1sfr!2sci!4v1700000000000!5m2!1sfr!2sci" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Location Rivera Bonoumin"
                className="absolute inset-0 w-full h-full grayscale opacity-80 hover:grayscale-0 transition-all duration-500"
              />
            </div>

          </div>

        </div>
      </section>


      {/* 11. FOOTER */}
      <footer className="bg-neutral-950 border-t border-neutral-900 pt-16 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-900">
            
            {/* Logo + Slogan Column */}
            <div className="col-span-1 md:col-span-2">
              <span className="font-serif text-3xl font-bold tracking-wider text-[#C9A84C]">
                P M S
              </span>
              <span className="text-xs text-white tracking-[0.25em] font-sans font-medium uppercase block mt-1">
                Chez MOLO
              </span>
              <p className="mt-4 text-gray-500 text-sm max-w-sm leading-relaxed">
                "Roulez avec distinction" — Agence de location automobile premium et centre de lavage expert méticuleux à Abidjan Rivera Bonoumin.
              </p>
            </div>

            {/* Quick Links Column */}
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-4 font-mono">
                Services & Liens
              </h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li>
                  <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-[#C9A84C] transition-colors cursor-pointer text-left">
                    Accueil
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo(vehiclesRef)} className="hover:text-[#C9A84C] transition-colors cursor-pointer text-left">
                    Notre Flotte
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo(lavageRef)} className="hover:text-[#C9A84C] transition-colors cursor-pointer text-left">
                    Lavage de Précision
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo(bookingRef)} className="hover:text-[#C9A84C] transition-colors cursor-pointer text-left">
                    Réservation Express
                  </button>
                </li>
              </ul>
            </div>

            {/* Location & Trust Column */}
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-4 font-mono">
                PMS Chez MOLO Abidjan
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Rivera Bonoumin, Abidjan<br />
                ☎ Téléphone : 07 49 57 58 74<br />
                ⭐ 5,0 sur Google d'après nos clients
              </p>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
            <div>
              <span>© 2026 P M S Chez MOLO — Tous droits réservés.</span>
            </div>
            <div className="flex gap-4">
              <span>Abidjan, Côte d'Ivoire</span>
              <span>•</span>
              <span>Qualité Premium</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
