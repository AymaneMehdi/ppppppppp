"use server";

import { connectDB } from "@/lib/mongodb";

import Product from "@/models/Product.model";
import mongoose from "mongoose";

type CreateProductType = {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
};

// Create a new product
export async function createProduct({
  name,
  description,
  price,
  stock,
  category,
  images,
}: CreateProductType) {
  try {
    await connectDB();

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      category: new mongoose.Types.ObjectId(category),
      images,
    });

    await newProduct.save();
    return { success: true, message: "Product created successfully" };
  } catch (error) {
    console.log("Failed to create product:", error);
    return { success: false, message: "Failed to create product" };
  }
}

// Fetch all products
export async function getAllProducts() {
  try {
    await connectDB();

    const products = await Product.find().populate("category");
    const serializedProducts = products.map((product) => ({
      _id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      images: product.images,
      category: product.category
        ? {
            _id: product.category._id.toString(),
            name: product.category.name,
            // Add other necessary category fields
          }
        : null,
    }));

    return { success: true, products: serializedProducts };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { success: false, message: "Failed to fetch products" };
  }
}

// Fetch a single product by ID
export async function getProductById({ id }: { id: string }) {
  try {
    await connectDB();
    const product = await Product.findById(id).populate("category");
    if (product) {
      const serializedProduct = {
        _id: product._id.toString(),
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images,
        category: {
          name: product.category?.name,
          _id: (product.category?._id as string).toString(),
        },
      };
      return { success: true, product: serializedProduct };
    }
    return { success: false, message: "Product not found" };
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return { success: false, message: "Failed to fetch product" };
  }
}

// Update a product
export async function updateProduct({
  id,
  updateData,
}: {
  id: string;
  updateData: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    images: string[];
  };
}) {
  try {
    await connectDB();
    await Product.findByIdAndUpdate(id, {
      ...updateData,
      price: updateData.price,
    });
    return { success: true, message: "Product updated successfully" };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, message: "Failed to update product" };
  }
}

// Delete a product
export async function deleteProduct({ id }: { id: string }) {
  try {
    await connectDB();
    await Product.findByIdAndDelete(id);
    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, message: "Failed to delete product" };
  }
}

// Fetch products by category
export async function getProductsByCategory({
  category,
}: {
  category: string;
}) {
  try {
    await connectDB();
    const products = await Product.find({ category }).populate("category");
    const serializedProducts = products.map((product) => ({
      _id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      images: product.images,
      category: {
        ...product.category,
        _id: product?.category._id.toString(),
      },
    }));
    return { success: true, products: serializedProducts };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { success: false, message: "Failed to fetch products" };
  }
}
