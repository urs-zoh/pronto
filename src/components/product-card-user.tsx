import { Plus, MapPin, Clock, Package, ShoppingCart, X } from "lucide-react";
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

interface ProductCardProps {
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
  onAddToCart?: (productId: number) => void;
  onRemoveFromCart?: (productId: number) => void;
  onRemoveAllFromCart?: (productId: number) => void;
}

// Helper function to format time from 24h to 12h format
const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export default function ProductCardWithCart({
  id,
  name,
  image_url,
  price,
  unit,
  amount_per_unit,
  stock_quantity,
  in_stock,
  cart_quantity,
  business,
  onAddToCart,
  // onRemoveFromCart,
  onRemoveAllFromCart,
}: ProductCardProps) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(id);
    }
  };

  // const handleRemoveFromCart = () => {
  //   if (onRemoveFromCart) {
  //     onRemoveFromCart(id);
  //   }
  // };

  const handleRemoveAllFromCart = () => {
    if (onRemoveAllFromCart) {
      onRemoveAllFromCart(id);
    }
  };

  // Format working hours for display
  const formatWorkingHours = (): string => {
    if (!business.working_hours_today) {
      return "Closed today";
    }
    const openTime = formatTime(business.working_hours_today.opens_at);
    const closeTime = formatTime(business.working_hours_today.closes_at);
    return `Today: ${openTime} - ${closeTime}`;
  };

  // Format price with currency
  const formatPrice = (): string => {
    return `$${price.toFixed(2)}`;
  };

  // Format unit display
  const formatUnit = (): string => {
    if (amount_per_unit === 1) {
      return `per ${unit}`;
    }
    return `per ${amount_per_unit} ${unit}`;
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0">
        <div className="relative">
          <Image
            src={image_url || "/placeholder.svg?height=200&width=300"}
            alt={name}
            width={300}
            height={200}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <Badge
            variant="secondary"
            className={`absolute top-2 right-2 ${
              in_stock
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-red-100 text-red-800 border-red-200"
            }`}>
            <Package className="w-3 h-3 mr-1" />
            {in_stock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg leading-tight">{name}</h3>
          <p className="text-sm text-muted-foreground">
            {stock_quantity > 0
              ? `${stock_quantity} available`
              : "Currently unavailable"}
          </p>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="font-medium text-sm">{business.name}</h4>
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <div>
              <p>{business.address}</p>
              <p>{business.zip_code}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span>{formatWorkingHours()}</span>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-green-600">{formatPrice()}</p>
            <p className="text-xs text-muted-foreground">{formatUnit()}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="w-full flex items-center justify-between bg-gray-50 rounded-lg p-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
            onClick={handleRemoveAllFromCart}
            disabled={cart_quantity === 0}>
            <X className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-3">
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-sm min-w-[20px] text-center">
              {cart_quantity}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600"
            onClick={handleAddToCart}
            disabled={!in_stock}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
