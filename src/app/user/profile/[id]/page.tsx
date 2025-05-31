"use client";

import { Save, X, Mail, Eye, EyeOff, Trash2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignOutButton } from "@/components/sign-out";
import toast, { Toaster } from "react-hot-toast";

interface User {
  id: number;
  email: string;
  name: string;
  zip_code: string;
  created_at: Date;
}

export default function UserProfilePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const zipCodeRef = useRef<HTMLInputElement>(null);

  const params = useParams();
  const userId = params?.id;

  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      if (!userId) return;
      try {
        const res = await fetch(`/api/user/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch user data");
        const user = await res.json();
        setUserData(user);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
    fetchUser();
  }, [userId]);

  async function handleSave() {
    if (!userId) return;
    const updatedData = {
      name: nameRef.current?.value,
      email: emailRef.current?.value,
      password: passwordRef.current?.value || undefined,
      zip_code: zipCodeRef.current?.value,
    };

    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Failed to update user profile");
      const updatedUser = await res.json();
      setUserData(updatedUser);
      toast.success("User profile updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Error updating profile.");
    }
  }

  async function handleDelete(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    if (!userId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete your user profile? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/user/${userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user profile");
      alert("User profile deleted successfully!");
      localStorage.removeItem("token");
      router.push("/login");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting profile.");
    }
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
            <p className="text-gray-600 mt-2">
              Manage your personal information and account settings
            </p>
          </div>

          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  ref={nameRef}
                  id="name"
                  placeholder="Enter your full name"
                  defaultValue={userData?.name}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  ref={emailRef}
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  defaultValue={userData?.email}
                />
              </div>

              {/* Password */}
              <div className="space-y-2 relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  ref={passwordRef}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  defaultValue=""
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-9"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </div>

              {/* ZIP Code */}
              <div className="space-y-2">
                <Label htmlFor="zip_code">ZIP Code</Label>
                <Input
                  ref={zipCodeRef}
                  id="zip_code"
                  placeholder="Enter ZIP code"
                  defaultValue={userData?.zip_code}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Account ID
                    </p>
                    <p className="text-sm text-gray-500">{userData?.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Created</p>
                    <p className="text-sm text-gray-500">
                      {userData?.created_at
                        ? new Date(userData.created_at).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <SignOutButton />
            <Button variant="destructive" size="lg" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Profile
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.back()}>
              <X className="w-4 h-4 mr-2" />
              Cancel Changes
            </Button>
            <Button size="lg" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
