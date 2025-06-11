"use client";

import { Plus, Package, ShoppingCart, Minus } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/lib/types";

export default function CartProductCard({
  product,
  onAddToCart,
  onRemoveFromCart,
  onRemoveAllFromCart,
}: {
  product: Product;
  onAddToCart: (productId: number) => void;
  onRemoveFromCart: (productId: number) => void;
  onRemoveAllFromCart: (productId: number) => void;
}) {
  const formatPrice = (): string => {
    return `$${product.price.toFixed(2)}`;
  };

  const formatUnit = (): string => {
    if (product.amount_per_unit === 1) {
      return `per ${product.unit}`;
    }
    return `per ${product.amount_per_unit} ${product.unit}`;
  };

  const totalPrice = product.price * product.cart_quantity;

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-shrink-0">
            <Image
              src={product.image_url || "/placeholder.svg?height=100&width=100"}
              alt={product.name}
              width={100}
              height={100}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <Badge
              variant="secondary"
              className={`absolute -top-2 -right-2 text-xs ${
                product.in_stock
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-red-100 text-red-800 border-red-200"
              }`}>
              <Package className="w-3 h-3 mr-1" />
              {product.in_stock ? "In Stock" : "Out"}
            </Badge>
          </div>

          <div className="flex-1 space-y-2">
            <div>
              <h3 className="font-semibold text-lg leading-tight">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {product.stock_quantity > 0
                  ? `${product.stock_quantity} available`
                  : "Currently unavailable"}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-green-600">
                  {formatPrice()}
                </p>
                <p className="text-xs text-muted-foreground">{formatUnit()}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">
                  ${totalPrice.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                  onClick={() => onRemoveFromCart(product.id)}
                  disabled={product.cart_quantity === 0}>
                  <Minus className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm min-w-[20px] text-center">
                    {product.cart_quantity}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600"
                  onClick={() => onAddToCart(product.id)}
                  disabled={!product.in_stock}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemoveAllFromCart(product.id)}
                className="text-red-600 hover:bg-red-50">
                Remove All
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
