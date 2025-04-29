// src/app/orders/detail/[id]/page.js
import OrderEditClient from "./OrderEditClient";

export default function OrderEditPage({ params }) {
  // Hanya meneruskan ID ke client component

  return <OrderEditClient id={params.id} />;
}
