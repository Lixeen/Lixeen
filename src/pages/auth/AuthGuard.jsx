import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // adjust path if needed

// Redirects logged-in users AWAY from login/signup
export function GuestOnly({ children }) {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && session) navigate("/", { replace: true });
  }, [session, loading]);

  if (loading || session) return null;
  return children;
}

// Redirects logged-out users AWAY from protected pages
export function RequireAuth({ children }) {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) navigate("/login", { replace: true });
  }, [session, loading]);

  if (loading || !session) return null;
  return children;
}