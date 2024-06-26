import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./reset.css";
import "./index.css";
import { store } from "./store/store";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		{/*makes redux store available application-wide*/}
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>
);
