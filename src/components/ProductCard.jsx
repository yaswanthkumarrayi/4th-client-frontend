import PropTypes from 'prop-types';
import FoodCard from './FoodCard';
import SkeletonCard from './SkeletonCard';

const ProductCard = ({ product, isLoading = false }) => {
  if (isLoading || !product) {
    return <SkeletonCard />;
  }

  return <FoodCard product={product} />;
};

ProductCard.propTypes = {
  product: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default ProductCard;

