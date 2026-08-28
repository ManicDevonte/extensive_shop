import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StorefrontApp from "./StorefrontApp.jsx";
import "./index.css";

const AdminApp = React.lazy(() => import("./AdminApp.jsx"));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<Suspense fallback={<div className="min-h-screen grid place-items-center bg-slate-50 text-sm text-gray-500">Loading admin console...</div>}><AdminApp /></Suspense>} />
        <Route path="/*" element={<StorefrontApp />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
