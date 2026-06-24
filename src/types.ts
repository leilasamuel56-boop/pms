/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Vehicle {
  id: string;
  name: string;
  category: string;
  pricePerDay: number; // mapping to priceShortTerm for backward compatibility in calculations
  priceShortTerm: number; // base daily rate
  priceLongTerm: number;  // weekly daily rate
  deposit: number;        // refundable caution deposit
  imageUrl: string;
  description: string;
  accessories: string[];
  seats: number;
  transmission: 'Automatique' | 'Manuelle';
  fuel: 'Essence' | 'Diesel' | 'Hybride';
  hasAc: boolean;
}

export interface WashPackage {
  id: string;
  name: string;
  includes: string[];
  price: number | 'Sur devis';
  popular?: boolean;
}

export interface BookingFormData {
  fullName: string;
  phone: string;
  email: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  pickupLocation: 'Rivera Bonoumin' | 'A domicile';
  withDriver: boolean;
  message: string;
}
