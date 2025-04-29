"use client"; // kalau kamu pakai app router

import { useState } from "react";
import toast from "react-hot-toast"; // Import toast

export default function InactiveModal({
  productId,
  isOpen,
  onClose,
  onSuccess,
}) {
  const handleConfirm = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/products/update-status/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "inactive" }),
        }
      );

      if (res.ok) {
        toast.success("Produk berhasil diubah menjadi tidak aktif!"); // Success toast
        onSuccess?.(); // reload data or show toast
        onClose(); // close modal
      } else {
        toast.error("Gagal memperbarui status produk."); // Error toast
      }
    } catch (err) {
      toast.error("Terjadi kesalahan: " + err.message); // Error toast
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md">
        <div className="p-4 text-center">
          <svg
            className="mx-auto mb-4 text-gray-400 w-12 h-12"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <h3 className="mb-5 text-lg font-normal text-gray-500">
            Set this product to inactive?
          </h3>
          <button
            onClick={handleConfirm}
            className="text-white bg-red-600 hover:bg-red-800 px-5 py-2.5 rounded-lg text-sm mr-2"
          >
            Yes, I'm sure
          </button>
          <button
            onClick={onClose}
            className="text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 px-5 py-2.5 rounded-lg text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
