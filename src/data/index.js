/**
 * Static Data Exports
 * 
 * Products are now fetched from the backend API.
 * This file contains only static configuration data:
 * - Categories
 * - Navigation links
 * - Footer data
 */

// Import category images
import vegPicklesImg from '../assets/images/VegPickles.png';
import nonVegPicklesImg from '../assets/images/NonVegPickles.png';
import podisImg from '../assets/images/Podis.png';
import snacksImg from '../assets/images/Snacks.png';
import sweetsImg from '../assets/images/Sweets.png';

// Re-export product images utility
export { 
  default as productImages,
  categoryImages, 
  getProductImage, 
  getProductImages,
  mergeProductWithImages 
} from './productImages';

// ============================================
// PRICING UTILITY FUNCTIONS
// ============================================

// Calculate weight prices from 1kg base price
export const calculateWeightPrices = (pricePerKg) => ({
  '250gm': Math.floor(pricePerKg * 0.25),
  '500gm': Math.floor(pricePerKg * 0.5),
  '1kg': pricePerKg,
  '2kg': pricePerKg * 2,
});

// Standard weights for products
export const STANDARD_WEIGHTS = ['250gm', '500gm', '1kg', '2kg'];

// ============================================
// CATEGORIES DATA
// ============================================

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

// ============================================
// NAVIGATION LINKS
// ============================================

export const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Veg Pickles', href: '/veg-pickles' },
  { name: 'Non Veg Pickles', href: '/non-veg-pickles' },
  { name: 'Podis', href: '/podis' },
  { name: 'Sweets', href: '/sweets' },
  { name: 'Snacks', href: '/snacks' },
];

// ============================================
// FOOTER DATA
// ============================================

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

// ============================================
// BEST SELLER & NEW ARRIVAL PRODUCT IDS
// (Used for featuring specific products on homepage)
// ============================================

export const bestSellerIds = [1, 2, 3, 4, 7, 8, 204, 102];
export const newArrivalIds = [9, 10, 11, 12, 208, 101];

// Note: Actual product data is fetched from API via ProductConfigContext
