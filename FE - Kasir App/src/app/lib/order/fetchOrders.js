// lib/fetchOrders.js

export async function fetchOrders() {
  const response = await fetch("http://localhost:8000/api/orders", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer token`, // kalau butuh token auth
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  const data = await response.json();
  return data;
}
