import { NavbarDemo } from "@/components/Navbar";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Meteors } from "@/components/ui/meteors";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex w-screen h-screen bg-black flex-col ">
      <AuroraBackground>
        <NavbarDemo />
        <div className="mt-28">{children}</div>
      </AuroraBackground>
    </div>
  );
}
