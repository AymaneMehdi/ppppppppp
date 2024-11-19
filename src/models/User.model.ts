// Create a User Model to store user data in the MongoDb database

import mongoose, { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface UserDocument {
  name: string;
  email: string;
  password: string;
  role: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  orders: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models?.User || model<UserDocument>("User", UserSchema);

export default User;

export const saltAndHashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};
