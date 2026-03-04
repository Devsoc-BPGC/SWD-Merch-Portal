"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import OrdersTable from "./OrdersTable";
import api from "@/lib/api";

function escapeCSV(value) {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes("\n") || str.includes("\r") || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export default function OrdersModal({ bundleId, allBundles, onClose }) {
  const [orders, setOrders] = useState([]);
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/api/orders/club/bundles/${bundleId}/orders`);
        setOrders(res.data.data.orders);
        setBundle(res.data.data.bundle);
      } catch (err) {
        console.error("Failed to fetch orders", err);
        setError(err.userMessage || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [bundleId]);

  const downloadCSV = () => {
    if (!orders.length || !bundle) return;

    const merchItems =
      bundle.merchItems ||
      allBundles.find((b) => b._id === bundle._id)?.merchItems ||
      [];
    const merchHeaders = merchItems.map((item) => item.name);
    const headers = [
      "Student Email",
      "Student Name",
      ...merchHeaders,
      "Combos",
      "Total Price",
      "Order Date",
    ];

    const csvContent = [
      headers.map((h) => escapeCSV(h)).join(","),
      ...orders.map((order) => {
        const merchData = merchItems.map((merchItem) => {
          const orderItem = order.items.find((i) => i.merchName === merchItem.name);
          if (orderItem) {
            return escapeCSV(
              `${orderItem.quantity}x ${orderItem.size} - Rs${orderItem.price}${
                orderItem.nick ? ` (${orderItem.nick})` : ""
              }`
            );
          }
          if (order.combos) {
            for (const combo of order.combos) {
              const ci = combo.items?.find((i) => i.itemName === merchItem.name);
              if (ci) {
                const itemPrice = Math.round(combo.price / combo.items.length);
                return escapeCSV(
                  `${combo.quantity}x ${ci.size} - Rs${itemPrice}${
                    ci.hasNick && ci.nick ? ` (${ci.nick})` : ""
                  } [Combo: ${combo.comboName}]`
                );
              }
            }
          }
          return escapeCSV("-");
        });
        const comboInfo =
          order.combos && order.combos.length > 0
            ? order.combos
                .map((c) => `${c.comboName || c.name} (x${c.quantity}) - Rs${c.price}`)
                .join("; ")
            : "No combos";
        return [
          escapeCSV(order.studentEmail || order.studentBITSID || ""),
          escapeCSV(order.studentName || ""),
          ...merchData,
          escapeCSV(comboInfo),
          escapeCSV(order.totalPrice),
          escapeCSV(new Date(order.createdAt).toLocaleString()),
        ].join(",");
      }),
    ].join("\n");

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${bundle?.title || "bundle"}_orders.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      onClose={onClose}
      title={
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Orders for {bundle?.title || "..."}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {orders.length} order{orders.length !== 1 ? "s" : ""} found
          </p>
        </div>
      }
      actions={
        <button
          onClick={downloadCSV}
          disabled={!orders.length}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Download CSV
        </button>
      }
    >
      {loading ? (
        <Spinner className="w-8 h-8" />
      ) : error ? (
        <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      ) : (
        <OrdersTable orders={orders} bundle={bundle} allBundles={allBundles} />
      )}
    </Modal>
  );
}
