"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ProductForm from "@/components/forms/product-form";
import toast, { Toaster } from "react-hot-toast";

interface Product {
  id: number;
  businessId: number;
  name: string;
  image_url?: string;
  price: number;
  unit: string;
  amount_per_unit: number;
  stock_quantity: number;
}

export default function ProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [productData, setProductData] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("Failed to fetch product");

        const product = await res.json();
        setProductData(product);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load product");
      }
    };

    fetchProduct();
  }, [productId]);

  const updateProduct = async (data: Product) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update product");

      toast.success("Product updated!");
      router.push("/business");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      {productData ? (
        <ProductForm
          initialData={productData}
          onSubmit={updateProduct}
          isLoading={isLoading}
        />
      ) : (
        <div className="text-center p-6 text-gray-600">Loading product...</div>
      )}
    </>
  );
}
