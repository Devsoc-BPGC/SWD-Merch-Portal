"use client";

import { Package } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import BundleCardCSA from "./BundleCardCSA";

export default function BundleListCSA({
  bundles,
  loading,
  searchTerm,
  statusFilter,
  onViewDetails,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Bundles ({bundles.length})
        </h2>
      </div>

      {loading ? (
        <Spinner text="Loading bundles..." />
      ) : bundles.length === 0 ? (
        <div className="p-8 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No bundles found</p>
          <p className="text-sm text-gray-500 mt-1">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "No bundles have been created yet"}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {bundles.map((bundle) => (
            <BundleCardCSA
              key={bundle._id}
              bundle={bundle}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}
