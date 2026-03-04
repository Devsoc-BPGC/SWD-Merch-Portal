"use client";

import { Check, EyeOff, Eye, Save, Edit2 } from "lucide-react";

export default function ApprovalActions({
  bundle,
  isEditing,
  approving,
  togglingVisibility,
  saving,
  hasBeenEdited,
  onApproveVisible,
  onApproveHidden,
  onToggleVisibility,
  onSaveChanges,
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
              disabled={approving || isEditing}
              className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Check className="w-5 h-5 mr-2" />
              {approving ? "Approving..." : "Approve & Make Visible"}
            </button>
            <button
              onClick={onApproveHidden}
              disabled={approving || isEditing}
              className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <EyeOff className="w-5 h-5 mr-2" />
              {approving ? "Approving..." : "Approve & Keep Hidden"}
            </button>
          </>
        ) : (
          <>
            {hasBeenEdited && (
              <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg mb-2">
                <Edit2 className="w-4 h-4" />
                <span>This bundle has unsaved CSA edits</span>
              </div>
            )}
            {hasBeenEdited && (
              <button
                onClick={onSaveChanges}
                disabled={saving || isEditing}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
            <button
              onClick={onToggleVisibility}
              disabled={togglingVisibility || isEditing}
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
