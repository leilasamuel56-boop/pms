import { Vehicle, WashPackage } from './types';

export const VEHICLES: Vehicle[] = [
  {
    id: 'kia-sportage',
    name: 'KIA Sportage',
    category: 'SUV Compact',
    pricePerDay: 50000,
    priceShortTerm: 50000,
    priceLongTerm: 35000,
    deposit: 100000,
    imageUrl: 'https://i.imgur.com/y9jYmyu.jpeg',
    description: 'SUV urbain dynamique et technologique, idéal pour circuler à Abidjan avec élégance et confort. Équipé d\'un écran tactile de dernière génération.',
    accessories: ["Parfum d'habitacle PMS", "GPS Tactile intégré", "Wifi haut débit", "Chargeur universel"],
    seats: 5,
    transmission: 'Automatique',
    fuel: 'Essence',
    hasAc: true
  },
  {
    id: 'mercedes-gle-43',
    name: 'Mercedes GLE 43 AMG',
    category: 'SUV Luxe',
    pricePerDay: 150000,
    priceShortTerm: 150000,
    priceLongTerm: 120000,
    deposit: 300000,
    imageUrl: 'https://i.imgur.com/CsrC86I.jpeg',
    description: 'La puissance brute associée au prestige de Mercedes-AMG. Une présence impériale sur la route et un confort de première classe.',
    accessories: ["Parfum de luxe signature", "Sonorisation Burmester", "Sièges ventilés & massants", "Assistance VIP H24"],
    seats: 5,
    transmission: 'Automatique',
    fuel: 'Essence',
    hasAc: true
  },
  {
    id: 'honda-crv',
    name: 'Honda CR-V 2022',
    category: 'SUV Familial',
    pricePerDay: 60000,
    priceShortTerm: 60000,
    priceLongTerm: 45000,
    deposit: 150000,
    imageUrl: 'https://i.imgur.com/MDt4Csg.jpeg',
    description: 'Spacieux, fiable et extrêmement confortable. Ce SUV haut de gamme est parfait pour les trajets en famille ou les délégations professionnelles.',
    accessories: ["Parfum d'habitacle PMS", "Grand coffre de voyage", "Double toit panoramique", "Siège bébé sur demande"],
    seats: 5,
    transmission: 'Automatique',
    fuel: 'Essence',
    hasAc: true
  },
  {
    id: 'bmw-m4',
    name: 'BMW M4 xDrive',
    category: 'Berline Sport',
    pricePerDay: 130000,
    priceShortTerm: 130000,
    priceLongTerm: 100000,
    deposit: 250000,
    imageUrl: 'https://i.imgur.com/oE7mjJk.jpeg',
    description: 'Des performances phénoménales et une motricité absolue xDrive. Une expérience de pilotage exclusive et inoubliable.',
    accessories: ["Pack sport M exclusif", "Parfum signature sportive", "Affichage tête haute", "Assistance routière VIP"],
    seats: 4,
    transmission: 'Automatique',
    fuel: 'Essence',
    hasAc: true
  },
  {
    id: 'hyundai-tucson',
    name: 'Hyundai Tucson',
    category: 'SUV Confort',
    pricePerDay: 55000,
    priceShortTerm: 55000,
    priceLongTerm: 40000,
    deposit: 120000,
    imageUrl: 'https://i.imgur.com/jwK6Mvm.jpeg',
    description: 'Un SUV moderne et élégant, doté d\'une habitabilité remarquable et d\'une conduite extrêmement souple.',
    accessories: ["Parfum d'habitacle PMS", "Caméra de recul 360°", "Éclairage d'ambiance LED", "Chargeur sans fil"],
    seats: 5,
    transmission: 'Automatique',
    fuel: 'Essence',
    hasAc: true
  },
  {
    id: 'bmw-m3',
    name: 'BMW M3',
    category: 'Berline Sport Premium',
    pricePerDay: 140000,
    priceShortTerm: 140000,
    priceLongTerm: 110000,
    deposit: 280000,
    imageUrl: 'https://i.imgur.com/CLEsajR.jpeg',
    description: 'L\'icône des berlines hautes performances. Un mariage parfait entre confort quotidien et tempérament de piste indomptable.',
    accessories: ["Sonorisation Harman Kardon", "Sellerie cuir mérinos", "Parfum d'ambiance BMW", "Assistance prioritaire 24/7"],
    seats: 5,
    transmission: 'Automatique',
    fuel: 'Essence',
    hasAc: true
  },
  {
    id: 'range-rover-sport',
    name: 'Range Rover Sport',
    category: 'SUV Premium',
    pricePerDay: 160000,
    priceShortTerm: 160000,
    priceLongTerm: 130000,
    deposit: 350000,
    imageUrl: 'https://i.imgur.com/DnNOrzj.jpeg',
    description: 'Le luxe tout-terrain sans compromis. Une silhouette musclée, une hauteur de conduite dominante et un raffinement royal.',
    accessories: ["Suspension pneumatique", "Parfum d'habitacle PMS", "Glacière centrale intégrée", "Pack sécurité totale"],
    seats: 5,
    transmission: 'Automatique',
    fuel: 'Diesel',
    hasAc: true
  },
  {
    id: 'kia-sorento',
    name: 'KIA Sorento',
    category: 'SUV 7 places',
    pricePerDay: 65000,
    priceShortTerm: 65000,
    priceLongTerm: 50000,
    deposit: 150000,
    imageUrl: 'https://i.imgur.com/Cwb67uc.jpeg',
    description: 'Le SUV grand format par excellence. 7 vraies places confortables pour voyager à plusieurs dans des conditions royales.',
    accessories: ["7 places configurables", "Parfum d'habitacle PMS", "Écrans arrières passagers", "Climatisation multizone"],
    seats: 7,
    transmission: 'Automatique',
    fuel: 'Diesel',
    hasAc: true
  }
];

export const WASH_PACKAGES: WashPackage[] = [
  {
    id: 'express',
    name: 'Lavage Express',
    includes: ['Lavage Extérieur complet', 'Nettoyage des jantes & pneus', 'Séchage microfibre à la main', 'Aspirateur rapide de courtoisie'],
    price: 2000
  },
  {
    id: 'complet',
    name: 'Lavage Complet',
    includes: ['Aspirateur intérieur méticuleux', 'Dépoussiérage du tableau de bord', 'Lavage Extérieur en profondeur', 'Nettoyage des vitres intérieures/extérieures', 'Parfumage premium de l\'habitacle'],
    price: 4000,
    popular: true
  },
  {
    id: 'grand-nettoyage',
    name: 'Grand Nettoyage',
    includes: ['Services du Lavage Complet', 'Lustrage de la carrosserie pour brillance éclatante', 'Nettoyage en profondeur du compartiment moteur', 'Shampoing des tapis et moquettes de voiture'],
    price: 8000
  },
  {
    id: 'canapes-tapis',
    name: 'Nettoyage Canapés & Tapis',
    includes: ['Injection/extraction vapeur professionnelle', 'Traitement antibactérien & anti-acariens', 'Détachage ciblé en profondeur', 'Service disponible à domicile ou en agence'],
    price: 'Sur devis'
  }
];

export const FAQS = [
  {
    question: 'Quels documents sont nécessaires pour louer ?',
    answer: 'Pour toute location de véhicule, vous devez fournir une pièce d\'identité valide (Carte Nationale d\'Identité ou Passeport en cours de validité) ainsi qu\'un permis de conduire valide depuis au moins 2 ans.'
  },
  {
    question: 'Y a-t-il une caution ?',
    answer: 'Oui, une caution de garantie est exigée avant la mise à disposition du véhicule. Le montant dépend du modèle de véhicule choisi. Elle vous est intégralement restituée au retour du véhicule si aucun dégât n\'est constaté.'
  },
  {
    question: 'Proposez-vous la livraison du véhicule ?',
    answer: 'Absolument. Nous pouvons livrer le véhicule à l\'adresse de votre choix (votre domicile, bureau, hôtel ou directement à l\'Aéroport d\'Abidjan). La livraison est possible partout à Abidjan et gratuite sous certaines conditions.'
  },
  {
    question: 'Puis-je louer avec chauffeur ?',
    answer: 'Oui, vous pouvez opter pour l\'option avec chauffeur professionnel et expérimenté. Cette option est facturée à un tarif forfaitaire de +15 000 FCFA par jour, vous assurant un trajet serein et en toute sécurité.'
  },
  {
    question: 'Comment régler ma réservation ?',
    answer: 'Nous acceptons plusieurs modes de paiement pour votre confort : en Espèces à l\'agence, par Mobile Money (Orange Money, MTN Mobile Money, Wave) très populaire et instantané, ou par virement bancaire.'
  },
  {
    question: 'Où se trouve votre agence ?',
    answer: 'Notre agence et centre de lavage automobile PMS Chez MOLO est idéalement située à Rivera Bonoumin, Abidjan, Côte d\'Ivoire. Vous pouvez nous y rendre pour inspecter nos véhicules ou pour un lavage professionnel.'
  }
];
