"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/forms/product-form";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

interface ProductData {
  shopId: number;
  name: string;
  image_url?: string;
  price: number;
  unit: string;
  amount_per_unit: number;
  stock_quantity: number;
}

export default function ProductEditPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function createProduct(data: ProductData) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      const product = await response.json();
      console.log("Product created:", product);

      router.push("/business");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Toaster />
      <ProductForm onSubmit={createProduct} isLoading={isLoading} />
    </>
  );
}
