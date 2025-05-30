"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, Save, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { jwtDecode } from "jwt-decode";

interface Product {
  id?: number;
  businessId: number;
  name: string;
  image_url?: string;
  price: number;
  unit: string;
  amount_per_unit: number;
  stock_quantity: number;
}

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Product) => Promise<void>;
  isLoading?: boolean;
}

export default function ProductForm({
  initialData,
  onSubmit,
  isLoading = false,
}: ProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    initialData?.image_url || "/placeholder.png"
  );

  const [formData, setFormData] = useState<Product>({
    businessId: initialData?.businessId || 0,
    name: initialData?.name || "",
    image_url: initialData?.image_url || "",
    price: initialData?.price || 0,
    unit: initialData?.unit || "",
    amount_per_unit: initialData?.amount_per_unit || 1,
    stock_quantity: initialData?.stock_quantity || 0,
  });

  useEffect(() => {
    if (!initialData) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode<{ id: string }>(token);
          setFormData((prev) => ({
            ...prev,
            businessId: Number(decoded.id),
          }));
        } catch (err) {
          console.error("Invalid token", err);
        }
      }
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setImagePreview(base64Image);
        setFormData((prev) => ({ ...prev, image_url: base64Image }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.businessId) return alert("Business ID is missing");
    if (!formData.name.trim()) return alert("Please enter a product name");
    if (!formData.unit.trim()) return alert("Please enter a unit");
    if (formData.price <= 0) return alert("Please enter a valid price");

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  const handleCancel = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {initialData?.id ? "Edit Product" : "Create New Product"}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Product Image</Label>
                <div className="relative">
                  <div
                    className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}>
                    <Image
                      src={imagePreview}
                      alt="Product preview"
                      width={300}
                      height={200}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                      <div className="text-white text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Click to change image</p>
                      </div>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Product Name */}
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input
                  name="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Price and Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Price Unit</Label>
                  <Input
                    name="unit"
                    placeholder="e.g. per kg"
                    value={formData.unit}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Amount per Unit */}
              <div className="space-y-2">
                <Label>Amount per Unit</Label>
                <Input
                  name="amount_per_unit"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount_per_unit}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Stock Quantity */}
              <div className="space-y-2">
                <Label>Stock Quantity</Label>
                <Input
                  name="stock_quantity"
                  type="number"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>

            <CardFooter className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleCancel}
                disabled={isLoading}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Product"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
