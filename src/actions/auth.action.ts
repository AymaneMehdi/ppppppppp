"use server";

import { registerUser } from "@/services/auth.service";
// import { signIn } from "@/auth";
// import { AuthError } from "next-auth";

export async function registerUserAction({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const data = await registerUser(email, password);

  return data;
}

// export async function loginAction({
//   email,
//   password,
// }: {
//   email: string;
//   password: string;
// }) {
//   try {
//     await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//     });
//     return { success: true };
//   } catch (error) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case "CredentialsSignin":
//           return { success: false, error: "Invalid credentials." };
//         default:
//           return { success: false, error: "Something went wrong." };
//       }
//     }
//     return { success: false, error: "Something went wrong." };
//   }
// }
