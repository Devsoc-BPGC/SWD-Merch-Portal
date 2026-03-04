import { Loader2 } from "lucide-react";

export default function Spinner({ className = "w-6 h-6", text }) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Loader2 className={`animate-spin text-gray-500 ${className}`} />
      {text && <p className="mt-2 text-sm text-gray-500">{text}</p>}
    </div>
  );
}
