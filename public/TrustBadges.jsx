const trustBadges = [
  { id: 1, name: 'FSSAI Certified', image: '/FSSAI.webp' },
  { id: 2, name: 'Hygienic', image: '/Hygenic.png' },
  { id: 3, name: 'International Shipping', image: '/International_shipping.png' },
  { id: 4, name: 'Quality Assured', image: '/Quality.png' },
  { id: 5, name: 'Secured Payments', image: '/Secured_Payments.png' },
];

const TrustBadges = ({ variant = 'scroll' }) => {
  if (variant === 'scroll') {
    // Horizontal scrollable version for product page
    return (
      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-4 min-w-max px-1 py-2">
          {trustBadges.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center gap-2 min-w-[80px]"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white shadow-soft flex items-center justify-center p-2">
                <img
                  src={badge.image}
                  alt={badge.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs text-gray-600 font-montserrat text-center leading-tight">
                {badge.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full width version for before footer
  return (
    <section className="py-8 sm:py-12 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 lg:gap-16">
          {trustBadges.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-soft flex items-center justify-center p-3">
                <img
                  src={badge.image}
                  alt={badge.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-sm text-gray-700 font-montserrat font-medium text-center">
                {badge.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
