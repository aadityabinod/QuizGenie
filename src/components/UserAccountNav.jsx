"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

const UserAccountNav = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none focus:outline-none">
        <UserAvatar
          className="w-10 h-10 border-2 border-gray-700 hover:border-green-500 transition-colors"
          user={{
            name: user.name || null,
            image: user.image || null,
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && (
              <p className="font-medium text-white">{user.name}</p>
            )}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-gray-400">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem asChild>
          <Link href="/" className="w-full text-white hover:bg-gray-700">
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-700" />

        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            signOut().catch(console.error);
          }}
          className="text-red-500 cursor-pointer hover:bg-gray-700"
        >
          Sign out
          <LogOut className="w-4 h-4 ml-2" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;