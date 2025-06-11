"use client";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type UserData = {
  id: number;
  email: string;
  name: string;
};

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<{ id: string; email: string; name: string }>(token);
      const id = parseInt(decoded.id);
      if (isNaN(id)) throw new Error("Invalid ID");

      setUserData({
        id,
        email: decoded.email,
        name: decoded.name,
      });
    } catch (err) {
      console.error("Invalid token", err);
    }
  }, []);

  return userData;
}