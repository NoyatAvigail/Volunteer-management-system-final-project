import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from './src/components/App.jsx';
import './src/style/index.css';
import { CodesProvider } from './src/components/Models.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CodesProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter> 
    </CodesProvider>
  </React.StrictMode>
);