import mongoose, { model, Schema } from "mongoose";

export interface OrderDocument {
  user: mongoose.Schema.Types.ObjectId;
  products: { product: mongoose.Schema.Types.ObjectId; quantity: number }[];
  totalAmount: number;
  status: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

const OrderSchema = new Schema<OrderDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      set: (v: number) => v * 100,
      get: (v: number) => v / 100,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "canceled"],
      default: "pending",
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
  },
  {
    timestamps: true,
  }
);

const Order =
  mongoose.models?.Order || model<OrderDocument>("Order", OrderSchema);

export default Order;
