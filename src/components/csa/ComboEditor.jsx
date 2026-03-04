"use client";

import { X } from "lucide-react";

export default function ComboEditor({ combos, isEditing, onChange }) {
  const updateCombo = (index, field, value) => {
    const updated = combos.map((combo, i) =>
      i === index ? { ...combo, [field]: value } : combo
    );
    onChange(updated);
  };

  const removeCombo = (index) => {
    onChange(combos.filter((_, i) => i !== index));
  };

  if (!combos || combos.length === 0) return null;

  return (
    <div className="p-6 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Combos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {combos.map((combo, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={combo.name}
                  onChange={(e) => updateCombo(index, "name", e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Combo name"
                />
                <input
                  type="number"
                  value={combo.comboPrice}
                  onChange={(e) =>
                    updateCombo(index, "comboPrice", parseFloat(e.target.value))
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  step="0.01"
                  min="0"
                />
                <textarea
                  value={combo.description || ""}
                  onChange={(e) =>
                    updateCombo(index, "description", e.target.value)
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="2"
                  placeholder="Description"
                />
                <div className="flex flex-wrap gap-1">
                  {combo.items &&
                    combo.items.map((item, itemIndex) => (
                      <span
                        key={itemIndex}
                        className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {item}
                      </span>
                    ))}
                </div>
                <button
                  onClick={() => removeCombo(index)}
                  className="w-full px-2 py-1 text-red-600 hover:bg-red-100 rounded text-sm flex items-center justify-center"
                >
                  <X className="w-3 h-3 mr-1" />
                  Remove
                </button>
              </div>
            ) : (
              <>
                <h4 className="font-semibold text-gray-900 mb-2">{combo.name}</h4>
                <p className="text-lg font-bold text-green-600 mb-2">
                  ₹{combo.comboPrice}
                </p>
                {combo.description && (
                  <p className="text-sm text-gray-600 mb-3">{combo.description}</p>
                )}
                {combo.items && combo.items.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {combo.items.map((item, itemIndex) => (
                      <span
                        key={itemIndex}
                        className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
