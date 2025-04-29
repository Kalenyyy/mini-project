import toast from "react-hot-toast";

const addCustomer = async (customerData) => {
  const res = await fetch("http://127.0.0.1:8000/api/customers/store", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customerData),
  });

  if (!res.ok) {
    toast.error("Gagal menambahkan customer!");
    return false;
  } else {
    toast.success("Customer berhasil ditambahkan!");
    return true;
  }
};

export default addCustomer;
