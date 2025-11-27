import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function ProductCard({ product }) {
  const mainImage = product.images.find(img => img.is_main)?.url || product.images[0]?.url;

  return (
    <motion.div
      className="product-card"
      whileHover={{ scale: 1.03, boxShadow: "0 15px 25px rgba(0,0,0,0.3)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Image Carousel */}
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={5}
        slidesPerView={1}
        loop={true}
      >
        {product.images.slice(0, 5).map((img, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={img.url}
              alt={product.title}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "12px"
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Product Info */}
      <div style={{ padding: "10px" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: "600", minHeight: "50px" }}>
          {product.title.length > 60 ? product.title.slice(0, 57) + "..." : product.title}
        </h3>
        <p style={{ fontSize: "0.85rem", color: "#666", margin: "5px 0" }}>
          SKU: {product.sku}
        </p>
        <p style={{ fontWeight: "bold", fontSize: "1rem", margin: "5px 0" }}>
          Price: ${product.price.toFixed(2)}
        </p>
        <p
          style={{
            color: product.status === "active" ? "green" : "orange",
            fontWeight: "500",
            fontSize: "0.9rem"
          }}
        >
          Status: {product.status}
        </p>

        {/* View More Button */}
        <a
          href={`https://yourapp.com/product/${product.u_product_id.$oid}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: "10px",
            padding: "6px 12px",
            backgroundColor: "#252169",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "500",
            textAlign: "center"
          }}
        >
          View More
        </a>
      </div>
    </motion.div>
  );
}
