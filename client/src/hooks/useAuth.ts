// In src/hooks/useAuth.ts

export const useAuth = () => {
  const token = localStorage.getItem('accessToken');

  // The user is authenticated if a token exists.
  // A more robust implementation could also decode the token to check for expiration.
  return { isAuthenticated: !!token };
};