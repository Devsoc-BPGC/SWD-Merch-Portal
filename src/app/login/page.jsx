import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login | SWD Merch Portal",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
