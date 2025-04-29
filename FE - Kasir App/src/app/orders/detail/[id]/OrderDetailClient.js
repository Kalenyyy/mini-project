"use client";

import { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout";
import Breadcrumb from "../../../lib/breadcrumb/useBreadcrumb";
import fetchOrderById from "../../../lib/order/fetchOrderById";

export default function OrderDetailClient({ id }) {
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetchOrderById(id)
      .then(({ order, items }) => {
        setOrder(order);
        setItems(items);
      })
      .catch((err) => {
        console.error(err);
        setOrder(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="p-8 text-center">Loading order #{id}…</div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="p-8 text-center text-red-500">
          Order #{id} not found.
        </div>
      </Layout>
    );
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Order List", href: "/orders" }, // Tidak ada href = halaman aktif
    { label: "Detail Order #" + order.id, href: "#" },
  ];

  return (
    <Layout>
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex justify-center bg-gray-100 p-8">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl p-8 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-700">
              Detail Penjualan #{order.id}
            </h2>
            <button
              onClick={() => history.back()}
              className="text-gray-400 hover:text-red-500 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="text-base text-gray-600">
            <p>
              <span className="font-semibold">Nama Customer:</span>{" "}
              {order.customer.name}
            </p>
            <p>
              <span className="font-semibold">Gender:</span>{" "}
              {order.customer.gender}
            </p>
          </div>

          <table className="w-full text-sm text-left border-t">
            <thead>
              <tr className="bg-gray-50 text-gray-700 font-semibold">
                <th className="py-3">Produk</th>
                <th className="py-3 text-center">Qty</th>
                <th className="py-3 text-right">Harga</th>
                <th className="py-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {items.map((it) => (
                <tr key={it.id} className="border-b">
                  <td className="py-3">{it.product.name}</td>
                  <td className="py-3 text-center">{it.quantity}</td>
                  <td className="py-3 text-right">
                    Rp {it.product.price.toLocaleString()}
                  </td>
                  <td className="py-3 text-right">
                    Rp {(it.product.price * it.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="space-y-2 text-base">
            <div className="flex justify-between font-semibold">
              <span>Total Belanja</span>
              <span>Rp {order.total_amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Bayaran Pembeli</span>
              <span>Rp {order.customer_pay.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold text-green-600">
              <span>Kembalian</span>
              <span>Rp {order.customer_change.toLocaleString()}</span>
            </div>
          </div>

          <div className="text-sm text-gray-500 text-right">
            Dibuat pada: {new Date(order.order_date).toLocaleString("id-ID")}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => history.back()}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
