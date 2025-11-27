import React, { useState } from "react";
import { motion } from "framer-motion";

export default function WarehouseList({ warehouses = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' or 'desc'

  // Filter warehouses based on search query
  const filteredWarehouses = warehouses.filter((warehouse) => {
    const searchLower = searchQuery.toLowerCase();
    const name = warehouse.name?.toLowerCase() || "";
    const warehouseId = warehouse.id?.toLowerCase() || warehouse._id?.$oid?.toLowerCase() || "";
    return name.includes(searchLower) || warehouseId.includes(searchLower);
  });

  // Sort by created date
  const sortedWarehouses = [...filteredWarehouses].sort((a, b) => {
    const dateA = new Date(parseInt(a.created_at) || a.createdAt || 0);
    const dateB = new Date(parseInt(b.created_at) || b.createdAt || 0);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
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

  // Get channel name
  const getChannelName = (warehouse) => {
    if (warehouse.channel_name) return warehouse.channel_name;
    if (warehouse.channel?.name) return warehouse.channel.name;
    if (warehouse.account?.name) return warehouse.account.name;
    if (warehouse.channel_id) return `Channel ${warehouse.channel_id}`;
    if (warehouse.account_id) return `Account ${warehouse.account_id}`;
    return "UniCon";
  };

  // Toggle sort order
  const handleSortToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
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
                Warehouse
              </h1>
              <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
                Manage data of your warehouses to ensure you never face overselling, stockouts, or order fulfillment errors.
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {/* Sync Button */}
              <button
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#F3F4F6",
                  color: "#374151",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#E5E7EB";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#F3F4F6";
                }}
                onClick={() => {
                  console.log("Sync warehouses");
                  // Handle sync action
                }}
              >
                <span style={{ fontSize: "16px" }}>🔄</span>
                Sync
              </button>
              
              {/* Map Warehouse Button */}
              <button
                style={{
                  padding: "10px 16px",
                  backgroundColor: "white",
                  color: "#374151",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
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
                  console.log("Map warehouse");
                  // Handle map warehouse action
                }}
              >
                Map Warehouse
              </button>
              
              {/* Add Warehouse Button */}
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#1E40AF",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#1E3A8A")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#1E40AF")}
                onClick={() => {
                  console.log("Add warehouse");
                  // Handle add warehouse action
                }}
              >
                Add Warehouse
              </button>
            </div>
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
              placeholder="Search by name"
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

        {/* Warehouse Table */}
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
                    Name
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
                    Channel
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6B7280",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                    onClick={handleSortToggle}
                  >
                    Created On
                    <span style={{ marginLeft: "4px", fontSize: "10px" }}>
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
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
                      textAlign: "right",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6B7280",
                      textTransform: "uppercase",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedWarehouses.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: "40px", textAlign: "center", color: "#9CA3AF" }}>
                      No warehouses found
                    </td>
                  </tr>
                ) : (
                  sortedWarehouses.map((warehouse, idx) => {
                    const warehouseId = warehouse.id || warehouse._id?.$oid || warehouse._id || idx;
                    const name = warehouse.name || "Unnamed Warehouse";
                    const channelName = getChannelName(warehouse);
                    const createdDate = formatDate(warehouse.created_at || warehouse.createdAt);
                    const status = warehouse.status || "Active";
                    const warehouseIdentifier = warehouse.id || warehouse._id?.$oid || warehouse._id || "";

                    return (
                      <motion.tr
                        key={warehouseId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        style={{
                          borderBottom: idx < sortedWarehouses.length - 1 ? "1px solid #E5E7EB" : "none",
                        }}
                      >
                        {/* Name Column */}
                        <td style={{ padding: "12px 16px" }}>
                          <div>
                            <div style={{ fontSize: "14px", color: "#111827", fontWeight: "500", marginBottom: "4px" }}>
                              {name}
                            </div>
                            <div style={{ fontSize: "12px", color: "#6B7280" }}>
                              {warehouseIdentifier}
                            </div>
                          </div>
                        </td>

                        {/* Channel Column */}
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ fontSize: "14px", color: "#374151" }}>{channelName}</div>
                        </td>

                        {/* Created On Column */}
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ fontSize: "14px", color: "#374151" }}>{createdDate}</div>
                        </td>

                        {/* Status Column */}
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 12px",
                              backgroundColor: "#D1FADF",
                              color: "#027A48",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: "500",
                            }}
                          >
                            {status}
                          </span>
                        </td>

                        {/* Actions Column */}
                        <td style={{ padding: "12px 16px", textAlign: "right" }}>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                            {/* Edit Button */}
                            <button
                              style={{
                                background: "white",
                                border: "1px solid #D1D5DB",
                                cursor: "pointer",
                                fontSize: "16px",
                                color: "#6B7280",
                                padding: "6px 10px",
                                borderRadius: "6px",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "32px",
                                height: "32px",
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
                                console.log("Edit warehouse:", warehouseId);
                                // Handle edit action
                              }}
                            >
                              ✏️
                            </button>
                            
                            {/* Delete Button */}
                            <button
                              style={{
                                background: "white",
                                border: "1px solid #FCA5A5",
                                cursor: "pointer",
                                fontSize: "16px",
                                color: "#DC2626",
                                padding: "6px 10px",
                                borderRadius: "6px",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "32px",
                                height: "32px",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#FEF2F2";
                                e.target.style.borderColor = "#F87171";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "white";
                                e.target.style.borderColor = "#FCA5A5";
                              }}
                              onClick={() => {
                                console.log("Delete warehouse:", warehouseId);
                                // Handle delete action
                              }}
                            >
                              🗑️
                            </button>
                          </div>
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
          }}
        >
          Total Records: {sortedWarehouses.length}
        </div>
      </div>
    </div>
  );
}

