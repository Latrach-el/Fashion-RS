import MainLayout from "@/components/main-layout";
import ProtectedRoutes from "@/components/protected-routes";

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoutes>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoutes>
  );
}
