"use client";

import { MapPin, Clock } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CartProductCard from "@/components/user/cart/cart-product-card";
import { Product, BusinessInfo } from "@/lib/types";

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const hour = Number.parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export default function ShopAccordion({
  business,
  products,
  onAddToCart,
  onRemoveFromCart,
  onRemoveAllFromCart,
}: {
  business: BusinessInfo;
  products: Product[];
  onAddToCart: (productId: number) => void;
  onRemoveFromCart: (productId: number) => void;
  onRemoveAllFromCart: (productId: number) => void;
}) {
  const formatWorkingHours = (): string => {
    if (!business.working_hours_today) {
      return "Closed today";
    }
    const openTime = formatTime(business.working_hours_today.opens_at);
    const closeTime = formatTime(business.working_hours_today.closes_at);
    return `${openTime} - ${closeTime}`;
  };

  const totalItems = products.reduce(
    (sum, product) => sum + product.cart_quantity,
    0
  );
  const shopTotal = products.reduce(
    (sum, product) => sum + product.price * product.cart_quantity,
    0
  );

  return (
    <AccordionItem value={business.id.toString()} className="border rounded-lg">
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <div className="flex items-center justify-between w-full mr-4">
          <div className="text-left">
            <h3 className="font-semibold text-lg">{business.name}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>
                  {business.address}, {business.zip_code}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatWorkingHours()}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">${shopTotal.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">{totalItems} items</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="space-y-3">
          {products.map((product) => (
            <CartProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              onRemoveAllFromCart={onRemoveAllFromCart}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
