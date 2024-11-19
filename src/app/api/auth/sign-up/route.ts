import { registerUser } from "@/services/auth.service";

export async function POST(req: Request) {
  // Get email and password from request body
  const { email, password } = await req.json();

  const data = await registerUser(email, password);

  return Response.json(data, {
    status: 200,
  });
}
