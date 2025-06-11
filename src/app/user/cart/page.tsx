"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { jwtDecode } from "jwt-decode";
import { Product, BusinessInfo } from "@/lib/types";
import ShopAccordion from "@/components/user/cart/shop-accordion";
import CheckoutCard from "@/components/user/cart/checkout-card";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function CartPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const decoded = jwtDecode<{ id: string }>(token);
      const idNum = parseInt(decoded.id);
      if (isNaN(idNum)) throw new Error("Invalid ID in token");
      setUserId(idNum);
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  }, []);

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const response = await fetch(`/api/cart?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch cart products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching cart products:", error);
      }
    };
    if (userId) {
      fetchCartProducts();
    }
  }, [userId]);

  // Group products by business
  const productsByBusiness = products.reduce((acc, product) => {
    const businessId = product.business.id;
    if (!acc[businessId]) {
      acc[businessId] = {
        business: product.business,
        products: [],
      };
    }
    acc[businessId].products.push(product);
    return acc;
  }, {} as Record<number, { business: BusinessInfo; products: Product[] }>);

  const handleAddToCart = (productId: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, cart_quantity: product.cart_quantity + 1 }
          : product
      )
    );
  };

  const handleRemoveFromCart = (productId: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId && product.cart_quantity > 0
          ? { ...product, cart_quantity: product.cart_quantity - 1 }
          : product
      )
    );
  };

  const handleRemoveAllFromCart = (productId: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, cart_quantity: 0 } : product
      )
    );
  };

  // Filter out products with 0 cart_quantity
  const cartProducts = products.filter((product) => product.cart_quantity > 0);

  async function handleCheckout(): Promise<void> {
    if (!userId) {
      alert("User not logged in.");
      return;
    }

    try {
      // Step 1: Check stock for each product
      for (const product of cartProducts) {
        const res = await fetch(`/api/products/${product.id}`);
        if (!res.ok) throw new Error("Failed to fetch product stock");
        const latestProduct = await res.json();
        if (latestProduct.stock_quantity < product.cart_quantity) {
          toast.error(
            `Sorry, "${product.name}" has only ${latestProduct.stock_quantity} items left in stock.`
          );
          return;
        }
      }

      // Step 2: Decrease stock for each product
      for (const product of cartProducts) {
        await fetch(`/api/products/${product.id}/decrease-stock`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: product.cart_quantity,
            userId,
          }),
        });
      }

      // Step 3: Clear user's cart
      const clearRes = await fetch(`/api/cart/clear`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!clearRes.ok) {
        throw new Error("Failed to clear cart");
      }

      // Step 4: Update UI
      setProducts([]);
      toast.success("Checkout successful!");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again.");
    }
  }

  return (
    <>
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {cartProducts.length === 0
              ? "Your cart is empty"
              : `${cartProducts.reduce(
                  (sum, p) => sum + p.cart_quantity,
                  0
                )} items in your cart`}
          </p>
        </div>

        {cartProducts.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-4">
              Add some products to get started
            </p>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Accordion
                type="multiple"
                defaultValue={Object.keys(productsByBusiness)}
                className="space-y-4">
                {Object.values(productsByBusiness).map(
                  ({ business, products: businessProducts }) => {
                    const cartBusinessProducts = businessProducts.filter(
                      (p) => p.cart_quantity > 0
                    );
                    if (cartBusinessProducts.length === 0) return null;

                    return (
                      <ShopAccordion
                        key={business.id}
                        business={business}
                        products={cartBusinessProducts}
                        onAddToCart={handleAddToCart}
                        onRemoveFromCart={handleRemoveFromCart}
                        onRemoveAllFromCart={handleRemoveAllFromCart}
                      />
                    );
                  }
                )}
              </Accordion>
            </div>

            <div className="lg:col-span-1">
              <CheckoutCard
                products={cartProducts}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
