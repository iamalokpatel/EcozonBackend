import Product from "../models/Product.js";
import logger from "../utils/logger.js";
import cloudinary from "../config/cloudinary.js";

// Create a new Product
export const createProduct = async (req, res) => {
  try {
    const { title, category, subtitle, description, price, user } = req.body;

    let imageUrl = "";
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    const newProduct = new Product({
      title,
      category,
      subtitle,
      description,
      price,
      image: imageUrl,
      user,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all Product
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a Product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Products not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { title, category, subtitle, description, price } = req.body;
    const updateData = { title, category, subtitle, description, price };

    if (req.file) {
      const fileStr = req.file.buffer.toString("base64");
      const uploadResponse = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${fileStr}`
      );
      updateData.image = uploadResponse.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating Product" });
  }
};

// Delete a Product
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Product" });
  }
};

// GET /products/featured - top 3 most expensive products
export const featureProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.find({})
      .sort({ price: -1 }) // Sort by price descending
      .limit(6); // Limit to top 3

    res.status(200).json({ products: featuredProducts });
  } catch (err) {
    console.error("Error fetching featured products:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/// category
export const CategorisedProduct = async (req, res) => {
  try {
    const { category } = req.query;

    // If category query param is passed, filter by it
    let products;
    if (category) {
      products = await Product.find({ category: category.toLowerCase() });
    } else {
      // If no category, return unique categories list
      const categories = await Product.distinct("category");
      products = await Product.find();
      return res.status(200).json(categories);
    }

    res.status(200).json(products);
  } catch (err) {
    console.error("Failed to handle categories route:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
