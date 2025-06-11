import { ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  name: string;
  cartItemCount?: number;
  shopLink: string;
  historyLink: string;
  profileLink: string;
  shopName?: string;
}

export default function Header({
  name,
  cartItemCount,
  shopLink,
  historyLink,
  profileLink,
  shopName = "Pronto!",
}: HeaderProps) {
  const displayShopName = shopName || "Pronto!";

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-primary">
              {displayShopName}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href={shopLink}
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
              Shop
            </Link>
            <Link
              href={historyLink}
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
              History
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            {typeof cartItemCount === "number" && (
              <Link href="/user/cart">
                <Button variant="outline" size="sm" className="relative">
                  <ShoppingCart className="w-4 h-4" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartItemCount}
                  </Badge>
                </Button>
              </Link>
            )}

            {/* Profile */}
            <Link href={profileLink}>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 h-auto p-2">
                <User className="h-6 w-6 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {name}
                </span>
              </Button>
            </Link>
          </div>

          {/* Mobile - Icons */}
          <div className="md:hidden flex items-center space-x-2">
            {typeof cartItemCount === "number" && (
              <Link href="/user/cart">
                <Button variant="outline" size="sm" className="relative">
                  <ShoppingCart className="w-4 h-4" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartItemCount}
                  </Badge>
                </Button>
              </Link>
            )}

            <Link href={profileLink}>
              <Button variant="ghost" className="p-2">
                <User className="h-6 w-6 text-gray-500" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href={shopLink}
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">
              Shop
            </Link>
            <Link
              href={historyLink}
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">
              History
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
