'use client'

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useCartStore } from "@/store/useCartStore"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface CheckoutButtonProps {
  product: {
    _id: string
    name: string
    price: number
    images: string[]
    stock: number
  }
}

export function CheckoutButton({ product }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()
  const router = useRouter()

  const handleBuyNow = async () => {
    setIsLoading(true)
    try {
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
      })
      router.push('/checkout')
    } catch (error) {
      console.log(error)
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleBuyNow}
      disabled={isLoading || product.stock === 0}
      className="w-full"
    >
      {isLoading ? "Processing..." : "Buy Now"}
    </Button>
  )
} 