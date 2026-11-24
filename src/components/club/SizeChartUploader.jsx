"use client";

import { useId, useState } from "react";
import { Upload, Loader2, X, Trash2 } from "lucide-react";
import { uploadSizeChart } from "@/lib/firebase";

export default function SizeChartUploader({ sizeCharts, onChange, onSetError }) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");

  const handleSelect = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      onSetError("Please select a valid image file");
      return;
    }
    try {
      setUploading(true);
      const url = await uploadSizeChart(file);
      setPreview(url);
    } catch (err) {
      onSetError(err.message || "Failed to upload size chart");
    } finally {
      setUploading(false);
    }
  };

  const addChart = () => {
    if (!preview) return;
    onChange([...sizeCharts, preview]);
    setPreview("");
  };

  const removeChart = (index) => {
    onChange(sizeCharts.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Size Charts</h3>

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="flex items-center space-x-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleSelect}
            className="hidden"
            id={inputId}
          />
          <label
            htmlFor={inputId}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            Upload Size Chart
          </label>
          {preview && (
            <button
              onClick={addChart}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add
            </button>
          )}
        </div>
        {preview && (
          <div className="mt-3 flex items-center space-x-2">
            <img src={preview} alt="Size Chart" className="w-28 h-28 object-contain bg-white rounded border" />
            <button
              onClick={() => setPreview("")}
              className="p-1 text-red-600 hover:bg-red-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {sizeCharts.length > 0 && (
        <div className="space-y-2">
          {sizeCharts.map((chart, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <img src={chart} alt="Size Chart" className="w-24 h-24 object-contain bg-white rounded border" />
              <button
                onClick={() => removeChart(index)}
                className="p-1 text-red-600 hover:bg-red-100 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
