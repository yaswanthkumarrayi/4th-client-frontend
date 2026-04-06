const TopBanner = () => {
  const whatsappUrl = 'https://wa.me/918500677977';

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full bg-primary hover:bg-primary-dark transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <p className="text-sm sm:text-base font-medium text-center text-white hover:underline underline-offset-2">
          For international orders click here
        </p>
      </div>
    </a>
  );
};

export default TopBanner;
