"use client";

import React from "react";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useStoreUser } from "@/hooks/use-store-user";
import { BarLoader } from "react-spinners";
import { Authenticated, Unauthenticated } from "convex/react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

export default function Header() {
  const { isLoading } = useStoreUser();
  const path = usePathname();

  if (path.includes("/editor")) {
    return null; // Hide header on editor page
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#DADDE3] bg-white/95 backdrop-blur text-nowrap">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-xl font-semibold tracking-tight text-[#111827]">
            ChitraMingle
          </span>
          <span className="hidden border-l border-[#DADDE3] pl-2 text-xs text-[#6B7280] sm:inline">
            image editor
          </span>
        </Link>

        {path === "/" && (
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-[#374151] hover:text-[#002FA7]"
            >
              Tools
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-[#374151] hover:text-[#002FA7]"
            >
              Pricing
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-3">
          <Authenticated>
            <Link href="/dashboard">
              <Button variant="glass" className="hidden sm:flex">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden md:flex">Projects</span>
              </Button>
            </Link>

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 rounded-lg border border-white/20",
                  userButtonPopoverCard:
                    "shadow-xl bg-white border border-[#DADDE3]",
                  userPreviewMainIdentifier: "font-semibold text-[#111827]",
                },
              }}
              afterSignOutUrl="/"
            />
          </Authenticated>

          <Unauthenticated>
            <SignInButton>
              <Button variant="glass" className="hidden sm:flex">
                Sign in
              </Button>
            </SignInButton>

            <SignUpButton>
              <Button variant="primary">Get started</Button>
            </SignUpButton>
          </Unauthenticated>
        </div>
        {isLoading && (
          <div className="fixed bottom-0 left-0 w-full z-40 flex justify-center">
            <BarLoader width={"95%"} color="#002FA7" />
          </div>
        )}
      </div>
    </header>
  );
}
