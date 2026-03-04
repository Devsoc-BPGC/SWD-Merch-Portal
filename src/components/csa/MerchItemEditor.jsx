"use client";

import { X } from "lucide-react";

export default function MerchItemEditor({ items, isEditing, onChange }) {
  const updateItem = (index, field, value) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="p-6 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Merch Items</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
            <div className="aspect-square mb-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x300?text=Image+Not+Found";
                }}
              />
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(index, "name", e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) =>
                    updateItem(index, "price", parseFloat(e.target.value))
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  step="0.01"
                  min="0"
                />
                <textarea
                  value={item.description || ""}
                  onChange={(e) =>
                    updateItem(index, "description", e.target.value)
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="2"
                  placeholder="Description"
                />
                <button
                  onClick={() => removeItem(index)}
                  className="w-full px-2 py-1 text-red-600 hover:bg-red-100 rounded text-sm flex items-center justify-center"
                >
                  <X className="w-3 h-3 mr-1" />
                  Remove
                </button>
              </div>
            ) : (
              <>
                <h4 className="font-semibold text-gray-900 mb-2">{item.name}</h4>
                <p className="text-lg font-bold text-green-600 mb-2">
                  \u20b9{item.price}
                </p>
                {item.nick && (
                  <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full mb-2">
                    Nick Option
                  </span>
                )}
                {item.description && (
                  <p className="text-sm text-gray-600">{item.description}</p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
