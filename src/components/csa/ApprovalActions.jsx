"use client";

import { Check, EyeOff, Eye } from "lucide-react";

export default function ApprovalActions({
  bundle,
  approving,
  togglingVisibility,
  onApproveVisible,
  onApproveHidden,
  onToggleVisibility,
}) {
  if (!bundle) return null;

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
      <div className="space-y-3">
        {bundle.approvalStatus === "pending" ? (
          <>
            <button
              onClick={onApproveVisible}
              disabled={approving}
              className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Check className="w-5 h-5 mr-2" />
              {approving ? "Approving..." : "Approve & Make Visible"}
            </button>
            <button
              onClick={onApproveHidden}
              disabled={approving}
              className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <EyeOff className="w-5 h-5 mr-2" />
              {approving ? "Approving..." : "Approve & Keep Hidden"}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onToggleVisibility}
              disabled={togglingVisibility}
              className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                bundle.visibility
                  ? "bg-gray-600 text-white hover:bg-gray-700"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {bundle.visibility ? (
                <>
                  <EyeOff className="w-5 h-5 mr-2" />
                  {togglingVisibility ? "Updating..." : "Hide Bundle"}
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5 mr-2" />
                  {togglingVisibility ? "Updating..." : "Make Visible"}
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
