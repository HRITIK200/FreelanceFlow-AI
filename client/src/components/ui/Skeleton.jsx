export default function Skeleton({ className = "", variant = "rect" }) {
  const baseClass = "animate-pulse bg-gray-200 dark:bg-gray-700";
  const variantClass =
    variant === "circle"
      ? "rounded-full"
      : variant === "text"
      ? "rounded h-4 w-full"
      : "rounded-2xl";

  return <div className={`${baseClass} ${variantClass} ${className}`} />;
}
