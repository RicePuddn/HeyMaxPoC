"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams(); 

  useEffect(() => {
    const role = localStorage.getItem("role"); 

    if (role === "customer") {
      router.push("/customer-home"); 
    } else if (role === "seller") {
      router.push("/seller-dashboard"); 
    }
  }, [router]);

  const handleLogin = async () => {
    setError("");

    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();

        console.log("Login successful:", data);

        localStorage.setItem("username", data.user.username);
        localStorage.setItem("role", data.user.role);

        const redirectPath =
          searchParams.get("redirect") || (data.user.role === "customer" ? "/customer-home" : "/seller-dashboard");

        console.log("Redirecting to:", redirectPath);

        router.push(redirectPath);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Invalid login details");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="flex w-full md:w-1/2 lg:w-1/3 items-center justify-center bg-white p-6 md:p-8">
        <Card className="w-full max-w-md shadow-md">
          <CardHeader>
            <img src="/img/logo.png" alt="Logo" className="mx-auto mb-4 h-32 md:h-44 lg:h-56" />
            <CardTitle className="text-center text-xl md:text-2xl lg:text-3xl font-bold">Login</CardTitle>
            <p className="text-center text-sm md:text-base text-gray-500 mt-2">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-600 hover:underline">
                Get Started Now
              </a>
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="mt-1 block w-full"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center mb-2 sm:mb-0">
                  <Checkbox id="remember" />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                    Remember Me
                  </label>
                </div>
                <a href="/recover" className="text-sm text-blue-600 hover:underline">
                  Forgot Your Password?
                </a>
              </div>

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <Button className="w-full mt-4" onClick={handleLogin}>
                Log In
              </Button>
            </div>
          </CardContent>
          <p className="mt-4 text-center text-xs text-gray-400">
            Copyright © 2025 Ernest Heng HeyMax PoC. All rights reserved. ☺️
          </p>
        </Card>
      </div>

      <div
        className="hidden md:flex w-full md:w-1/2 lg:w-2/3 bg-cover bg-center opacity-85"
        style={{
          backgroundImage: "url('/img/login_background.jpg')",
        }}
      ></div>
    </div>
  );
}