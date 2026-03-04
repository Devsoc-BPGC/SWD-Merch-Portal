"use client";

export default function ComboEditor({ combos }) {
  if (!combos || combos.length === 0) return null;

  return (
    <div className="p-6 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Combos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {combos.map((combo, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
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
          </div>
        ))}
      </div>
    </div>
  );
}
