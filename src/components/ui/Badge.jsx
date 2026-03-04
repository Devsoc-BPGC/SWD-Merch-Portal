const variants = {
  pending: "bg-yellow-100 text-yellow-800",
  live: "bg-green-100 text-green-800",
  hidden: "bg-gray-100 text-gray-800",
  info: "bg-blue-100 text-blue-800",
  purple: "bg-purple-100 text-purple-800",
  danger: "bg-red-100 text-red-800",
};

export default function Badge({ children, variant = "info", className = "" }) {
  return (
    <span
      className={`px-2 py-1 text-xs rounded-full font-medium ${variants[variant] || variants.info} ${className}`}
    >
      {children}
    </span>
  );
}
