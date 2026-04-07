/**
 * Product Images Mapping
 * 
 * Images are handled ONLY in frontend - NOT stored in database.
 * This file maps product IDs to their corresponding images.
 */

// Category Images
import vegPicklesImg from '../assets/images/VegPickles.png';
import nonVegPicklesImg from '../assets/images/NonVegPickles.png';
import podisImg from '../assets/images/Podis.png';
import snacksImg from '../assets/images/Snacks.png';
import sweetsImg from '../assets/images/Sweets.png';

// Veg Pickles Images
import vegPickleImg1 from '../assets/images/VegPickles/Avakaya1.png';
import vegPickleImg2 from '../assets/images/VegPickles/Avakaya2.png';
import gongura1 from '../assets/images/VegPickles/Gongura1.png';
import gongura2 from '../assets/images/VegPickles/Gongura2.png';
import gingerPickle from '../assets/images/VegPickles/GingerPickle.png';
import lemonPickle from '../assets/images/VegPickles/LemonPickle.png';
import redChilliPickle from '../assets/images/VegPickles/RedChilliPickle.png';
import usirikayaPickle from '../assets/images/VegPickles/UsirikayaPickle.png';

// Non Veg Pickles Images
import nonVegPickleImg1 from '../assets/images/NonVegPickles/Chicken1.png';
import nonVegPickleImg2 from '../assets/images/NonVegPickles/Chicken2.png';
import prawn1 from '../assets/images/NonVegPickles/Prawn1.png';
import prawn2 from '../assets/images/NonVegPickles/Prawn2.png';
import muttonPickle from '../assets/images/NonVegPickles/MuttonPickle.png';

// Podis Images
import kandiPodi from '../assets/images/Podis/KandiPodi.png';
import karvepakuPodi from '../assets/images/Podis/KarvepakuPodi.png';
import kobbariPodi from '../assets/images/Podis/KobbariPodi.png';

// Snacks Images
import mixtureImg from '../assets/images/Snacks/Mixture.png';
import murukuluImg from '../assets/images/Snacks/Murukulu.png';
import ribbonPakodiImg from '../assets/images/Snacks/RibbonPakodi.png';

// Sweets Images
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

/**
 * Product Images Map
 * Maps productId -> { image, images (array for gallery) }
 */
export const productImages = {
  // Veg Pickles
  1: { image: vegPickleImg1, images: [vegPickleImg1, vegPickleImg2] },  // Mango Avakaya
  2: { image: gongura1, images: [gongura1, gongura2] },                  // Gongura Pickle
  10: { image: gingerPickle, images: [gingerPickle] },                   // Ginger Pickle
  11: { image: lemonPickle, images: [lemonPickle] },                     // Lemon Pickle
  12: { image: redChilliPickle, images: [redChilliPickle] },             // Red Chilli Pickle
  13: { image: usirikayaPickle, images: [usirikayaPickle] },             // Usirikaya Pickle
  
  // Non Veg Pickles
  3: { image: nonVegPickleImg1, images: [nonVegPickleImg1, nonVegPickleImg2] },  // Chicken Pickle
  4: { image: prawn1, images: [prawn1, prawn2] },                                  // Prawns Pickle
  14: { image: muttonPickle, images: [muttonPickle] },                             // Mutton Pickle
  
  // Podis
  7: { image: kandiPodi, images: [kandiPodi] },                          // Kandi Podi
  8: { image: karvepakuPodi, images: [karvepakuPodi] },                  // Karvepaku Podi
  9: { image: kobbariPodi, images: [kobbariPodi] },                      // Kobbari Podi
  
  // Snacks
  101: { image: mixtureImg, images: [mixtureImg] },                      // Mixture
  102: { image: murukuluImg, images: [murukuluImg] },                    // Murukulu
  103: { image: ribbonPakodiImg, images: [ribbonPakodiImg] },            // Ribbon Pakodi
  
  // Sweets
  201: { image: ariseluImg, images: [ariseluImg] },                      // Ariselu
  202: { image: bandharuLadduImg, images: [bandharuLadduImg] },          // Bandharu Laddu
  203: { image: boondhiAchuImg, images: [boondhiAchuImg] },              // Boondhi Achu
  204: { image: boondhiLadduImg, images: [boondhiLadduImg] },            // Boondhi Laddu
  205: { image: booreluImg, images: [booreluImg] },                      // Boorelu
  206: { image: cashewAchuImg, images: [cashewAchuImg] },                // Cashew Achu
  207: { image: kajjiKayaluImg, images: [kajjiKayaluImg] },              // Kajji Kayalu
  208: { image: mysorepakImg, images: [mysorepakImg] },                  // Mysore Pak
  209: { image: nuvvundaluImg, images: [nuvvundaluImg] },                // Nuvvundalu
  210: { image: palliUndaluImg, images: [palliUndaluImg] },              // Palli Undalu
  211: { image: sannaBoondhiLadduImg, images: [sannaBoondhiLadduImg] },  // Sanna Boondhi Laddu
  212: { image: sunnundaImg, images: [sunnundaImg] },                    // Sunnunda
};

/**
 * Category Images Map
 */
export const categoryImages = {
  'Veg Pickles': vegPicklesImg,
  'Non Veg Pickles': nonVegPicklesImg,
  'Podis': podisImg,
  'Snacks': snacksImg,
  'Sweets': sweetsImg,
};

/**
 * Get image for a product
 * @param {number} productId - The product ID
 * @returns {string} The image path or a placeholder
 */
export const getProductImage = (productId) => {
  const productImg = productImages[productId];
  return productImg?.image || vegPicklesImg; // Fallback to a default image
};

/**
 * Get all images for a product (for gallery/slider)
 * @param {number} productId - The product ID
 * @returns {string[]} Array of image paths
 */
export const getProductImages = (productId) => {
  const productImg = productImages[productId];
  return productImg?.images || [getProductImage(productId)];
};

/**
 * Merge product data with images
 * @param {object} product - Product data from API
 * @returns {object} Product with images merged
 */
export const mergeProductWithImages = (product) => {
  const imageData = productImages[product.id] || productImages[product.productId];
  return {
    ...product,
    image: imageData?.image || vegPicklesImg,
    images: imageData?.images || [vegPicklesImg],
  };
};

/**
 * Default placeholder image
 */
export const defaultProductImage = vegPicklesImg;

export default productImages;
