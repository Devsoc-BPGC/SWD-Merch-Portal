"use client";

export default function OrdersTable({ orders, bundle, allBundles = [] }) {
  const merchItems =
    bundle?.merchItems ||
    allBundles.find((b) => b._id === bundle?._id)?.merchItems ||
    [];

  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No orders found for this bundle.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Student Email
            </th>
            {merchItems.map((m, i) => (
              <th
                key={i}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {m.name}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Combos
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {/* Summary Row */}
          <tr className="bg-blue-50 border-b-2 border-blue-200">
            <td className="px-6 py-3">
              <div className="text-sm font-bold text-blue-900">TOTAL ORDERS</div>
              <div className="text-xs text-blue-600">{orders.length} students</div>
            </td>
            {merchItems.map((merchItem, index) => {
              const totalQuantity = orders.reduce((sum, order) => {
                const oi = order.items.find((i) => i.merchName === merchItem.name);
                let qty = oi ? oi.quantity : 0;
                if (order.combos) {
                  for (const c of order.combos) {
                    if (c.items?.find((ci) => ci.itemName === merchItem.name)) {
                      qty += c.quantity;
                      break;
                    }
                  }
                }
                return sum + qty;
              }, 0);
              const totalRevenue = orders.reduce((sum, order) => {
                const oi = order.items.find((i) => i.merchName === merchItem.name);
                let rev = oi ? oi.quantity * oi.price : 0;
                if (order.combos) {
                  for (const c of order.combos) {
                    if (c.items?.find((ci) => ci.itemName === merchItem.name)) {
                      rev += c.quantity * Math.round(c.price / c.items.length);
                      break;
                    }
                  }
                }
                return sum + rev;
              }, 0);
              return (
                <td key={index} className="px-6 py-3">
                  <div className="text-sm font-bold text-blue-900">
                    {totalQuantity > 0 ? `${totalQuantity} items` : "0 items"}
                  </div>
                  <div className="text-xs text-blue-600">
                    {totalRevenue > 0 ? `\u20b9${totalRevenue}` : "\u20b90"}
                  </div>
                </td>
              );
            })}
            <td className="px-6 py-3">
              <div className="text-sm font-bold text-blue-900">
                {orders.reduce((s, o) => s + (o.combos ? o.combos.length : 0), 0)} combos
              </div>
            </td>
            <td className="px-6 py-3">
              <div className="text-sm font-bold text-blue-900">
                \u20b9{orders.reduce((s, o) => s + o.totalPrice, 0)}
              </div>
            </td>
            <td className="px-6 py-3">
              <div className="text-xs text-blue-600">Summary</div>
            </td>
          </tr>

          {/* Individual Rows */}
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  <div className="font-medium">{order.studentEmail}</div>
                  <div className="text-gray-500 text-xs">{order.studentName}</div>
                </div>
              </td>
              {merchItems.map((merchItem, idx) => {
                let orderItem = order.items.find((i) => i.merchName === merchItem.name);
                if (!orderItem && order.combos) {
                  for (const combo of order.combos) {
                    const ci = combo.items?.find((i) => i.itemName === merchItem.name);
                    if (ci) {
                      orderItem = {
                        quantity: combo.quantity,
                        size: ci.size,
                        price: Math.round(combo.price / combo.items.length),
                        nick: ci.hasNick ? ci.nick : null,
                        isFromCombo: true,
                        comboName: combo.comboName,
                      };
                      break;
                    }
                  }
                }
                return (
                  <td key={idx} className="px-6 py-4">
                    {orderItem ? (
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">
                          {orderItem.quantity}x {orderItem.size}
                          {orderItem.isFromCombo && (
                            <span className="ml-2 px-1 py-0.5 bg-blue-100 text-blue-600 text-xs rounded">
                              Combo
                            </span>
                          )}
                        </div>
                        <div className="text-gray-500 text-xs">\u20b9{orderItem.price}</div>
                        {orderItem.nick && (
                          <div className="mt-1">
                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                              {orderItem.nick}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">-</div>
                    )}
                  </td>
                );
              })}
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {order.combos && order.combos.length > 0 ? (
                    <div className="space-y-1">
                      {order.combos.map((combo, ci) => (
                        <div key={ci} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {combo.comboName} (x{combo.quantity}) - \u20b9{combo.price}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500 text-xs">No combos</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-gray-900">\u20b9{order.totalPrice}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
