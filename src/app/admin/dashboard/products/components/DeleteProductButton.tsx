"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/actions/products/product.action";
import { useRouter } from "next/navigation";

interface DeleteProductButtonProps {
  productId: string;
}

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      setIsDeleting(true);
      try {
        const result = await deleteProduct({ id: productId });
        if (result.success) {
          alert("Product deleted successfully");
          router.refresh();
        } else {
          alert(`Failed to delete product: ${result.message}`);
        }
      } catch (error) {
        alert("An error occurred while deleting the product");
        console.error(error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  );
}
