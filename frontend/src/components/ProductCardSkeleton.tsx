const ProductCardSkeleton = () => (
  <div className="bg-card rounded-2xl overflow-hidden shadow-card animate-pulse">
    <div className="aspect-square bg-muted" />
    <div className="p-3 space-y-2">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-1/2" />
      <div className="flex items-center justify-between mt-2">
        <div className="h-5 bg-muted rounded w-16" />
        <div className="w-8 h-8 bg-muted rounded-xl" />
      </div>
    </div>
  </div>
);

export default ProductCardSkeleton;
