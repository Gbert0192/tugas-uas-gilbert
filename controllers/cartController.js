import User from "../models/user.js";
import Cart from "../models/cart.js";
import axios from "axios";

export const getCartItem = async (req, res) => {
  const userId = req.cookies.userId;
  try {
    const cart = await Cart.findAll({ where: { userId, orderId: null } });
    const uniqueItems = await Cart.count({
      where: { userId, orderId: null },
      distinct: true,
      col: "productId",
    });
    if (cart) {
      return res.json({ cart, uniqueItems });
    } else {
      return res.json({ success: false, message: "Cart is empty" }); // atau bisa mengembalikan pesan bahwa cart kosong
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data produk",
    });
  }
};

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.cookies.userId;
  console.log("Product ID:", productId, "Quantity:", quantity);

  try {
    let cartItem = await Cart.findOne({
      where: { productId, userId, orderId: null },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.save();
      return res.status(200).json({
        success: true,
        message: "Quantity produk berhasil diperbarui",
        cartItem,
      });
    } else {
      const response = await axios.get(
        `https://dummyjson.com/products/${productId}`
      );
      const data = response.data;

      const productName = data.title;
      const productCategory = data.category;
      const productPrice = data.price;
      const productImage = data.thumbnail;

      await Cart.create({
        userId,
        productId,
        productName,
        productCategory,
        productImage,
        productPrice: productPrice * 16000,
        quantity,
      });

      return res.status(200).json({
        success: true,
        message: "Produk berhasil ditambahkan ke keranjang",
      });
    }
  } catch (error) {
    console.error("Error fetching product data:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data produk",
    });
  }
};

export const updateCart = async (req, res) => {
  const { productId, quantity } = req.body; // 0 = kurangi, 1 = tambahkan, 2 = hapus
  const userId = req.cookies.userId;

  try {
    // Cari produk di keranjang
    const cart = await Cart.findOne({
      where: { productId, userId, orderId: null },
    });
    // console.log(cart);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan di keranjang.",
      });
    }

    // Validasi nilai quantity
    if (![0, 1, 2].includes(quantity)) {
      return res.status(400).json({
        success: false,
        message: "Nilai quantity tidak valid.",
      });
    }

    if (quantity === 1) {
      cart.quantity += 1;
      await cart.save();
    } else if (quantity === 0) {
      cart.quantity -= 1;
      if (cart.quantity <= 0) {
        await Cart.destroy({ where: { productId, userId } });
        return res.status(200).json({
          success: true,
          message: "Produk dihapus dari keranjang.",
        });
      }
      await cart.save();
    } else if (quantity === 2) {
      await Cart.destroy({ where: { productId, userId } });
      return res.status(200).json({
        success: true,
        message: "Produk dihapus dari keranjang.",
      });
    }

    // Jika update berhasil
    return res.status(200).json({
      success: true,
      message: "Kuantitas produk berhasil diperbarui.",
      data: cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui kuantitas produk.",
    });
  }
};
