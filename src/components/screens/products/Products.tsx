import { getAllProducts } from "@/actions/products/product.action";
import Product from "./Product";

interface Product {
  id: string;
  name: string;
  price: number;
  // Add other product properties as needed
}

async function Products() {
  const result = await getAllProducts();
  
  if (!result.success) {
    throw new Error(result.message || "Failed to fetch products");
  }

  const products = result.products?.map((product) => ({
    id: product._id.toString(),
    name: product.name,
    price: product.price,
    image: product.images[0],
  }));

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {products?.map((product) => (
          <Product key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}

export default Products;
