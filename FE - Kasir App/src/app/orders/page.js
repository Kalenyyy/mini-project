"use client";

import Layout from "../components/Layout/Layout";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "../components/modalOrder/DeleteModal";
import { fetchOrders } from "../lib/order/fetchOrders";
import Breadcrumb from "../lib/breadcrumb/useBreadcrumb";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // ← ini
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadOrders();
  }, []);

  // Callback setelah delete sukses
  const handleDeleted = () => {
    setIsDeleteOpen(false);
    setDeleteId(null);
    loadOrders();
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Order List" }, // Tidak ada href = halaman aktif
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Content Container */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Orders List</h1>
            <Link href="/orders/create">
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Add New Order
              </button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Nama Pelanggan
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Tanggal Pembelian
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Total Belanja
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-6 text-gray-500"
                      >
                        Tidak ada order.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-900">
                          {order.customer?.name}
                        </td>
                        <td className="px-6 py-4">
                          {new Date(order.order_date).toLocaleDateString(
                            "id-ID"
                          )}
                        </td>
                        <td className="px-6 py-4">
                          Rp {order.total_amount.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4 text-center space-x-2">
                          <Link href={`/orders/detail/${order.id}`}>
                            <button className="text-sm text-white bg-green-500 px-3 py-1 rounded">
                              Detail
                            </button>
                          </Link>
                          <Link href={`/orders/edit/${order.id}`}>
                            <button className="text-sm text-white bg-yellow-500 px-3 py-1 rounded">
                              Edit
                            </button>
                          </Link>
                          <button
                            onClick={() => {
                              setDeleteId(order.id);
                              setIsDeleteOpen(true);
                            }}
                            className="text-sm text-white bg-red-500 px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <DeleteModal
        orderId={deleteId}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={handleDeleted}
      />
    </Layout>
  );
}
