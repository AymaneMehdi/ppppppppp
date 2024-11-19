import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getProductById } from "@/actions/products/product.action";
import { ArrowRight, ShieldCheck, Star, TruckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddToCartButton } from "@/components/AddToCart";
import { CheckoutButton } from "@/components/CheckoutButton";

type tParams = Promise<{ productId: string }>;

export default async function ProductPage({ params }: { params: tParams }) {
  const { productId } = await params;
  const { success, product } = await getProductById({ id: productId });

  if (!success || !product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative aspect-square">
            <Image
              src={product.images[0] || '/placeholder.svg'}
              alt={product.name}
              fill
              className="object-contain rounded-lg"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {product.images.map((image: string, index: number) => (
              <Button key={index} variant="outline" className="p-0 w-20 h-20">
                <Image
                  src={image}
                  alt={`${product.name} - Image ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-cover rounded-md"
                />
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-500">(50 reviews)</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={product.stock > 0 ? "default" : "destructive"}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </Badge>
            <span className="text-sm text-gray-500">({product.stock} available)</span>
          </div>
          <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>
          <Tabs defaultValue="description" className="w-full">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="text-gray-600">
              {product.description}
            </TabsContent>
            <TabsContent value="specifications">
              <ul className="list-disc pl-5 space-y-2">
                <li>Category: {product.category.name}</li>
                <li>Weight: 0.5 kg</li>
                <li>Dimensions: 10 x 5 x 2 cm</li>
                <li>Material: High-quality plastic</li>
              </ul>
            </TabsContent>
          </Tabs>
          <div className="space-y-4">
            <AddToCartButton product={product} />
            <CheckoutButton product={product} />
          </div>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <TruckIcon className="w-5 h-5 text-primary" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span>1 year warranty</span>
              </div>
            </CardContent>
          </Card>
          <Button variant="link" className="w-full">
            View more products from this category
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
