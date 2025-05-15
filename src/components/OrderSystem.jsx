import React, { useState } from "react";

const itemsList = [
  { id: 1, name: "Hamburger", price: 300 },
  { id: 2, name: "Chicken Nuggets", price: 300 },
  { id: 3, name: "Submarine Sandwich", price: 300 },
  { id: 4, name: "Pizza slices", price: 300 },
];

export default function OrderSystem() {
  const [customerName, setCustomerName] = useState("");
  const [selectedItems, setSelectedItems] = useState(
    itemsList.map((item) => ({ ...item, quantity: 0 }))
  );
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");

  // Calculate total price of current selection
  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Handle quantity change for an item
  const handleQuantityChange = (id, qty) => {
    if (qty < 0) qty = 0;
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Number(qty) } : item
      )
    );
  };

  // Add order
  const placeOrder = () => {
    if (!customerName.trim()) {
      alert("Please enter customer name.");
      return;
    }
    if (selectedItems.every((item) => item.quantity === 0)) {
      alert("Please select at least one item.");
      return;
    }

    const newOrder = {
      id: orders.length + 1,
      customerName: customerName.trim(),
      items: selectedItems.filter((item) => item.quantity > 0),
      totalAmount: selectedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      status: "Pending",
    };

    setOrders((prev) => [...prev, newOrder]);
    // Reset form
    setCustomerName("");
    setSelectedItems(itemsList.map((item) => ({ ...item, quantity: 0 })));
  };

  // Change order status to Delivered
  const deliverOrder = (id) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: "Delivered" } : order
      )
    );
  };

  // Cancel/delete order
  const cancelOrder = (id) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  // Filtered orders based on filter state
  const filteredOrders = orders.filter((order) => {
    if (filter === "All") return true;
    return order.status === filter;
  });

  // Summary counts
  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 flex-grow">
      {/* Create Order Section */}
      <div className="bg-cardbg rounded-lg p-6 h-[calc(100vh_-_130px)] flex flex-col">
        <h2 className="text-xl font-bold mb-1">CREATE ORDER</h2>
        <p className="text-gray-400 text-sm mb-4">
          Accurately fulfill customer orders based on a precise understanding
          of their requirements.
        </p>

        {/* Customer Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full bg-gray-700 bg-opacity-50 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
          />
        </div>

        {/* Choose Items */}
        <div className="mb-4 flex-grow overflow-auto">
          <label className="block text-sm font-medium mb-2">Choose Items</label>
          <div className="items-container max-h-[240px] overflow-auto">
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-700 bg-opacity-30 rounded-md p-3 mb-3 flex justify-between items-center hover:bg-opacity-40 transition-all duration-300"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 flex items-center justify-center mr-3">
                    {/* Images fallback */}
                    <img
                      src={`./assets/${item.name
                        .toLowerCase()
                        .replace(/ /g, "")}.svg`}
                      alt={item.name}
                      className="w-10 h-10"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/40";
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-xs text-gray-400">BDT {item.price}</p>
                  </div>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="w-8 h-8 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors duration-300 text-white"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={0}
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, Number(e.target.value))
                    }
                    className="w-12 text-center bg-gray-700 rounded-md p-1 focus:outline-none"
                  />
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors duration-300 text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={placeOrder}
          disabled={totalPrice === 0 || !customerName.trim()}
          className={`w-full ${
            totalPrice === 0 || !customerName.trim()
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-primary hover:bg-opacity-90"
          } text-white font-medium py-3 rounded-full transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1`}
        >
          Place Order (BDT {totalPrice})
        </button>
      </div>

      {/* Order Summary and Reports Section */}
      <div className="md:col-span-2 h-[calc(100vh_-_130px)] flex flex-col">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-cardbg rounded-lg p-4 relative overflow-hidden">
            <div className="text-5xl font-bold text-yellow-500 mb-2">
              {totalOrdersCount}
            </div>
            <div className="bg-yellow-800 bg-opacity-50 text-yellow-200 text-xs font-medium px-3 py-1 rounded-full inline-block">
              Total Orders
            </div>
          </div>

          <div className="bg-cardbg rounded-lg p-4 relative overflow-hidden">
            <div className="text-5xl font-bold text-red-500 mb-2">{pendingCount}</div>
            <div className="bg-red-800 bg-opacity-50 text-red-200 text-xs font-medium px-3 py-1 rounded-full inline-block">
              Pending
            </div>
          </div>

          <div className="bg-cardbg rounded-lg p-4 relative overflow-hidden">
            <div className="text-5xl font-bold text-green-500 mb-2">
              {deliveredCount}
            </div>
            <div className="bg-green-800 bg-opacity-50 text-green-200 text-xs font-medium px-3 py-1 rounded-full inline-block">
              Delivered
            </div>
          </div>
        </div>

        {/* Order Reports */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Order Reports</h2>
          <div className="flex gap-4 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-funnel-icon lucide-funnel"
            >
              <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
            </svg>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-zinc-900 accent-orange-600 border-none outline-none rounded-sm p-1"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-cardbg rounded-lg p-4 overflow-auto flex-grow">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left text-sm border-b border-gray-700">
                <th className="pb-3 font-medium px-2">ID</th>
                <th className="pb-3 font-medium px-2">Customer Name</th>
                <th className="pb-3 font-medium px-2">Items</th>
                <th className="pb-3 font-medium px-2">Amount</th>
                <th className="pb-3 font-medium px-2">Status</th>
                <th className="pb-3 font-medium px-2">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-400">
                    No orders to show.
                  </td>
                </tr>
              )}

              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-gray-700 hover:bg-gray-800 transition-colors"
                >
                  <td className="py-3 px-2">{order.id}</td>
                  <td className="py-3 px-2">{order.customerName}</td>
                  <td className="py-3 px-2">
                    {order.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                  </td>
                  <td className="py-3 px-2">BDT {order.totalAmount}</td>
                  <td className="py-3 px-2">
                    <span
                      className={
                        order.status === "Pending"
                          ? "text-red-500"
                          : "text-green-500"
                      }
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    {order.status === "Pending" ? (
                      <>
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="bg-gray-800 hover:bg-red-600 text-xs px-3 py-1 rounded-full mr-1 transition-colors duration-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => deliverOrder(order.id)}
                          className="bg-gray-800 hover:bg-green-600 text-xs px-3 py-1 rounded-full transition-colors duration-300"
                        >
                          Deliver
                        </button>
                      </>
                    ) : (
                      <span className="text-green-400 text-xs font-semibold">Delivered</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

