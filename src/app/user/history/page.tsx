"use client";

import OrderHistory from "@/components/history/order-history";
import Header from "@/components/ui/header";
import { useUserData } from "@/hooks/useUserData";

export default function Page() {
  const userData = useUserData();

  if (!userData) {
    return <div className="p-6">Loading user info...</div>;
  }

  return (
    <>
      <Header
        name={userData.email}
        cartItemCount={0} // Or fetch from context/state
        shopLink="/"
        historyLink="/user/history"
        profileLink={`/user/profile/${userData.id}`}
        shopName={userData.name}
      />
      <OrderHistory />
    </>
  );
}
