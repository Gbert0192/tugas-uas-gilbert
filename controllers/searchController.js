import axios from "axios";
import { priceToIdr } from "../utils/format.js";
import User from "../models/user.js";
import { formatCurrency } from "../utils/format.js";

export const searchParams = async (req, res) => {
  const userId = req.cookies.userId;
  const query = req.query.query;
  const renderError = (code, message) =>
    res.status(code).render("errors/error", {
      layout: false,
      message,
      code,
    });

  try {
    if (!query || query.trim() === "") {
      return renderError(400, "Query tidak boleh kosong.");
    }

    const user = await User.findOne({ where: { userId } });

    const resp = await axios.get(
      `https://dummyjson.com/products/search?q=${query}`
    );

    if (!resp.data || !resp.data.products) {
      return renderError(404, "Produk tidak ditemukan.");
    }

    const products = resp.data.products;
    res.render("category/categoryPage", {
      layout: "category/categoryMain",
      title: "category",
      products,
      user,
      formatCurrency,
      priceToIdr,
      query: query || null,
    });
  } catch (error) {
    console.error(error);
    renderError(500, error.message || "Terjadi kesalahan pada server.");
  }
};

export const searchCategories = async (req, res) => {
  const userId = req.cookies.userId;
  const renderError = (code, message) =>
    res.status(code).render("errors/error", {
      layout: false,
      message,
      code,
    });

  try {
    const user = await User.findOne({ where: { userId } });
    const params = req.params.category;
    const resp = await axios.get(
      `https://dummyjson.com/products/category/${params}?limit=100`
    );
    const products = resp.data;
    res.render("category/categoryPage", {
      layout: "category/categoryMain",
      title: "category",
      products: products.products,
      user,
      formatCurrency,
      priceToIdr,
      query: null,
    });
  } catch (error) {
    renderError(500, error.message || "Terjadi kesalahan pada server.");
  }
};
