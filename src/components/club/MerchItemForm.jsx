"use client";

import { useState } from "react";
import { Upload, Loader2, X } from "lucide-react";
import { uploadMerchImage } from "@/lib/firebase";

const SIZE_OPTIONS = [
  "3XS", "2XS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL",
];

export default function MerchItemForm({ onAdd, editingItem, onSetError }) {
  const [form, setForm] = useState(
    editingItem
      ? {
          name: editingItem.name,
          price: editingItem.price.toString(),
          description: editingItem.description || "",
          image: editingItem.image,
          nick: editingItem.nick || false,
          nickPrice: editingItem.nickPrice ? editingItem.nickPrice.toString() : "",
          sizes: editingItem.sizes || [],
        }
      : { name: "", price: "", description: "", image: "", nick: false, nickPrice: "", sizes: [] }
  );
  const [uploading, setUploading] = useState(false);

  const toggleSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      onSetError("Please select a valid image file");
      return;
    }
    try {
      setUploading(true);
      const url = await uploadMerchImage(file);
      setForm((prev) => ({ ...prev, image: url }));
    } catch (err) {
      onSetError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = () => {
    if (!form.name.trim() || !form.price || !form.image) {
      onSetError("Name, price, and image are required for merch items");
      return;
    }
    if (form.sizes.length === 0) {
      onSetError("Please select at least one size for the merch item");
      return;
    }
    if (form.nick && !form.nickPrice) {
      onSetError("Please provide the additional price for the nick option");
      return;
    }

    onAdd({
      ...form,
      price: parseFloat(form.price),
      nickPrice: form.nick ? parseFloat(form.nickPrice) : undefined,
    });

    setForm({ name: "", price: "", description: "", image: "", nick: false, nickPrice: "", sizes: [] });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h4 className="font-medium mb-3">
        {editingItem ? "Edit Item" : "Add New Item"}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Item Name *"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Price *"
          value={form.price}
          onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          step="0.01"
          min="0"
        />
      </div>
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="2"
      />

      {/* Nick Option */}
      <div className="mt-3 flex items-center space-x-3">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.nick}
            onChange={(e) => setForm((prev) => ({ ...prev, nick: e.target.checked }))}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Nick Option</span>
        </label>
        <span className="text-xs text-gray-500">Enable if this item has a nick option</span>
      </div>

      {form.nick && (
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nick Price (Additional Cost) *
          </label>
          <input
            type="number"
            placeholder="Additional price for nick"
            value={form.nickPrice}
            onChange={(e) => setForm((prev) => ({ ...prev, nickPrice: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            step="0.01"
            min="0"
          />
        </div>
      )}

      {/* Size Selection */}
      <div className="mt-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Available Sizes *
        </label>
        <div className="grid grid-cols-4 gap-2">
          {SIZE_OPTIONS.map((size) => (
            <label key={size} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.sizes.includes(size)}
                onChange={() => toggleSize(size)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{size}</span>
            </label>
          ))}
        </div>
        {form.sizes.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="text-xs text-gray-500">Selected:</span>
            {form.sizes.map((size) => (
              <span key={size} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {size}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Image Upload */}
      <div className="mt-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Item Image *</label>
        <div className="flex items-center space-x-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            id="merch-image-upload"
          />
          <label
            htmlFor="merch-image-upload"
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            Upload Image
          </label>
          {form.image && (
            <div className="flex items-center space-x-2">
              <img src={form.image} alt="Preview" className="w-12 h-12 object-cover rounded" />
              <button
                onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                className="p-1 text-red-600 hover:bg-red-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={uploading}
        className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {editingItem ? "Update Item" : "Add Item"}
      </button>
    </div>
  );
}
