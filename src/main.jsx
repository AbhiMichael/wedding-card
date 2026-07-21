import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Note: intentionally not wrapped in <React.StrictMode> — StrictMode
// double-invokes effects in dev, which would trigger the frame-loading
// logic twice and be confusing to debug against. Safe to add back for
// production hardening once you're done tuning things.
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
