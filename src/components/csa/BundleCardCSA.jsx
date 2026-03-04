"use client";

import { Clock, Building, Edit2, Eye, EyeOff } from "lucide-react";

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

export default function BundleCardCSA({ bundle, onViewDetails }) {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{bundle.title}</h3>
            {getStatusBadge(bundle.approvalStatus, bundle.visibility)}
            {bundle.hasBeenEdited && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                <Edit2 className="w-3 h-3 mr-1" />
                Edited
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <Building className="w-4 h-4" />
              <span>{bundle.club?.clubName}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Created {new Date(bundle.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {bundle.description && (
            <p className="text-gray-600 text-sm line-clamp-2">{bundle.description}</p>
          )}
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onViewDetails(bundle)}
            className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
