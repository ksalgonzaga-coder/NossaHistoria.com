import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface AdminSession {
  id: number;
  email: string;
  timestamp: string;
}

export function useAdminAuth() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check for admin session in localStorage
    const storedSession = localStorage.getItem('adminSession');
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession);
        const sessionTime = new Date(parsed.timestamp).getTime();
        const currentTime = new Date().getTime();
        const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours

        // Check if session is still valid
        if (currentTime - sessionTime < sessionDuration) {
          setSession(parsed);
        } else {
          // Session expired
          localStorage.removeItem('adminSession');
        }
      } catch (error) {
        console.error('Failed to parse admin session:', error);
        localStorage.removeItem('adminSession');
      }
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('adminSession');
    setSession(null);
    setLocation('/admin-login');
  };

  return {
    session,
    isLoading,
    isAuthenticated: !!session,
    logout,
  };
}
