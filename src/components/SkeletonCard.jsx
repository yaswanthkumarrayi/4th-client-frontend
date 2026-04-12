const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl lg:rounded-3xl overflow-hidden shadow-soft">
      <div className="aspect-square bg-gray-200 animate-pulse" />
      <div className="p-4 lg:p-5 space-y-3">
        <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
};

export default SkeletonCard;

