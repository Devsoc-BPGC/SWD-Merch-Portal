import AuthGuard from "@/components/auth/AuthGuard";

export const metadata = {
  title: "CSA Portal | SWD Merch Portal",
};

export default function CSAPortalLayout({ children }) {
  return <AuthGuard allowedRoles={["csa"]}>{children}</AuthGuard>;
}
