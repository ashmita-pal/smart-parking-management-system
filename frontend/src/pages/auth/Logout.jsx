import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await api.post("/auth/logout");

        // Redirect to login after successful logout
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);

        // Even if the request fails, send the user to login
        navigate("/login");
      }
    };

    logoutUser();
  }, [navigate]);

  return null;
};

export default Logout;