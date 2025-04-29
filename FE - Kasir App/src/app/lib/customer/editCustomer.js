import toast from "react-hot-toast";

const editCustomer = async (updatedCustomer) => {
  const res = await fetch(
    `http://127.0.0.1:8000/api/customers/update/${updatedCustomer.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCustomer),
    }
  );

  if (!res.ok) {
    toast.error("Gagal memperbarui customer!");
    return false;
  }

  toast.success("Customer berhasil diperbarui!");
  return true;
};

export default editCustomer;
