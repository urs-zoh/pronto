"use client";

import { ShoppingCart, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/lib/types";

type CheckoutCardProps = {
  products: Product[];
  onCheckout: () => void; // <- Add this
};

export default function CheckoutCard({
  products,
  onCheckout,
}: CheckoutCardProps) {
  const totalItems = products.reduce(
    (sum, product) => sum + product.cart_quantity,
    0
  );
  const subtotal = products.reduce(
    (sum, product) => sum + product.price * product.cart_quantity,
    0
  );
  const total = subtotal;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Items ({totalItems})</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <p className="text-xs text-muted-foreground">All prices include VAT</p>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          onClick={onCheckout}
          disabled={totalItems === 0}>
          <CreditCard className="w-4 h-4 mr-2" />
          Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  );
}
