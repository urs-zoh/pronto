"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Package, Plus } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { jwtDecode } from "jwt-decode";

interface Product {
  id: number;
  shopId: number;
  name: string;
  price: number;
  unit: string;
  amount_per_unit: number;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export default function BusinessPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const router = useRouter();

  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode<{ id: string }>(token);
        setBusinessId(decoded.id);
      } catch (err) {
        console.error("Invalid token", err);
      }
    } else {
      console.error("No token found");
    }
  }, []);

  useEffect(() => {
    if (businessId) {
      fetchProducts(businessId);
    }
  }, [businessId]);

  const fetchProducts = async (businessId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products?businessId=${businessId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    router.push("/business/products/create");
  };

  const handleEdit = (productId: number) => {
    router.push(`/business/products/edit/${productId}`);
  };

  const handleDelete = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setDeletingId(productId);

      // You'll need to create a DELETE endpoint in your API
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // Remove the product from the local state
      setProducts(products.filter((product) => product.id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getStockStatus = (stockQuantity: number) => {
    if (stockQuantity > 10) {
      return {
        label: "In Stock",
        className: "bg-green-100 text-green-800 border-green-200",
      };
    } else if (stockQuantity > 0) {
      return {
        label: "Low Stock",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    } else {
      return {
        label: "Out of Stock",
        className: "bg-red-100 text-red-800 border-red-200",
      };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            {/* <Button onClick={fetchProducts}>Try Again</Button> */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Product
        </Button>
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-3 sm:grid-cols-2">
        {/* Product Cards */}
        {products.map((product) => {
          const stockStatus = getStockStatus(product.stock_quantity);

          return (
            <Card key={product.id} className="w-full max-w-sm">
              <CardHeader className="p-0">
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=200&width=300"
                    alt={product.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge
                    variant="secondary"
                    className={`absolute top-2 right-2 ${stockStatus.className}`}>
                    <Package className="w-3 h-3 mr-1" />
                    {stockStatus.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Stock: {product.stock_quantity} units
                  </p>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {formatPrice(product.price)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.unit} ({product.amount_per_unit} per unit)
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(product.id)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDelete(product.id)}
                  disabled={deletingId === product.id}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  {deletingId === product.id ? "Deleting..." : "Delete"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="col-span-full flex items-center justify-center h-64">
            <div className="text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No products yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first product
              </p>
              <Button onClick={handleCreateNew}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Product
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
