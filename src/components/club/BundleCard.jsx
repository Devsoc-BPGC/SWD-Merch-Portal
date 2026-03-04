"use client";

import { Loader2 } from "lucide-react";
import Badge from "@/components/ui/Badge";

function getStatusBadge(status, visibility) {
  if (status === "pending") return <Badge variant="pending">Pending</Badge>;
  if (status === "approved" && visibility) return <Badge variant="live">Live</Badge>;
  if (status === "approved" && !visibility) return <Badge variant="hidden">Hidden</Badge>;
  return null;
}

export default function BundleCard({ bundle, orderCount = 0, onViewOrders, ordersLoading }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg">{bundle.title}</h3>
          <p className="text-sm text-gray-600">{bundle.description}</p>
        </div>
        {getStatusBadge(bundle.approvalStatus, bundle.visibility)}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Items:</span> {bundle.merchItems.length}
        </div>
        <div>
          <span className="text-gray-500">Combos:</span> {bundle.combos.length}
        </div>
        <div>
          <span className="text-gray-500">Size Charts:</span> {bundle.sizeCharts.length}
        </div>
        <div>
          <span className="text-gray-500">Created:</span>{" "}
          {new Date(bundle.createdAt).toLocaleDateString()}
        </div>
      </div>

      {bundle.approvalStatus === "approved" && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Approved by: {bundle.approvedBy?.username}
          </p>
          <p className="text-sm text-gray-600">
            Approved on: {new Date(bundle.approvedAt).toLocaleDateString()}
          </p>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-200">
        <button
          onClick={() => onViewOrders(bundle._id)}
          disabled={ordersLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {ordersLoading ? (
            <span className="flex items-center">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Loading...
            </span>
          ) : (
            <span className="flex items-center space-x-2">
              <span>View Orders</span>
              <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                {orderCount}
              </span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
