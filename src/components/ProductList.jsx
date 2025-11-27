import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ProductList({ products = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [variantView, setVariantView] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const itemsPerPage = 10;

  // Filter products based on search query
  const filteredProducts = products.filter((product) => {
    const searchLower = searchQuery.toLowerCase();
    const title = product.title?.toLowerCase() || "";
    const sku = product.sku?.toLowerCase() || "";
    return title.includes(searchLower) || sku.includes(searchLower);
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Handle checkbox selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(new Set(paginatedProducts.map((p) => p._id?.$oid || p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleSelectProduct = (productId) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower === "active") {
      return { bg: "#D1FADF", text: "#027A48" };
    } else if (statusLower === "incomplete") {
      return { bg: "#FEF3C7", text: "#B45309" };
    }
    return { bg: "#E5E7EB", text: "#374151" };
  };

  // Format price
  const formatPrice = (price) => {
    if (!price || price === "-") return "-";
    if (typeof price === "number") {
      return price.toFixed(2);
    }
    return price;
  };

  // Get product image
  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      const mainImage = product.images.find((img) => img.is_main);
      return mainImage?.url || product.images[0]?.url;
    }
    return null;
  };

  return (
    <div style={{ padding: "24px", backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
      {/* Header Section */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>
              Product List
            </h1>
            <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
              Add attributes for your choice of category to add relevant product details for easy control.
            </p>
          </div>
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#6366F1",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#4F46E5")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#6366F1")}
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Informational Banner */}
      <div
        style={{
          backgroundColor: "#F3F4F6",
          border: "1px solid #E5E7EB",
          borderRadius: "8px",
          padding: "12px 16px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span style={{ fontSize: "20px" }}>⚠️</span>
        <p style={{ margin: 0, fontSize: "14px", color: "#374151" }}>
          Get an overview of parent products to ensure accurate listings and streamlined catalog control.
        </p>
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
          <span style={{ position: "absolute", left: "12px", color: "#9CA3AF" }}>🔍</span>
          <input
            type="text"
            placeholder="Search by title or SKU"
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

        {/* Customize Grid Button */}
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
          }}
        >
          <span>⚏</span>
          Customize Grid
          <span>▼</span>
        </button>

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
          }}
        >
          <span>🔽</span>
          Filters
        </button>

        {/* Variant View Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "14px", color: "#374151" }}>Variant View</span>
          <div
            onClick={() => setVariantView(!variantView)}
            style={{
              width: "44px",
              height: "24px",
              backgroundColor: variantView ? "#6366F1" : "#D1D5DB",
              borderRadius: "12px",
              position: "relative",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "white",
                borderRadius: "50%",
                position: "absolute",
                top: "2px",
                left: variantView ? "22px" : "2px",
                transition: "left 0.2s",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            />
          </div>
        </div>
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
                <th style={{ padding: "12px 16px", textAlign: "left", width: "40px" }}>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={paginatedProducts.length > 0 && paginatedProducts.every((p) => selectedProducts.has(p._id?.$oid || p.id))}
                    style={{ cursor: "pointer" }}
                  />
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase" }}>
                  Image
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase" }}>
                  Title
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase" }}>
                  SKU
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase" }}>
                  Price (INR)
                  <span style={{ marginLeft: "4px", fontSize: "10px" }}>↕️</span>
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase" }}>
                  Channels
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase" }}>
                  Status
                </th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: "40px", textAlign: "center", color: "#9CA3AF" }}>
                    No products found
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product, idx) => {
                  const productId = product._id?.$oid || product.id || idx;
                  const isSelected = selectedProducts.has(productId);
                  const statusColors = getStatusColor(product.status);
                  const productImage = getProductImage(product);
                  const channels = product.channels || product.u_source || "N/A";
                  const price = product.price ? formatPrice(product.price) : "-";

                  return (
                    <motion.tr
                      key={productId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      style={{
                        borderBottom: idx < paginatedProducts.length - 1 ? "1px solid #E5E7EB" : "none",
                        backgroundColor: isSelected ? "#F3F4F6" : "white",
                      }}
                    >
                      {/* Checkbox */}
                      <td style={{ padding: "12px 16px" }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectProduct(productId)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>

                      {/* Image */}
                      <td style={{ padding: "12px 16px" }}>
                        {productImage ? (
                          <img
                            src={productImage}
                            alt={product.title || "Product"}
                            style={{
                              width: "48px",
                              height: "48px",
                              objectFit: "cover",
                              borderRadius: "6px",
                              border: "1px solid #E5E7EB",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            backgroundColor: "#F3F4F6",
                            borderRadius: "6px",
                            display: productImage ? "none" : "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            color: "#9CA3AF",
                            border: "1px solid #E5E7EB",
                          }}
                        >
                          Image
                        </div>
                      </td>

                      {/* Title */}
                      <td style={{ padding: "12px 16px", maxWidth: "300px" }}>
                        <div style={{ fontSize: "14px", color: "#111827", lineHeight: "1.5" }}>
                          {product.title || "N/A"}
                          {product.variants && (
                            <span style={{ color: "#6366F1", marginLeft: "4px", cursor: "pointer" }}>
                              Variants
                            </span>
                          )}
                        </div>
                      </td>

                      {/* SKU */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontSize: "14px", color: "#374151" }}>{product.sku || "N/A"}</div>
                      </td>

                      {/* Price */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontSize: "14px", color: "#111827", fontWeight: "500" }}>{price}</div>
                      </td>

                      {/* Channels */}
                      <td style={{ padding: "12px 16px" }}>
                        {channels !== "N/A" ? (
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 12px",
                              backgroundColor: "#F3F4F6",
                              color: "#374151",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: "500",
                            }}
                          >
                            {channels}
                          </span>
                        ) : (
                          <span style={{ fontSize: "14px", color: "#9CA3AF" }}>N/A</span>
                        )}
                      </td>

                      {/* Status */}
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
                          {product.status || "Unknown"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "18px",
                            color: "#6B7280",
                            padding: "4px",
                          }}
                          onClick={() => {
                            // Handle actions menu
                            console.log("Actions for product:", productId);
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
            Total Records: {filteredProducts.length}
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
              }}
            >
              ←
            </button>
            <span style={{ fontSize: "14px", color: "#374151", padding: "0 8px" }}>
              Page {currentPage} of {totalPages || 1}
            </span>
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

