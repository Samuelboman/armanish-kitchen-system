import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../context/auth-context";

// Only signed-in admins see admin pages; everyone else goes to the admin login.
export default function RequireAdmin({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "checking") {
    return (
      <p role="status" className="px-4 py-24 text-center text-muted">
        Checking your login
      </p>
    );
  }
  if (status !== "signedIn") {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
