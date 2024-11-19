'use client'

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/store/useCartStore"
import { useState } from "react";

interface AddToCartButtonProps {
  product: {
    _id: string
    name: string
    price: number
    images: string[]
    stock: number
  }
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()

  const handleAddToCart = () => {
    setIsLoading(true)
    try {
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
      })
      toast({
        description: "Added to cart"
      })
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Failed to add to cart"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleAddToCart} 
      disabled={isLoading || product.stock === 0}
      className="w-full"
    >
      {isLoading ? "Adding..." : "Add to Cart"}
    </Button>
  )
}
