"use client";

import { useState, useEffect, useCallback } from "react";
import { Award } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import api from "@/lib/api";
import CreateBundleForm from "@/components/club/CreateBundleForm";
import BundleList from "@/components/club/BundleList";
import BundleDetailModal from "@/components/club/BundleDetailModal";
import OrdersModal from "@/components/club/OrdersModal";

export default function ClubPortalPage() {
  const { user, logout } = useAuth();

  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Orders modal
  const [ordersModalBundleId, setOrdersModalBundleId] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [bundleOrderCounts, setBundleOrderCounts] = useState({});

  // Detail / Edit modal
  const [selectedBundle, setSelectedBundle] = useState(null);

  // Fetch bundles
  const fetchBundles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/merch/club/bundles");
      const fetched = res.data.data.bundles;
      setBundles(fetched);
      // Fetch order counts
      fetchBundleOrderCounts(fetched);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bundles");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBundleOrderCounts = async (list) => {
    const counts = {};
    for (const b of list) {
      try {
        const res = await api.get(`/api/orders/club/bundles/${b._id}/orders`);
        counts[b._id] = res.data.data.orders.length;
      } catch {
        counts[b._id] = 0;
      }
    }
    setBundleOrderCounts(counts);
  };

  // Create bundle
  const handleCreateBundle = async (formData) => {
    try {
      setLoading(true);
      const res = await api.post("/api/merch/club/bundles", formData);
      setSuccess("Bundle created successfully!");
      const newBundle = res.data.data.bundle;
      setBundles((prev) => [newBundle, ...prev]);
      setBundleOrderCounts((prev) => ({ ...prev, [newBundle._id]: 0 }));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create bundle");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // View orders
  const handleViewOrders = (bundleId) => {
    setOrdersModalBundleId(bundleId);
  };

  // View bundle details
  const handleViewDetails = (bundle) => {
    setSelectedBundle(bundle);
  };

  // Edit bundle (opens detail modal in edit mode — same entry point)
  const handleEditBundle = (bundle) => {
    if (bundle.approvalStatus === "approved") return;
    setSelectedBundle(bundle);
  };

  // Update bundle via PUT
  const handleUpdateBundle = async (bundleId, formData) => {
    try {
      const res = await api.put(
        `/api/merch/club/bundles/${bundleId}`,
        formData
      );
      const updatedBundle = res.data.data.bundle;
      setBundles((prev) =>
        prev.map((b) => (b._id === bundleId ? updatedBundle : b))
      );
      setSelectedBundle(updatedBundle);
      setSuccess("Bundle updated successfully!");
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update bundle");
      return false;
    }
  };

  // Clear messages after 5s
  useEffect(() => {
    fetchBundles();
  }, [fetchBundles]);

  useEffect(() => {
    if (!error && !success) return;
    const timer = setTimeout(() => {
      setError("");
      setSuccess("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [error, success]);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <span className="font-medium">Logout</span>
                </button>
                <div className="h-6 w-px bg-gray-300" />
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      Club Coordinator Portal
                    </h1>
                    <p className="text-sm text-gray-500">
                      {user?.clubName || user?.username}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600">{success}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create Bundle Form */}
            <CreateBundleForm
              onSubmit={handleCreateBundle}
              loading={loading}
              onSetError={setError}
            />

            {/* Existing Bundles */}
            <BundleList
              bundles={bundles}
              loading={loading}
              bundleOrderCounts={bundleOrderCounts}
              onViewOrders={handleViewOrders}
              onViewDetails={handleViewDetails}
              onEdit={handleEditBundle}
              ordersLoading={ordersLoading}
            />
          </div>
        </div>

        {/* Bundle Detail / Edit Modal */}
        {selectedBundle && (
          <BundleDetailModal
            bundle={selectedBundle}
            onClose={() => setSelectedBundle(null)}
            onBundleUpdated={handleUpdateBundle}
            onSetError={setError}
          />
        )}

        {/* Orders Modal */}
        {ordersModalBundleId && (
          <OrdersModal
            bundleId={ordersModalBundleId}
            allBundles={bundles}
            onClose={() => setOrdersModalBundleId(null)}
          />
        )}
      </div>

      <footer className="w-full border-t border-gray-200 bg-gray-50 px-4 py-3 text-center text-sm text-gray-600">
        Made with ❤️ from
        <span className="font-bold text-[#3aa6a1]"> Dev</span>
        <span className="font-bold text-[#24353f]">Soc</span>
      </footer>
    </>
  );
}
