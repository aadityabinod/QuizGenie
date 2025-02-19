import Link from "next/link";
import React from "react";

import UserAccountNav from "./UserAccountNav";
import SignInButton from "./SignInButton";
import { getAuthSession } from "@/lib/nextauth";

const Navbar = async () => {
  const session = await getAuthSession();
  return (
    <>
    <div className="fixed  inset-x-0 top-0 bg-gray-900 z-[10] h-16 border-b border-gray-700">
      <div className="flex items-center justify-between h-full px-8 mx-auto max-w-7xl">
        {/* Logo */}
        <Link href={"/"} className="flex items-center gap-2">
          <p className="text-2xl font-bold text-white hover:text-green-500 transition-colors">
            QuizGenie
          </p>
        </Link>
        <div className="flex items-center">
          {session?.user ? (
            <UserAccountNav user={session.user} />
          ) : (
            <SignInButton text={"Sign In"} />
          )}
        </div>
      </div>
    </div>

    <br />
   </>
  );
};

export default Navbar;