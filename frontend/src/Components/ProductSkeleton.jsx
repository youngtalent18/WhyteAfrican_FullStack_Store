const ProductSkeleton = () => {
  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden p-3 animate-pulse">
      
      {/* Image skeleton */}
      <div className="h-48 w-full bg-slate-700 rounded-md"></div>

      {/* Title */}
      <div className="h-4 w-3/4 bg-slate-700 mt-3 rounded"></div>

      {/* Category */}
      <div className="h-3 w-1/2 bg-slate-700 mt-2 rounded"></div>

      {/* Price */}
      <div className="h-4 w-1/3 bg-slate-700 mt-3 rounded"></div>
    </div>
  );
};

export default ProductSkeleton;