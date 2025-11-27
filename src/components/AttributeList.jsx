import React, { useState } from "react";
import { motion } from "framer-motion";

export default function AttributeList({ attributes = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' or 'desc'
  const itemsPerPage = 10;

  // Filter attributes based on search query
  const filteredAttributes = attributes.filter((attr) => {
    const searchLower = searchQuery.toLowerCase();
    const name = attr.name?.toLowerCase() || "";
    return name.includes(searchLower);
  });

  // Sort by created date
  const sortedAttributes = [...filteredAttributes].sort((a, b) => {
    const dateA = new Date(a.created_at || a.createdAt || 0);
    const dateB = new Date(b.created_at || b.createdAt || 0);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  // Pagination
  const totalPages = Math.ceil(sortedAttributes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAttributes = sortedAttributes.slice(startIndex, endIndex);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch (e) {
      return "N/A";
    }
  };

  // Format type name
  const formatType = (type) => {
    if (!type) return "N/A";
    // Convert snake_case or camelCase to Title Case
    return type
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Toggle sort order
  const handleSortToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div style={{ padding: "24px", backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
      {/* Top Banner */}
      <div
        style={{
          backgroundColor: "#FEF3C7",
          border: "1px solid #FCD34D",
          borderRadius: "8px",
          padding: "12px 16px",
          marginBottom: "24px",
          fontSize: "14px",
          color: "#374151",
        }}
      >
        You're part of an early access experience where we're fine-tuning features to serve you better. You may notice occasional updates in real time.
      </div>

      {/* Header Section */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>
              Manage Attributes
            </h1>
            <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
              Add and manage product attributes to provide accurate details about your products across channels.
            </p>
          </div>
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
          >
            Add Attribute
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div style={{ marginBottom: "24px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        {/* Search Bar */}
        <div
          style={{
            flex: "1",
            minWidth: "300px",
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ position: "absolute", left: "12px", color: "#9CA3AF", fontSize: "16px" }}>🔍</span>
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              width: "100%",
              padding: "10px 12px 10px 40px",
              border: "1px solid #D1D5DB",
              borderRadius: "8px",
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
            border: "1px solid #D1D5DB",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#374151",
          }}
        >
          <span>☰</span>
          Filters
        </button>
      </div>

      {/* Table Section */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          border: "1px solid #E5E7EB",
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
                  Type
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
                  Required
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
              {paginatedAttributes.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: "40px", textAlign: "center", color: "#9CA3AF" }}>
                    No attributes found
                  </td>
                </tr>
              ) : (
                paginatedAttributes.map((attr, idx) => {
                  const attributeId = attr._id?.$oid || attr.id || attr._id || idx;
                  const name = attr.name || "N/A";
                  const type = formatType(attr.type || attr.frontend_type || "");
                  const isRequired = attr.is_required !== undefined ? attr.is_required : attr.isRequired || false;
                  const createdDate = formatDate(attr.created_at || attr.createdAt);

                  return (
                    <motion.tr
                      key={attributeId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      style={{
                        borderBottom: idx < paginatedAttributes.length - 1 ? "1px solid #E5E7EB" : "none",
                      }}
                    >
                      {/* Name */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontSize: "14px", color: "#111827", fontWeight: "500" }}>{name}</div>
                      </td>

                      {/* Type */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontSize: "14px", color: "#374151" }}>{type}</div>
                      </td>

                      {/* Required */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontSize: "14px", color: "#374151" }}>{isRequired ? "Yes" : "No"}</div>
                      </td>

                      {/* Created On */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontSize: "14px", color: "#374151" }}>{createdDate}</div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "18px",
                            color: "#6B7280",
                            padding: "4px 8px",
                          }}
                          onClick={() => {
                            // Handle actions menu
                            console.log("Actions for attribute:", attributeId);
                          }}
                        >
                          ⋮
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer/Pagination */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #E5E7EB",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#F9FAFB",
          }}
        >
          <div style={{ fontSize: "14px", color: "#6B7280" }}>
            Total Records: {sortedAttributes.length}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={{
                padding: "8px 12px",
                backgroundColor: currentPage === 1 ? "#F3F4F6" : "white",
                border: "1px solid #D1D5DB",
                borderRadius: "6px",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                color: currentPage === 1 ? "#9CA3AF" : "#374151",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
              }}
            >
              ←
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
              style={{
                padding: "8px 12px",
                backgroundColor: currentPage >= totalPages ? "#F3F4F6" : "white",
                border: "1px solid #D1D5DB",
                borderRadius: "6px",
                cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                color: currentPage >= totalPages ? "#9CA3AF" : "#374151",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
              }}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

