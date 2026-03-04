"use client";

import { useState } from "react";

export default function ComboForm({ merchItems = [], onAdd, editingCombo, onSetError }) {
  const [form, setForm] = useState(
    editingCombo
      ? {
          name: editingCombo.name,
          items: [...editingCombo.items],
          comboPrice: editingCombo.comboPrice.toString(),
          description: editingCombo.description || "",
        }
      : { name: "", items: [], comboPrice: "", description: "" }
  );

  const toggleItem = (itemName) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.includes(itemName)
        ? prev.items.filter((n) => n !== itemName)
        : [...prev.items, itemName],
    }));
  };

  const handleAdd = () => {
    if (!form.name.trim() || !form.comboPrice || form.items.length === 0) {
      onSetError("Combo name, price, and at least one item are required");
      return;
    }
    onAdd({ ...form, comboPrice: parseFloat(form.comboPrice) });
    setForm({ name: "", items: [], comboPrice: "", description: "" });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h4 className="font-medium mb-3">
        {editingCombo ? "Edit Combo" : "Add New Combo"}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Combo Name *"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Combo Price *"
          value={form.comboPrice}
          onChange={(e) => setForm((prev) => ({ ...prev, comboPrice: e.target.value }))}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          step="0.01"
          min="0"
        />
      </div>
      <textarea
        placeholder="Combo Description"
        value={form.description}
        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="2"
      />

      {/* Select Items */}
      {merchItems.length > 0 && (
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Items *</label>
          <div className="flex flex-wrap gap-2">
            {merchItems.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleItem(item.name)}
                className={`px-3 py-1 rounded-full text-sm ${
                  form.items.includes(item.name)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleAdd}
        className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        {editingCombo ? "Update Combo" : "Add Combo"}
      </button>
    </div>
  );
}
