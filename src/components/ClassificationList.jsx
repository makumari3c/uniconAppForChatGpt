import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ClassificationList({ classifications = [] }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter classifications based on search query
  const filteredClassifications = classifications.filter((classification) => {
    const searchLower = searchQuery.toLowerCase();
    const name = classification.name?.toLowerCase() || "";
    const code = classification.code?.toLowerCase() || "";
    return name.includes(searchLower) || code.includes(searchLower);
  });

  // Format classification name (convert SNAKE_CASE to readable format)
  const formatName = (name) => {
    if (!name) return "N/A";
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
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
                Classify Products
              </h1>
              <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
                Add or manage classifications to upload the products in a relevant category on multiple channels.
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
              Add Classification
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
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
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Classifications Table */}
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
                      textAlign: "center",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6B7280",
                      textTransform: "uppercase",
                    }}
                  >
                    Assigned Products
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
                {filteredClassifications.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ padding: "40px", textAlign: "center", color: "#9CA3AF" }}>
                      No classifications found
                    </td>
                  </tr>
                ) : (
                  filteredClassifications.map((classification, idx) => {
                    const classificationId = classification.id || classification._id?.$oid || classification._id || idx;
                    const name = classification.name || "N/A";
                    const assignedProducts = classification.count !== undefined ? classification.count : 0;

                    return (
                      <motion.tr
                        key={classificationId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        style={{
                          borderBottom: idx < filteredClassifications.length - 1 ? "1px solid #E5E7EB" : "none",
                        }}
                      >
                        {/* Name Column */}
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ fontSize: "14px", color: "#111827", fontWeight: "500" }}>
                            {formatName(name)}
                          </div>
                        </td>

                        {/* Assigned Products Column */}
                        <td style={{ padding: "12px 16px", textAlign: "center" }}>
                          <div style={{ fontSize: "14px", color: "#374151" }}>{assignedProducts}</div>
                        </td>

                        {/* Actions Column */}
                        <td style={{ padding: "12px 16px", textAlign: "right" }}>
                          <button
                            style={{
                              background: "#F3F4F6",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "18px",
                              color: "#6B7280",
                              padding: "6px 10px",
                              borderRadius: "6px",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "32px",
                              height: "32px",
                              transition: "background-color 0.2s",
                            }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#E5E7EB")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#F3F4F6")}
                            onClick={() => {
                              console.log("Actions for classification:", classificationId);
                              // Handle actions menu
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
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "16px",
            fontSize: "14px",
            color: "#6B7280",
          }}
        >
          Total Records: {filteredClassifications.length}
        </div>
      </div>
    </div>
  );
}

