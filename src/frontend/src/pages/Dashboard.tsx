import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import ContactSidebar from "../components/ContactSidebar";
import NotesSection from "../components/NotesSection";
import { useAppContext } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { type ContactCategory, useContacts } from "../hooks/useQueries";

export default function Dashboard() {
  const { userName, logout } = useAppContext();
  const { clear: iiClear } = useInternetIdentity();
  const [activeNav, setActiveNav] = useState("dashboard");
  const { data: contacts = [], isLoading } = useContacts();
  const [filterCategory, setFilterCategory] = useState<ContactCategory | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    iiClear();
    logout();
  };

  const navLinks = [
    { id: "dashboard", label: "Dashboard" },
    { id: "contacts", label: "Contacts" },
    { id: "search", label: "Search" },
    { id: "reports", label: "Reports" },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.09 0 0)" }}
    >
      <header
        className="sticky top-0 z-50 border-b border-border"
        style={{ background: "oklch(0.11 0 0)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-2">
            <h1
              className="font-script text-3xl text-primary"
              style={{ lineHeight: 1.2 }}
            >
              Personal Touch
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.id}
                data-ocid={`nav.${link.id}.link`}
                onClick={() => setActiveNav(link.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors relative ${
                  activeNav === link.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {activeNav === link.id && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center border border-primary/40 text-primary text-xs font-bold"
                style={{ background: "oklch(0.18 0.04 78)" }}
              >
                {userName?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block text-sm text-muted-foreground">
                {userName}
              </span>
            </div>
            <Button
              data-ocid="nav.logout.button"
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:block">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <ContactSidebar
          contacts={contacts}
          isLoading={isLoading}
          filterCategory={filterCategory}
          onFilterChange={setFilterCategory}
        />

        <main className="flex-1 overflow-y-auto">
          <NotesSection
            contacts={contacts}
            filterCategory={filterCategory}
            onFilterChange={setFilterCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </main>
      </div>

      <footer
        className="border-t border-border py-3 px-6 flex items-center justify-between text-xs text-muted-foreground/50"
        style={{ background: "oklch(0.11 0 0)" }}
      >
        <span>
          © {new Date().getFullYear()} Personal Touch. All rights reserved.
        </span>
        <span>
          Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary/60 hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </span>
      </footer>
    </div>
  );
}
