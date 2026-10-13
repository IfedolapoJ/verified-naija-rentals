// Verified Naija Rentals — data layer (types, mock data, bilingual helpers)

export type Lang = "en" | "pidgin";

/** Bilingual inline resolver: returns English or Nigerian Pidgin copy. */
export const L = (lang: Lang, en: string, pidgin: string): string =>
  lang === "en" ? en : pidgin;

export const formatNaira = (n: number): string =>
  "₦" + Math.round(n).toLocaleString("en-NG");

export const uid = (): string => Math.random().toString(36).slice(2, 10);

// ---------------------------------------------------------------- Types

export interface Landlord {
  id: string;
  name: string;
  role: "Landlord" | "Agent";
  ninVerified: boolean;
  bvnVerified: boolean;
  selfieVerified: boolean;
  docsVerified: boolean;
  trustScore: number; // 0-100
  tier: 1 | 2 | 3;
  memberSince: string;
  listingsCount: number;
  responseRate: number;
}

export interface PropertyListing {
  id: string;
  title: string;
  city: string;
  state: string;
  area: string;
  type: string;
  beds: number;
  baths: number;
  pricePerYear: number;
  power: string;
  furnished: boolean;
  directFromLandlord: boolean;
  verified: boolean;
  geotagged: boolean;
  images: string[];
  landlordId: string;
  description: string;
  safetyScore: number;
  serviceCharge: number;
  cautionPct: number;
  agencyPct: number;
  legalPct: number;
  rating: number;
  reviewCount: number;
}

export interface ChatMessage {
  id: string;
  from: "tenant" | "landlord";
  text: string;
  time: string;
  masked?: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  listingId: string;
}

export interface EscrowStep {
  key: string;
  en: string;
  pidgin: string;
  done: boolean;
}

export type EscrowStatus =
  | "draft"
  | "funded"
  | "accepted"
  | "checkin"
  | "released"
  | "disputed";

export interface EscrowTransaction {
  id: string;
  listingId: string;
  listingTitle: string;
  amount: number;
  status: EscrowStatus;
  steps: EscrowStep[];
  signature: string;
  agreementDate: string;
}

export interface Filters {
  query: string;
  city: string;
  type: string;
  power: string;
  minPrice: number;
  maxPrice: number;
  directOnly: boolean;
  verifiedOnly: boolean;
}

// ---------------------------------------------------------------- Static option sets

export const CITIES = [
  "Lekki",
  "Ikoyi",
  "Victoria Island",
  "Ikeja",
  "Yaba",
  "Maitama",
  "Wuse 2",
  "Port Harcourt",
];

export const PROPERTY_TYPES = [
  "Self-Contain",
  "1 Bedroom Flat",
  "2 Bedroom Flat",
  "3 Bedroom Flat",
  "Duplex",
  "Terrace",
];

export const POWER_OPTIONS = [
  "24/7 Inverter",
  "Solar + Inverter",
  "Generator Schedule",
  "NEPA Only",
];

export const NEIGHBORHOODS = [
  "Lekki Phase 1",
  "Ikoyi",
  "VI",
  "Ikeja GRA",
  "Yaba",
  "Maitama",
  "Wuse 2",
  "New GRA PH",
];

export const DEFAULT_FILTERS: Filters = {
  query: "",
  city: "All",
  type: "All",
  power: "All",
  minPrice: 0,
  maxPrice: 25000000,
  directOnly: false,
  verifiedOnly: false,
};

// ---------------------------------------------------------------- Generated imagery

const IMG = {
  lekki:
    "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/d9a3ca14-3d26-471d-88b3-b42a38783a7d/lekki-2bed-apartment-69684ef7-1791867583828.webp",
  ikoyi:
    "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/d9a3ca14-3d26-471d-88b3-b42a38783a7d/ikoyi-luxury-duplex-a8365da5-1791867584408.webp",
  vi: "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/d9a3ca14-3d26-471d-88b3-b42a38783a7d/victoria-island-terrace-a1d4238a-1791867584211.webp",
  maitama:
    "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/d9a3ca14-3d26-471d-88b3-b42a38783a7d/maitama-abuja-mansion-a88dde66-1791867583928.webp",
  yaba: "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/d9a3ca14-3d26-471d-88b3-b42a38783a7d/yaba-self-contain-room-d2102d09-1791867583804.webp",
  gra: "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/d9a3ca14-3d26-471d-88b3-b42a38783a7d/gra-port-harcourt-flat-a3d656e9-1791867588074.webp",
};

// ---------------------------------------------------------------- Landlords

export const LANDLORDS: Record<string, Landlord> = {
  l1: {
    id: "l1",
    name: "Chief Adebayo Okonkwo",
    role: "Landlord",
    ninVerified: true,
    bvnVerified: true,
    selfieVerified: true,
    docsVerified: true,
    trustScore: 98,
    tier: 3,
    memberSince: "2021",
    listingsCount: 7,
    responseRate: 96,
  },
  l2: {
    id: "l2",
    name: "Mrs. Funke Adeyemi",
    role: "Agent",
    ninVerified: true,
    bvnVerified: true,
    selfieVerified: true,
    docsVerified: false,
    trustScore: 88,
    tier: 2,
    memberSince: "2022",
    listingsCount: 12,
    responseRate: 91,
  },
  l3: {
    id: "l3",
    name: "Alhaji Musa Bello",
    role: "Landlord",
    ninVerified: true,
    bvnVerified: false,
    selfieVerified: true,
    docsVerified: true,
    trustScore: 82,
    tier: 2,
    memberSince: "2023",
    listingsCount: 4,
    responseRate: 88,
  },
  l4: {
    id: "l4",
    name: "Engr. Chidi Nwosu",
    role: "Landlord",
    ninVerified: true,
    bvnVerified: true,
    selfieVerified: true,
    docsVerified: true,
    trustScore: 95,
    tier: 3,
    memberSince: "2020",
    listingsCount: 9,
    responseRate: 98,
  },
};

// ---------------------------------------------------------------- Listings

export const LISTINGS: PropertyListing[] = [
  {
    id: "p1",
    title: "Serene 2-Bedroom Apartment, Gated Compound",
    city: "Lekki",
    state: "Lagos",
    area: "Lekki Phase 1",
    type: "2 Bedroom Flat",
    beds: 2,
    baths: 2,
    pricePerYear: 4500000,
    power: "24/7 Inverter",
    furnished: true,
    directFromLandlord: true,
    verified: true,
    geotagged: true,
    images: [IMG.lekki, IMG.vi, IMG.ikoyi],
    landlordId: "l1",
    description:
      "Bright, cross-ventilated 2-bedroom in a secure gated cluster with fitted kitchen, ample wardrobe and standby inverter. Walking distance to Lekki-Epe express.",
    safetyScore: 94,
    serviceCharge: 600000,
    cautionPct: 10,
    agencyPct: 10,
    legalPct: 5,
    rating: 4.8,
    reviewCount: 34,
  },
  {
    id: "p2",
    title: "Executive 4-Bedroom Duplex with BQ",
    city: "Ikoyi",
    state: "Lagos",
    area: "Ikoyi",
    type: "Duplex",
    beds: 4,
    baths: 5,
    pricePerYear: 18000000,
    power: "Solar + Inverter",
    furnished: true,
    directFromLandlord: false,
    verified: true,
    geotagged: true,
    images: [IMG.ikoyi, IMG.maitama, IMG.lekki],
    landlordId: "l2",
    description:
      "Premium Ikoyi duplex with boys quarters, roof terrace, smart lighting and 24/7 solar-inverter hybrid. Title documents fully vetted on platform.",
    safetyScore: 97,
    serviceCharge: 2400000,
    cautionPct: 10,
    agencyPct: 10,
    legalPct: 5,
    rating: 4.9,
    reviewCount: 21,
  },
  {
    id: "p3",
    title: "Modern Terrace, Close to Marina",
    city: "Victoria Island",
    state: "Lagos",
    area: "VI",
    type: "Terrace",
    beds: 3,
    baths: 3,
    pricePerYear: 12000000,
    power: "24/7 Inverter",
    furnished: false,
    directFromLandlord: true,
    verified: true,
    geotagged: true,
    images: [IMG.vi, IMG.ikoyi, IMG.gra],
    landlordId: "l4",
    description:
      "Unfurnished 3-bed terrace with open-plan living, utility balcony and dedicated parking. Ideal for young professionals in the Island business core.",
    safetyScore: 92,
    serviceCharge: 1500000,
    cautionPct: 10,
    agencyPct: 5,
    legalPct: 5,
    rating: 4.7,
    reviewCount: 18,
  },
  {
    id: "p4",
    title: "Cozy Self-Contain Studio",
    city: "Yaba",
    state: "Lagos",
    area: "Yaba",
    type: "Self-Contain",
    beds: 1,
    baths: 1,
    pricePerYear: 1200000,
    power: "Generator Schedule",
    furnished: false,
    directFromLandlord: true,
    verified: true,
    geotagged: true,
    images: [IMG.yaba, IMG.lekki],
    landlordId: "l3",
    description:
      "Affordable self-contained studio near Yaba tech corridor. Private kitchenette, tiled washroom, gen schedule 6pm-8am. Perfect for students and first-jobbers.",
    safetyScore: 81,
    serviceCharge: 120000,
    cautionPct: 10,
    agencyPct: 0,
    legalPct: 5,
    rating: 4.4,
    reviewCount: 47,
  },
  {
    id: "p5",
    title: "Spacious 3-Bedroom Flat, Ikeja GRA",
    city: "Ikeja",
    state: "Lagos",
    area: "Ikeja GRA",
    type: "3 Bedroom Flat",
    beds: 3,
    baths: 3,
    pricePerYear: 7500000,
    power: "24/7 Inverter",
    furnished: true,
    directFromLandlord: false,
    verified: true,
    geotagged: false,
    images: [IMG.lekki, IMG.gra, IMG.vi],
    landlordId: "l2",
    description:
      "Furnished 3-bed flat in serene Ikeja GRA, fitted kitchen, standby power and 24-hour security. Minutes from airport and computer village.",
    safetyScore: 90,
    serviceCharge: 900000,
    cautionPct: 10,
    agencyPct: 10,
    legalPct: 5,
    rating: 4.6,
    reviewCount: 29,
  },
  {
    id: "p6",
    title: "Luxury Detached Mansion, Maitama",
    city: "Maitama",
    state: "Abuja",
    area: "Maitama",
    type: "Duplex",
    beds: 5,
    baths: 6,
    pricePerYear: 24000000,
    power: "Solar + Inverter",
    furnished: true,
    directFromLandlord: true,
    verified: true,
    geotagged: true,
    images: [IMG.maitama, IMG.ikoyi, IMG.gra],
    landlordId: "l1",
    description:
      "5-bedroom fully-serviced mansion in diplomatic Maitama with staff quarters, landscaped compound, borehole and full solar-inverter backup.",
    safetyScore: 99,
    serviceCharge: 3200000,
    cautionPct: 10,
    agencyPct: 5,
    legalPct: 5,
    rating: 5.0,
    reviewCount: 12,
  },
  {
    id: "p7",
    title: "Tasteful 2-Bedroom, Wuse 2",
    city: "Wuse 2",
    state: "Abuja",
    area: "Wuse 2",
    type: "2 Bedroom Flat",
    beds: 2,
    baths: 2,
    pricePerYear: 6000000,
    power: "24/7 Inverter",
    furnished: true,
    directFromLandlord: false,
    verified: true,
    geotagged: true,
    images: [IMG.gra, IMG.maitama, IMG.lekki],
    landlordId: "l4",
    description:
      "Furnished 2-bed in the heart of Wuse 2, close to banks, malls and nightlife. Secure building with intercom and inverter backup.",
    safetyScore: 89,
    serviceCharge: 800000,
    cautionPct: 10,
    agencyPct: 10,
    legalPct: 5,
    rating: 4.5,
    reviewCount: 23,
  },
  {
    id: "p8",
    title: "Garden 3-Bedroom Flat, New GRA",
    city: "Port Harcourt",
    state: "Rivers",
    area: "New GRA PH",
    type: "3 Bedroom Flat",
    beds: 3,
    baths: 3,
    pricePerYear: 5000000,
    power: "Generator Schedule",
    furnished: false,
    directFromLandlord: true,
    verified: true,
    geotagged: true,
    images: [IMG.gra, IMG.lekki, IMG.vi],
    landlordId: "l3",
    description:
      "Unfurnished 3-bed flat with private garden in New GRA Port Harcourt. Quiet street, treated water, reliable gen schedule.",
    safetyScore: 86,
    serviceCharge: 600000,
    cautionPct: 10,
    agencyPct: 0,
    legalPct: 5,
    rating: 4.3,
    reviewCount: 16,
  },
];

// ---------------------------------------------------------------- Fee breakdown

export interface Breakdown {
  rent: number;
  caution: number;
  agency: number;
  legal: number;
  service: number;
  total: number;
}

export const priceBreakdown = (p: PropertyListing): Breakdown => {
  const rent = p.pricePerYear;
  const caution = Math.round((rent * p.cautionPct) / 100);
  const agency = Math.round((rent * p.agencyPct) / 100);
  const legal = Math.round((rent * p.legalPct) / 100);
  const service = p.serviceCharge;
  return { rent, caution, agency, legal, service, total: rent + caution + agency + legal + service };
};

// ---------------------------------------------------------------- Escrow steps

export const makeEscrowSteps = (): EscrowStep[] => [
  { key: "funded", en: "Funds Locked in Vault", pidgin: "Money Lock For Vault", done: false },
  { key: "accepted", en: "Landlord Accepts Terms", pidgin: "Landlord Agree Terms", done: false },
  { key: "checkin", en: "Physical Check-in Day", pidgin: "Check-in Day", done: false },
  { key: "confirm", en: "Tenant OTP Confirmation", pidgin: "Tenant Enter OTP", done: false },
  { key: "released", en: "Funds Released to Landlord", pidgin: "Give Landlord Money", done: false },
];

// ---------------------------------------------------------------- Tenancy clauses

export const TENANCY_CLAUSES: { en: string; pidgin: string }[] = [
  {
    en: "The Landlord hereby lets to the Tenant the described premises for a term of one (1) year commencing on the check-in date.",
    pidgin: "Landlord give Tenant the house for one year, as from the day Tenant enter.",
  },
  {
    en: "Rent is paid yearly in advance and is held in escrow until the Tenant confirms physical check-in and key handover.",
    pidgin: "Dem pay rent one year ahead but money dey for escrow till Tenant confirm say e don enter collect key.",
  },
  {
    en: "A caution deposit is refundable at the end of the tenancy, subject to fair wear and tear and outstanding utility bills.",
    pidgin: "Dem go give back caution money when tenancy finish, if no be say dem spoil place pass normal or dey owe light bill.",
  },
  {
    en: "The Landlord warrants clear title and authority to let; any misrepresentation voids this agreement and triggers a full escrow refund.",
    pidgin: "Landlord confirm say the house na him own and e get right to let am. If e lie, contract cancel and dem refund Tenant everything.",
  },
  {
    en: "Either party may terminate with one (1) month written notice after the first six months of the tenancy.",
    pidgin: "Any side fit end the matter with one month notice after six months don pass.",
  },
];

// ---------------------------------------------------------------- Chat helpers

export const QUICK_PROMPTS: { en: string; pidgin: string }[] = [
  { en: "Is inspection available today?", pidgin: "Make we fit check the house today?" },
  { en: "What is the servicing schedule?", pidgin: "How dem take do servicing?" },
  { en: "Is the price negotiable?", pidgin: "Price fit come down small?" },
  { en: "When can I move in?", pidgin: "When I fit enter?" },
];

export const LANDLORD_REPLIES: { en: string; pidgin: string }[] = [
  {
    en: "Yes, inspection is open today between 10am and 4pm. Please book a slot in-app so we keep it safe.",
    pidgin: "Yes, today dey open from 10am to 4pm. Just book for inside app make e safe.",
  },
  {
    en: "Service charge is paid monthly and covers security, generator fuel and common area cleaning.",
    pidgin: "Service charge na monthly, e cover security, gen fuel and cleaning of outside.",
  },
  {
    en: "All payments go through the Naija Rentals escrow vault. Never send money to any personal account.",
    pidgin: "All money must pass Naija Rentals escrow. No send money go any personal account o.",
  },
  {
    en: "The price is firm for now but I can hold it in escrow for 48 hours while you decide.",
    pidgin: "Price firm small but I fit hold am for escrow for 48 hours while you dey think.",
  },
];

export const MASK_WARNING = {
  en: "Phone numbers and emails are masked for your safety. Keep all payments inside Escrow.",
  pidgin: "We dey hide phone number and email for your safety. Keep all money inside Escrow.",
};

// ---------------------------------------------------------------- Seed reviews

export const SEED_REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Tunde A.",
    rating: 5,
    text: "Escrow protected my one-year rent. Landlord was exactly as verified. Zero wahala.",
    date: "2024-11-02",
    verified: true,
    listingId: "p1",
  },
  {
    id: "r2",
    author: "Ngozi E.",
    rating: 5,
    text: "First time I rent without fear of advance-fee scam. The NIN badge gave me confidence.",
    date: "2024-10-18",
    verified: true,
    listingId: "p2",
  },
  {
    id: "r3",
    author: "Ibrahim S.",
    rating: 4,
    text: "Smooth check-in OTP flow. Masked chat kept the conversation professional.",
    date: "2024-09-30",
    verified: true,
    listingId: "p6",
  },
];
