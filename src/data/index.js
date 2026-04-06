// Import local images
import vegPicklesImg from '../assets/images/VegPickles.png';
import nonVegPicklesImg from '../assets/images/NonVegPickles.png';
import podisImg from '../assets/images/Podis.png';
import snacksImg from '../assets/images/Snacks.png';
import sweetsImg from '../assets/images/Sweets.png';

// Veg Pickles
import vegPickleImg1 from '../assets/images/VegPickles/Avakaya1.png';
import vegPickleImg2 from '../assets/images/VegPickles/Avakaya2.png';
import gongura1 from '../assets/images/VegPickles/Gongura1.png';
import gongura2 from '../assets/images/VegPickles/Gongura2.png';
import gingerPickle from '../assets/images/VegPickles/GingerPickle.png';
import lemonPickle from '../assets/images/VegPickles/LemonPickle.png';
import redChilliPickle from '../assets/images/VegPickles/RedChilliPickle.png';
import usirikayaPickle from '../assets/images/VegPickles/UsirikayaPickle.png';

// Non Veg Pickles
import nonVegPickleImg1 from '../assets/images/NonVegPickles/Chicken1.png';
import nonVegPickleImg2 from '../assets/images/NonVegPickles/Chicken2.png';
import prawn1 from '../assets/images/NonVegPickles/Prawn1.png';
import prawn2 from '../assets/images/NonVegPickles/Prawn2.png';
import muttonPickle from '../assets/images/NonVegPickles/MuttonPickle.png';

// Podis
import kandiPodi from '../assets/images/Podis/KandiPodi.png';
import karvepakuPodi from '../assets/images/Podis/KarvepakuPodi.png';
import kobbariPodi from '../assets/images/Podis/KobbariPodi.png';

// Snacks
import mixtureImg from '../assets/images/Snacks/Mixture.png';
import murukuluImg from '../assets/images/Snacks/Murukulu.png';
import ribbonPakodiImg from '../assets/images/Snacks/RibbonPakodi.png';

// Sweets
import ariseluImg from '../assets/images/Sweets/Ariselu.png';
import bandharuLadduImg from '../assets/images/Sweets/BandharuLaddu.png';
import boondhiAchuImg from '../assets/images/Sweets/Boondhiachu.png';
import boondhiLadduImg from '../assets/images/Sweets/BoondhiLaddu.png';
import booreluImg from '../assets/images/Sweets/Boorelu.png';
import cashewAchuImg from '../assets/images/Sweets/CashewAchu.png';
import kajjiKayaluImg from '../assets/images/Sweets/KajjiKayalu.png';
import mysorepakImg from '../assets/images/Sweets/MysoreaPak.png';
import nuvvundaluImg from '../assets/images/Sweets/nuvvundalu.png';
import palliUndaluImg from '../assets/images/Sweets/PalliUndalu.png';
import sannaBoondhiLadduImg from '../assets/images/Sweets/SannaBoondhiLaddu.png';
import sunnundaImg from '../assets/images/Sweets/Sunnunda.png';

// ============================================
// PRICING UTILITY FUNCTIONS
// ============================================

// Base prices per 1kg for each category
const CATEGORY_BASE_PRICES = {
  snacks: 550,
  sweets: 799,
  vegPickles: 750,
  podis: 1400,
  // Non-veg pickles have individual prices
  chickenPickle: 1999,
  prawnPickle: 2499,
  muttonPickle: 2799,
};

// Calculate weight prices from 1kg base price (using floor for cleaner prices)
export const calculateWeightPrices = (pricePerKg) => ({
  '250gm': Math.floor(pricePerKg * 0.25),
  '500gm': Math.floor(pricePerKg * 0.5),
  '1kg': pricePerKg,
  '2kg': pricePerKg * 2,
});

// Standard weights for most products
const STANDARD_WEIGHTS = ['250gm', '500gm', '1kg', '2kg'];

// Helper to create product with dynamic pricing
const createProduct = (id, name, category, pricePerKg, image, images = null) => ({
  id,
  name,
  category,
  price: Math.floor(pricePerKg * 0.25), // Display price is 250gm (smallest)
  originalPrice: Math.floor(pricePerKg * 0.25 * 1.15), // ~15% higher for "original"
  image,
  images: images || [image],
  weights: STANDARD_WEIGHTS,
  weightPrices: calculateWeightPrices(pricePerKg),
});

// Categories for Collections section (using main category images)
export const categories = [
  {
    id: 1,
    name: 'Veg Pickles',
    slug: 'veg-pickles',
    image: vegPicklesImg,
  },
  {
    id: 2,
    name: 'Non Veg Pickles',
    slug: 'non-veg-pickles',
    image: nonVegPicklesImg,
  },
  {
    id: 3,
    name: 'Podis',
    slug: 'podis',
    image: podisImg,
  },
  {
    id: 4,
    name: 'Sweets',
    slug: 'sweets',
    image: sweetsImg,
  },
  {
    id: 5,
    name: 'Snacks',
    slug: 'snacks',
    image: snacksImg,
  },
];

// Best sellers data with multiple images for product page
export const bestSellers = [
  createProduct(1, 'Mango Avakaya', 'Veg Pickles', CATEGORY_BASE_PRICES.vegPickles, vegPickleImg1, [vegPickleImg1, vegPickleImg2]),
  createProduct(2, 'Gongura Pickle', 'Veg Pickles', CATEGORY_BASE_PRICES.vegPickles, gongura1, [gongura1, gongura2]),
  createProduct(3, 'Chicken Pickle', 'Non Veg Pickles', CATEGORY_BASE_PRICES.chickenPickle, nonVegPickleImg1, [nonVegPickleImg1, nonVegPickleImg2]),
  createProduct(4, 'Prawns Pickle', 'Non Veg Pickles', CATEGORY_BASE_PRICES.prawnPickle, prawn1, [prawn1, prawn2]),
  createProduct(7, 'Kandi Podi', 'Podis', CATEGORY_BASE_PRICES.podis, kandiPodi),
  createProduct(8, 'Karvepaku Podi', 'Podis', CATEGORY_BASE_PRICES.podis, karvepakuPodi),
  createProduct(204, 'Boondhi Laddu', 'Sweets', CATEGORY_BASE_PRICES.sweets, boondhiLadduImg),
  createProduct(102, 'Murukulu', 'Snacks', CATEGORY_BASE_PRICES.snacks, murukuluImg),
];

// New arrivals
export const newArrivals = [
  createProduct(5, 'Gongura Avakaya', 'Veg Pickles', CATEGORY_BASE_PRICES.vegPickles, gongura1, [gongura1, gongura2]),
  createProduct(6, 'Spicy Chicken', 'Non Veg Pickles', CATEGORY_BASE_PRICES.chickenPickle, nonVegPickleImg1, [nonVegPickleImg1, nonVegPickleImg2]),
  createProduct(9, 'Kobbari Podi', 'Podis', CATEGORY_BASE_PRICES.podis, kobbariPodi),
  createProduct(10, 'Ginger Pickle', 'Veg Pickles', CATEGORY_BASE_PRICES.vegPickles, gingerPickle),
  createProduct(208, 'Mysore Pak', 'Sweets', CATEGORY_BASE_PRICES.sweets, mysorepakImg),
  createProduct(101, 'Mixture', 'Snacks', CATEGORY_BASE_PRICES.snacks, mixtureImg),
];

// All products combined for lookup
export const allProducts = [...bestSellers, ...newArrivals];

// Full product catalog by category
export const vegPickles = [
  createProduct(1, 'Mango Avakaya', 'Veg Pickles', CATEGORY_BASE_PRICES.vegPickles, vegPickleImg1, [vegPickleImg1, vegPickleImg2]),
  createProduct(2, 'Gongura Pickle', 'Veg Pickles', CATEGORY_BASE_PRICES.vegPickles, gongura1, [gongura1, gongura2]),
  createProduct(10, 'Ginger Pickle', 'Veg Pickles', CATEGORY_BASE_PRICES.vegPickles, gingerPickle),
  createProduct(11, 'Lemon Pickle', 'Veg Pickles', CATEGORY_BASE_PRICES.vegPickles, lemonPickle),
  createProduct(12, 'Red Chilli Pickle', 'Veg Pickles', CATEGORY_BASE_PRICES.vegPickles, redChilliPickle),
  createProduct(13, 'Usirikaya Pickle', 'Veg Pickles', CATEGORY_BASE_PRICES.vegPickles, usirikayaPickle),
];

export const nonVegPickles = [
  createProduct(3, 'Chicken Pickle', 'Non Veg Pickles', CATEGORY_BASE_PRICES.chickenPickle, nonVegPickleImg1, [nonVegPickleImg1, nonVegPickleImg2]),
  createProduct(4, 'Prawns Pickle', 'Non Veg Pickles', CATEGORY_BASE_PRICES.prawnPickle, prawn1, [prawn1, prawn2]),
  createProduct(14, 'Mutton Boneless Pickle', 'Non Veg Pickles', CATEGORY_BASE_PRICES.muttonPickle, muttonPickle),
];

export const podis = [
  createProduct(7, 'Kandi Podi', 'Podis', CATEGORY_BASE_PRICES.podis, kandiPodi),
  createProduct(8, 'Karvepaku Podi', 'Podis', CATEGORY_BASE_PRICES.podis, karvepakuPodi),
  createProduct(9, 'Kobbari Podi', 'Podis', CATEGORY_BASE_PRICES.podis, kobbariPodi),
];

export const snacks = [
  createProduct(101, 'Mixture', 'Snacks', CATEGORY_BASE_PRICES.snacks, mixtureImg),
  createProduct(102, 'Murukulu', 'Snacks', CATEGORY_BASE_PRICES.snacks, murukuluImg),
  createProduct(103, 'Ribbon Pakodi', 'Snacks', CATEGORY_BASE_PRICES.snacks, ribbonPakodiImg),
];

export const sweets = [
  createProduct(201, 'Ariselu', 'Sweets', CATEGORY_BASE_PRICES.sweets, ariseluImg),
  createProduct(202, 'Bandharu Laddu', 'Sweets', CATEGORY_BASE_PRICES.sweets, bandharuLadduImg),
  createProduct(203, 'Boondhi Achu', 'Sweets', CATEGORY_BASE_PRICES.sweets, boondhiAchuImg),
  createProduct(204, 'Boondhi Laddu', 'Sweets', CATEGORY_BASE_PRICES.sweets, boondhiLadduImg),
  createProduct(205, 'Boorelu', 'Sweets', CATEGORY_BASE_PRICES.sweets, booreluImg),
  createProduct(206, 'Cashew Achu', 'Sweets', CATEGORY_BASE_PRICES.sweets, cashewAchuImg),
  createProduct(207, 'Kajji Kayalu', 'Sweets', CATEGORY_BASE_PRICES.sweets, kajjiKayaluImg),
  createProduct(208, 'Mysore Pak', 'Sweets', CATEGORY_BASE_PRICES.sweets, mysorepakImg),
  createProduct(209, 'Nuvvundalu', 'Sweets', CATEGORY_BASE_PRICES.sweets, nuvvundaluImg),
  createProduct(210, 'Palli Undalu', 'Sweets', CATEGORY_BASE_PRICES.sweets, palliUndaluImg),
  createProduct(211, 'Sanna Boondhi Laddu', 'Sweets', CATEGORY_BASE_PRICES.sweets, sannaBoondhiLadduImg),
  createProduct(212, 'Sunnunda', 'Sweets', CATEGORY_BASE_PRICES.sweets, sunnundaImg),
];

// Combined catalog for product lookup
export const productCatalog = [...vegPickles, ...nonVegPickles, ...podis, ...snacks, ...sweets];

// Navigation links
export const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Veg Pickles', href: '/veg-pickles' },
  { name: 'Non Veg Pickles', href: '/non-veg-pickles' },
  { name: 'Podis', href: '/podis' },
  { name: 'Sweets', href: '/sweets' },
  { name: 'Snacks', href: '/snacks' },
];

// Footer links
export const footerLinks = {
  quickLinks: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Shipping Policy', href: '/shipping' },
    { name: 'Return Policy', href: '/returns' },
  ],
  categories: [
    { name: 'Veg Pickles', href: '/veg-pickles' },
    { name: 'Non Veg Pickles', href: '/non-veg-pickles' },
    { name: 'Podis', href: '/podis' },
    { name: 'Sweets', href: '/sweets' },
    { name: 'Snacks', href: '/snacks' },
  ],
  contact: {
    phone: '+91 85006 77977',
    email: 'hello@samskruthifoods.com',
    address: 'Hyderabad, Telangana, India',
  },
  social: [
    { name: 'Facebook', href: 'https://facebook.com' },
    { name: 'Instagram', href: 'https://instagram.com' },
    { name: 'Twitter', href: 'https://twitter.com' },
    { name: 'YouTube', href: 'https://youtube.com' },
  ],
};
