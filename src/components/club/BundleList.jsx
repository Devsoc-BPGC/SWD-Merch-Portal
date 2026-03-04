"use client";

import Spinner from "@/components/ui/Spinner";
import BundleCard from "./BundleCard";

export default function BundleList({
  bundles,
  loading,
  bundleOrderCounts,
  onViewOrders,
  onViewDetails,
  onEdit,
  ordersLoading,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">Your Bundles</h2>

      {loading ? (
        <Spinner />
      ) : bundles.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No bundles created yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            Create your first bundle using the form on the left.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bundles.map((bundle) => (
            <BundleCard
              key={bundle._id}
              bundle={bundle}
              orderCount={bundleOrderCounts[bundle._id] || 0}
              onViewOrders={onViewOrders}
              onViewDetails={onViewDetails}
              onEdit={onEdit}
              ordersLoading={ordersLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
