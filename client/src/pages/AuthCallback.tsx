import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const userParam = searchParams.get("user");

    try {
      if (accessToken && refreshToken && userParam) {
        const user = JSON.parse(decodeURIComponent(userParam));

        // Save tokens securely (localStorage for now, or use httpOnly cookies in production)
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        window.dispatchEvent(new Event("authChange"));

        // Redirect to dashboard
        navigate("/");
      } else {
        navigate("/login?error=google_auth_failed");
      }
    } catch (err) {
      console.error("Error parsing user info:", err);
      navigate("/login?error=invalid_user_data");
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Finalizing Google login...</p>
    </div>
  );
};

export default AuthCallback;
