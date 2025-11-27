# ChatGPT Apps SDK Integration Guide

This document outlines the changes required to properly integrate the Unicon React app with the ChatGPT Apps SDK UI framework.

## Overview

The ChatGPT Apps SDK allows your React application to run inside ChatGPT as an iframe and interact with MCP (Model Context Protocol) tools through the `window.openai` API. This integration enables dynamic tool calling and real-time data updates.

## Current Architecture

### Current Implementation
- **Data Loading**: Static JSON files from `/tool-output/` directory
- **Component Mapping**: Uses `componen-tool-mapper.json` to map tool outputs to React components
- **File Structure**: 
  - `index.html` - Entry point
  - `src/App.jsx` - Main application component
  - `src/components/` - React components for different data types
  - `public/tool-output/` - Static JSON files

### Current Data Flow
```
User selects file → Fetch JSON from /tool-output/ → Parse mapper → Render component
```

## Required Changes

### 1. Add ChatGPT Apps SDK Loader Script

**File**: `public/loader.js` (NEW)

Create a loader script that bridges the ChatGPT Apps SDK with your React app:

```javascript
// Loads tool outputs using ChatGPT Apps SDK
async function loadToolOutput(toolName, params = {}) {
  // Check if running in ChatGPT Apps SDK context
  if (window.openai && window.openai.callTool) {
    try {
      // Call tool via ChatGPT Apps SDK
      const result = await window.openai.callTool(toolName, params);
      return result;
    } catch (error) {
      console.error(`Error calling tool ${toolName}:`, error);
      throw error;
    }
  } else {
    // Fallback: Load from static JSON files (for local development)
    console.warn('ChatGPT Apps SDK not available, falling back to static files');
    const res = await fetch(`/tool-output/${toolName}.json`);
    if (!res.ok) throw new Error(`File not found: ${toolName}.json`);
    return await res.json();
  }
}

// List available tools
async function listToolOutputs() {
  if (window.openai && window.openai.listTools) {
    try {
      return await window.openai.listTools();
    } catch (error) {
      console.error('Error listing tools:', error);
      return [];
    }
  } else {
    // Fallback: Return static list from mapper
    try {
      const res = await fetch('/tool-output/componen-tool-mapper.json');
      const mapper = await res.json();
      return Object.keys(mapper);
    } catch (error) {
      return [];
    }
  }
}

// Subscribe to streaming updates
function subscribeToStream(callback) {
  if (window.openai && window.openai.onStream) {
    window.openai.onStream((event) => {
      callback(event);
    });
  }
}

// Expose API to window
window.ToolOutputLoader = {
  loadToolOutput,
  listToolOutputs,
  subscribeToStream
};
```

### 2. Update index.html

**File**: `index.html`

Add the loader script before the React app script:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Unicon ChatGPT Apps SDK React</title>
  <!-- Add loader script for ChatGPT Apps SDK -->
  <script src="/loader.js" defer></script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/index.jsx"></script>
</body>
</html>
```

### 3. Update App.jsx to Use SDK

**File**: `src/App.jsx`

Modify the data loading logic to use the ChatGPT Apps SDK:

**Key Changes:**

1. **Replace static file loading with SDK calls**:
   ```jsx
   // OLD:
   const res = await fetch(`/tool-output/${file}`);
   const json = await res.json();
   
   // NEW:
   const toolName = file.replace(/\.json$/, "");
   const json = await window.ToolOutputLoader.loadToolOutput(toolName);
   ```

2. **Update file listing**:
   ```jsx
   // OLD:
   const res = await fetch("/tool-output/componen-tool-mapper.json");
   const mapperData = await res.json();
   const fileList = Object.keys(mapperData).map(key => `${key}.json`);
   
   // NEW:
   const tools = await window.ToolOutputLoader.listToolOutputs();
   const fileList = tools.map(tool => `${tool}.json`);
   ```

3. **Add streaming support** (optional):
   ```jsx
   useEffect(() => {
     if (window.ToolOutputLoader && window.ToolOutputLoader.subscribeToStream) {
       window.ToolOutputLoader.subscribeToStream((event) => {
         // Handle streaming updates
         if (event.tool === selectedFile?.replace(/\.json$/, "")) {
           setData(event.data);
         }
       });
     }
   }, [selectedFile]);
   ```

**Complete Updated App.jsx Structure:**

```jsx
import React, { useState, useEffect } from "react";
import ToolOutputSelector from "./components/ToolOutputSelector";
// ... other imports

function App() {
  const [files, setFiles] = useState([]);
  const [data, setData] = useState(null);
  const [mapper, setMapper] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [componentConfig, setComponentConfig] = useState(null);
  const [isSDKAvailable, setIsSDKAvailable] = useState(false);

  // Check if ChatGPT Apps SDK is available
  useEffect(() => {
    const checkSDK = () => {
      const available = !!(window.openai && window.openai.callTool);
      setIsSDKAvailable(available);
      return available;
    };

    // Check immediately
    checkSDK();

    // Poll for SDK availability (in case it loads after React)
    const interval = setInterval(() => {
      if (checkSDK()) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Load mapper and file list
  useEffect(() => {
    const loadMapper = async () => {
      try {
        if (isSDKAvailable && window.ToolOutputLoader) {
          // Use SDK to list tools
          const tools = await window.ToolOutputLoader.listToolOutputs();
          setFiles(tools.map(tool => `${tool}.json`));
          
          // Still load mapper for component mapping
          const res = await fetch("/tool-output/componen-tool-mapper.json");
          const mapperData = await res.json();
          setMapper(mapperData);
        } else {
          // Fallback to static files
          const res = await fetch("/tool-output/componen-tool-mapper.json");
          const mapperData = await res.json();
          setMapper(mapperData);
          const fileList = Object.keys(mapperData).map(key => `${key}.json`);
          setFiles(fileList);
        }
      } catch (error) {
        console.error("Failed to load mapper:", error);
        setFiles(["sample_tool.json", "sample_tool_2.json"]);
      }
    };
    
    loadMapper();
  }, [isSDKAvailable]);

  const loadFile = async (file) => {
    if (!file) return;
    
    try {
      const toolName = file.replace(/\.json$/, "");
      
      // Find component configuration from mapper
      if (mapper && mapper[toolName]) {
        const toolConfig = mapper[toolName];
        const componentType = Object.keys(toolConfig)[0];
        const componentName = toolConfig[componentType];
        setComponentConfig({ type: componentType, name: componentName });
      }
      
      // Load data using SDK or fallback
      let json;
      if (isSDKAvailable && window.ToolOutputLoader) {
        json = await window.ToolOutputLoader.loadToolOutput(toolName);
      } else {
        // Fallback to static file
        const res = await fetch(`/tool-output/${file}`);
        json = await res.json();
      }
      
      setData(json);
      setSelectedFile(file);
    } catch (error) {
      console.error("Failed to load file:", error);
    }
  };

  // ... rest of component remains the same
}
```

### 4. Update Vite Configuration

**File**: `vite.config.js`

Ensure proper build configuration for iframe embedding:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
      interval: 1000
    },
    // Allow iframe embedding
    headers: {
      'X-Frame-Options': 'ALLOWALL'
    }
  },
  build: {
    // Ensure loader.js is copied to public
    copyPublicDir: true,
    rollupOptions: {
      output: {
        // Ensure proper chunking for iframe
        manualChunks: undefined
      }
    }
  },
  optimizeDeps: {
    exclude: []
  }
})
```

### 5. Create AI Plugin Manifest

**File**: `public/ai-plugin.json` (NEW)

Create the manifest file that ChatGPT will read:

```json
{
  "schema_version": "v1",
  "name_for_human": "Unicon",
  "name_for_model": "unicon",
  "description_for_human": "Unicon SDK React Demo - Manage products, attributes, channels, and orders",
  "description_for_model": "React frontend for Unicon GPT App that displays product listings, attributes, channels, classifications, warehouses, and orders using interactive UI components",
  "auth": {
    "type": "none"
  },
  "api": {
    "type": "openapi",
    "url": "https://your-backend.com/openapi.json"
  },
  "ui": {
    "type": "iframe",
    "url": "https://your-frontend-url.com/index.html"
  },
  "logo_url": "https://your-frontend-url.com/logo.png",
  "contact_email": "support@unicon.com",
  "legal_info_url": "https://unicon.com/legal"
}
```

**Important Fields:**
- `ui.url`: Must point to your hosted React app's `index.html`
- `api.url`: Points to your MCP backend OpenAPI specification
- All URLs must be HTTPS

### 6. Update Component Data Fetching (Optional Enhancement)

For components that need to refresh data, add SDK integration:

**Example for ProductList component:**

```jsx
// In ProductList.jsx or similar components
useEffect(() => {
  if (window.openai && window.openai.onStream) {
    window.openai.onStream((event) => {
      if (event.tool === 'get_products') {
        // Update products in real-time
        setProducts(event.data?.products || []);
      }
    });
  }
}, []);
```

### 7. Handle SDK Initialization

**File**: `src/index.jsx` (Optional Enhancement)

Add SDK availability check:

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./css/style.css";

// Check for ChatGPT Apps SDK
if (window.openai) {
  console.log('ChatGPT Apps SDK detected');
} else {
  console.warn('ChatGPT Apps SDK not available - running in fallback mode');
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
```

## Deployment Requirements

### 1. Hosting
- **Required**: HTTPS hosting (Vercel, Netlify, Render, etc.)
- **Build**: Run `npm run build` before deployment
- **Public URL**: Must be accessible from ChatGPT's servers

### 2. CORS Configuration
Ensure your hosting allows iframe embedding:
- Remove `X-Frame-Options: DENY` headers
- Add appropriate CORS headers if needed

### 3. Testing Locally
Use a tunnel service for local testing:
```bash
# Using ngrok
npx ngrok http 5173

# Using localtunnel
npx localtunnel --port 5173
```

## Migration Checklist

- [ ] Create `public/loader.js` with SDK integration
- [ ] Update `index.html` to include loader script
- [ ] Modify `App.jsx` to use `window.ToolOutputLoader` instead of direct fetch
- [ ] Add SDK availability detection
- [ ] Update `vite.config.js` for iframe compatibility
- [ ] Create `public/ai-plugin.json` manifest
- [ ] Test with static files (fallback mode)
- [ ] Deploy to HTTPS hosting
- [ ] Test with ChatGPT Apps SDK
- [ ] Update manifest URLs to production

## Testing Strategy

### Phase 1: Local Development (Fallback Mode)
1. Run `npm run dev`
2. Verify components load with static JSON files
3. Check console for "ChatGPT Apps SDK not available" warning

### Phase 2: Local Tunnel Testing
1. Start local tunnel (ngrok/localtunnel)
2. Update manifest with tunnel URL
3. Load in ChatGPT Developer Mode
4. Verify SDK integration works

### Phase 3: Production Testing
1. Deploy to production hosting
2. Update manifest with production URLs
3. Test full integration in ChatGPT

## Common Issues and Solutions

### Issue: `window.openai is undefined`
**Solution**: Ensure loader.js loads before React app, and check if running in ChatGPT context

### Issue: CORS errors
**Solution**: Configure hosting to allow iframe embedding and proper CORS headers

### Issue: Components not rendering
**Solution**: Check data structure matches expected format, verify mapper configuration

### Issue: Tools not available
**Solution**: Ensure MCP backend is properly configured and accessible

## Additional Considerations

### Security
- Validate all data from SDK before rendering
- Sanitize user inputs
- Implement proper error boundaries

### Performance
- Implement loading states
- Add error handling for failed tool calls
- Consider caching for frequently accessed data

### User Experience
- Show loading indicators during tool calls
- Display error messages clearly
- Provide fallback UI when SDK unavailable

## Next Steps

1. Implement the changes outlined above
2. Test thoroughly in both fallback and SDK modes
3. Deploy to staging environment
4. Test with ChatGPT Apps SDK
5. Deploy to production
6. Monitor and iterate based on usage

## References

- ChatGPT Apps SDK Documentation
- MCP (Model Context Protocol) Specification
- React Best Practices for iframe embedding
- Vite Build Configuration

