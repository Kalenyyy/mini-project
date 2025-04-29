"use client";
import { useForm } from "react-hook-form";
import React from "react";

export default function EditCustomerModal({
  isOpen,
  onClose,
  onSubmit,
  customerId,
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  React.useEffect(() => {
    if (isOpen && customerId) {
      fetch(`http://127.0.0.1:8000/api/customers/${customerId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Customer not found");
          return res.json();
        })
        .then((data) => {
          console.log("Customer Data:", data);
          setValue("name", data.name);
          setValue("domisili", data.domisili);
          setValue("gender", data.gender);
        })
        .catch((err) => {
          console.error("Failed to fetch Customer:", err.message);
        });
    } else if (isOpen && !customerId) {
      reset();
    }
  }, [isOpen, customerId, setValue, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">Edit Customer</h3>
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
              id: customerId,
            });
            onClose();
          })}
          className="p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <input
              {...register("name", { required: "Customer name is required" })}
              className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              placeholder="Masukkan nama customer"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domisili
              </label>
              <input
                type="text"
                {...register("domisili", {
                  required: "Domisili is required",
                })}
                className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                placeholder="Enter quantity"
              />
              {errors.domisili && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.domisili.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                {...register("gender", { required: "Gender is required" })}
                className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 appearance-none"
              >
                <option value="" disabled hidden>
                  Select gender
                </option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>
          </div>

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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
