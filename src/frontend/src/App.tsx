import { Toaster } from "@/components/ui/sonner";
import { AppProvider, useAppContext } from "./context/AppContext";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";

function AppContent() {
  const { userName } = useAppContext();
  return (
    <>
      {userName ? <Dashboard /> : <LoginPage />}
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
