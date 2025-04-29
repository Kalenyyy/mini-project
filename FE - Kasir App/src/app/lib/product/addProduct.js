import toast from "react-hot-toast";

const addProduct = async (newProduct) => {
  const res = await fetch("http://127.0.0.1:8000/api/products/store", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProduct),
  });

  if (!res.ok) {
    toast.error("Gagal menambahkan produk!");
    return false;
  }

  toast.success("Produk berhasil ditambahkan!");
  return true;
};

export default addProduct;
