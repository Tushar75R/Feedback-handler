import { NavbarDemo } from "@/components/Navbar";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Meteors } from "@/components/ui/meteors";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div>
      {children}
      <BackgroundBeams />
    </div>
  );
}
