"use client";

import { useState, useEffect } from "react";
import Layout from "@/app/components/Layout/Layout";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation"; // Untuk App Router
import fetchCustomers from "@/app/lib/customer/fetchCustomers";
import fetchProducts from "@/app/lib/product/fetchProducts";
import { formatRupiah, parseRupiah } from "../../lib/formatRupiah";
import Breadcrumb from "@/app/lib/breadcrumb/useBreadcrumb";
import {
  handleProcessOrder,
  handleCompletePayment,
} from "@/app/lib/order/helperStoreOrder";

export default function Order() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCustomers(setCustomers, setLoading);
    fetchProducts(setProducts, setLoading);
    setIsClient(true);
  }, []);

  const customerOptions = customers.map((c) => ({
    id: c.id,
    label: c.name,
  }));

  const productOptions = products.map((p) => ({
    id: p.id,
    label: `${p.name} (${formatRupiah(p.price)})`,
    price: p.price,
  }));

  const handleAddProduct = () => {
    setSelectedProducts([
      ...selectedProducts,
      { product: null, quantity: 1, subtotal: 0 },
    ]);
  };

  const handleRemoveProduct = (index) => {
    const updated = [...selectedProducts];
    updated.splice(index, 1);
    setSelectedProducts(updated);
  };

  const handleProductChange = (index, selectedOption) => {
    const updated = [...selectedProducts];
    updated[index].product = selectedOption;
    updated[index].subtotal =
      updated[index].quantity * (selectedOption?.price || 0);
    setSelectedProducts(updated);
  };

  const handleQuantityChange = (index, quantity) => {
    const updated = [...selectedProducts];
    updated[index].quantity = Math.max(1, quantity);
    updated[index].subtotal =
      updated[index].quantity * (updated[index].product?.price || 0);
    setSelectedProducts(updated);
  };

  const total = selectedProducts.reduce(
    (sum, item) => sum + (item.subtotal || 0),
    0
  );

  const handlePaymentAmountChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "");

    // Batasi hanya 12 digit
    if (numericValue.length > 12) return;

    if (numericValue === "") {
      setPaymentAmount("");
    } else {
      const formattedValue = formatRupiah(numericValue);
      setPaymentAmount(formattedValue);
    }
  };

  const numericPaymentAmount = paymentAmount ? parseRupiah(paymentAmount) : 0;
  const change = numericPaymentAmount - total;
  const isPaymentValid = numericPaymentAmount >= total;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Order List", href: "orders" },
    { label: "Order Create", href: "orders/create" },
  ];

  return (
    <Layout>
      <Breadcrumb items={breadcrumbItems} />

      <div className=" mx-auto p-6 space-y-8 bg-white">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-800">Buat Order Baru</h1>
          <p className="text-gray-600">
            Isi detail customer dan produk yang dipesan
          </p>
        </div>

        {/* Customer Selection */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Informasi Customer
          </h2>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Pilih Customer
            </label>
            {isClient && (
              <Select
                options={customerOptions}
                onChange={setSelectedCustomer}
                isClearable
                isSearchable
                isLoading={loading}
                placeholder="Cari atau pilih customer..."
                className="text-gray-800"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: "#fff",
                    borderColor: "#d1d5db",
                    minHeight: "44px",
                    "&:hover": {
                      borderColor: "#9ca3af",
                    },
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? "#3b82f6" : "#fff",
                    color: state.isSelected ? "#fff" : "#1f2937",
                    "&:hover": {
                      backgroundColor: state.isSelected ? "#3b82f6" : "#f3f4f6",
                    },
                  }),
                }}
              />
            )}
          </div>
        </div>

        {/* Product Selection */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Daftar Produk
            </h2>
            <button
              onClick={handleAddProduct}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Tambah Produk
            </button>
          </div>

          {selectedProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto mb-3 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p>Belum ada produk yang ditambahkan</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedProducts.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="w-full md:w-2/5">
                    {isClient && (
                      <Select
                        options={productOptions}
                        value={item.product}
                        onChange={(value) => handleProductChange(index, value)}
                        placeholder="Pilih produk..."
                        className="text-gray-800"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            backgroundColor: "#fff",
                            borderColor: "#d1d5db",
                            minHeight: "40px",
                            "&:hover": {
                              borderColor: "#9ca3af",
                            },
                          }),
                        }}
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <button
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded transition-colors"
                      onClick={() =>
                        handleQuantityChange(index, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, parseInt(e.target.value))
                      }
                      className="w-16 text-center bg-white text-gray-800 border border-gray-300 rounded p-1"
                      min={1}
                    />
                    <button
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded transition-colors"
                      onClick={() =>
                        handleQuantityChange(index, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <div className="text-green-600 font-semibold text-lg md:w-1/5 text-right">
                    {formatRupiah(item.subtotal || 0)}
                  </div>

                  <button
                    onClick={() => handleRemoveProduct(index)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-500 ml-auto transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary Section */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-right md:text-left">
              <p className="text-gray-600 text-sm">Total Pesanan</p>
              <p className="text-green-600 text-2xl font-bold">
                {formatRupiah(total)}
              </p>
            </div>

            <button
              className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium shadow hover:shadow-lg transition-all ${
                selectedProducts.length === 0 || !selectedCustomer
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              }`}
              onClick={() =>
                handleProcessOrder(
                  selectedProducts,
                  selectedCustomer,
                  setShowPaymentSection
                )
              }
              disabled={selectedProducts.length === 0 || !selectedCustomer}
            >
              Lanjut ke Pembayaran
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 inline-block ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Payment Section - Only shown after clicking "Lanjut ke Pembayaran" */}
        {showPaymentSection && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 space-y-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-800">Pembayaran</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Jumlah Pembayaran
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-700"></span>
                  <input
                    type="text"
                    value={paymentAmount}
                    onChange={handlePaymentAmountChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan jumlah pembayaran"
                  />
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Belanja:</span>
                  <span className="font-medium">{formatRupiah(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pembayaran:</span>
                  <span className="font-medium">
                    {paymentAmount ? formatRupiah(numericPaymentAmount) : "Rp0"}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="text-gray-800 font-semibold">
                    Kembalian:
                  </span>
                  <span
                    className={`font-bold ${
                      change >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatRupiah(Math.abs(change))}
                    {change < 0 && " (Kurang)"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="relative group">
                <button
                  onClick={() =>
                    handleCompletePayment(
                      selectedProducts,
                      selectedCustomer,
                      isPaymentValid,
                      total,
                      numericPaymentAmount,
                      setLoading,
                      setIsProcessing,
                      router
                    )
                  }
                  disabled={
                    !isPaymentValid ||
                    !paymentAmount ||
                    selectedProducts.some((item) => !item.product) ||
                    isProcessing
                  }
                  className={`px-6 py-3 rounded-lg font-medium shadow hover:shadow-lg transition-all ${
                    isPaymentValid &&
                    paymentAmount &&
                    !selectedProducts.some((item) => !item.product) &&
                    !isProcessing
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Memproses...
                    </span>
                  ) : (
                    <>
                      Selesaikan Pembayaran
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 inline-block ml-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </>
                  )}
                </button>
                {(!isPaymentValid ||
                  !paymentAmount ||
                  selectedProducts.some((item) => !item.product)) && (
                  <div className="absolute z-10 invisible group-hover:visible bottom-full mb-2 w-64 px-3 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg shadow-sm">
                    {!paymentAmount
                      ? "Harap masukkan jumlah pembayaran"
                      : selectedProducts.some((item) => !item.product)
                      ? "Harap pilih semua produk yang ditambahkan"
                      : `Jumlah pembayaran kurang ${formatRupiah(
                          total - numericPaymentAmount
                        )}`}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Layout>
  );
}
