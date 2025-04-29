export const fetchOrderDetails = async (
  id,
  setOrder,
  setSelectedCustomer,
  setSelectedProducts
) => {
  if (!id) return;

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/orders/edit/${id}`);
    const result = await response.json();

    if (result.data) {
      console.log("Order data:", result.data); // Log data order untuk melihat isi response
      setOrder(result.data);

      // Mengatur customer berdasarkan data dari order
      if (result.data.customer) {
        setSelectedCustomer({
          id: result.data.customer.id,
          label: result.data.customer.name,
        });
      } else {
        setSelectedCustomer(null); // Inisialisasi null jika tidak ada customer
      }

      // Mapping order_details ke selectedProducts
      const orderProducts = result.order_details.map((item) => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
        },
        quantity: item.quantity,
        subtotal: item.quantity * item.product.price,
      }));

      setSelectedProducts(orderProducts);
    } else {
      setOrder(null);
      setSelectedCustomer(null);
      setSelectedProducts([]);
    }
  } catch (error) {
    console.error("Gagal mengambil detail order:", error);
    setOrder(null);
    setSelectedProducts([]);
  }
};

export default fetchOrderDetails;