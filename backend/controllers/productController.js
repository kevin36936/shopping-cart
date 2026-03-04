import { getAllProducts } from "../models/product.js";

export const getProducts = async (req, res) => {
  try {
    const rows = await getAllProducts();
    const products = rows.map((product) => ({
      ...product,
      price: parseFloat(product.price),
    }));
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).josn({ error: "Database error" });
  }
};
