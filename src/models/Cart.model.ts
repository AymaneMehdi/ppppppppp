import mongoose, { model, Schema } from "mongoose";

export interface CartDocument {
  user: mongoose.Schema.Types.ObjectId;
  products: { product: mongoose.Schema.Types.ObjectId; quantity: number }[];
  totalPrice: number;
}

const CartSchema = new Schema<CartDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      set: (val: number) => val * 100,
      get: (val: number) => val / 100,
    }, // Calculated total
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.models?.Cart || model<CartDocument>("Cart", CartSchema);

export default Cart;
