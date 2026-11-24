"use client";

import { useId, useState } from "react";
import { Upload, Loader2, Trash2 } from "lucide-react";
import { uploadSizeChart } from "@/lib/firebase";

export default function SizeChartUploader({ sizeCharts = [], onChange, onSetError }) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const charts = Array.isArray(sizeCharts) ? sizeCharts.filter(Boolean) : [];

  const handleSelect = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      onSetError("Please select a valid image file");
      return;
    }
    try {
      setUploading(true);
      const url = await uploadSizeChart(file);
      // Add immediately — no separate "Add" step that was easy to miss on Save
      onChange([...charts, url]);
    } catch (err) {
      onSetError(err.message || "Failed to upload size chart");
    } finally {
      setUploading(false);
    }
  };

  const removeChart = (index) => {
    onChange(charts.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">
        Size Charts {charts.length > 0 ? `(${charts.length})` : ""}
      </h3>

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="flex items-center space-x-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleSelect}
            className="hidden"
            id={inputId}
            disabled={uploading}
          />
          <label
            htmlFor={inputId}
            className={`flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer ${
              uploading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            {uploading ? "Uploading..." : "Upload Size Chart"}
          </label>
          <span className="text-sm text-gray-500">
            Image is added to the bundle as soon as upload finishes
          </span>
        </div>
      </div>

      {charts.length > 0 ? (
        <div className="space-y-2">
          {charts.map((chart, index) => (
            <div
              key={`${chart}-${index}`}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <img
                src={chart}
                alt={`Size Chart ${index + 1}`}
                className="w-24 h-24 object-contain bg-white rounded border"
              />
              <button
                type="button"
                onClick={() => removeChart(index)}
                className="p-1 text-red-600 hover:bg-red-100 rounded"
                aria-label={`Remove size chart ${index + 1}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No size charts added yet.</p>
      )}
    </div>
  );
}
