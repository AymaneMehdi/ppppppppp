/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/Cart.model";

export async function syncCart(cartItems: any[]) {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "User not authenticated" };
    }

    const cart = await Cart.findOneAndUpdate(
      { user: session.user._id },
      {
        products: cartItems.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
        })),
        totalPrice: cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
      },
      { upsert: true, new: true }
    ).populate("products.product");

    // Serialize the cart data
    const serializedCart = {
      _id: cart?._id.toString(),
      products: cart?.products?.map((item: any) => ({
        product: {
          _id: item.product._id.toString(),
          name: item.product.name,
          price: item.product.price,
          image: item.product.images[0],
        },
        quantity: item.quantity,
      })),
      totalPrice: cart?.totalPrice,
    };
    
    return { success: true, cart: serializedCart };
  } catch (error) {
    console.log("Error syncing cart", error);

    return { success: false, message: "Failed to sync cart" };
  }
}

export async function loadUserCart() {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "User not authenticated" };
    }

    const cart = await Cart.findOne({ user: session.user._id }).populate(
      "products.product"
    );

    if (!cart) {
      return { success: true, cart: { products: [] } };
    }

    // Transform the serialized cart data
    const cartItems = cart.products.map((item: any) => ({
      productId: item.product._id.toString(),
      name: item.product.name,
      price: item.product.price,
      image: item.product.images[0],
      quantity: item.quantity,
    }));

    return { success: true, cartItems };
  } catch (error) {
    console.log("Error loading cart", error);

    return { success: false, message: "Failed to load cart" };
  }
}
