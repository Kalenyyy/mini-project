// src/app/orders/detail/[id]/page.js
import OrderDetailClient from "./OrderDetailClient";

export default function OrderDetailPage({ params }) {
  // Hanya meneruskan ID ke client component

  return <OrderDetailClient id={params.id} />;
}
