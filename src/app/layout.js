import { AuthProvider } from "@/hooks/useAuth";
import "./globals.css";

export const metadata = {
  title: "SWD Merch Portal",
  description: "SWD Store Control Portal — Merch management for clubs and CSA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
