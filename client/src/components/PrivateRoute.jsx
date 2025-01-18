import { shallowEqual, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader1 } from "./Loader";

export default function PrivateRoute() {
  const { userInfo } = useSelector((state) => state.auth, shallowEqual);

  const location = useLocation();

  if (userInfo === undefined) {
    return <Loader1 />;
  }

  return userInfo ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}
