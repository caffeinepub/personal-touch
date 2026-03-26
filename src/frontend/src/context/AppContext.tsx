import { type ReactNode, createContext, useContext, useState } from "react";
import type { Contact } from "../backend";

interface AppContextValue {
  userName: string | null;
  setUserName: (name: string) => void;
  selectedContact: Contact | null;
  setSelectedContact: (contact: Contact | null) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userName, setUserNameState] = useState<string | null>(() => {
    return localStorage.getItem("pt_username");
  });
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const setUserName = (name: string) => {
    localStorage.setItem("pt_username", name);
    setUserNameState(name);
  };

  const logout = () => {
    localStorage.removeItem("pt_username");
    setUserNameState(null);
    setSelectedContact(null);
  };

  return (
    <AppContext.Provider
      value={{
        userName,
        setUserName,
        selectedContact,
        setSelectedContact,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
