import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useCTFAuth } from "../context/CTFAuthContext.jsx";

export default function ProtectedCTFRoute({ children }) {
  const { player, loading } = useCTFAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-ctf-bg flex items-center justify-center">
        <div className="text-ctf-muted text-lg">Ładowanie...</div>
      </div>
    );
  }

  if (!player) return <Navigate to="/ctf/login" replace />;

  return children;
}

ProtectedCTFRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
