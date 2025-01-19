// const axios = require("axios");
import axios from "axios";
export const getCategoryList = async () => {
  const response = await axios.get(
    "https://dummyjson.com/products/category-list"
  );
  return response.data;
};

// Fungsi untuk mengambil produk berdasarkan kategori
export const getCategorizedProducts = async (categoryList) => {
  const categorizedProductsArray = await Promise.all(
    categoryList.map(async (category) => {
      const response = await axios.get(
        `https://dummyjson.com/products/category/${category}`
      );
      return { [category]: response.data.products };
    })
  );

  return Object.assign({}, ...categorizedProductsArray);
};

export const getAllProducts = async (page = 1, limit = 20) => {
  try {
    const skip = (page - 1) * limit; // Menghitung produk yang harus dilewati
    const response = await axios.get(
      `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
    );
    const products = response.data;
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
