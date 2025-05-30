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

export default function ProductCardWithCart() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0">
        <div className="relative">
          <Image
            src="/placeholder.svg?height=200&width=300"
            alt="Fresh Strawberries"
            width={300}
            height={200}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <Badge
            variant="secondary"
            className="absolute top-2 right-2 bg-green-100 text-green-800 border-green-200">
            <Package className="w-3 h-3 mr-1" />
            In Stock
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg leading-tight">
            Fresh Strawberries
          </h3>
          <p className="text-sm text-muted-foreground">Sweet & Juicy</p>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Berry Fresh Market</h4>
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <div>
              <p>456 Oak Avenue</p>
              <p>Riverside, 67890</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span>Today: 7:00 AM - 10:00 PM</span>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-green-600">$4.99</p>
            <p className="text-xs text-muted-foreground">per container</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="w-full flex items-center justify-between bg-gray-50 rounded-lg p-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600">
            <X className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-3">
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-sm min-w-[20px] text-center">
              2
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
