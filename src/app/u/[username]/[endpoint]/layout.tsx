import { NavbarDemo } from "@/components/Navbar";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarDemo />
      <div className="">{children}</div>
    </div>
  );
}
