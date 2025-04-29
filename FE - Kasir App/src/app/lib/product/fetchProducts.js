import toast from "react-hot-toast";

const fetchProducts = async (setProducts, setLoading) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/products");
    const data = await response.json();

    if (Array.isArray(data) && Array.isArray(data[0])) {
      setProducts(data[0]);
    } else if (Array.isArray(data)) {
      setProducts(data);
    } else if (data.data) {
      setProducts(data.data);
    } else {
      toast.error("Format data tidak sesuai!");
    }

    console.log(data);
  } catch (error) {
    toast.error("Gagal mengambil data produk.");
  } finally {
    setLoading(false);
  }
};

export default fetchProducts;
