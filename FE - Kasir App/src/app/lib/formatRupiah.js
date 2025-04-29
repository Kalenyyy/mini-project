// lib/formatRupiah.js

export const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };
  
  export const parseRupiah = (rupiah) => {
    return parseInt(rupiah.replace(/[^0-9]/g, ""));
  };