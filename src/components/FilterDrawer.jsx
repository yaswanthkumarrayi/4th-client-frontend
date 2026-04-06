import { useState } from 'react';
import { X, Sliders } from 'lucide-react';

const FilterDrawer = ({ isOpen, onClose, filters, setFilters, onApply }) => {
  const [tempFilters, setTempFilters] = useState(filters);

  const handleAvailabilityChange = (option) => {
    setTempFilters((prev) => ({
      ...prev,
      availability: prev.availability.includes(option)
        ? prev.availability.filter((item) => item !== option)
        : [...prev.availability, option],
    }));
  };

  const handlePriceChange = (type, value) => {
    setTempFilters((prev) => ({
      ...prev,
      price: {
        ...prev.price,
        [type]: value,
      },
    }));
  };

  const handleApply = () => {
    setFilters(tempFilters);
    onApply(tempFilters);
    onClose();
  };

  const handleRemoveAll = () => {
    const resetFilters = {
      availability: [],
      price: { min: 0, max: 10000 },
    };
    setTempFilters(resetFilters);
    setFilters(resetFilters);
    onApply(resetFilters);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Filter Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] sm:w-1/2 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-primary" />
              <h2 className="font-rubik font-bold text-xl text-gray-800">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Availability Filter */}
          <div>
            <h3 className="font-rubik font-semibold text-gray-800 mb-4">Availability</h3>
            <div className="space-y-3">
              {['In Stock', 'Out of Stock'].map((option) => (
                <label key={option} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempFilters.availability.includes(option)}
                    onChange={() => handleAvailabilityChange(option)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700 font-montserrat text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="font-rubik font-semibold text-gray-800 mb-4">Price Range</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 font-montserrat mb-2">
                  Min Price: ₹{tempFilters.price.min}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={tempFilters.price.min}
                  onChange={(e) => handlePriceChange('min', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 font-montserrat mb-2">
                  Max Price: ₹{tempFilters.price.max}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={tempFilters.price.max}
                  onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="pt-2 px-3 py-2 bg-gray-50 rounded-lg text-center">
                <p className="text-sm font-montserrat text-gray-700">
                  ₹{tempFilters.price.min} - ₹{tempFilters.price.max}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 sm:p-6 border-t border-gray-100 bg-white space-y-3">
          <button
            onClick={handleRemoveAll}
            className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-300 font-montserrat"
          >
            Remove All
          </button>
          <button
            onClick={handleApply}
            className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors duration-300 font-montserrat"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterDrawer;
