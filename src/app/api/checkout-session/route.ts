import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cartItems, shippingAddress } = body;

    const session = await stripe.checkout.sessions.create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      line_items: cartItems.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: item.price * 100, // Stripe expects amounts in cents
        },
        quantity: item.quantity,
      })),
      metadata: {
        products: JSON.stringify(
          cartItems.map((item: { productId: string; quantity: number }) => ({
            product: item.productId,
            quantity: item.quantity,
          }))
        ),
        userId: body.userId,
        shippingAddress: JSON.stringify(shippingAddress),
      },
      mode: "payment",
      success_url: `${req.headers.get("origin")}/orders?success=true`,
      cancel_url: `${req.headers.get("origin")}/checkout?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message },
      { status: err?.statusCode || 500 }
    );
  }
}
