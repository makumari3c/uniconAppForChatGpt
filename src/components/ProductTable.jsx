import React from "react";
import { motion } from "framer-motion";

export default function ProductTable({ products }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        background: "white",
        borderRadius: "12px",
        overflow: "hidden"
      }}>
        <thead style={{ backgroundColor: "#252169", color: "white" }}>
          <tr>
            <th style={{ padding: "12px", textAlign: "left" }}>Image</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Title</th>
            <th style={{ padding: "12px", textAlign: "left" }}>SKU</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Price</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Marketplace</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, idx) => (
            <motion.tr
              key={product._id.$oid}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              style={{
                borderBottom: "1px solid #eee",
                backgroundColor: idx % 2 === 0 ? "#f9f9ff" : "white"
              }}
            >
              {/* Image */}
              <td style={{ padding: "10px" }}>
                <img
                  src={product.images.find(img => img.is_main)?.url || product.images[0]?.url}
                  alt={product.title}
                  style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
                />
              </td>

              {/* Title */}
              <td style={{ padding: "10px", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {product.title}
              </td>

              {/* SKU */}
              <td style={{ padding: "10px" }}>{product.sku}</td>

              {/* Price */}
              <td style={{ padding: "10px" }}>${product.price.toFixed(2)}</td>

              {/* Status */}
              <td style={{
                padding: "10px",
                color: product.status === "active" ? "green" : "orange",
                fontWeight: "500"
              }}>
                {product.status}
              </td>

              {/* Marketplace */}
              <td style={{ padding: "10px" }}>{product.u_source}</td>

              {/* Action */}
              <td style={{ padding: "10px", textAlign: "center" }}>
                <a
                  href={`https://yourapp.com/product/${product.u_product_id.$oid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#252169",
                    color: "white",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: "500"
                  }}
                >
                  View
                </a>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
