"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const SettingsDropdown = () => {
  const router = useRouter();
  const session = useSession();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative flex items-center">
          <User className="h-6 w-6 mr-2" />
          <span className="hidden sm:block">Profile</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        {session.status === "authenticated" ? (
          <>
            <div className="px-2 py-1.5 text-sm font-medium">
              {session.data.user?.email}
            </div>
            <div className="h-px bg-border my-1" />
            {session.data.user?.role === "admin" && (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.push("/admin/dashboard")}
              >
                Dashboard
              </Button>
            )}
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                signOut({
                  redirect: false,
                });
                router.push("/login");
                router.refresh();
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default SettingsDropdown;
