import { Navigate } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { useEffect, useState } from 'react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useSite();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (currentUser) {
        // Force refresh the token to get latest custom claims
        const token = await currentUser.getIdTokenResult(true);
        setIsAdmin(!!token.claims.admin);
      } else {
        setIsAdmin(false);
      }
    };
    verifyAdmin();
  }, [currentUser]);

  if (isAdmin === null) return <div>Loading...</div>; // Prevent flicker
  return isAdmin ? <>{children}</> : <Navigate to="/login" />;
};