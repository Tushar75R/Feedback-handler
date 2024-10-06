"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Menu, MenuItem } from "./ui/navbar-menu";

export function NavbarDemo() {
  return (
    <div className="relative w-full  flex items-center justify-center">
      <Navbar className="top-2" />
    </div>
  );
}
const Navbar = ({ className }: { className?: string }) => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const [active, setActive] = useState<string | null>(null);

  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        {/* Left Side: First Item */}
        <div className="flex-grow text-left">
          <MenuItem setActive={setActive} active={active} item="FeedCast">
            <Link href={"/"} />
          </MenuItem>
        </div>

        {/* Center: Hello Username */}
        <div className="flex-grow text-center">
          {session && (
            <MenuItem
              setActive={setActive}
              active={active}
              item={`hello' ${user.username}`}
            />
          )}
        </div>

        {/* Right Side: Remaining Items */}
        <div className="flex-grow text-right flex items-center justify-end space-x-4">
          <MenuItem setActive={setActive} active={active} item="Contact Us" />
          {session ? (
            <MenuItem setActive={setActive} active={active} item="LogOut">
              <Button className="w-full md:w-auto" onClick={() => signOut()}>
                Logout
              </Button>
            </MenuItem>
          ) : (
            <MenuItem setActive={setActive} active={active} item="Join-Us">
              <Link href={"/sign-in"} className="mr-3 mb-3">
                <Button className="w-full text-black border-black border-4 rounded-xl md:w-auto">
                  Login
                </Button>
              </Link>
              <Link href={"/sign-up"}>
                <Button className="w-full text-black border-black border-4 rounded-xl md:w-auto">
                  Register
                </Button>
              </Link>
            </MenuItem>
          )}
        </div>
      </Menu>
    </div>
  );
};
