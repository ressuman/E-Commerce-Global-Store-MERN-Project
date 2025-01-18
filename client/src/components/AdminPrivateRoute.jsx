import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";
import { toast } from "react-toastify";
import { Loader1 } from "./Loader";

export default function AdminPrivateRoute() {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!userInfo) {
    toast.error("You must be logged in to access this page.");
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  if (!userInfo) {
    return <Loader1 />;
  }

  if (!userInfo.isAdmin) {
    toast.error("Access denied. Admin privileges required.");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
