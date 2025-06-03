import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();

interface CartItem {
  itemId: number;
  quantity: number;
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

interface ProductResponse {
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

interface CartQuantityMap {
  [itemId: number]: number;
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('user-id');
    
    // Get the current day for working hours
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    
    // Get ALL existing products with their business info and today's working hours only
    const productsData = await prisma.item.findMany({
      include: {
        business: {
          include: {
            workingHours: {
              where: {
                day: today
              }
            }
          }
        }
      }
    });
    
    // Get cart quantities for all items if user is provided
    let cartItems: CartItem[] = [];
    if (userId) {
      cartItems = await prisma.cartItem.findMany({
        where: {
          cart: {
            userId: parseInt(userId)
          }
        },
        select: {
          itemId: true,
          quantity: true
        }
      });
    }
    
    // Create a map for quick cart quantity lookup
    const cartQuantityMap: CartQuantityMap = {};
    cartItems.forEach((item: CartItem) => {
      cartQuantityMap[item.itemId] = item.quantity;
    });
    
    // Transform the data to match component needs
    const response: ProductResponse[] = productsData.map(product => {
      // Get today's working hours (should be only one or none)
      const todayHours = product.business.workingHours[0] || null;
      
      return {
        id: product.id,
        name: product.name,
        image_url: product.image_url,
        price: Number(product.price),
        unit: product.unit,
        amount_per_unit: product.amount_per_unit,
        stock_quantity: product.stock_quantity,
        in_stock: product.stock_quantity > 0,
        cart_quantity: cartQuantityMap[product.id] || 0,
        business: {
          id: product.business.id,
          name: product.business.name,
          address: product.business.address,
          zip_code: product.business.zip_code,
          working_hours_today: todayHours ? {
            opens_at: todayHours.opens_at,
            closes_at: todayHours.closes_at
          } : null
        }
      };
    });

    return Response.json(response);
  } catch (error) {
    console.error('Error fetching products data:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}