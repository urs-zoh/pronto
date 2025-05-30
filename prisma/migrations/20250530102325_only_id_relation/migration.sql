-- DropForeignKey
ALTER TABLE "BusinessOrderHistory" DROP CONSTRAINT "BusinessOrderHistory_businessId_fkey";

-- DropForeignKey
ALTER TABLE "BusinessOrderHistory" DROP CONSTRAINT "BusinessOrderHistory_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_cartId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_shopId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_shopId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Shop" DROP CONSTRAINT "Shop_businessId_fkey";

-- DropForeignKey
ALTER TABLE "UserOrderHistory" DROP CONSTRAINT "UserOrderHistory_orderId_fkey";

-- DropForeignKey
ALTER TABLE "UserOrderHistory" DROP CONSTRAINT "UserOrderHistory_userId_fkey";
