import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FoodCard from './FoodCard';

const ProductSlider = ({ products, onAddToCart }) => {
  const sliderRef = useRef(null);
  const [centerIndex, setCenterIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateCenterIndex = () => {
    if (sliderRef.current) {
      const slider = sliderRef.current;
      const scrollLeft = slider.scrollLeft;
      const cardWidth = slider.scrollWidth / products.length;
      const viewportCenter = scrollLeft + slider.clientWidth / 2;
      const newCenterIndex = Math.floor(viewportCenter / cardWidth);
      setCenterIndex(Math.min(Math.max(newCenterIndex, 0), products.length - 1));
      
      // Update scroll buttons
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < slider.scrollWidth - slider.clientWidth - 10);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', updateCenterIndex);
      updateCenterIndex();
      return () => slider.removeEventListener('scroll', updateCenterIndex);
    }
  }, [products.length]);

  const scrollToIndex = (index) => {
    if (sliderRef.current) {
      const slider = sliderRef.current;
      const cardWidth = slider.scrollWidth / products.length;
      slider.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth',
      });
    }
  };

  const scrollPrev = () => {
    const newIndex = Math.max(0, centerIndex - 1);
    scrollToIndex(newIndex);
  };

  const scrollNext = () => {
    const newIndex = Math.min(products.length - 1, centerIndex + 1);
    scrollToIndex(newIndex);
  };

  return (
    <div className="relative">
      {/* Slider Container */}
      <div
        ref={sliderRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto hide-scrollbar pb-6 pt-4 px-4 scroll-smooth snap-x snap-mandatory cursor-grab active:cursor-grabbing"
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-[85%] sm:w-[70%] md:w-[50%] lg:w-[35%] xl:w-[28%] snap-center"
          >
            <div
              className={`transition-all duration-500 ease-out ${
                index === centerIndex
                  ? 'scale-105 -translate-y-2'
                  : 'scale-95 translate-y-0 opacity-90'
              }`}
            >
              <FoodCard product={product} onAddToCart={onAddToCart} />
            </div>
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      {products.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                centerIndex === index
                  ? 'bg-primary w-6'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSlider;
