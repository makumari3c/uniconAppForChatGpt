import React, { useState, useEffect } from "react";
import ToolOutputSelector from "./components/ToolOutputSelector";
import ProductCard from "./components/ProductCard";
import ProductTable from "./components/ProductTable";
import ProductList from "./components/ProductList";
import AttributeList from "./components/AttributeList";
import ChannelList from "./components/ChannelList";
import ClassificationList from "./components/ClassificationList";
import WarehouseList from "./components/WarehouseList";
import ChannelOrdersList from "./components/ChannelOrdersList";

// Component mapping
const componentMap = {
  ProductCard: ProductCard,
  ProductTable: ProductTable,
  ProductList: ProductList,
  AttributeList: AttributeList,
  ChannelList: ChannelList,
  ClassificationList: ClassificationList,
  WarehouseList: WarehouseList,
  ChannelOrdersList: ChannelOrdersList,
};

function App() {
  const [files, setFiles] = useState([]);
  const [data, setData] = useState(null);
  const [mapper, setMapper] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [componentConfig, setComponentConfig] = useState(null);

  // Load mapper and file list
  useEffect(() => {
    const loadMapper = async () => {
      try {
        const res = await fetch("/tool-output/componen-tool-mapper.json");
        const mapperData = await res.json();
        setMapper(mapperData);
        
        // Extract file list from mapper keys
        const fileList = Object.keys(mapperData).map(key => `${key}.json`);
        setFiles(fileList);
      } catch (error) {
        console.error("Failed to load mapper:", error);
        // Fallback to default files
        setFiles(["sample_tool.json", "sample_tool_2.json"]);
      }
    };
    
    loadMapper();
  }, []);

  const loadFile = async (file) => {
    if (!file) return;
    
    try {
      // Extract tool name from filename (remove .json extension)
      const toolName = file.replace(/\.json$/, "");
      
      // Find component configuration from mapper
      if (mapper && mapper[toolName]) {
        const toolConfig = mapper[toolName];
        // Get the first component type and name (assuming one component per tool)
        const componentType = Object.keys(toolConfig)[0];
        const componentName = toolConfig[componentType];
        setComponentConfig({ type: componentType, name: componentName });
      }
      
      // Load the data
      const res = await fetch(`/tool-output/${file}`);
      const json = await res.json();
      setData(json);
      setSelectedFile(file);
    } catch (error) {
      console.error("Failed to load file:", error);
    }
  };
    var  response = window?.openai?.toolOutput ?? "NO TOOL OUTPUT FOUND";


  // Render the appropriate component based on mapper
  const renderComponent = () => {
    if (!data || !componentConfig) return null;

    const Component = componentMap[componentConfig.name];
    console.log("Tool Output Response:", response);
    if (!Component) {
      return <div>Component {componentConfig.name} not found</div>;
    }

    // Determine props based on component type
    if (componentConfig.name === "ProductCard") {
      return (
        <div className="product-list">
          {data?.products?.map((p) => (
            <ProductCard key={p._id?.$oid || p.u_product_id?.$oid || Math.random()} product={p} />
          ))}
        </div>
      );
    } else if (componentConfig.name === "ProductTable") {
      return <ProductTable products={data?.products || []} />;
    } else if (componentConfig.name === "ProductList") {
      return <ProductList products={data?.products || []} />;
    } else if (componentConfig.name === "AttributeList") {
      return <AttributeList attributes={data?.attributes || data?.data || []} />;
    } else if (componentConfig.name === "ChannelList") {
      return <ChannelList accounts={data?.accounts || data?.data || []} />;
    } else if (componentConfig.name === "ClassificationList") {
      return <ClassificationList classifications={data?.classifications || data?.data || []} />;
    } else if (componentConfig.name === "WarehouseList") {
      return <WarehouseList warehouses={data?.warehouses || data?.data || []} />;
    } else if (componentConfig.name === "ChannelOrdersList") {
      return <ChannelOrdersList orders={data?.orders || data?.data || []} />;
    }

    return null;
  };

  return (
    <div className="app-container">
      <h1>Unicon</h1>
      <p>React SDK Base Setup</p>
      <div>{response}</div>

      <ToolOutputSelector files={files} onLoad={loadFile} />

      {selectedFile && componentConfig && (
        <p style={{ marginTop: "10px", color: "#666" }}>
          Rendering: <strong>{componentConfig.name}</strong> for <strong>{selectedFile}</strong>
        </p>
      )}

      <h2>Rendered Products</h2>
      {renderComponent()}
    </div>
  );
}

export default App;
