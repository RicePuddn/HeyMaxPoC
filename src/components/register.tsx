"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleRegister = async () => {
    setError("");

    if (!username || !password || !location || !role) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, location, role }),
      });

      if (response.ok) {
        toast({
          title: "Account created successfully!",
          description: "You can now log in to your account.",
          variant: "success",
        });
        router.push("/");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create account.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="flex w-full md:w-1/2 lg:w-1/3 items-center justify-center bg-white p-6 md:p-8">
        <Card className="w-full max-w-md shadow-md">
          <CardHeader>
            <img src="/img/logo.png" alt="Logo" className="mx-auto mb-4 h-32 md:h-44 lg:h-56" />
            <CardTitle className="text-center text-xl md:text-2xl lg:text-3xl font-bold">Register</CardTitle>
            <p className="text-center text-sm md:text-base text-gray-500 mt-2">
              Already have an account?{" "}
              <a href="/" className="text-blue-600 hover:underline">
                Log In Here
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
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <Input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your location"
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <Select onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <Button className="w-full mt-4" onClick={handleRegister}>
                Register
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
          backgroundImage: "url('/img/register_background.jpg')",
        }}
      ></div>
    </div>
  );
}