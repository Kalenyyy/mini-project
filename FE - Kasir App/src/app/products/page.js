"use client";

import Layout from "../components/Layout/Layout";
import ProductAddModal from "../components/ModalProduct/AddProduct";
import ProductEditModal from "../components/ModalProduct/EditProduct";
import ProductUpdateStatusModal from "../components/ModalProduct/UpdateStatus";
import { useEffect, useState } from "react";
import fetchProducts from "../lib/product/fetchProducts";
import addProduct from "../lib/product/addProduct";
import editProduct from "../lib/product/editProduct";
import usePagination from "../lib/pagination/usePagination";
import Breadcrumb from "../lib/breadcrumb/useBreadcrumb";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const {
    currentPage,
    setCurrentPage,
    currentItems: currentProducts,
    pageCount,
    pages,
    canGoNext,
    canGoPrev,
    goToNext,
    goToPrev,
  } = usePagination(products, 5);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [statusProductId, setStatusProductId] = useState(null);

  useEffect(() => {
    fetchProducts(setProducts, setLoading);
  }, []);

  const handleAddProduct = async (newProduct) => {
    const success = await addProduct(newProduct);
    if (success) {
      setIsAddModalOpen(false);
      await fetchProducts(setProducts, setLoading);
    }
  };

  const handleEditProduct = async (updatedProduct) => {
    const success = await editProduct(updatedProduct);
    if (success) {
      setIsEditModalOpen(false);
      await fetchProducts(setProducts, setLoading);
    }
  };
  const openEditModal = (product) => {
    setSelectedProduct(product.id);
    setIsEditModalOpen(true);
  };

  const openUpdateStatusModal = (product) => {
    setStatusProductId(product.id);
    setIsUpdateStatusModalOpen(true);
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products" }, // Tidak ada href = halaman aktif
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Content Container */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Product List</h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add New Product
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-10 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Product name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Price
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentProducts
                    .filter((product) => product.status !== "inactive") // Filter out inactive products
                    .map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-6 py-4">{product.category}</td>
                        <td className="px-6 py-4 ">
                          {product.price != null
                            ? `Rp ${Number(product.price).toLocaleString(
                                "id-ID"
                              )}`
                            : "Rp -"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            className="text-sm text-white bg-blue-500 px-3 py-1 rounded mr-2"
                            onClick={() => openEditModal(product)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-sm text-white bg-red-500 px-3 py-1 rounded"
                            onClick={() => openUpdateStatusModal(product)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <nav
          aria-label="Page navigation example"
          className="mt-6 flex justify-center"
        >
          <ul className="inline-flex -space-x-px text-base h-10">
            <li>
              <button
                onClick={goToPrev}
                disabled={!canGoPrev}
                className={`flex items-center justify-center px-4 h-10 leading-tight border ${
                  !canGoPrev
                    ? "text-gray-400 bg-white border-gray-300 cursor-not-allowed"
                    : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                } rounded-l-lg`}
              >
                Previous
              </button>
            </li>

            {pages.map((page) => {
              const start = Math.max(1, currentPage + 1 - 3);
              const end = Math.min(pageCount, start + 6);
              if (page < start || page > end) return null;

              return (
                <li key={page}>
                  <button
                    onClick={() => setCurrentPage(page - 1)}
                    aria-current={currentPage + 1 === page ? "page" : undefined}
                    className={`flex items-center justify-center px-4 h-10 leading-tight border ${
                      currentPage + 1 === page
                        ? "text-blue-600 bg-blue-50 border-gray-300"
                        : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                </li>
              );
            })}

            <li>
              <button
                onClick={goToNext}
                disabled={!canGoNext}
                className={`flex items-center justify-center px-4 h-10 leading-tight border ${
                  !canGoNext
                    ? "text-gray-400 bg-white border-gray-300 cursor-not-allowed"
                    : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                } rounded-r-lg`}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <ProductAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProduct}
      />

      <ProductEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditProduct}
        productId={selectedProduct}
      />

      <ProductUpdateStatusModal
        isOpen={isUpdateStatusModalOpen}
        onClose={() => setIsUpdateStatusModalOpen(false)}
        productId={selectedProduct}
        onSuccess={fetchProducts}
      />
    </Layout>
  );
}
