/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Header from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import ProductCardWithCart from "@/components/user/product-card-user";

interface User {
  id: number;
  email: string;
  name: string;
  zip_code: string;
  role: string;
  created_at: string;
}

interface WorkingHour {
  opens_at: string;
  closes_at: string;
}

interface BusinessInfo {
  id: number;
  name: string;
  address: string;
  zip_code: string;
  working_hours_today: WorkingHour | null;
}

interface Product {
  id: number;
  name: string;
  image_url: string;
  price: number;
  unit: string;
  amount_per_unit: number;
  stock_quantity: number;
  in_stock: boolean;
  cart_quantity: number;
  business: BusinessInfo;
}

export default function UserProfilePage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartItemCount, setCartItemCount] = useState<number>(0);

  const [sortByPrice, setSortByPrice] = useState<"asc" | "desc" | "none">(
    "none"
  );
  const [sortByStock, setSortByStock] = useState<"asc" | "desc" | "none">(
    "none"
  );
  const [shopFilter, setShopFilter] = useState("");
  const [zipFilter, setZipFilter] = useState("");

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

  // Fetch products when userId is ready
  useEffect(() => {
    if (!userId) return;

    async function fetchProducts() {
      setProductsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/products/shop", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "user-id": userId!.toString(),
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch products.");
        }

        const productsData: Product[] = await res.json();
        setProducts(productsData);

        // Calculate total cart items
        const totalCartItems = productsData.reduce((total, product) => {
          return total + product.cart_quantity;
        }, 0);
        setCartItemCount(totalCartItems);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setProductsLoading(false);
      }
    }

    fetchProducts();
  }, [userId]);

  // Handle adding to cart
  const handleAddToCart = async (productId: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          itemId: productId,
          quantity: 1,
        }),
      });

      if (res.ok) {
        // Update the product's cart quantity locally
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId
              ? { ...product, cart_quantity: product.cart_quantity + 1 }
              : product
          )
        );
        setCartItemCount((prevCount) => prevCount + 1);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  // Handle removing all from cart
  const handleRemoveAllFromCart = async (productId: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          itemId: productId,
        }),
      });

      if (res.ok) {
        // Update the product's cart quantity locally
        const productToUpdate = products.find((p) => p.id === productId);
        const removedQuantity = productToUpdate?.cart_quantity || 0;

        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId
              ? { ...product, cart_quantity: 0 }
              : product
          )
        );
        setCartItemCount((prevCount) => prevCount - removedQuantity);
      }
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

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
    return null;
  }

  // Filter and sort products based on user input
  const filteredAndSortedProducts = products
    .filter((product) => {
      const shopMatches = product.business.name
        .toLowerCase()
        .includes(shopFilter.toLowerCase());
      const zipMatches = product.business.zip_code
        .toString()
        .includes(zipFilter);
      return shopMatches && zipMatches;
    })
    .sort((a, b) => {
      // First: price sorting
      if (sortByPrice !== "none") {
        const priceDiff = a.price - b.price;
        if (priceDiff !== 0) {
          return sortByPrice === "asc" ? priceDiff : -priceDiff;
        }
      }

      // Then: stock sorting
      if (sortByStock !== "none") {
        const stockDiff = a.stock_quantity - b.stock_quantity;
        if (stockDiff !== 0) {
          return sortByStock === "asc" ? stockDiff : -stockDiff;
        }
      }

      return 0; // No sorting applied or both equal
    });

  return (
    <>
      <Header
        name={userData.email}
        cartItemCount={cartItemCount}
        shopLink="/"
        historyLink="/orders"
        profileLink={`/user/profile/${userId}`}
        shopName={userData.name}
      />

      <div className="container mx-auto p-4">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex gap-4 mb-4">
            <select
              value={sortByPrice}
              onChange={(e) =>
                setSortByPrice(e.target.value as "asc" | "desc" | "none")
              }
              className="border rounded p-2">
              <option value="none">Sort by Price</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>

            <select
              value={sortByStock}
              onChange={(e) =>
                setSortByStock(e.target.value as "asc" | "desc" | "none")
              }
              className="border rounded p-2">
              <option value="none">Sort by Stock</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Filter by Shop Name"
            value={shopFilter}
            onChange={(e) => setShopFilter(e.target.value)}
            className="border rounded p-2"
          />

          <input
            type="text"
            placeholder="Filter by ZIP Code"
            value={zipFilter}
            onChange={(e) => setZipFilter(e.target.value)}
            className="border rounded p-2"
          />
        </div>

        {productsLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-muted-foreground ml-4">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.length > 0 ? (
              filteredAndSortedProducts.map((product) => (
                <ProductCardWithCart
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  image_url={product.image_url}
                  price={product.price}
                  unit={product.unit}
                  amount_per_unit={product.amount_per_unit}
                  stock_quantity={product.stock_quantity}
                  in_stock={product.in_stock}
                  cart_quantity={product.cart_quantity}
                  business={product.business}
                  onAddToCart={handleAddToCart}
                  onRemoveAllFromCart={handleRemoveAllFromCart}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">
                  No products available at the moment.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
