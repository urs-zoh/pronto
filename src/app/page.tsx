/* eslint-disable @typescript-eslint/no-unused-vars */
// import Header from "@/components/header";

// export default function LoginPage() {
//   return (
//     <Header
//       name={businessData?.email || "Business Dashboard"}
//       cartItemCount={undefined}
//       shopLink="/business/"
//       historyLink="/business/orders"
//       profileLink={`/business/profile/${businessId}`}
//       shopName={businessData?.name || "Your Shop"}
//     />
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";

interface User {
  id: number;
  email: string;
  name: string;
  zip_code: string;
  role: string;
  created_at: string;
}

export default function UserProfilePage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Extract user ID from JWT token stored in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found, please login.");
      setLoading(false);
      return;
    }
    try {
      const decoded = jwtDecode<{ id: string }>(token);
      const idNum = parseInt(decoded.id);
      if (isNaN(idNum)) throw new Error("Invalid ID in token");
      setUserId(idNum);
    } catch (err) {
      setError("Invalid token.");
      setLoading(false);
    }
  }, []);

  // Fetch user data when userId is ready
  useEffect(() => {
    if (!userId) return;

    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/user/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("User not found.");
          } else if (res.status === 401) {
            throw new Error("Unauthorized access.");
          } else {
            throw new Error("Failed to fetch user data.");
          }
        }
        const data: User = await res.json();
        setUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
        <p className="text-muted-foreground">Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 items-center justify-center text-center">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <Button onClick={() => router.push("/login")}>Go to Login</Button>
      </div>
    );
  }

  if (!userData) {
    return null; // or some fallback
  }

  return (
    <>
      <Header
        name={userData.email}
        cartItemCount={undefined}
        shopLink="/"
        historyLink="/orders"
        profileLink={`/user/profile/${userId}`}
        shopName={userData.name}
      />
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

        <div className="space-y-4 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <p>{userData.name}</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Email</label>
            <p>{userData.email}</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Zip Code</label>
            <p>{userData.zip_code}</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Role</label>
            <p>{userData.role}</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Member Since</label>
            <p>{new Date(userData.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </main>
    </>
  );
}
