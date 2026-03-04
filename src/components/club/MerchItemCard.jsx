"use client";

import { Edit2, Trash2 } from "lucide-react";
import Badge from "@/components/ui/Badge";

export default function MerchItemCard({ item, index, onEdit, onRemove }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <img
          src={item.image}
          alt={item.name}
          className="w-10 h-10 object-cover rounded"
        />
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-gray-600">₹{item.price}</p>
          <div className="flex items-center space-x-2 mt-1">
            {item.nick && (
              <Badge variant="purple">Nick (+₹{item.nickPrice})</Badge>
            )}
            {item.sizes && item.sizes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.sizes.map((size) => (
                  <span
                    key={size}
                    className="px-1 py-0.5 text-xs bg-blue-100 text-blue-800 rounded"
                  >
                    {size}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
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
  );
}
