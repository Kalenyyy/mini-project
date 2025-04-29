import toast from "react-hot-toast";

const editProduct = async (updatedProduct) => {
  const res = await fetch(
    `http://127.0.0.1:8000/api/products/update/${updatedProduct.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    }
  );

  if (!res.ok) {
    toast.error("Gagal memperbarui produk!");
    return false;
  }

  toast.success("Produk berhasil diperbarui!");
  return true;
};

export default editProduct;
