"use client";

import {
  Save,
  X,
  Building,
  Mail,
  Lock,
  MapPin,
  Calendar,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignOutButton } from "@/components/ui/sign-out";
import { useParams, useRouter } from "next/navigation";
interface Business {
  id: number;
  email: string;
  name: string;
  address: string;
  zip_code: string;
  created_at: Date;
}

export default function BusinessProfilePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [businessData, setBusinessData] = useState<Business | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const zipCodeRef = useRef<HTMLInputElement>(null);

  const params = useParams();
  const businessId = params?.id;

  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!businessId) return;

      try {
        const res = await fetch(`/api/business/${businessId}`);
        if (!res.ok) throw new Error("Failed to fetch business data");

        const business = await res.json();
        setBusinessData(business);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchProduct();
  }, [businessId]);

  const handleSave = async () => {
    console.log("Saving business profile...");
    if (!businessId) return;

    const updatedData = {
      name: nameRef.current?.value,
      email: emailRef.current?.value,
      password: passwordRef.current?.value || undefined,
      address: addressRef.current?.value,
      zip_code: zipCodeRef.current?.value,
    };

    try {
      const res = await fetch(`/api/business/${businessId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Failed to update business profile");

      const updatedBusiness = await res.json();
      setBusinessData(updatedBusiness);
      alert("Business profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating profile.");
    }
  };

  async function handleDelete(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> {
    event.preventDefault();
    if (!businessId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete your business profile? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/business/${businessId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete business profile");

      alert("Business profile deleted successfully!");
      localStorage.removeItem("token");
      router.push("/login");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting profile.");
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Business Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your business information and settings
          </p>
        </div>

        {/* Schedule Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Business Hours</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your operating hours and schedule
                </p>
              </div>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                <Link href="/login/business-or-personal/business/hours">
                  Schedule Edit
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Business Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Business name</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  ref={nameRef}
                  id="name"
                  placeholder="Enter business name"
                  defaultValue={businessData?.name}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  ref={emailRef}
                  id="email"
                  type="email"
                  placeholder="business@example.com"
                  defaultValue={businessData?.email}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  ref={passwordRef}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  defaultValue="••••••••"
                  className="pl-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  ref={addressRef}
                  id="address"
                  placeholder="Enter complete address"
                  defaultValue={businessData?.address}
                  className="pl-10"
                />
              </div>
            </div>

            {/* ZIP Code */}
            <div className="space-y-2">
              <Label htmlFor="zip_code">ZIP Code</Label>
              <Input
                ref={zipCodeRef}
                id="zip_code"
                placeholder="Enter ZIP code"
                defaultValue={businessData?.zip_code}
                className="max-w-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
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
                  <p className="text-sm text-gray-500">{businessData?.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Created</p>
                  <p className="text-sm text-gray-500">
                    {businessData?.created_at
                      ? new Date(businessData.created_at).toLocaleDateString()
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <SignOutButton />
          <Button variant="destructive" size="lg" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Profile
          </Button>
          <Button variant="outline" size="lg">
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
  );
}
