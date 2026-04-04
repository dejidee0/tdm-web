"use client";

export default function ActiveFilterTags({
  activeFilters,
  onRemoveFilter,
  onClearAll,
}) {
  const hasActiveFilters =
    (activeFilters.categories && activeFilters.categories.length > 0) ||
    (activeFilters.materialTypes && activeFilters.materialTypes.length > 0);

  if (!hasActiveFilters) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {activeFilters.categories?.map((category) => (
        <button
          key={`category-${category}`}
          onClick={() => onRemoveFilter("category", category)}
          className="inline-flex items-center gap-2 px-3 py-1 bg-stone text-[#0A0A0A] rounded-none text-xs hover:bg-warm transition-colors font-manrope"
        >
          <span>{category}</span>
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      ))}

      {activeFilters.materialTypes?.map((materialType) => (
        <button
          key={`material-${materialType}`}
          onClick={() => onRemoveFilter("materialType", materialType)}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone text-[#0A0A0A] rounded-none text-sm hover:bg-warm transition-colors font-manrope"
        >
          <span>{materialType.split("_").join(" ")}</span>
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      ))}

      <button
        onClick={onClearAll}
        className="text-sm text-[#0A0A0A] hover:text-gold font-medium font-manrope underline transition-colors"
      >
        Clear All
      </button>
    </div>
  );
}
