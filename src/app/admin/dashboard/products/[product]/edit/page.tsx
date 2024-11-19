"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { getAllCategories } from "@/actions/categories/category.action";
import {
  updateProduct,
  getProductById,
} from "@/actions/products/product.action";
import { useParams, useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Price must be a non-negative number.",
    }),
  stock: z
    .string()
    .refine(
      (val) => val === "" || (!isNaN(parseInt(val)) && parseFloat(val) >= 0),
      {
        message: "Stock must be a non-negative integer.",
      }
    ),
  category: z.string({
    required_error: "Please select a category.",
  }),
  images: z.array(z.string().url()).optional(),
});

type CategoryType = {
  _id: string;
  name: string;
};

export default function EditProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const productId = params.product as string;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      stock: "",
      images: [],
    },
  });

  useEffect(() => {
    const fetchProductAndCategories = async () => {
      setIsLoading(true);
      const [productResponse, categoriesResponse] = await Promise.all([
        getProductById({ id: productId }),
        getAllCategories(),
      ]);

      if (productResponse.success && productResponse.product) {
        const product = productResponse.product;
        form.reset({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          stock: product.stock.toString(),
          category: product.category._id,
          images: product.images,
        });
      } else {
        // Handle error or redirect if product not found
        console.error("Failed to fetch product");
        router.push("/admin/dashboard/products");
      }

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.categories || []);
      }

      setIsLoading(false);
    };

    fetchProductAndCategories();
  }, [productId, form, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const { name, description, price, stock, category, images = [] } = values;

    // Update the product
    const response = await updateProduct({
      id: productId,
      updateData: {
        name,
        description,
        price: parseFloat(price || "0"),
        category,
        images,
        stock: parseInt(stock || "0"),
      },
    });

    if (response.success) {
      // Display success message
      alert("Product updated successfully");
      router.push("/admin/dashboard/products");
    } else {
      console.log(response);
      // Display error message
      alert("Failed to update product");
    }

    setIsSubmitting(false);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name that will be displayed to customers.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a detailed description of the product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Allow numbers and at most one decimal point
                      if (/^\d*\.?\d*$/.test(value)) {
                        // Remove leading zeros, but keep one if it's the only digit before decimal
                        const cleanedValue = value.replace(/^0+(?=\d)/, "");
                        field.onChange(cleanedValue);
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>Enter the price in dollars.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="0"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Only allow non-negative integers
                      if (/^\d*$/.test(value)) {
                        // Remove leading zeros, but keep one if it's the only digit before decimal
                        const cleanedValue = value.replace(/^0+(?=\d)/, "");
                        field.onChange(cleanedValue);
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Enter the current stock quantity.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the category that best fits this product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      field.onChange(
                        files.map((file) => URL.createObjectURL(file))
                      );
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Upload one or more product images.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating Product..." : "Update Product"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
