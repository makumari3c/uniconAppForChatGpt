import React, { useState } from "react";

export default function ToolOutputSelector({ files, onLoad }) {
  const [selected, setSelected] = useState("");

  return (
    <div className="controls">
      <select value={selected} onChange={(e) => setSelected(e.target.value)}>
        <option value="">-- choose --</option>
        {files.map(f => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>
      <button onClick={() => onLoad(selected)}>Load</button>
    </div>
  );
}
