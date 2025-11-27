import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";

export default function ChannelOrdersList({ orders = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannel, setSelectedChannel] = useState(null);

  // Get unique channels from orders
  const availableChannels = useMemo(() => {
    const channels = new Set();
    orders.forEach((order) => {
      const channelName = order.channel_name || order.marketplace_account_id || "Unknown";
      const channelId = order.marketplace_account_id || order.u_channel_id || "";
      channels.add(JSON.stringify({ name: channelName, id: channelId }));
    });
    return Array.from(channels).map((ch) => JSON.parse(ch));
  }, [orders]);

  // Set default channel if available
  React.useEffect(() => {
    if (availableChannels.length > 0 && !selectedChannel) {
      setSelectedChannel(availableChannels[0]);
    }
  }, [availableChannels, selectedChannel]);

  // Filter orders based on search query and selected channel
  const filteredOrders = orders.filter((order) => {
    // Filter by channel
    if (selectedChannel) {
      const orderChannelId = order.marketplace_account_id || "";
      const orderChannelName = order.channel_name || "";
      if (
        selectedChannel.id !== orderChannelId &&
        selectedChannel.name !== orderChannelName
      ) {
        return false;
      }
    }

    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const orderId = order.order_id?.toLowerCase() || "";
      const orderName = order.order_name?.toLowerCase() || "";
      return orderId.includes(searchLower) || orderName.includes(searchLower);
    }

    return true;
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      // Handle Unix timestamp (milliseconds or seconds)
      const timestamp = typeof dateString === "string" ? parseInt(dateString) : dateString;
      const date = timestamp < 10000000000 ? new Date(timestamp * 1000) : new Date(timestamp);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch (e) {
      return "N/A";
    }
  };

  // Format fulfillment type
  const formatFulfillmentType = (fulfillmentType) => {
    if (!fulfillmentType) return "N/A";
    return fulfillmentType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Format status
  const formatStatus = (status) => {
    if (!status) return "N/A";
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("hold")) {
      return { bg: "#F3F4F6", text: "#374151" };
    } else if (statusLower.includes("complete") || statusLower.includes("fulfilled")) {
      return { bg: "#D1FADF", text: "#027A48" };
    } else if (statusLower.includes("pending")) {
      return { bg: "#FEF3C7", text: "#B45309" };
    }
    return { bg: "#E5E7EB", text: "#374151" };
  };

  // Check if order has error
  const hasError = (order) => {
    return (
      order.packages?.error_message ||
      order.error_message ||
      false
    );
  };

  // Copy order ID to clipboard
  const copyOrderId = (orderId) => {
    navigator.clipboard.writeText(orderId).then(() => {
      // You could show a toast notification here
      console.log("Order ID copied:", orderId);
    });
  };

  // Format price
  const formatPrice = (price, currency = "USD") => {
    if (!price) return "0.00";
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return numPrice.toFixed(2);
  };

  return (
    <div style={{ padding: "24px", backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
      {/* Main Content Card */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          padding: "24px",
        }}
      >
        {/* Header Section */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
            <div>
              <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>
                Channel Orders
              </h1>
              <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
                Orders imported from channels are available in this section.
              </p>
            </div>
            
            {/* Channel Selector */}
            {availableChannels.length > 0 && (
              <div style={{ position: "relative" }}>
                <select
                  value={selectedChannel ? JSON.stringify(selectedChannel) : ""}
                  onChange={(e) => {
                    if (e.target.value) {
                      setSelectedChannel(JSON.parse(e.target.value));
                    }
                  }}
                  style={{
                    padding: "10px 40px 10px 16px",
                    backgroundColor: "#6366F1",
                    color: "white",
                    border: "1px solid #6366F1",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    outline: "none",
                    appearance: "none",
                    minWidth: "250px",
                  }}
                >
                  {availableChannels.map((channel, idx) => (
                    <option
                      key={idx}
                      value={JSON.stringify(channel)}
                      style={{ backgroundColor: "white", color: "#111827" }}
                    >
                      {channel.name}_{channel.id}
                    </option>
                  ))}
                </select>
                <span
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    color: "white",
                    fontSize: "12px",
                  }}
                >
                  ▼
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filter Section */}
        <div style={{ marginBottom: "24px", display: "flex", gap: "0", alignItems: "center" }}>
          {/* Search Bar */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              flex: "1",
              maxWidth: "400px",
            }}
          >
            <span style={{ position: "absolute", left: "12px", color: "#9CA3AF", fontSize: "16px" }}>🔍</span>
            <input
              type="text"
              placeholder="Search by Order Id"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px 10px 40px",
                border: "1px solid #D1D5DB",
                borderTopLeftRadius: "8px",
                borderBottomLeftRadius: "8px",
                borderRight: "none",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>
          
          {/* Filters Button */}
          <button
            style={{
              padding: "10px 16px",
              backgroundColor: "white",
              color: "#374151",
              border: "1px solid #D1D5DB",
              borderTopRightRadius: "8px",
              borderBottomRightRadius: "8px",
              borderLeft: "none",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#F9FAFB";
              e.target.style.borderColor = "#9CA3AF";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "white";
              e.target.style.borderColor = "#D1D5DB";
            }}
            onClick={() => {
              console.log("Open filters");
              // Handle filters action
            }}
          >
            <span style={{ fontSize: "14px" }}>🔽</span>
            Filters
          </button>
        </div>

        {/* Orders Table */}
        <div
          style={{
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                <tr>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6B7280",
                      textTransform: "uppercase",
                    }}
                  >
                    Order ID
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6B7280",
                      textTransform: "uppercase",
                    }}
                  >
                    Fulfilled by
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6B7280",
                      textTransform: "uppercase",
                    }}
                  >
                    Created On
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6B7280",
                      textTransform: "uppercase",
                    }}
                  >
                    Price (USD)
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6B7280",
                      textTransform: "uppercase",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6B7280",
                      textTransform: "uppercase",
                    }}
                  >
                    Error
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "#9CA3AF" }}>
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, idx) => {
                    const orderId = order.order_id || order.order_name || "N/A";
                    const fulfillmentType = formatFulfillmentType(order.fulfillment_type);
                    const createdDate = formatDate(order.created_at || order.create_time);
                    const price = formatPrice(order.total, order.currency);
                    const status = formatStatus(order.status);
                    const statusColors = getStatusColor(order.status);
                    const errorExists = hasError(order);
                    const errorMessage = order.packages?.error_message || order.error_message || "";

                    return (
                      <motion.tr
                        key={order.id || order._id?.$oid || idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        style={{
                          borderBottom: idx < filteredOrders.length - 1 ? "1px solid #E5E7EB" : "none",
                        }}
                      >
                        {/* Order ID Column */}
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ fontSize: "14px", color: "#111827", fontWeight: "500" }}>
                              {orderId}
                            </div>
                            <button
                              onClick={() => copyOrderId(orderId)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "4px",
                                display: "flex",
                                alignItems: "center",
                                color: "#6B7280",
                              }}
                              title="Copy Order ID"
                            >
                              <span style={{ fontSize: "14px" }}>📋</span>
                            </button>
                          </div>
                        </td>

                        {/* Fulfilled by Column */}
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ fontSize: "14px", color: "#374151" }}>{fulfillmentType}</div>
                        </td>

                        {/* Created On Column */}
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ fontSize: "14px", color: "#374151" }}>{createdDate}</div>
                        </td>

                        {/* Price Column */}
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ fontSize: "14px", color: "#374151", fontWeight: "500" }}>
                            {price}
                          </div>
                        </td>

                        {/* Status Column */}
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 12px",
                              backgroundColor: statusColors.bg,
                              color: statusColors.text,
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: "500",
                            }}
                          >
                            {status}
                          </span>
                        </td>

                        {/* Error Column */}
                        <td style={{ padding: "12px 16px" }}>
                          {errorExists ? (
                            <span
                              style={{
                                display: "inline-block",
                                padding: "4px 12px",
                                backgroundColor: "#DC2626",
                                color: "white",
                                borderRadius: "12px",
                                fontSize: "12px",
                                fontWeight: "500",
                                borderBottom: "1px dashed rgba(255, 255, 255, 0.5)",
                                cursor: "help",
                              }}
                              title={errorMessage}
                            >
                              Error
                            </span>
                          ) : (
                            <span style={{ fontSize: "14px", color: "#9CA3AF" }}>-</span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "16px",
            fontSize: "14px",
            color: "#6B7280",
            fontWeight: "600",
          }}
        >
          Total Records: {filteredOrders.length}
        </div>
      </div>
    </div>
  );
}

