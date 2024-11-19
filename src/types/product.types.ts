import { Types } from "mongoose";

export interface ProductType {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Types.ObjectId | string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type CreateProductInput = Omit<
  ProductType,
  "_id" | "createdAt" | "updatedAt"
>;

export type UpdateProductInput = Partial<CreateProductInput>;

export interface ProductResponse {
  success: boolean;
  product?: ProductType;
  message?: string;
}

export interface ProductsResponse {
  success: boolean;
  products?: ProductType[];
  message?: string;
}
