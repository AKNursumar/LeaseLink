import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  fullName?: string;
}

interface Session {
  access_token: string;
  refresh_token: string;
}

interface WorkingAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
}

const WorkingAuthContext = createContext<WorkingAuthContextType | undefined>(undefined);

export const useWorkingAuth = () => {
  const context = useContext(WorkingAuthContext);
  if (!context) {
    throw new Error('useWorkingAuth must be used within a WorkingAuthProvider');
  }
  return context;
};

interface WorkingAuthProviderProps {
  children: ReactNode;
}

export const WorkingAuthProvider = ({ children }: WorkingAuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    const savedSession = localStorage.getItem('auth_session');
    
    if (savedUser && savedSession) {
      setUser(JSON.parse(savedUser));
      setSession(JSON.parse(savedSession));
    }
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    
    try {
      console.log('🔄 Attempting registration...');
      
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName }),
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Registration successful');
        return { success: true };
      } else {
        console.error('❌ Registration failed:', data.error);
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Connection failed' };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      console.log('🔄 Attempting login...');
      
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Login successful');
        setUser(data.user);
        setSession(data.session);
        
        // Save to localStorage
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        localStorage.setItem('auth_session', JSON.stringify(data.session));
        
        return { success: true };
      } else {
        console.error('❌ Login failed:', data.error);
        return { success: false, error: data.error || 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Connection failed' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    setSession(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_session');
    console.log('👋 Signed out successfully');
  };

  const value: WorkingAuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <WorkingAuthContext.Provider value={value}>
      {children}
    </WorkingAuthContext.Provider>
  );
};

export default WorkingAuthProvider;
