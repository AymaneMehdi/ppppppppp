import { syncCart } from "@/actions/cart/cart.actions";
import { getSession } from "next-auth/react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
}

export interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  initializeCart: (items: CartItem[]) => void;
}

const syncCartMethod = async (items: CartItem[]) => {
  const session = await getSession();
  if (session?.user) {
    syncCart(items);
  }
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.productId === item.productId
          );
          if (existingItem) {
            const updatedItems = state.items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
            
            // Sync cart with server when updating existing item
            syncCartMethod(updatedItems);
            console.log("updatedItems", updatedItems);

            return { items: updatedItems };
          }
          console.log("item", item);
          
          // Sync cart with server for new item
          const newItems = [...state.items, item];
          syncCartMethod(newItems);

          return { items: newItems };
        });
      },
      removeItem: (productId) => {
        set((state) => {
          const updatedItems = state.items.filter(
            (item) => item.productId !== productId
          );

          // Sync cart with server
          syncCartMethod(updatedItems);

          return { items: updatedItems };
        });
      },
      updateQuantity: (productId, quantity) => {
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          );

          // Sync cart with server
          syncCartMethod(updatedItems);

          return { items: updatedItems };
        });
      },
      clearCart: () => {
        set({ items: [] });

        // Sync cart with server
        syncCartMethod([]);
      },
      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        const state = get();
        return state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      initializeCart: (items) => {
        set({ items });
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
