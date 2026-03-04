"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, LogOut, AlertCircle, CheckCircle } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import api from "@/lib/api";
import BundleSearchBar from "@/components/csa/BundleSearchBar";
import BundleListCSA from "@/components/csa/BundleListCSA";
import BundleDetailModal from "@/components/csa/BundleDetailModal";

export default function CSAPortalPage() {
  const { user, logout } = useAuth();

  // Data state
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Filter / search state
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Detail modal state
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [showBundleDetails, setShowBundleDetails] = useState(false);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editingBundle, setEditingBundle] = useState(null);

  // Action state
  const [approving, setApproving] = useState(false);
  const [togglingVisibility, setTogglingVisibility] = useState(false);
  const [saving, setSaving] = useState(false);

  // ---------- API helpers ----------

  const fetchBundles = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = statusFilter !== "all" ? { status: statusFilter } : {};
      const res = await api.get("/api/merch/csa/bundles", { params });
      setBundles(res.data.bundles || res.data);
    } catch (err) {
      setError(err.userMessage || "Failed to fetch bundles");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const approveBundle = async (bundleId, visibility) => {
    try {
      setApproving(true);
      setError("");
      await api.put(`/api/merch/csa/bundles/${bundleId}/approve`, { visibility });
      setSuccess("Bundle approved successfully");
      await fetchBundles();
      // Update selected bundle in modal
      if (selectedBundle?._id === bundleId) {
        const res = await api.get("/api/merch/csa/bundles");
        const all = res.data.bundles || res.data;
        const updated = all.find((b) => b._id === bundleId);
        if (updated) setSelectedBundle(updated);
      }
    } catch (err) {
      setError(err.userMessage || "Failed to approve bundle");
    } finally {
      setApproving(false);
    }
  };

  const toggleBundleVisibility = async (bundleId) => {
    try {
      setTogglingVisibility(true);
      setError("");
      await api.put(`/api/merch/csa/bundles/${bundleId}/visibility`);
      setSuccess("Bundle visibility updated");
      await fetchBundles();
      if (selectedBundle?._id === bundleId) {
        const res = await api.get("/api/merch/csa/bundles");
        const all = res.data.bundles || res.data;
        const updated = all.find((b) => b._id === bundleId);
        if (updated) setSelectedBundle(updated);
      }
    } catch (err) {
      setError(err.userMessage || "Failed to toggle visibility");
    } finally {
      setTogglingVisibility(false);
    }
  };

  const saveEditedBundle = async () => {
    if (!editingBundle) return;
    try {
      setSaving(true);
      setError("");
      await api.put(`/api/merch/csa/bundles/${selectedBundle._id}`, {
        merchItems: editingBundle.merchItems,
        combos: editingBundle.combos,
      });
      setSuccess("Bundle updated successfully");
      setIsEditing(false);
      setEditingBundle(null);
      await fetchBundles();
      // Refresh selected bundle
      const res = await api.get("/api/merch/csa/bundles");
      const all = res.data.bundles || res.data;
      const updated = all.find((b) => b._id === selectedBundle._id);
      if (updated) setSelectedBundle(updated);
    } catch (err) {
      setError(err.userMessage || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const saveChangesToApprovedBundle = async () => {
    if (!selectedBundle) return;
    try {
      setSaving(true);
      setError("");
      await api.put(`/api/merch/csa/bundles/${selectedBundle._id}`, {
        merchItems: selectedBundle.merchItems,
        combos: selectedBundle.combos,
      });
      setSuccess("Changes saved successfully");
      await fetchBundles();
      const res = await api.get("/api/merch/csa/bundles");
      const all = res.data.bundles || res.data;
      const updated = all.find((b) => b._id === selectedBundle._id);
      if (updated) setSelectedBundle(updated);
    } catch (err) {
      setError(err.userMessage || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // ---------- Editing helpers ----------

  const startEditing = () => {
    setEditingBundle(JSON.parse(JSON.stringify(selectedBundle)));
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingBundle(null);
  };

  // ---------- Filtered bundles ----------

  const filteredBundles = bundles.filter((bundle) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      bundle.title?.toLowerCase().includes(term) ||
      bundle.club?.clubName?.toLowerCase().includes(term)
    );
  });

  // ---------- Effects ----------

  useEffect(() => {
    fetchBundles();
  }, [fetchBundles]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // ---------- Modal handlers ----------

  const viewBundleDetails = (bundle) => {
    setSelectedBundle(bundle);
    setShowBundleDetails(true);
    setIsEditing(false);
    setEditingBundle(null);
  };

  const closeBundleDetails = () => {
    setShowBundleDetails(false);
    setSelectedBundle(null);
    setIsEditing(false);
    setEditingBundle(null);
  };

  // ---------- Render ----------

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CSA Portal</h1>
                <p className="text-sm text-gray-500">Merch Bundle Approvals</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.username || user?.email}
              </span>
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 flex items-center p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 flex items-center p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            {success}
          </div>
        )}

        {/* Search & Filter */}
        <BundleSearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          onRefresh={fetchBundles}
          loading={loading}
        />

        {/* Bundles List */}
        <BundleListCSA
          bundles={filteredBundles}
          loading={loading}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onViewDetails={viewBundleDetails}
        />
      </main>

      {/* Detail Modal */}
      {showBundleDetails && selectedBundle && (
        <BundleDetailModal
          bundle={selectedBundle}
          editingBundle={editingBundle}
          isEditing={isEditing}
          approving={approving}
          togglingVisibility={togglingVisibility}
          saving={saving}
          onClose={closeBundleDetails}
          onStartEditing={startEditing}
          onCancelEditing={cancelEditing}
          onSaveEditing={saveEditedBundle}
          onMerchItemsChange={(items) =>
            setEditingBundle((prev) => ({ ...prev, merchItems: items }))
          }
          onCombosChange={(combos) =>
            setEditingBundle((prev) => ({ ...prev, combos }))
          }
          onApproveVisible={() => approveBundle(selectedBundle._id, true)}
          onApproveHidden={() => approveBundle(selectedBundle._id, false)}
          onToggleVisibility={() => toggleBundleVisibility(selectedBundle._id)}
          onSaveChanges={saveChangesToApprovedBundle}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            SWD Merch Portal — CSA Administration
          </p>
        </div>
      </footer>
    </div>
  );
}
