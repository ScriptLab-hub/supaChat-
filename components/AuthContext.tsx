import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { User } from '@supabase/supabase-js';

// --------------------
// Auth Context Type
// --------------------
interface AuthType {
  user: User | null;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create Context
const AuthContext = createContext<AuthType | null>(null);

// --------------------
// AuthProvider Component
// --------------------
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // --------------------
  // Register Function
  // --------------------
  const register = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error("❌ Registration error:", error.message);
      alert(error.message);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: name,
        avatar_url: `https://i.pravatar.cc/150?u=${data.user.id}`
      });

      if (profileError) {
        console.error("❌ Profile creation error:", profileError.message);
        alert(profileError.message);
      }
    }
  };

  // --------------------
  // Login Function
  // --------------------
  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("❌ Login error:", error.message);
      alert(error.message);
    }
  };

  // --------------------
  // Logout Function
  // --------------------
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      console.log("✅ User signed out successfully");
    } catch (error: any) {
      console.error("❌ Error signing out:", error.message);
      alert("Failed to sign out. Please try again.");
    }
  };

  // --------------------
  // Context Value
  // --------------------
  const value: AuthType = {
    user,
    register,
    login,
    logout,
  };

  // --------------------
  // Provider Return
  // --------------------
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// --------------------
// useAuth Hook
// --------------------
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
