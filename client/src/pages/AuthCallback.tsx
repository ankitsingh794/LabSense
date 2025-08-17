import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const user = searchParams.get('user');

    if (accessToken && user) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', decodeURIComponent(user));
      
      // Redirect to the dashboard
      navigate('/dashboard');
    } else {
      navigate('/login?error=google_auth_failed');
    }
  }, [searchParams, navigate]);

  // Render a simple loading message while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading your session...</p>
    </div>
  );
};

export default AuthCallback;