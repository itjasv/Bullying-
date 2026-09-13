"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const AuthContext = createContext({ user: null, checked: false });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let mounted = true;
    let authListener = null;

    try {
      const supabase = createClient();

      supabase.auth.getUser().then(({ data }) => {
        if (mounted) {
          setUser(data?.user || null);
          setChecked(true);
        }
      });

      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (mounted) {
          setUser(session?.user || null);
          setChecked(true);
        }
      });
      authListener = data;
    } catch (err) {
      // Gracefully handle missing Supabase credentials in dev mode
      console.warn("Supabase client could not be created. Missing environment variables?");
      if (mounted) setChecked(true);
    }

    return () => {
      mounted = false;
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, checked }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
