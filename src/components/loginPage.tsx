"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Logging in with:", { username, password });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="flex w-full md:w-1/2 lg:w-1/3 items-center justify-center bg-white p-6 md:p-8">
        <Card className="w-full max-w-md shadow-md">
          <CardHeader>
            <img
              src="/img/logo.png"
              alt="Logo"
              className="mx-auto mb-4 h-16 md:h-28 lg:h-36"
            />
            <CardTitle className="text-center text-xl md:text-2xl lg:text-3xl font-bold">
              Login
            </CardTitle>
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
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
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
                  {/* This doesnt work */}
                  <label
                    htmlFor="remember"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Remember Me
                  </label>
                </div>
                <a
                  href="/recover"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Your Password?
                </a>
              </div>
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
        className="hidden md:flex w-full md:w-1/2 lg:w-2/3 bg-cover bg-center"
        style={{
          backgroundImage: "url('/img/login_background.jpg')",
        }}
      ></div>
    </div>
  );
}