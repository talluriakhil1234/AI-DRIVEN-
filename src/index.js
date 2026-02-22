// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
import { CartProvider } from "./components/context/CartContext";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_AdmxhyKeU",
  client_id: "7ukvon3a8gqpl9uh9imt2darp8",
  redirect_uri: "http://localhost:3000/home",
  logout_uri: "http://localhost:3000/logout-success",
  response_type: "code",
  scope: "email openid phone profile",

  //automaticSilentRenew: true, // Keep this true for good UX
 // revokeTokensOnSignout: true, // Recommended for security
};

const root = ReactDOM.createRoot(document.getElementById("root"));

// ✅ Single render call wrapping both providers
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);