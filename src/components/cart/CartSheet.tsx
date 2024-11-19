"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { syncCart } from "@/actions/cart/cart.actions";
import Link from "next/link";
import { CartItem } from "./CartItem";

export function CartSheet() {
  // const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const { items, getTotalPrice, getTotalItems } = useCartStore();

  // Hydration fix
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync cart with server when items change
  // useEffect(() => {
  //   if (session?.user) {
  //     syncCart(items);
  //   }
  // }, [session, items]);

  if (!isMounted) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-6 w-6" />
          {getTotalItems() > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
              {getTotalItems()}
            </span>
          )}
          <span className="sr-only">Shopping Cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({getTotalItems()} items)</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 px-4">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Your cart is empty
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <CartItem key={item.productId} item={item} />
                ))}
              </div>
            </ScrollArea>
            <div className="border-t px-4 py-6 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => setOpen(false)}
                asChild
              >
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
