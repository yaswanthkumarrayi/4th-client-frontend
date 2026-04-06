import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const CategoryCard = ({ category, isCenter = false }) => {
  return (
    <Link
      to={`/${category.slug}`}
      className={`group block transition-all duration-500 ease-out ${
        isCenter 
          ? 'scale-105 -translate-y-2' 
          : 'scale-95 translate-y-0 opacity-90'
      }`}
    >
      {/* Square Image Container */}
      <div className={`aspect-square overflow-hidden rounded-2xl lg:rounded-3xl bg-white shadow-soft transition-all duration-500 group-hover:shadow-soft-lg ${
        isCenter ? 'shadow-lg' : ''
      }`}>
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <span className="text-4xl lg:text-5xl font-rubik font-bold text-primary/30">
              {category.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Title with Arrow */}
      <div className="flex items-center justify-center gap-1 mt-4">
        <h3 className="font-rubik font-bold text-base sm:text-lg lg:text-xl text-gray-800 group-hover:text-primary transition-colors duration-300">
          {category.name}
        </h3>
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
      </div>
    </Link>
  );
};

export default CategoryCard;
