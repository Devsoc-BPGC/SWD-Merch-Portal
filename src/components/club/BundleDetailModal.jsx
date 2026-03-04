"use client";

import { useState } from "react";
import { Edit2, Calendar, CheckCircle, Image as ImageIcon } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import MerchItemCard from "./MerchItemCard";
import ComboCard from "./ComboCard";
import BundleEditForm from "./BundleEditForm";

function getStatusBadge(status, visibility) {
  if (status === "pending") return <Badge variant="pending">Pending</Badge>;
  if (status === "approved" && visibility)
    return <Badge variant="live">Live</Badge>;
  if (status === "approved" && !visibility)
    return <Badge variant="hidden">Hidden</Badge>;
  return null;
}

export default function BundleDetailModal({
  bundle,
  onClose,
  onBundleUpdated,
  onSetError,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewingImage, setViewingImage] = useState(null);

  const isEditable = bundle.approvalStatus === "pending";

  const handleEditSave = async (formData) => {
    setLoading(true);
    try {
      const success = await onBundleUpdated(bundle._id, formData);
      if (success) {
        setIsEditing(false);
      }
      return success;
    } finally {
      setLoading(false);
    }
  };

  const modalTitle = (
    <div className="flex items-center space-x-3">
      <h2 className="text-xl font-bold text-gray-900">
        {isEditing ? "Edit Bundle" : bundle.title}
      </h2>
      {!isEditing && getStatusBadge(bundle.approvalStatus, bundle.visibility)}
    </div>
  );

  const modalActions = !isEditing && isEditable && (
    <button
      onClick={() => setIsEditing(true)}
      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
    >
      <Edit2 className="w-4 h-4" />
      <span>Edit Bundle</span>
    </button>
  );

  return (
    <>
      <Modal onClose={onClose} title={modalTitle} actions={modalActions}>
        {isEditing ? (
          <BundleEditForm
            bundle={bundle}
            onSubmit={handleEditSave}
            onCancel={() => setIsEditing(false)}
            loading={loading}
            onSetError={onSetError}
          />
        ) : (
          <div className="space-y-6">
            {/* Description */}
            {bundle.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Description
                </h3>
                <p className="text-gray-700">{bundle.description}</p>
              </div>
            )}

            {/* Timestamps & Approval Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>
                  Created:{" "}
                  {new Date(bundle.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>
                  Updated:{" "}
                  {new Date(bundle.updatedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              {bundle.approvalStatus === "approved" && (
                <>
                  <div className="flex items-center space-x-2 text-sm text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      Approved by: {bundle.approvedBy?.username || "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      Approved on:{" "}
                      {new Date(bundle.approvedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Merch Items */}
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Merch Items ({bundle.merchItems.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bundle.merchItems.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {/* Large image */}
                    <div
                      className="relative cursor-pointer group"
                      onClick={() => setViewingImage(item.image)}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                      </div>
                    </div>
                    {/* Item details */}
                    <div className="p-3">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {item.name}
                        </h4>
                        <span className="text-lg font-bold text-blue-600">
                          ₹{item.price}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {item.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2">
                        {item.nick && (
                          <Badge variant="purple">
                            Nick (+₹{item.nickPrice})
                          </Badge>
                        )}
                        {item.sizes &&
                          item.sizes.length > 0 &&
                          item.sizes.map((size) => (
                            <span
                              key={size}
                              className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded"
                            >
                              {size}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Size Charts */}
            {bundle.sizeCharts && bundle.sizeCharts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Size Charts ({bundle.sizeCharts.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {bundle.sizeCharts.map((chart, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => setViewingImage(chart)}
                    >
                      <img
                        src={chart}
                        alt={`Size Chart ${index + 1}`}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Combos */}
            {bundle.combos && bundle.combos.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Combos ({bundle.combos.length})
                </h3>
                <div className="space-y-3">
                  {bundle.combos.map((combo, index) => (
                    <ComboCard key={index} combo={combo} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Editable hint for pending bundles */}
            {isEditable && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  This bundle is pending approval. You can still edit it using
                  the "Edit Bundle" button above.
                </p>
              </div>
            )}

            {/* Approved notice */}
            {bundle.approvalStatus === "approved" && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  This bundle has been approved and can no longer be edited.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Full-size image viewer */}
      {viewingImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60] cursor-pointer"
          onClick={() => setViewingImage(null)}
        >
          <img
            src={viewingImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
