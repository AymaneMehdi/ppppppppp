import { connectDB } from "@/lib/mongodb";
import User, { saltAndHashPassword } from "@/models/User.model";

export const registerUser = async (email: string, password: string) => {
  try {
    await connectDB();

    const userFound = await User.findOne({ email });

    if (userFound) {
      return {
        success: false,
        error: "Email already exists!",
      };
    }

    const hashedPassword = saltAndHashPassword(password);

    const user = new User({
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    // Return a plain object instead of the MongoDB document
    return {
      success: true,
      user: {
        id: savedUser._id.toString(),
        email: savedUser.email,
      },
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred during registration",
    };
  }
};
