// lib/api/fetchOrderById.js
export default async function fetchOrderById(id) {
  const res = await fetch(`http://127.0.0.1:8000/api/orders/show/${id}`);

  if (!res.ok) {
    throw new Error("Gagal mengambil data order.");
  }

  const json = await res.json();

  return {
    order: json.data,
    items: json.order_details || [],
  };
}

