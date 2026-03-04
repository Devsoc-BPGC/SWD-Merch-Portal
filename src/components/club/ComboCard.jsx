"use client";

import { Edit2, Trash2 } from "lucide-react";

export default function ComboCard({ combo, index, onEdit, onRemove }) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-medium">{combo.name}</p>
          <p className="text-sm text-gray-600">₹{combo.comboPrice}</p>
        </div>
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(index)}
              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onRemove && (
            <button
              onClick={() => onRemove(index)}
              className="p-1 text-red-600 hover:bg-red-100 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {combo.description && (
        <p className="text-sm text-gray-600">{combo.description}</p>
      )}
      <div className="mt-2 flex flex-wrap gap-1">
        {combo.items.map((item, i) => (
          <span
            key={i}
            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
