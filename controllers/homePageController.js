//axios api controller
import {
  getAllProducts,
  getCategoryList,
  getCategorizedProducts,
} from "../controllers/getProductController.js";

//format utils
import { priceToIdr, formatCurrency } from "../utils/format.js";

//database
import User from "../models/user.js";

export const userLoginHomePage = async (req, res) => {
  const requestedId = req.params.uuid;
  const loggedInUserId = req.user.id;
  console.log(requestedId);
  console.log(loggedInUserId);

  const renderError = (code, message) =>
    res.status(code).render("errors/error", {
      layout: false,
      message,
      code,
    });

  try {
    const user = await User.findOne({ where: { userId: requestedId } });
    if (!user) {
      return renderError(404, "User tidak ditemukan");
    }
    // console.log(user);

    // Validasi apakah user memiliki akses
    if (requestedId !== loggedInUserId) {
      return renderError(
        403,
        "Access Forbidden: Anda tidak dapat mengakses halaman ini."
      );
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1); // Set minimum page = 1
    const limit = parseInt(req.query.limit, 10) || 20;

    const categoryList = await getCategoryList();
    const categorizedProducts = await getCategorizedProducts(categoryList);
    const products = await getAllProducts(page, limit);
    const totalPages = Math.ceil(products.total / limit);

    if (page > totalPages) {
      return res.redirect(`/main/${user.userId}`);
    }

    // Render halaman utama
    return res.render("index/homePage", {
      layout: "index/main",
      title: "Main Page Login",
      user,
      categoryList,
      categorizedProducts,
      products: products.products,
      priceToIdr,
      formatCurrency,
      totalProducts: products.total,
      currentPage: page,
      totalPages,
      limit,
    });
  } catch (error) {
    console.error("Error:", error);
    return renderError(
      500,
      "Terjadi kesalahan saat memuat produk. " + error.message
    );
  }
};

export const userNoLoginHomePage = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const categoryList = await getCategoryList();
    const categorizedProducts = await getCategorizedProducts(categoryList);
    const products = await getAllProducts(page, limit);

    // Hitung total halaman
    const totalPages = Math.ceil(products.total / limit);

    if (page > totalPages) {
      return res.redirect(`?page=${totalPages}&limit=${limit}`);
    }

    return res.render("noLogin/homePageNoLogin", {
      layout: "noLogin/main",
      title: "Main Page No Login",
      categoryList,
      categorizedProducts,
      products: products.products,
      totalProducts: products.total,
      currentPage: page,
      totalPages,
      priceToIdr,
      formatCurrency,
      limit,
    });
  } catch (error) {
    console.error("Error loading data:", error);
    return res.status(500).render("errors/error", {
      layout: false,
      message: "Terjadi kesalahan saat memuat produk. " + error.message,
      code: "500",
    });
  }
};
