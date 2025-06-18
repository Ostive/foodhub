"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Import our authentication hooks
import { useLogin } from "@/lib/hooks/use-auth";
import { useAuth } from "@/lib/auth/auth-context";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // Use our login mutation hook
  const { mutate: login, isPending: isLoading, error: loginError } = useLogin();
  const { isAuthenticated, user } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate form fields
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    // Call login mutation
    login(
      { email, password },
      {
        onSuccess: (data) => {
          // Check if the user has the correct role
          if (data.user.role !== 'admin' && data.user.role !== 'manager' && data.user.role !== 'developer') {
            setError("This login is only for administrators. Please use the appropriate login page.");
            return;
          }
          
          // Redirect to admin dashboard after successful login
          router.push("/admin/dashboard");
        },
        onError: (error: Error) => {
          setError(error.message || "Login failed. Please try again.");
        }
      }
    );
  };
  
  // Redirect if already authenticated using useEffect
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin' || user?.role === 'manager' || user?.role === 'developer') {
        router.push("/admin/dashboard");
      } else {
        // If authenticated but wrong role, redirect to appropriate dashboard
        switch(user?.role) {
          case 'customer':
            router.push("/customer");
            break;
          case 'restaurant':
            router.push("/restaurant/dashboard");
            break;
          case 'delivery_person':
            router.push("/deliver/dashboard");
            break;
          default:
            router.push("/");
        }
      }
    }
  }, [isAuthenticated, user, router]);
  
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          {error && (
            <div className="mt-2 text-sm text-red-500">
              {error}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Admin Login
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
