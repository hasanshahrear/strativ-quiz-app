"use client"

import { createContext, useContext, ReactNode, useState, useMemo } from 'react';
import { TAuthContextType } from './type';
import { TUser } from '@/models';

const AuthContext = createContext<TAuthContextType>(null!);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<TUser | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });


  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = useMemo(() => ({ user, setUser, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}