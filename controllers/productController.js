export const productPagination = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const response = await fetch(
      `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
    );
    const data = await response.json();

    res.json({
      products: data.products,
      currentPage: parseInt(page),
      totalProducts: data.total,
      totalPages: Math.ceil(data.total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};
