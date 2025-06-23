import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Import CSS của Ant Design
import "antd/dist/reset.css"; // hoặc antd.css nếu dùng v4

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
