const trustBadges = [
  { id: 1, name: 'FSSAI Certified', image: '/FSSAI.webp' },
  { id: 2, name: 'Hygienic', image: '/Hygenic.png' },
  { id: 3, name: 'International Shipping', image: '/International_Shipping.png' },
  { id: 4, name: 'Quality Assured', image: '/Quality.png' },
  { id: 5, name: 'Secured Payments', image: '/Secured_Payment.png' },
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
              className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center flex-shrink-0"
            >
              <img
                src={badge.image}
                alt={badge.name}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full width version for before footer - single row scrollable
  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex justify-center gap-8 sm:gap-12 lg:gap-20 min-w-max">
            {trustBadges.map((badge) => (
              <div
                key={badge.id}
                className="w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center flex-shrink-0"
              >
                <img
                  src={badge.image}
                  alt={badge.name}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
