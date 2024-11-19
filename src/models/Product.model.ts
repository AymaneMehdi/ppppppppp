import mongoose, { model, Schema } from "mongoose";

export interface ProductDocument {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Schema.Types.ObjectId;
  images: string[];
}

const ProductSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: {
      type: Number,
      required: true,
      min: 0,
      get: (v: number) => v / 100,
      set: (v: number) => v * 100 ,
    },
    stock: { type: Number, required: true, min: 0 },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [String], // Array of image URLs
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models?.Product || model<ProductDocument>("Product", ProductSchema);

export default Product;
