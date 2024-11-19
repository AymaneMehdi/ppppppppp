"use server"

import { connectDB } from "@/lib/mongodb"
import User from "@/models/User.model"
import bcrypt from "bcryptjs"

export async function verifyUser(email: string, password: string) {
  await connectDB()
  
  const user = await User.findOne({ email })
  if (!user) return null
  
  const passwordMatch = bcrypt.compareSync(password, user.password)
  if (!passwordMatch) return null
  
  return {
    id: user._id,
    email: user.email,
    role: user.role,
  }
} 