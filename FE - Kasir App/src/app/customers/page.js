"use client";

import Layout from "../components/Layout/Layout";
import fetchCustomers from "../lib/customer/fetchCustomers";
import addCustomer from "../lib/customer/addCustomer";
import editCustomer from "../lib/customer/editCustomer";
import AddCustomerModal from "../components/ModalCustomer/AddCustomer";
import EditCustomerModal from "../components/ModalCustomer/EditCustomer";
import InactiveModal from "../components/ModalCustomer/UpdateStatus";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Breadcrumb from "../lib/breadcrumb/useBreadcrumb";
import usePagination from "../lib/pagination/usePagination";

export default function Product() {
  // Mengambil Data Customer
  const [customers, setCustomers] = useState([]);

  // Membuka Modal Tambah Customer
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Membuka Modal Edit Customer
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // State untuk mengubah status customer
  const [isInactiveModalOpen, setIsInactiveModalOpen] = useState(false);
  const [inactiveCustomerId, setInactiveCustomerId] = useState(null);

  const {
    currentPage,
    setCurrentPage,
    currentItems: currentCustomers,
    pageCount,
    pages,
    canGoNext,
    canGoPrev,
    goToNext,
    goToPrev,
  } = usePagination(customers, 5);

  // Fungsi refresh customer
  const refreshCustomers = () => fetchCustomers(setCustomers);

  useEffect(() => {
    fetchCustomers(setCustomers);
  }, []);

  const handleAddCustomer = async (customerData) => {
    const success = await addCustomer(customerData);
    if (success) {
      setIsAddModalOpen(false);
      await fetchCustomers(setCustomers);
    }
  };

  const openEditModal = (customers) => {
    setSelectedCustomer(customers.id);
    setIsEditModalOpen(true);
  };

  const openUpdateStatusModal = (customers) => {
    setInactiveCustomerId(customers.id);
    setIsInactiveModalOpen(true);
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Customers" }, // Tidak ada href = halaman aktif
  ];

  console.log("Selected Customer:", inactiveCustomerId);
  console.log("data customers:", customers);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Content Container */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Customers List</h1>
            <button
              className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add New Customer
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Customer name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Domisili
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentCustomers
                  .filter((customers) => customers.status !== "inactive") // Filter out inactive products
                  .map((customers) => (
                    <tr key={customers.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">
                        {customers.name}
                      </td>
                      <td className="px-6 py-4">{customers.domisili}</td>
                      <td className="px-6 py-4">{customers.gender}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          className="text-sm text-white bg-blue-500 px-3 py-1 rounded mr-2"
                          onClick={() => openEditModal(customers)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-sm text-white bg-red-500 px-3 py-1 rounded"
                          onClick={() => openUpdateStatusModal(customers)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
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

      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCustomer}
      />

      <EditCustomerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={async (updatedCustomer) => {
          const success = await editCustomer(updatedCustomer);
          if (success) {
            setIsEditModalOpen(false);
            await fetchCustomers(setCustomers);
          }
        }}
        customerId={selectedCustomer}
      />

      <InactiveModal
        isOpen={isInactiveModalOpen}
        onClose={() => setIsInactiveModalOpen(false)}
        customerId={inactiveCustomerId}
        onSuccess={refreshCustomers}
      />
    </Layout>
  );
}
