import React from "react";
import "./index.css";
import { createHashRouter, RouterProvider } from "react-router";
import ReactDom from "react-dom/client";
import routes from "./routes";

const router = createHashRouter(routes);
ReactDom.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
