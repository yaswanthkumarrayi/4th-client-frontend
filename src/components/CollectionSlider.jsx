import { useRef, useState, useEffect } from 'react';
import CategoryCard from './CategoryCard';

const CollectionSlider = ({ categories }) => {
  const sliderRef = useRef(null);
  const [centerIndex, setCenterIndex] = useState(0);

  const updateCenterIndex = () => {
    if (sliderRef.current) {
      const slider = sliderRef.current;
      const scrollLeft = slider.scrollLeft;
      const cardWidth = slider.scrollWidth / categories.length;
      const viewportCenter = scrollLeft + slider.clientWidth / 2;
      const newCenterIndex = Math.floor(viewportCenter / cardWidth);
      setCenterIndex(Math.min(Math.max(newCenterIndex, 0), categories.length - 1));
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', updateCenterIndex);
      updateCenterIndex();
      return () => slider.removeEventListener('scroll', updateCenterIndex);
    }
  }, [categories.length]);

  return (
    <div className="relative">
      {/* Slider Container - Drag/Swipe to scroll */}
      <div
        ref={sliderRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto hide-scrollbar pb-6 pt-4 px-4 scroll-smooth snap-x snap-mandatory cursor-grab active:cursor-grabbing"
      >
        {categories.map((category, index) => (
          <div
            key={category.id}
            className="flex-shrink-0 w-[200px] sm:w-[280px] lg:w-[320px] snap-center"
          >
            <CategoryCard 
              category={category} 
              isCenter={index === centerIndex}
            />
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-2">
        {categories.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (sliderRef.current) {
                const cardWidth = sliderRef.current.scrollWidth / categories.length;
                sliderRef.current.scrollTo({
                  left: cardWidth * index,
                  behavior: 'smooth',
                });
              }
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              centerIndex === index
                ? 'bg-primary w-6'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CollectionSlider;
