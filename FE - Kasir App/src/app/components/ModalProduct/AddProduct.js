'use client';
import { useForm } from "react-hook-form";
import React from "react";

export default function ProductAddModal({ isOpen, onClose, onSubmit }) {
  const form = useForm();
  const { register, handleSubmit, reset, setValue, watch } = form;

  React.useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  // Ambil nilai saat user mengetik agar bisa diformat
  const price = watch("price") || "";

  // Fungsi untuk format angka ke format "Rp X.XXX"
  const formatRupiah = (angka) => {
    if (!angka) return "";
    const numeric = angka.toString().replace(/[^0-9]/g, "");
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setValue("price", value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">
            Create New Product
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit((data) => {
            onSubmit({
              ...data,
              price: parseInt(
                (data.price || "0").toString().replace(/\./g, "")
              ),
            });
            onClose();
          })}
          className="p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              {...register("name", { required: true })}
              className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              placeholder="Enter product name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  Rp
                </span>
                <input
                  type="text"
                  value={formatRupiah(price)}
                  onChange={handlePriceChange}
                  className="mt-1 block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  placeholder="0"
                />
              </div>
            </div>

            {/* ...kategori (tidak berubah) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                {...register("category", { required: true })}
                className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 appearance-none"
              >
                <option value="" disabled hidden>
                  Select category
                </option>
                <option value="ATK">ATK</option>
                <option value="RT">RT</option>
                <option value="Masak">Masak</option>
                <option value="Elektronik">Elektronik</option>
              </select>
            </div>
          </div>

          {/* ...buttons (tidak berubah) */}
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
