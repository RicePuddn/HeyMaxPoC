"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RecoverPage() {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleRecover = async () => {
    setError("");
    setSuccess("");

    if (!username || !newPassword) {
      setError("Username and new password are required.");
      return;
    }

    try {
      const response = await fetch("/api/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, newPassword }),
      });

      if (response.ok) {
        setSuccess("Password updated successfully. You can now log in.");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update password.");
      }
    } catch (err) {
      console.error("Error recovering account:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="flex w-full md:w-1/2 lg:w-1/3 items-center justify-center bg-white p-6 md:p-8">
        <Card className="w-full max-w-md shadow-md">
          <CardHeader>
            <img src="/img/logo.png" alt="Logo" className="mx-auto mb-4 h-32 md:h-44 lg:h-56" />
            <CardTitle className="text-center text-xl md:text-2xl lg:text-3xl font-bold">
              Recover Password
            </CardTitle>
            <p className="text-center text-sm md:text-base text-gray-500 mt-2">
              Remember your password?{" "}
              <a href="/" className="text-blue-600 hover:underline">
                Log In
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
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="mt-1 block w-full"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}

              <Button className="w-full mt-4" onClick={handleRecover}>
                Update Password
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