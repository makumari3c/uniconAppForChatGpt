import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ChannelList({ accounts = [] }) {
  // Get channel type from account name or channel_id
  const getChannelType = (account) => {
    const name = account.name?.toLowerCase() || "";
    const channelName = account.channel?.name?.toLowerCase() || "";
    const channelGroupName = account.channel_group?.name?.toLowerCase() || "";
    
    if (name.includes("amazon") || channelName.includes("amazon") || channelGroupName.includes("amazon")) {
      return "amazon";
    } else if (name.includes("tiktok") || channelName.includes("tiktok") || channelGroupName.includes("tiktok")) {
      return "tiktok";
    } else if (name.includes("ebay") || channelName.includes("ebay") || channelGroupName.includes("ebay")) {
      return "ebay";
    } else if (name.includes("walmart") || channelName.includes("walmart") || channelGroupName.includes("walmart")) {
      return "walmart";
    } else if (name.includes("shein") || channelName.includes("shein") || channelGroupName.includes("shein")) {
      return "shein";
    }
    return "default";
  };

  // Get channel logo
  const getChannelLogo = (channelType) => {
    switch (channelType) {
      case "amazon":
        return (
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#FF9900",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            a
          </div>
        );
      case "tiktok":
        return (
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#000000",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "20px",
            }}
          >
            ♫
          </div>
        );
      case "ebay":
        return (
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#E53238",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            ebay
          </div>
        );
      case "walmart":
        return (
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#0071CE",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            W
          </div>
        );
      case "shein":
        return (
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#FF6B9D",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            S
          </div>
        );
      default:
        return (
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#6B7280",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            ?
          </div>
        );
    }
  };

  // Check if token is expired or expiring soon
  const isTokenExpiring = (account) => {
    if (!account.expires_in) return false;
    const expiresIn = typeof account.expires_in === "number" ? account.expires_in : parseInt(account.expires_in);
    const currentTime = Math.floor(Date.now() / 1000);
    const daysUntilExpiry = (expiresIn - currentTime) / (60 * 60 * 24);
    // Show notice if expiring within 30 days
    return daysUntilExpiry < 30 && daysUntilExpiry > 0;
  };

  // Check if token is expired
  const isTokenExpired = (account) => {
    if (!account.expires_in) return false;
    const expiresIn = typeof account.expires_in === "number" ? account.expires_in : parseInt(account.expires_in);
    const currentTime = Math.floor(Date.now() / 1000);
    return expiresIn < currentTime;
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
        <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>
          My Channels
        </h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
          Review and manage all your connected channels to fully optimize your multichannel selling experience.
        </p>
      </div>

      {/* Channels Table */}
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
                  Channel
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
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan="2" style={{ padding: "40px", textAlign: "center", color: "#9CA3AF" }}>
                    No channels found
                  </td>
                </tr>
              ) : (
                accounts.map((account, idx) => {
                  const channelType = getChannelType(account);
                  const accountId = account.id || account._id?.$oid || account._id || idx;
                  const accountName = account.name || "Unnamed Channel";
                  const channelSubtitle = account.channel?.name || account.channel_group?.name || "Marketplace";
                  const tokenExpiring = isTokenExpiring(account);
                  const tokenExpired = isTokenExpired(account);

                  return (
                    <motion.tr
                      key={accountId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      style={{
                        borderBottom: idx < accounts.length - 1 ? "1px solid #E5E7EB" : "none",
                      }}
                    >
                      {/* Channel Column */}
                      <td style={{ padding: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          {/* Logo */}
                          {getChannelLogo(channelType)}
                          
                          {/* Name and Subtitle */}
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                              <div style={{ fontSize: "14px", color: "#111827", fontWeight: "500" }}>
                                {accountName}
                              </div>
                              {tokenExpiring && (
                                <span
                                  style={{
                                    display: "inline-block",
                                    padding: "2px 8px",
                                    backgroundColor: "#FEF3C7",
                                    color: "#B45309",
                                    borderRadius: "12px",
                                    fontSize: "11px",
                                    fontWeight: "500",
                                  }}
                                >
                                  Token Expiry Notice
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: "12px", color: "#6B7280" }}>
                              {channelSubtitle}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Action Column */}
                      <td style={{ padding: "16px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          {tokenExpired && (
                            <button
                              style={{
                                padding: "8px 16px",
                                backgroundColor: "white",
                                border: "1px solid #D1D5DB",
                                borderRadius: "6px",
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151",
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
                                console.log("Re-Authorize account:", accountId);
                                // Handle re-authorize action
                              }}
                            >
                              Re-Authorize
                            </button>
                          )}
                          <button
                            style={{
                              padding: "8px 16px",
                              backgroundColor: "white",
                              border: "1px solid #D1D5DB",
                              borderRadius: "6px",
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "#374151",
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
                              console.log("Manage account:", accountId);
                              // Handle manage action
                            }}
                          >
                            Manage
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
    </div>
  );
}

