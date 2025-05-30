import { Edit, Trash2, Package } from "lucide-react";
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

export default function Component() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0">
        <div className="relative">
          <Image
            src="/placeholder.svg?height=200&width=300"
            alt="Organic Bananas"
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
            Organic Bananas
          </h3>
          <p className="text-sm text-muted-foreground">Fresh & Natural</p>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-green-600">$2.99</p>
            <p className="text-xs text-muted-foreground">per lb</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" className="flex-1">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
