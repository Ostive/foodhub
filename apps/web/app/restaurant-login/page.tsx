"use client"

import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center px-6 py-10 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {/* Branding */}
        <a href="#" className="flex items-center gap-2 self-center font-medium text-lg text-foreground">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          FoodHUB Restaurant
        </a>

        {/* Optional Logo */}
        <div className="mx-auto">
          <Image
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=200&q=80"
            alt="FoodHUB logo"
            width={80}
            height={80}
            className="rounded-full"
          />
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} FoodHUB. All rights reserved.
        </p>
      </div>
    </div>
  )
}
