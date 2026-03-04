import AuthGuard from "@/components/auth/AuthGuard";

export const metadata = {
  title: "Club Portal | SWD Merch Portal",
};

export default function ClubPortalLayout({ children }) {
  return <AuthGuard allowedRoles={["club"]}>{children}</AuthGuard>;
}
