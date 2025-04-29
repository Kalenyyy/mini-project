import { toast } from "react-toastify";
import { formatRupiah, parseRupiah } from "../formatRupiah";

export const handleProcessOrder = (
  selectedProducts,
  selectedCustomer,
  setShowPaymentSection
) => {
  // Cek apakah ada produk yang belum dipilih
  const hasEmptyProduct = selectedProducts.some((item) => !item.product);

  if (hasEmptyProduct) {
    toast.error("Harap pilih produk untuk semua item yang ditambahkan!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    return;
  }

  // Cek apakah customer sudah dipilih
  if (!selectedCustomer) {
    toast.error("Harap pilih customer terlebih dahulu!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    return;
  }

  // Cek apakah ada produk yang dipilih
  if (selectedProducts.length === 0) {
    toast.error("Harap tambahkan minimal satu produk!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    return;
  }

  // Call setShowPaymentSection outside of the render logic
  setTimeout(() => {
    setShowPaymentSection(true);
  }, 0); // Ensure state update happens asynchronously
};

export const handleCompletePayment = async (
  
  selectedProducts,
  selectedCustomer,
  isPaymentValid,
  total,
  numericPaymentAmount,
  setLoading,
  setIsProcessing,
  router
) => {
  // Validasi 1: Cek produk
  const hasEmptyProduct = selectedProducts.some((item) => !item.product);
  if (hasEmptyProduct) {
    toast.error("Harap pilih produk untuk semua item yang ditambahkan!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    return;
  }

  // Validasi 2: Cek apakah customer dipilih
  if (!selectedCustomer) {
    toast.error("Harap pilih customer terlebih dahulu!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    return;
  }

  // Validasi 3: Cek apakah jumlah pembayaran valid
  if (!isPaymentValid) {
    toast.error(
      `Jumlah pembayaran kurang ${formatRupiah(total - numericPaymentAmount)}!`,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
    return;
  }

  // Cek apakah selectedCustomer ada
  if (!selectedCustomer || !selectedCustomer.id) {
    console.error("Customer is not selected!");
    return;
  }

  const transactionData = {
    customer_id: selectedCustomer.id,
    total: total,
    payment: numericPaymentAmount,
    items: selectedProducts.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    })),
  };

  setLoading(true);
  setIsProcessing(true);
  try {
    // Kirim data ke API Laravel
    const response = await fetch(`http://127.0.0.1:8000/api/orders/store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(transactionData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal menyimpan transaksi");
    }

    // Tampilkan toast sukses
    toast.success("Transaksi berhasil disimpan!", {
      position: "top-right",
      autoClose: 3000,
    });

    // Tunggu 3 detik sebelum pindah halaman
    setTimeout(() => {
      router.push("/orders");
    }, 3000);
    console.log("Transaction saved:", data);
  } catch (error) {
    console.error("Error saving transaction:", error);
    toast.error(error.message || "Terjadi kesalahan saat menyimpan transaksi");
  } finally {
    setLoading(false);
  }
};
