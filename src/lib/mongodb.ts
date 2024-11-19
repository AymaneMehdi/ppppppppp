import mongoose from "mongoose";
import "@/models/Product.model";
import "@/models/Category.model";
import "@/models/User.model";
import "@/models/Order.model";
import "@/models/Cart.model";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalAny: any = global;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("MONGODB_URI is not defined in the environment variables.");
  // You might want to set a default URI or handle this case differently
  // For now, we'll just log a warning instead of throwing an error
}

let cached = globalAny.mongoose;

if (!cached) {
  cached = globalAny.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
