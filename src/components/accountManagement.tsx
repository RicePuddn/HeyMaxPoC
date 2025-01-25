"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AccountPage() {
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");

        const response = await fetch("/api/account", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
          setLocation(data.location);
        } else {
          const data = await response.json();
          toast({ title: data.error || "Failed to fetch user data.", variant: "destructive" });
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        toast({ title: "Error fetching user data.", variant: "destructive" });
      }
    };

    fetchUserData();
  }, [toast]);

  // Update user details
  const handleUpdate = async () => {
    setError("");

    if (!newUsername && !password && !location) {
      setError("Please fill in at least one field to update.");
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");

      const response = await fetch("/api/account", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ newUsername, password, location }),
      });

      if (response.ok) {
        toast({ title: "Account updated successfully.", variant: "success" });
        setNewUsername("");
        setPassword("");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update account.");
      }
    } catch (err) {
      console.error("Error updating account:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Current Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                disabled
                className="mt-1 block w-full bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="newUsername" className="block text-sm font-medium text-gray-700">
                New Username
              </label>
              <Input
                id="newUsername"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter a new username"
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a new password"
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

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button className="w-full bg-green-600 hover:bg-green-700 mt-4" onClick={handleUpdate}>
              Update Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}