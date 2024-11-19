'use client'

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/useCartStore"
import { Minus, Plus, X } from "lucide-react"
import Image from "next/image"

interface CartItemProps {
  item: {
    productId: string
    quantity: number
    name: string
    price: number
    image: string
  }
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(item.productId, newQuantity)
  }

  return (
    <div className="flex gap-4 py-4">
      <div className="relative aspect-square h-24 w-24 min-w-fit overflow-hidden rounded-lg border">
        <Image
          src={item.image || '/placeholder.svg'}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-muted-foreground">
              ${item.price.toFixed(2)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => removeItem(item.productId)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease quantity</span>
          </Button>
          <span className="w-12 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
