"use server";

import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order.model";
import mongoose from "mongoose";

interface CreateOrderInput {
  products: { product: string; quantity: number }[];
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export async function createOrder(input: CreateOrderInput) {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Not authenticated" };
    }

    const order = await Order.create({
      user: new mongoose.Types.ObjectId(session.user._id),
      ...input,
      status: "pending",
    });

    // Serialize the order data
    const serializedOrder = JSON.parse(JSON.stringify(order));
    return { success: true, order: serializedOrder };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, message: "Failed to create order" };
  }
}

export async function getUserOrders() {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const orders = await Order.find({ user: session.user._id })
      .populate("products.product")
      .sort({ createdAt: -1 }); // Add lean() to get plain JavaScript objects

    // Serialize the orders to handle MongoDB ObjectId and Date objects
    // Map the orders to apply getters and handle MongoDB specific types
    const serializedOrders = orders.map((order) => ({
      _id: order._id.toString(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      products: order.products.map((p: any) => ({
        product: {
          _id: p.product._id.toString(),
          name: p.product.name,
          price: p.product.price,
          images: p.product.images,
        },
        quantity: p.quantity,
      })),
      totalAmount: order.totalAmount, // This will use the getter to convert cents to dollars
      status: order.status,
      shippingAddress: { ...order.shippingAddress },
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    return {
      success: true,
      data: serializedOrders,
    };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return {
      success: false,
      message: "Failed to fetch orders",
    };
  }
}
