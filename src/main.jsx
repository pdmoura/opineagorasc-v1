import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";
import "./index.css";

// Configuração para eliminar warnings do React Router v7
const routerConfig = {
	future: {
		v7_startTransition: true,
		v7_relativeSplatPath: true,
	},
};

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<HelmetProvider>
			<BrowserRouter {...routerConfig}>
				<App />
			</BrowserRouter>
		</HelmetProvider>
	</React.StrictMode>,
);
