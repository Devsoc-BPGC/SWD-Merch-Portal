"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import MerchItemForm from "./MerchItemForm";
import MerchItemCard from "./MerchItemCard";
import SizeChartUploader from "./SizeChartUploader";
import ComboForm from "./ComboForm";
import ComboCard from "./ComboCard";

export default function BundleEditForm({
  bundle,
  onSubmit,
  onCancel,
  loading,
  onSetError,
}) {
  const [form, setForm] = useState({
    title: bundle.title || "",
    description: bundle.description || "",
    merchItems: bundle.merchItems ? [...bundle.merchItems] : [],
    sizeCharts: bundle.sizeCharts ? [...bundle.sizeCharts] : [],
    combos: bundle.combos ? [...bundle.combos] : [],
  });
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [editingComboIndex, setEditingComboIndex] = useState(null);

  const addOrUpdateMerchItem = (item) => {
    if (editingItemIndex !== null) {
      const updated = [...form.merchItems];
      updated[editingItemIndex] = item;
      setForm((prev) => ({ ...prev, merchItems: updated }));
      setEditingItemIndex(null);
    } else {
      setForm((prev) => ({
        ...prev,
        merchItems: [...prev.merchItems, item],
      }));
    }
  };

  const removeMerchItem = (index) => {
    setForm((prev) => ({
      ...prev,
      merchItems: prev.merchItems.filter((_, i) => i !== index),
    }));
    // If the removed item is being edited, cancel the edit
    if (editingItemIndex === index) {
      setEditingItemIndex(null);
    } else if (editingItemIndex !== null && editingItemIndex > index) {
      // Adjust index if a preceding item was removed
      setEditingItemIndex(editingItemIndex - 1);
    }
  };

  const editMerchItem = (index) => {
    setEditingItemIndex(index);
  };

  const addOrUpdateCombo = (combo) => {
    if (editingComboIndex !== null) {
      const updated = [...form.combos];
      updated[editingComboIndex] = combo;
      setForm((prev) => ({ ...prev, combos: updated }));
      setEditingComboIndex(null);
    } else {
      setForm((prev) => ({ ...prev, combos: [...prev.combos, combo] }));
    }
  };

  const removeCombo = (index) => {
    setForm((prev) => ({
      ...prev,
      combos: prev.combos.filter((_, i) => i !== index),
    }));
    if (editingComboIndex === index) {
      setEditingComboIndex(null);
    } else if (editingComboIndex !== null && editingComboIndex > index) {
      setEditingComboIndex(editingComboIndex - 1);
    }
  };

  const editCombo = (index) => {
    setEditingComboIndex(index);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      onSetError("Bundle title is required");
      return;
    }
    if (form.merchItems.length === 0) {
      onSetError("At least one merch item is required");
      return;
    }
    await onSubmit(form);
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bundle Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Summer Collection 2024"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Describe your merch bundle..."
          />
        </div>
      </div>

      {/* Merch Items */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Merch Items *</h3>
        <MerchItemForm
          key={editingItemIndex}
          onAdd={addOrUpdateMerchItem}
          editingItem={
            editingItemIndex !== null
              ? form.merchItems[editingItemIndex]
              : null
          }
          onSetError={onSetError}
        />
        {form.merchItems.length > 0 && (
          <div className="space-y-2">
            {form.merchItems.map((item, index) => (
              <MerchItemCard
                key={index}
                item={item}
                index={index}
                onEdit={editMerchItem}
                onRemove={removeMerchItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Size Charts */}
      <SizeChartUploader
        sizeCharts={form.sizeCharts}
        onChange={(charts) =>
          setForm((prev) => ({ ...prev, sizeCharts: charts }))
        }
        onSetError={onSetError}
      />

      {/* Combos */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Combos (Optional)</h3>
        <ComboForm
          key={editingComboIndex}
          merchItems={form.merchItems}
          onAdd={addOrUpdateCombo}
          editingCombo={
            editingComboIndex !== null
              ? form.combos[editingComboIndex]
              : null
          }
          onSetError={onSetError}
        />
        {form.combos.length > 0 && (
          <div className="space-y-2">
            {form.combos.map((combo, index) => (
              <ComboCard
                key={index}
                combo={combo}
                index={index}
                onEdit={editCombo}
                onRemove={removeCombo}
              />
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleSubmit}
          disabled={loading || form.merchItems.length === 0}
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Saving Changes...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
