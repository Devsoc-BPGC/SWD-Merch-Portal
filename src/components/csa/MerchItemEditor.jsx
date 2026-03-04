"use client";

export default function MerchItemEditor({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="p-6 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Merch Items</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
            <div className="aspect-square mb-3">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm font-medium"
                style={{ display: item.image ? 'none' : 'flex' }}
              >
                Image Not Found
              </div>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">{item.name}</h4>
            <p className="text-lg font-bold text-green-600 mb-2">
              ₹{item.price}
            </p>
            {item.nick && (
              <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full mb-2">
                Nick Option (+₹{item.nickPrice})
              </span>
            )}
            {item.sizes && item.sizes.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {item.sizes.map((size) => (
                  <span key={size} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                    {size}
                  </span>
                ))}
              </div>
            )}
            {item.description && (
              <p className="text-sm text-gray-600">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
