/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin, Package } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function getTodayBusinessHours(workingHours: any[]) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayHours = workingHours.find((hour) => hour.day === today);
  return todayHours
    ? `${todayHours.opens_at} - ${todayHours.closes_at}`
    : "Closed";
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "processing":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function groupItemsByBusiness(orderItems: any[]) {
  const grouped = orderItems.reduce((acc, orderItem) => {
    const businessId = orderItem.item.business.id;
    if (!acc[businessId]) {
      acc[businessId] = {
        business: orderItem.item.business,
        items: [],
      };
    }
    acc[businessId].items.push(orderItem);
    return acc;
  }, {});

  return Object.values(grouped);
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

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
    if (userId === undefined || userId === null) return;

    async function fetchOrders() {
      try {
        const res = await fetch(`/api/history?userId=${userId}`);
        if (!res.ok) {
          console.error("Fetch failed", res.status);
          return;
        }
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to load order history", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [userId]);

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading order history…
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Order History</h1>
        <p className="text-muted-foreground">
          View your past orders and track their status
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const groupedItems = groupItemsByBusiness(order.orderItems);

          return (
            <Card key={order.id} className="w-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Order #{order.id}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Placed on{" "}
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Badge>
                    <p className="text-lg font-semibold mt-1">
                      ${order.total_amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  {groupedItems.map((group: any, index: number) => (
                    <div key={group.business.id}>
                      {index > 0 && <Separator className="my-4" />}

                      {/* Business Info */}
                      <div className="mb-4">
                        <h3 className="font-semibold text-lg mb-2">
                          {group.business.name}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{group.business.address}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              Today:{" "}
                              {getTodayBusinessHours(
                                group.business.workingHours
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Items from this business */}
                      <div className="grid gap-3">
                        {group.items.map((orderItem: any) => (
                          <div
                            key={orderItem.id}
                            className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                            <Image
                              width={48}
                              height={48}
                              src={
                                orderItem.item.image_url || "/placeholder.svg"
                              }
                              alt={orderItem.item.name}
                              className="w-12 h-12 rounded-md object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">
                                {orderItem.item.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {orderItem.quantity} {orderItem.unit} × $
                                {orderItem.price_per_unit}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                $
                                {(
                                  orderItem.quantity *
                                  Number.parseFloat(orderItem.price_per_unit)
                                ).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
