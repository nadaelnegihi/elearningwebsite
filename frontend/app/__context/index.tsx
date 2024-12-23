"use client"
import { createContext, JSX, ReactNode, useContext, useState } from "react";

type UserDataType = {
  role: string;
  // setRole: (newValue: string) => void;
};
const UserDataContext = createContext<UserDataType | undefined>(undefined);

export function UserDataProvider ({ children, role }: { children: ReactNode, role: string }) {

  return (
    <UserDataContext.Provider value={{ role }}>
      {children}
    </UserDataContext.Provider>
  );
}

export const useUserContext = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserContext must be used within a MyProvider");
  }
  return context;
};