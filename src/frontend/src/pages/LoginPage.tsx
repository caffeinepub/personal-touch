import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useLogin } from "../hooks/useQueries";

export default function LoginPage() {
  const [name, setName] = useState("");
  const { setUserName } = useAppContext();
  const loginMutation = useLogin();
  const { login: iiLogin, isLoggingIn, identity } = useInternetIdentity();

  const handleLogin = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    // If not authenticated with II, trigger II login first
    if (!identity) {
      iiLogin();
      // After II login completes, the user will need to click again
      // Store the name so we can use it after
      localStorage.setItem("pt_pending_name", name.trim());
      return;
    }
    try {
      await loginMutation.mutateAsync(name.trim());
      setUserName(name.trim());
      localStorage.removeItem("pt_pending_name");
    } catch {
      toast.error("Login failed. Please try again.");
    }
  };

  // Auto-login after II authentication if pending name
  const handleIILogin = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name first");
      return;
    }
    iiLogin();
  };

  const isPending = loginMutation.isPending || isLoggingIn;

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, oklch(0.15 0.03 78 / 0.3) 0%, oklch(0.09 0 0) 65%)",
      }}
    >
      {/* Decorative background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/5" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-primary/10" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-primary/15" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        {/* Card */}
        <div
          className="rounded-2xl p-8 border border-border"
          style={{
            background: "oklch(0.12 0 0)",
            boxShadow:
              "0 25px 60px oklch(0 0 0 / 0.6), 0 0 40px oklch(0.72 0.10 78 / 0.08)",
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1
              className="font-script text-5xl text-primary mb-1"
              style={{ lineHeight: 1.2 }}
            >
              Personal Touch
            </h1>
            <p className="text-muted-foreground text-sm tracking-widest uppercase">
              Relationship Manager
            </p>
          </motion.div>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-primary/60 text-xs">✦</span>
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label
                className="text-sm text-muted-foreground/80 font-medium"
                htmlFor="login-name"
              >
                Your Name
              </label>
              <Input
                id="login-name"
                data-ocid="login.input"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="h-11 bg-input border-border text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60"
              />
            </div>

            {!identity ? (
              <Button
                data-ocid="login.primary_button"
                onClick={handleIILogin}
                disabled={isPending || !name.trim()}
                className="w-full h-11 font-semibold text-sm tracking-wide"
                style={{
                  background: "oklch(0.72 0.10 78)",
                  color: "oklch(0.10 0 0)",
                }}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Authenticating...
                  </>
                ) : (
                  "Connect & Enter"
                )}
              </Button>
            ) : (
              <Button
                data-ocid="login.primary_button"
                onClick={handleLogin}
                disabled={isPending || !name.trim()}
                className="w-full h-11 font-semibold text-sm tracking-wide"
                style={{
                  background: "oklch(0.72 0.10 78)",
                  color: "oklch(0.10 0 0)",
                }}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Entering...
                  </>
                ) : (
                  "Enter"
                )}
              </Button>
            )}
          </motion.div>

          <p className="text-center text-muted-foreground/40 text-xs mt-6">
            Your personal relationship intelligence platform
          </p>
        </div>
      </motion.div>
    </div>
  );
}
