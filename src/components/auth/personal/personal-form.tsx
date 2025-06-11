"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export function PersonalForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [form, setForm] = useState({
    name: "",
    zip: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setError("");
    setSuccess("");
  };

  // const handleSubmit = async (e: React.FormEvent) => {

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          name: form.name,
          type: "user",
          role: "user",
          zip_code: form.zip,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      // 🔑 Automatically log in the user
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          type: "user",
        }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error(loginData.error || "Login failed");

      localStorage.setItem("token", loginData.token);
      document.cookie = `token=${loginData.token}; path=/; max-age=604800`;

      // ✅ Navigate to home
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  //   if (form.password !== form.confirmPassword) {
  //     setError("Passwords do not match.");
  //     return;
  //   }

  //   try {
  //     const res = await fetch("/api/auth/register", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         email: form.email,
  //         password: form.password,
  //         name: form.name,
  //         type: "user",
  //         role: "user", // Assuming role is user for personal registration
  //         zip_code: form.zip,
  //       }),
  //     });

  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.message || "Registration failed");

  //     setSuccess("Registration successful!");
  //     setTimeout(() => {
  //       router.push("/");
  //     }, 2000);
  //   } catch (err: unknown) {
  //     if (err instanceof Error) {
  //       setError(err.message);
  //     } else {
  //       setError("An unexpected error occurred.");
  //     }
  //   }
  // };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Personal Info</CardTitle>
          <CardDescription>
            Enter your personal details to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  type="text"
                  placeholder="12345"
                  pattern="[0-9]{5}"
                  value={form.zip}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Repeat Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}

              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
