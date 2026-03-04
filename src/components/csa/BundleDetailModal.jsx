"use client";

import { X, Edit2, Save, XCircle, Clock, Building, Eye, EyeOff } from "lucide-react";
import MerchItemEditor from "./MerchItemEditor";
import ComboEditor from "./ComboEditor";
import ApprovalActions from "./ApprovalActions";

function getStatusBadge(status, visibility) {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </span>
    );
  }
  if (status === "approved" && visibility) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <Eye className="w-3 h-3 mr-1" />
        Visible
      </span>
    );
  }
  if (status === "approved" && !visibility) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <EyeOff className="w-3 h-3 mr-1" />
        Hidden
      </span>
    );
  }
  return null;
}

export default function BundleDetailModal({
  bundle,
  editingBundle,
  isEditing,
  approving,
  togglingVisibility,
  saving,
  onClose,
  onStartEditing,
  onCancelEditing,
  onSaveEditing,
  onMerchItemsChange,
  onCombosChange,
  onApproveVisible,
  onApproveHidden,
  onToggleVisibility,
  onSaveChanges,
}) {
  if (!bundle) return null;

  const displayBundle = isEditing ? editingBundle : bundle;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-gray-900">{bundle.title}</h2>
            {getStatusBadge(bundle.approvalStatus, bundle.visibility)}
          </div>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={onSaveEditing}
                  disabled={saving}
                  className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-1" />
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={onCancelEditing}
                  className="flex items-center px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={onStartEditing}
                className="flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bundle Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Club</p>
              <div className="flex items-center space-x-1">
                <Building className="w-4 h-4 text-gray-400" />
                <p className="font-medium text-gray-900">{bundle.club?.clubName}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium text-gray-900 capitalize">{bundle.approvalStatus}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Visibility</p>
              <p className="font-medium text-gray-900">{bundle.visibility ? "Visible" : "Hidden"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-medium text-gray-900">
                {new Date(bundle.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          {bundle.description && (
            <p className="text-gray-600 mt-4">{bundle.description}</p>
          )}
        </div>

        {/* Merch Items */}
        <MerchItemEditor
          items={displayBundle?.merchItems || []}
          isEditing={isEditing}
          onChange={onMerchItemsChange}
        />

        {/* Size Charts */}
        {bundle.sizeCharts && bundle.sizeCharts.length > 0 && (
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Size Charts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bundle.sizeCharts.map((chart, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={chart}
                    alt={`Size Chart ${index + 1}`}
                    className="w-full h-auto"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=Size+Chart+Not+Found";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Combos */}
        <ComboEditor
          combos={displayBundle?.combos || []}
          isEditing={isEditing}
          onChange={onCombosChange}
        />

        {/* Approval Actions */}
        <ApprovalActions
          bundle={bundle}
          isEditing={isEditing}
          approving={approving}
          togglingVisibility={togglingVisibility}
          saving={saving}
          hasBeenEdited={bundle.hasBeenEdited}
          onApproveVisible={onApproveVisible}
          onApproveHidden={onApproveHidden}
          onToggleVisibility={onToggleVisibility}
          onSaveChanges={onSaveChanges}
        />
      </div>
    </div>
  );
}
