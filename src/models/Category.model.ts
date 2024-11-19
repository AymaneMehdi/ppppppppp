import mongoose, { model, Schema } from "mongoose";

export interface CategoryDocument {
  name: string;
  description?: string;
  parentCategory?: Schema.Types.ObjectId;
}

const CategorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true },
    description: String,
    parentCategory: { type: Schema.Types.ObjectId, ref: "Category" }, // For nested categories
  },
  {
    timestamps: true,
  }
);

const Category =
  mongoose.models?.Category ||
  model<CategoryDocument>("Category", CategorySchema);

export default Category;
