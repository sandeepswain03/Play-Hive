import { useEffect } from "react";
import { LoginPopup } from "./index.js";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function AuthLayout({ children, authentication }) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (!authentication && authStatus !== authentication) {
      return <LoginPopup />;
    }
  }, [authStatus, authentication, navigate]);

  if (authentication && authStatus !== authentication) {
    return <LoginPopup />;
  }

  return children;
}

export default AuthLayout;
