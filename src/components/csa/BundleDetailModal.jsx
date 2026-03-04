"use client";

import { X, Clock, Building, Eye, EyeOff } from "lucide-react";
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
  approving,
  togglingVisibility,
  onClose,
  onApproveVisible,
  onApproveHidden,
  onToggleVisibility,
}) {
  if (!bundle) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-gray-900">{bundle.title}</h2>
            {getStatusBadge(bundle.approvalStatus, bundle.visibility)}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
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
          items={bundle.merchItems || []}
        />

        {/* Size Charts */}
        {bundle.sizeCharts && bundle.sizeCharts.length > 0 && (
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Size Charts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bundle.sizeCharts.map((chart, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  {chart ? (
                    <img
                      src={chart}
                      alt={`Size Chart ${index + 1}`}
                      className="w-full h-auto"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-medium"
                    style={{ display: chart ? 'none' : 'flex' }}
                  >
                    Size Chart Not Found
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Combos */}
        <ComboEditor
          combos={bundle.combos || []}
        />

        {/* Approval Actions */}
        <ApprovalActions
          bundle={bundle}
          approving={approving}
          togglingVisibility={togglingVisibility}
          onApproveVisible={onApproveVisible}
          onApproveHidden={onApproveHidden}
          onToggleVisibility={onToggleVisibility}
        />
      </div>
    </div>
  );
}
