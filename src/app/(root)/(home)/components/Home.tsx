import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Products from "@/components/screens/products/Products";
import { ChevronRight } from "lucide-react";
import { Suspense } from "react";
import ProductsLoading from "@/components/screens/products/ProductsLoading";
import Hero from "./Hero";

export default function HomePage() {
  return (
    <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Hero />
      <section className="mb-12">
        <Suspense fallback={<ProductsLoading />}>
          <Products />
        </Suspense>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-primary">Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {["Electronics", "Clothing", "Home & Garden", "Toys"].map(
            (category, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {category}
                    <ChevronRight className="h-6 w-6 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </CardTitle>
                </CardHeader>
              </Card>
            )
          )}
        </div>
      </section>

      <section className="mb-12">
        <Card className="bg-secondary text-secondary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl">Special Offer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Get 20% off on all products this week!</p>
            <Button variant="outline">Shop Now</Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
