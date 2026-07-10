import "../globals.css";
import Navbar from "@/components/common/navbar";

// No <Providers> here — the root layout (app/layout.js) already supplies them.
// A second QueryClientProvider would give this subtree its own cache, so a user
// signing in would land on a dashboard that cannot see the session just written.

export const metadata = {
  title: "Sign In | TBM Building Services",
  description: "Log in or create your TBM account to manage projects, save designs, and shop materials.",
};

export default function AuthLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
