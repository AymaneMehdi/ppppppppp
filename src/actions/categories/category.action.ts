"use server";

import Category from "@/models/Category.model";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

type CreateCategoryParams = {
  name: string;
  description?: string;
  parentCategory?: string;
};

type UpdateCategoryParams = {
  id: string;
  data: CreateCategoryParams;
};

// Create a new category
export async function createCategory({
  name,
  description,
  parentCategory,
}: CreateCategoryParams) {
  try {
    await connectDB();

    const newCategory = new Category({
      name,
      description,
      parentCategory: parentCategory
        ? new mongoose.Types.ObjectId(parentCategory)
        : undefined,
    });

    await newCategory.save();
    return { success: true, message: "Category created successfully" };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { success: false, message: "Failed to create category" };
  }
}

// Read all categories
export async function getAllCategories() {
  try {
    await connectDB();
    const categories = await Category.find().populate("parentCategory");

    const serializedCategories = categories.map((category) => ({
      _id: category._id.toString(),
      name: category.name,
      description: category.description,
      parentCategory: category?.parentCategory
        ? {
            name: category.parentCategory?.name,
            description: category.parentCategory?.description,
            _id: category.parentCategory?._id.toString(),
          }
        : null,
    }));

    return { success: true, categories: serializedCategories };
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { success: false, message: "Failed to fetch categories" };
  }
}

// Read a single category by ID
export async function getCategoryById({ id }: { id: string }) {
  try {
    await connectDB();

    const category = await Category.findById(id).populate("parentCategory");

    const serializedCategory = {
      _id: category._id.toString(),
      name: category.name,
      description: category.description,
      parentCategory: category?.parentCategory
        ? {
            ...category.parentCategory,
            _id: (category?.parentCategory?._id as string).toString(),
          }
        : null,
    };
    return { success: true, category: serializedCategory };
  } catch (error) {
    console.error("Failed to fetch category:", error);
    return { success: false, message: "Failed to fetch category" };
  }
}

// Update a category
export async function updateCategory({ id, data }: UpdateCategoryParams) {
  try {
    await connectDB();
    await Category.findByIdAndUpdate(id, data);

    return {
      success: true,
      message: "Category updated successfully",
    };
  } catch (error) {
    console.error("Failed to update category:", error);
    return { success: false, message: "Failed to update category" };
  }
}

// Delete a category
export async function deleteCategory({ id }: { id: string }) {
  try {
    await connectDB();
    const deletedCategory = await Category.findByIdAndDelete(id).lean();
    if (!deletedCategory) {
      return { success: false, message: "Category not found" };
    }
    return { success: true, message: "Category deleted successfully" };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { success: false, message: "Failed to delete category" };
  }
}
