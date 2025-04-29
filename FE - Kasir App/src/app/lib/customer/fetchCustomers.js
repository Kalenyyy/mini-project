import toast from "react-hot-toast";

const fetchCustomers = async (setCustomers) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/customers");
    if (!response.ok) {
      throw new Error("Gagal mengambil data customers.");
    }
    const data = await response.json();

    if (Array.isArray(data)) {
      setCustomers(data); // Langsung set data array
    } else if (data.data && Array.isArray(data.data)) {
      setCustomers(data.data); // Kalau dibungkus dalam { data: [...] }
    } else {
      toast.error("Format data tidak sesuai!");
    }
  } catch (error) {
    toast.error("Gagal mengambil data customers.");
    console.error(error);
  }
};

export default fetchCustomers;
