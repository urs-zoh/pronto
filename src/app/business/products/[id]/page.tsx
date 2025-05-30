"use client";

import ProductForm from "@/components/forms/product-form";
import { useParams } from "next/navigation";

export default function ProductEditPage() {
  const { id } = useParams();
  const data = fetch(`/api/products/${id}`);

  const updateProduct = async (formData: FormData) => {
    "use server";
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to update product");
    }
  };

  return <ProductForm initialData={data} onSubmit={updateProduct} />;
}
